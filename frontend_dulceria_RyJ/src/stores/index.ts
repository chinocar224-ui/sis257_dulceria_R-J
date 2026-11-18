import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') || '',
    nombres: localStorage.getItem('nombres') || '',
    rol: localStorage.getItem('rol') || '',
    token: getTokenFromLocalStorage(),
    returnUrl: null as string | null,
  }),
  getters: {
    esAdmin: (state) => state.rol === 'ADMIN',
  },
  actions: {
    async login(usuario: string, clave: string) {
      const response = await http.post('auth/login', { usuario, clave })
      this.user = response.data.usuario
      this.nombres = response.data.nombres
      this.rol = response.data.rol?.nombre ?? ''
      this.token = response.data.access_token

      localStorage.setItem('user', this.user)
      localStorage.setItem('nombres', this.nombres)
      localStorage.setItem('rol', this.rol)
      localStorage.setItem('token', this.token || '')

      router.push(this.returnUrl || '/')
    },
    logout() {
      localStorage.clear()
      this.$reset()
      this.token = null
      router.push('/login')
    },
  },
})

export { useAuthStore }
