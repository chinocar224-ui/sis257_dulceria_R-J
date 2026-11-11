import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(@InjectRepository(Cliente) private clientesRepository: Repository<Cliente>) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    let cliente = await this.clientesRepository.findOneBy({ ciNit: createClienteDto.ciNit });
    if (cliente) throw new ConflictException('Ya existe un cliente con ese CI/NIT');

    cliente = new Cliente();
    Object.assign(cliente, createClienteDto);
    return this.clientesRepository.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clientesRepository.find({
      relations: { direcciones: true },
      order: { apellidos: 'ASC', nombres: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({
      where: { id },
      relations: { direcciones: true },
    });
    if (!cliente) throw new NotFoundException(`El cliente con id ${id} no existe`);
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    await this.findOne(id);
    await this.clientesRepository.update(id, updateClienteDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Cliente> {
    const cliente = await this.findOne(id);
    return this.clientesRepository.softRemove(cliente);
  }
}