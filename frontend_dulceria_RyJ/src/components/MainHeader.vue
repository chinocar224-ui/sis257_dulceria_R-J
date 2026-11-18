<script setup lang="ts">
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark menu-dulce sticky-top">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">
        <i class="bi bi-cake2"></i> Dulcería R&amp;J
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#menuPrincipal"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="menuPrincipal" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Inicio</RouterLink>
          </li>

          <template v-if="authStore.token">
            <!-- Ventas -->
            <li class="nav-item">
              <RouterLink class="nav-link" to="/punto-venta">
                <i class="bi bi-cart3"></i> Punto de venta
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/ventas">Ventas</RouterLink>
            </li>

            <!-- Catálogos -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Catálogos
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><RouterLink class="dropdown-item" to="/productos">Productos</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/clientes">Clientes</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/direcciones">Direcciones</RouterLink></li>
                <template v-if="authStore.esAdmin">
                  <li><hr class="dropdown-divider" /></li>
                  <li><RouterLink class="dropdown-item" to="/categorias">Categorías</RouterLink></li>
                  <li><RouterLink class="dropdown-item" to="/proveedores">Proveedores</RouterLink></li>
                  <li><RouterLink class="dropdown-item" to="/inventario">Inventario</RouterLink></li>
                </template>
              </ul>
            </li>

            <!-- Administración (solo ADMIN) -->
            <li v-if="authStore.esAdmin" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Administración
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><RouterLink class="dropdown-item" to="/usuarios">Usuarios</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/roles">Roles</RouterLink></li>
              </ul>
            </li>

            <!-- Usuario conectado -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle"></i> {{ authStore.nombres || authStore.user }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <span class="dropdown-item-text small text-muted">Rol: {{ authStore.rol }}</span>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="authStore.logout()">
                    <i class="bi bi-box-arrow-right"></i> Cerrar sesión
                  </a>
                </li>
              </ul>
            </li>
          </template>

          <li v-else class="nav-item">
            <RouterLink class="nav-link" to="/login">
              <i class="bi bi-box-arrow-in-right"></i> Iniciar sesión
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.menu-dulce {
  background: linear-gradient(90deg, #d63384, #f472b6);
}
.nav-link.router-link-active {
  font-weight: bold;
  color: #fff !important;
}
.dropdown-item.router-link-active {
  background: #fce7f3;
  color: #9d174d;
}
</style>
