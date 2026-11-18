import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/index'
import { getTokenFromLocalStorage } from '@/helpers'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },

    // Ventas (ADMIN y CAJERO)
    { path: '/punto-venta', name: 'punto-venta', component: () => import('../views/PuntoVentaView.vue') },
    { path: '/ventas', name: 'ventas', component: () => import('../views/VentasView.vue') },

    // Catálogos (ADMIN y CAJERO)
    { path: '/clientes', name: 'clientes', component: () => import('../views/ClientesView.vue') },
    { path: '/direcciones', name: 'direcciones', component: () => import('../views/DireccionesView.vue') },
    { path: '/productos', name: 'productos', component: () => import('../views/ProductosView.vue') },

    // Solo ADMIN
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriasView.vue'),
      meta: { roles: ['ADMIN'] },
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      component: () => import('../views/ProveedoresView.vue'),
      meta: { roles: ['ADMIN'] },
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: () => import('../views/InventarioView.vue'),
      meta: { roles: ['ADMIN'] },
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/UsuariosView.vue'),
      meta: { roles: ['ADMIN'] },
    },
    {
      path: '/roles',
      name: 'roles',
      component: () => import('../views/RolesView.vue'),
      meta: { roles: ['ADMIN'] },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const publicPages = ['/', '/login']
  const autenticado = !!getTokenFromLocalStorage()

  // 1. Sin sesión: solo puede ver las páginas públicas
  if (!publicPages.includes(to.path) && !autenticado) {
    authStore.returnUrl = to.fullPath
    return '/login'
  }

  // 2. Con sesión: no tiene sentido volver al login
  if (to.path === '/login' && autenticado) return '/'

  // 3. Rutas solo para ciertos roles
  const roles = to.meta.roles as string[] | undefined
  if (roles && !roles.includes(authStore.rol)) return '/'
})

export default router
