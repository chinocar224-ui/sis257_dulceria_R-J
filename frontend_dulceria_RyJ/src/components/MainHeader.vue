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
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Inicio</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/categorias">Categorías</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/productos">Productos</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/clientes">Clientes</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/direcciones">Direcciones</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/proveedores">Proveedores</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/roles">Roles</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/usuarios">Usuarios</RouterLink>
          </li>

          <li v-if="!authStore.token" class="nav-item">
            <RouterLink class="nav-link" to="/login">Iniciar sesión</RouterLink>
          </li>
          <li v-else class="nav-item">
            <a class="nav-link" href="#" @click.prevent="authStore.logout()">
              Salir ({{ authStore.user }})
            </a>
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
</style>
