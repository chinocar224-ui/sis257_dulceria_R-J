import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 30 })
  nombre: string;

  @Column('varchar', { length: 100 })
  descripcion: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios: Usuario[];
}