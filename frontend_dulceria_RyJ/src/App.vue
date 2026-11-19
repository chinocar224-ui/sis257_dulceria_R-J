<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'

const route = useRoute()
const esInicio = computed(() => route.path === '/')
</script>

<template>
  <MainHeader />
  <!-- El inicio ocupa todo el ancho; las demás páginas van en un contenedor -->
  <main :class="{ 'container py-5 contenido': !esInicio }">
    <RouterView />
  </main>
  <MainFooter />
</template>

<style scoped>
.contenido {
  min-height: 70vh;
}
</style>
