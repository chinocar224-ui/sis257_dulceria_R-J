import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const existe = await this.usuariosRepository.findOneBy({ usuario: createUsuarioDto.usuario });
    if (existe) throw new ConflictException('El usuario ya existe');

    const usuario = new Usuario();
    Object.assign(usuario, createUsuarioDto);
    const nuevo = await this.usuariosRepository.save(usuario);
    return this.findOne(nuevo.id);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      relations: { rol: true },
      order: { nombres: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: { rol: true },
    });
    if (!usuario) throw new NotFoundException(`El usuario con id ${id} no existe`);
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    await this.findOne(id);
    const datos: Partial<Usuario> = { ...updateUsuarioDto };
    if (updateUsuarioDto.clave) {
      datos.clave = await hash(updateUsuarioDto.clave, await genSalt());
    }
    await this.usuariosRepository.update(id, datos);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Usuario> {
    const usuario = await this.findOne(id);
    return this.usuariosRepository.softRemove(usuario);
  }
}