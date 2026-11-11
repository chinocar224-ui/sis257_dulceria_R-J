import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { Rol } from '../../roles/entities/rol.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_rol' })
  idRol: number;

  @Column('varchar', { length: 100 })
  nombres: string;

  @Column('varchar', { length: 20 })
  usuario: string;

  @Column('varchar', { length: 250, select: false })
  clave: string;

  @Column('varchar', { length: 50 })
  email: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Rol, rol => rol.usuarios)
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id' })
  rol: Rol;

  @BeforeInsert()
  async hashPassword() {
    const salt = await genSalt();
    this.clave = await hash(this.clave, salt);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return compare(plainPassword, this.clave);
  }
}