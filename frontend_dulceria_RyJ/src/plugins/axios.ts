import Axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/index'

const axios: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT,
})

axios.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (config.headers) {
    config.headers['Content-type'] = 'application/json'
    if (authStore.token) config.headers['Authorization'] = 'Bearer ' + authStore.token
  }
  return config
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = error.config?.url?.includes('auth/login')
    if (error.response?.status === 401 && !esLogin) {
      useAuthStore().logout()
    }
    return Promise.reject(error)
  },
)

export default axios
