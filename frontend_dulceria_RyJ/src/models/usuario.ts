import type { Rol } from './rol'

export interface Usuario {
  id: number
  idRol: number
  nombres: string
  usuario: string
  clave?: string
  email: string
  rol?: Rol
}
