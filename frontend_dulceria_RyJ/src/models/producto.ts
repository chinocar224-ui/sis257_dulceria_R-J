import type { Categoria } from './categoria'
import type { Proveedor } from './proveedor'

export interface Producto {
  id: number
  idCategoria: number
  idProveedor?: number | null
  codigo: string
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  fechaVencimiento?: string
  imagen?: string
  categoria?: Categoria
  proveedor?: Proveedor | null
}
