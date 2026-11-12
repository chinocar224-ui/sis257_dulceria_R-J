import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(@InjectRepository(Producto) private productosRepository: Repository<Producto>) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
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
    await this.findOne(id);
    await this.productosRepository.update(id, updateProductoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Producto> {
    const producto = await this.findOne(id);
    return this.productosRepository.softRemove(producto);
  }
}