<script setup lang="ts">
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'
</script>

<template>
  <MainHeader />
  <main class="container my-4">
    <RouterView />
  </main>
  <MainFooter />
</template>