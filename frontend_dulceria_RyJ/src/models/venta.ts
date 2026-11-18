import type { Cliente } from './cliente'
import type { Producto } from './producto'
import type { Usuario } from './usuario'

export interface DetalleVenta {
  id: number
  idProducto: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  producto?: Producto
}

export interface Pago {
  id: number
  metodo: string
  monto: number
  referencia?: string
}

export interface Venta {
  id: number
  idCliente: number
  idUsuario: number
  fecha: string
  total: number
  estado: string
  cliente?: Cliente
  usuario?: Usuario
  detalles?: DetalleVenta[]
  pagos?: Pago[]
}
