<script setup lang="ts">
import ProductoList from '@/components/producto/ProductoList.vue'
import ProductoSave from '@/components/producto/ProductoSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Producto } from '@/models/producto'

const mostrarDialog = ref<boolean>(false)
const productoListRef = ref<typeof ProductoList | null>(null)
const productoEdit = ref<Producto | null>(null)

function handleCreate() {
  productoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(producto: Producto) {
  productoEdit.value = producto
  mostrarDialog.value = true
}

function handleSave() {
  productoListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center">
    <h2>Productos</h2>
    <Button label="Nuevo producto" icon="pi pi-plus" @click="handleCreate" />
  </div>
  <ProductoList ref="productoListRef" @edit="handleEdit" />
  <ProductoSave
    :mostrar="mostrarDialog"
    :producto="productoEdit ?? undefined"
    :modoEdicion="!!productoEdit"
    @guardar="handleSave"
    @close="handleCloseDialog"
  />
</template>