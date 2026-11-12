import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { Direccion } from './entities/direccion.entity';

@Injectable()
export class DireccionesService {
  constructor(
    @InjectRepository(Direccion) private direccionesRepository: Repository<Direccion>,
  ) {}

  async create(createDireccionDto: CreateDireccionDto): Promise<Direccion> {
    // Si la nueva dirección es principal, se desmarcan las demás del mismo cliente
    if (createDireccionDto.principal) {
      await this.direccionesRepository.update(
        { idCliente: createDireccionDto.idCliente },
        { principal: false },
      );
    }

    const direccion = new Direccion();
    Object.assign(direccion, createDireccionDto);
    return this.direccionesRepository.save(direccion);
  }

  async findAll(): Promise<Direccion[]> {
    return this.direccionesRepository.find({
      relations: { cliente: true },
      order: { idCliente: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Direccion> {
    const direccion = await this.direccionesRepository.findOne({
      where: { id },
      relations: { cliente: true },
    });
    if (!direccion) throw new NotFoundException(`La dirección con id ${id} no existe`);
    return direccion;
  }

  async update(id: number, updateDireccionDto: UpdateDireccionDto): Promise<Direccion> {
    const actual = await this.findOne(id);

    // Si se marca como principal, se desmarcan las demás del mismo cliente
    if (updateDireccionDto.principal) {
      await this.direccionesRepository.update(
        { idCliente: updateDireccionDto.idCliente ?? actual.idCliente },
        { principal: false },
      );
    }

    await this.direccionesRepository.update(id, updateDireccionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Direccion> {
    const direccion = await this.findOne(id);
    return this.direccionesRepository.softRemove(direccion);
  }
}