<script setup lang="ts">
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()

// Las imágenes están en public/img (reemplázalas por fotos reales de dulces)
const categorias = [
  {
    nombre: 'Chocolates',
    imagen: '/img/cat-chocolates.jpg',
    texto: 'Barras, bombones y trufas de las mejores marcas nacionales e importadas.',
  },
  {
    nombre: 'Gomitas',
    imagen: '/img/cat-gomitas.jpg',
    texto: 'Gomitas de frutas, ositos, gusanitos ácidos y caramelos masticables.',
  },
  {
    nombre: 'Caramelos',
    imagen: '/img/cat-caramelos.jpg',
    texto: 'Caramelos duros, chupetes y dulces tradicionales para todas las edades.',
  },
  {
    nombre: 'Galletas',
    imagen: '/img/cat-galletas.jpg',
    texto: 'Galletas dulces, rellenas y bañadas en chocolate para acompañar tu día.',
  },
]
</script>

<template>
  <!-- ========== CARRUSEL ========== -->
  <div id="header-carousel" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img class="w-100" src="/img/carousel-1.jpg" alt="Dulces" />
        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
          <div class="title mx-5 px-5">
            <div class="title-center">
              <h5>Bienvenidos</h5>
              <h1 class="display-1">Dulcería R&amp;J</h1>
            </div>
          </div>
          <p class="fs-5 mb-5">
            Chocolates, gomitas, caramelos y mucho más.<br />
            Endulzamos tus días desde nuestro mostrador.
          </p>
          <RouterLink
            :to="authStore.token ? '/punto-venta' : '/login'"
            class="btn btn-outline-primary border-2 py-3 px-5"
          >
            {{ authStore.token ? 'Ir al punto de venta' : 'Iniciar sesión' }}
          </RouterLink>
        </div>
      </div>
      <div class="carousel-item">
        <img class="w-100" src="/img/carousel-2.jpg" alt="Dulces" />
        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
          <div class="title mx-5 px-5">
            <div class="title-center">
              <h5>Variedad y calidad</h5>
              <h1 class="display-1">Para todos los gustos</h1>
            </div>
          </div>
          <p class="fs-5 mb-5">
            Productos frescos, controlados por fecha de vencimiento<br />
            y con el mejor precio de la ciudad.
          </p>
        </div>
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#header-carousel"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#header-carousel"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Siguiente</span>
    </button>
  </div>

  <!-- ========== SOBRE NOSOTROS ========== -->
  <div class="container-fluid bg-secondary">
    <div class="container">
      <div class="row g-5 align-items-center">
        <div class="col-lg-7 py-5">
          <div class="py-5">
            <div class="title">
              <div class="title-left">
                <h5>Nuestra historia</h5>
                <h1>Sobre nosotros</h1>
              </div>
            </div>
            <p class="mb-4">
              Dulcería R&amp;J es una tienda de dulces que ofrece una gran variedad de golosinas a
              precios accesibles. Con nuestro sistema llevamos el control del inventario, las ventas
              y los clientes para brindarte una atención rápida y confiable.
            </p>
            <ul class="list-group list-group-flush mb-5">
              <li class="list-group-item bg-secondary text-body border-dark ps-0">
                <i class="fa fa-check-circle text-primary me-1"></i> Productos frescos y controlados
                por vencimiento
              </li>
              <li class="list-group-item bg-secondary text-body border-dark ps-0">
                <i class="fa fa-check-circle text-primary me-1"></i> Pagos en efectivo, QR o tarjeta
              </li>
              <li class="list-group-item bg-secondary text-body border-dark ps-0">
                <i class="fa fa-check-circle text-primary me-1"></i> Atención rápida con comprobante
                de venta
              </li>
            </ul>
          </div>
        </div>
        <div class="col-lg-5">
          <img class="img-fluid rounded" src="/img/about.jpg" alt="Nuestra tienda" />
        </div>
      </div>
    </div>
  </div>

  <!-- ========== CATEGORÍAS (sección "Services" del template) ========== -->
  <div class="container-fluid py-5">
    <div class="container py-5">
      <div class="text-center">
        <div class="title">
          <div class="title-center">
            <h5>Nuestros productos</h5>
            <h1>Categorías</h1>
          </div>
        </div>
      </div>
      <div
        v-for="(categoria, index) in categorias"
        :key="categoria.nombre"
        class="service-item"
        :class="index % 2 === 0 ? 'service-item-left' : 'service-item-right'"
      >
        <div class="row g-0 align-items-center">
          <div class="col-md-5" :class="{ 'order-md-1 text-md-end': index % 2 !== 0 }">
            <div class="service-img p-5">
              <img
                class="img-fluid rounded-circle"
                :src="categoria.imagen"
                :alt="categoria.nombre"
              />
            </div>
          </div>
          <div class="col-md-7">
            <div
              class="service-text px-5 px-md-0 py-md-5"
              :class="{ 'text-md-end': index % 2 !== 0 }"
            >
              <h3 class="text-uppercase">{{ categoria.nombre }}</h3>
              <p class="mb-0">{{ categoria.texto }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
