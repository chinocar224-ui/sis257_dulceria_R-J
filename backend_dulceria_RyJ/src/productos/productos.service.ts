import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(@InjectRepository(Producto) private productosRepository: Repository<Producto>) {}
    // La fecha de vencimiento no puede ser anterior a hoy
  private validarVencimiento(fecha?: string) {
    if (!fecha) return;
    const h = new Date();
    const hoy = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}`;
    if (fecha.slice(0, 10) < hoy) {
      throw new BadRequestException('La fecha de vencimiento no puede ser una fecha pasada');
    }
  }
    async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    this.validarVencimiento(createProductoDto.fechaVencimiento);
    const existe = await this.productosRepository.findOneBy({ codigo: createProductoDto.codigo });  
    if (existe) throw new ConflictException('Ya existe un producto con ese código');

    const producto = new Producto();
    Object.assign(producto, createProductoDto);
    const nuevo = await this.productosRepository.save(producto);
    return this.findOne(nuevo.id);
  }

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.find({
      relations: { categoria: true, proveedor: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: { categoria: true, proveedor: true },
    });
    if (!producto) throw new NotFoundException(`El producto con id ${id} no existe`);
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const actual = await this.findOne(id);
    // Solo se valida si se cambia la fecha (un producto ya vencido se puede seguir editando)
    if (
      updateProductoDto.fechaVencimiento &&
      updateProductoDto.fechaVencimiento !== actual.fechaVencimiento
    ) {
      this.validarVencimiento(updateProductoDto.fechaVencimiento);
    }
    await this.productosRepository.update(id, updateProductoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Producto> {
    const producto = await this.findOne(id);
    return this.productosRepository.softRemove(producto);
  }
}