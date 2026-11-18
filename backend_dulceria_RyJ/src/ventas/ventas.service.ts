import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Pago } from './entities/pago.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Producto } from '../productos/entities/producto.entity';
import { MovimientoInventario } from '../movimientos-inventario/entities/movimiento-inventario.entity';

const redondear = (valor: number) => Math.round(valor * 100) / 100;

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta) private ventasRepository: Repository<Venta>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateVentaDto, idUsuario: number): Promise<Venta & { cambio: number }> {
    const resultado = await this.dataSource.transaction(async (manager) => {
      // 1. Verificar el cliente
      const cliente = await manager.findOne(Cliente, { where: { id: dto.idCliente } });
      if (!cliente) throw new NotFoundException(`El cliente con id ${dto.idCliente} no existe`);

      // 2. Juntar productos repetidos (si mandan el mismo producto dos veces)
      const cantidades = new Map<number, number>();
      for (const d of dto.detalles) {
        cantidades.set(d.idProducto, (cantidades.get(d.idProducto) ?? 0) + d.cantidad);
      }

      // 3. Revisar stock, tomar precios de la BD y descontar stock
      let total = 0;
      const detalles: DetalleVenta[] = [];
      for (const [idProducto, cantidad] of cantidades) {
        const producto = await manager.findOne(Producto, {
          where: { id: idProducto },
          lock: { mode: 'pessimistic_write' },
        });
        if (!producto) throw new NotFoundException(`El producto con id ${idProducto} no existe`);
        if (producto.stock < cantidad) {
          throw new BadRequestException(
            `Stock insuficiente de "${producto.nombre}". Disponible: ${producto.stock}`,
          );
        }

        const subtotal = redondear(producto.precio * cantidad);
        total = redondear(total + subtotal);
        detalles.push(
          manager.create(DetalleVenta, {
            idProducto,
            cantidad,
            precioUnitario: producto.precio,
            subtotal,
          }),
        );
        await manager.update(Producto, idProducto, { stock: producto.stock - cantidad });
      }

      // 4. Validar los pagos y calcular el cambio
      const totalPagado = redondear(dto.pagos.reduce((suma, p) => suma + p.monto, 0));
      if (totalPagado < total) {
        throw new BadRequestException(
          `El pago (Bs. ${totalPagado.toFixed(2)}) no cubre el total (Bs. ${total.toFixed(2)})`,
        );
      }
      const cambio = redondear(totalPagado - total);
      const pagos = dto.pagos.map((p) => ({ ...p }));
      if (cambio > 0) {
        // El cambio solo se puede dar en efectivo: se descuenta del pago en efectivo
        const pagoEfectivo = pagos.find((p) => p.metodo === 'EFECTIVO');
        if (!pagoEfectivo || pagoEfectivo.monto < cambio) {
          throw new BadRequestException(
            'Los pagos con QR o tarjeta deben ser exactos; el cambio solo se da en efectivo',
          );
        }
        (pagoEfectivo as { monto: number }).monto = redondear(pagoEfectivo.monto - cambio);
      }

      // 5. Guardar la venta
      const venta = await manager.save(
        manager.create(Venta, { idCliente: dto.idCliente, idUsuario, total, estado: 'PAGADA' }),
      );

      // 6. Guardar detalles, pagos y movimientos de inventario (SALIDA)
      for (const detalle of detalles) {
        detalle.idVenta = venta.id;
      }
      await manager.save(detalles);

      await manager.save(
        pagos
          .filter((p) => p.monto > 0)
          .map((p) => manager.create(Pago, { ...p, idVenta: venta.id })),
      );

      await manager.save(
        detalles.map((d) =>
          manager.create(MovimientoInventario, {
            idProducto: d.idProducto,
            idUsuario,
            idVenta: venta.id,
            tipo: 'SALIDA',
            cantidad: d.cantidad,
            motivo: `Venta #${venta.id}`,
          }),
        ),
      );

      return { idVenta: venta.id, cambio };
    });

    const venta = await this.findOne(resultado.idVenta);
    return { ...venta, cambio: resultado.cambio };
  }

  async findAll(): Promise<Venta[]> {
    return this.ventasRepository.find({
      relations: { cliente: true, usuario: true },
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: { cliente: true, usuario: true, detalles: { producto: true }, pagos: true },
    });
    if (!venta) throw new NotFoundException(`La venta con id ${id} no existe`);
    return venta;
  }

  async anular(id: number, idUsuario: number): Promise<Venta> {
    await this.dataSource.transaction(async (manager) => {
      const venta = await manager.findOne(Venta, {
        where: { id },
        relations: { detalles: true },
      });
      if (!venta) throw new NotFoundException(`La venta con id ${id} no existe`);
      if (venta.estado === 'ANULADA') throw new BadRequestException('La venta ya está anulada');

      // Devolver el stock y registrar la ENTRADA en el inventario
      for (const detalle of venta.detalles) {
        await manager.increment(Producto, { id: detalle.idProducto }, 'stock', detalle.cantidad);
        await manager.save(
          manager.create(MovimientoInventario, {
            idProducto: detalle.idProducto,
            idUsuario,
            idVenta: venta.id,
            tipo: 'ENTRADA',
            cantidad: detalle.cantidad,
            motivo: `Anulación de venta #${venta.id}`,
          }),
        );
      }

      await manager.update(Venta, venta.id, { estado: 'ANULADA' });
    });

    return this.findOne(id);
  }
}