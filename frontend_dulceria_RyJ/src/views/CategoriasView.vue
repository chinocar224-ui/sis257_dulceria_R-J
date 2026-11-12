<script setup lang="ts">
import CategoriaList from '@/components/categoria/CategoriaList.vue'
import CategoriaSave from '@/components/categoria/CategoriaSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Categoria } from '@/models/categoria'

const mostrarDialog = ref<boolean>(false)
const categoriaListRef = ref<typeof CategoriaList | null>(null)
const categoriaEdit = ref<Categoria | null>(null)

function handleCreate() {
  categoriaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(categoria: Categoria) {
  categoriaEdit.value = categoria
  mostrarDialog.value = true
}

function handleSave() {
  categoriaListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center">
    <h2>Categorías</h2>
    <Button label="Nueva categoría" icon="pi pi-plus" @click="handleCreate" />
  </div>
  <CategoriaList ref="categoriaListRef" @edit="handleEdit" />
  <CategoriaSave
    :mostrar="mostrarDialog"
    :categoria="categoriaEdit ?? undefined"
    :modoEdicion="!!categoriaEdit"
    @guardar="handleSave"
    @close="handleCloseDialog"
  />
</template>