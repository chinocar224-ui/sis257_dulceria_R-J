import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('direcciones')
export class Direccion {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_cliente' })
  idCliente: number;

  @Column('varchar', { length: 150 })
  direccion: string;

  @Column('varchar', { length: 50 })
  zona: string;

  @Column('varchar', { length: 150, nullable: true })
  referencia: string;

  @Column('boolean', { default: false })
  principal: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Cliente, cliente => cliente.direcciones)
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
  cliente: Cliente;
}