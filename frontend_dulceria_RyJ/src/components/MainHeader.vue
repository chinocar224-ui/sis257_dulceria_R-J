<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
const route = useRoute()
// En el inicio el menú flota sobre el carrusel (como en el template)
const esInicio = computed(() => route.path === '/')
</script>

<template>
  <div class="container-fluid p-0">
    <nav class="navbar navbar-expand-lg navbar-dark px-lg-5" :class="{ 'navbar-fija': !esInicio }">
      <RouterLink to="/" class="navbar-brand ms-4 ms-lg-0">
        <h2 class="mb-0 text-primary text-uppercase">
          <i class="bi bi-cake2 me-1"></i>Dulcería R&amp;J
        </h2>
      </RouterLink>
      <button
        type="button"
        class="navbar-toggler me-4"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navbarCollapse" class="collapse navbar-collapse">
        <div class="navbar-nav mx-auto p-4 p-lg-0">
          <RouterLink to="/" class="nav-item nav-link">Inicio</RouterLink>

          <template v-if="authStore.token">
            <RouterLink to="/punto-venta" class="nav-item nav-link">Punto de venta</RouterLink>
            <RouterLink to="/ventas" class="nav-item nav-link">Ventas</RouterLink>

            <div class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Catálogos</a>
              <div class="dropdown-menu m-0">
                <RouterLink to="/productos" class="dropdown-item">Productos</RouterLink>
                <RouterLink to="/clientes" class="dropdown-item">Clientes</RouterLink>
                <RouterLink to="/direcciones" class="dropdown-item">Direcciones</RouterLink>
                <template v-if="authStore.esAdmin">
                  <RouterLink to="/categorias" class="dropdown-item">Categorías</RouterLink>
                  <RouterLink to="/proveedores" class="dropdown-item">Proveedores</RouterLink>
                  <RouterLink to="/inventario" class="dropdown-item">Inventario</RouterLink>
                </template>
              </div>
            </div>

            <div v-if="authStore.esAdmin" class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Administración</a>
              <div class="dropdown-menu m-0">
                <RouterLink to="/usuarios" class="dropdown-item">Usuarios</RouterLink>
                <RouterLink to="/roles" class="dropdown-item">Roles</RouterLink>
              </div>
            </div>
          </template>
        </div>

        <!-- Botón de la derecha (en el template era "Download Now") -->
        <div class="d-flex align-items-center pb-3 pb-lg-0 px-4 px-lg-0">
          <div v-if="authStore.token" class="nav-item dropdown">
            <a
              href="#"
              class="btn btn-outline-primary border-2 dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-person-circle"></i> {{ authStore.nombres || authStore.user }}
            </a>
            <div class="dropdown-menu dropdown-menu-end m-0">
              <span class="dropdown-item-text small">Rol: {{ authStore.rol }}</span>
              <a href="#" class="dropdown-item text-danger" @click.prevent="authStore.logout()">
                <i class="bi bi-box-arrow-right"></i> Cerrar sesión
              </a>
            </div>
          </div>
          <RouterLink v-else to="/login" class="btn btn-outline-primary border-2">
            <i class="bi bi-box-arrow-in-right"></i> Iniciar sesión
          </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>
