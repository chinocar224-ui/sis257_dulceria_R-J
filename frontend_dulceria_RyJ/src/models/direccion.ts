import type { Cliente } from './cliente'

export interface Direccion {
  id: number
  idCliente: number
  direccion: string
  zona: string
  referencia?: string
  principal: boolean
  cliente?: Cliente
}
