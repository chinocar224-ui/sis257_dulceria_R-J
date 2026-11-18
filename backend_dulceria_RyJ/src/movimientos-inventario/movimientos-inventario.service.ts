import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class MovimientosInventarioService {
  constructor(
    @InjectRepository(MovimientoInventario)
    private movimientosRepository: Repository<MovimientoInventario>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateMovimientoInventarioDto, idUsuario: number): Promise<MovimientoInventario> {
    const idMovimiento = await this.dataSource.transaction(async (manager) => {
      // 1. Verificar que el producto exista
      const producto = await manager.findOne(Producto, { where: { id: dto.idProducto } });
      if (!producto) throw new NotFoundException(`El producto con id ${dto.idProducto} no existe`);

      // 2. Calcular el nuevo stock
      let nuevoStock = producto.stock;
      if (dto.tipo === 'ENTRADA') {
        nuevoStock += dto.cantidad;
      } else {
        if (producto.stock < dto.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente de "${producto.nombre}". Disponible: ${producto.stock}`,
          );
        }
        nuevoStock -= dto.cantidad;
      }

      // 3. Actualizar el stock del producto
      await manager.update(Producto, producto.id, { stock: nuevoStock });

      // 4. Registrar el movimiento
      const movimiento = manager.create(MovimientoInventario, {
        ...dto,
        idUsuario,
        idVenta: null,
      });
      const guardado = await manager.save(movimiento);
      return guardado.id;
    });

    return this.findOne(idMovimiento);
  }

  async findAll(): Promise<MovimientoInventario[]> {
    return this.movimientosRepository.find({
      relations: { producto: true, usuario: true },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findByProducto(idProducto: number): Promise<MovimientoInventario[]> {
    return this.movimientosRepository.find({
      where: { idProducto },
      relations: { producto: true, usuario: true },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<MovimientoInventario> {
    const movimiento = await this.movimientosRepository.findOne({
      where: { id },
      relations: { producto: true, usuario: true },
    });
    if (!movimiento) throw new NotFoundException(`El movimiento con id ${id} no existe`);
    return movimiento;
  }
}