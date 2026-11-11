import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Direccion } from '../../direcciones/entities/direccion.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_usuario', nullable: true })
  idUsuario: number | null;

  @Column('varchar', { name: 'ci_nit', length: 20 })
  ciNit: string;

  @Column('varchar', { length: 50 })
  nombres: string;

  @Column('varchar', { length: 50 })
  apellidos: string;

  @Column('varchar', { length: 15, nullable: true })
  telefono: string;

  @Column('varchar', { length: 50, nullable: true })
  email: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;

    @OneToMany(() => Direccion, direccion => direccion.cliente)
  direcciones: Direccion[];
}