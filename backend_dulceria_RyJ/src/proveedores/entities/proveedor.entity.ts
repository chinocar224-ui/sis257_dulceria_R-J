import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { name: 'razon_social', length: 100 })
  razonSocial: string;

  @Column('varchar', { length: 20 })
  nit: string;

  @Column('varchar', { length: 15 })
  telefono: string;

  @Column('varchar', { length: 150, nullable: true })
  direccion: string;

  @Column('varchar', { length: 50, nullable: true })
  email: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Producto, producto => producto.proveedor)
  productos: Producto[];
}