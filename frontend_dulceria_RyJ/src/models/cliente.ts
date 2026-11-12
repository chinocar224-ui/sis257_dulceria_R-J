import type { Direccion } from './direccion'

export interface Cliente {
  id: number
  idUsuario?: number | null
  ciNit: string
  nombres: string
  apellidos: string
  telefono?: string
  email?: string
  direcciones?: Direccion[]
}
