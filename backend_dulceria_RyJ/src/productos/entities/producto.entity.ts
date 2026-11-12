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
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_categoria' })
  idCategoria: number;

  @Column('integer', { name: 'id_proveedor', nullable: true })
  idProveedor: number | null;

  @Column('varchar', { length: 20 })
  codigo: string;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 250, nullable: true })
  descripcion: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: { to: (valor: number) => valor, from: (valor: string) => Number(valor) },
  })
  precio: number;

  @Column('integer', { default: 0 })
  stock: number;

  @Column('date', { name: 'fecha_vencimiento', nullable: true })
  fechaVencimiento: string;

  @Column('varchar', { length: 255, nullable: true })
  imagen: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Categoria, categoria => categoria.productos)
  @JoinColumn({ name: 'id_categoria', referencedColumnName: 'id' })
  categoria: Categoria;

   @ManyToOne(() => Proveedor, proveedor => proveedor.productos)
  @JoinColumn({ name: 'id_proveedor', referencedColumnName: 'id' })
  proveedor: Proveedor;
}