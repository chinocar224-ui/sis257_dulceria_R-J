<script setup lang="ts">
import DireccionList from '@/components/direccion/DireccionList.vue'
import DireccionSave from '@/components/direccion/DireccionSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Direccion } from '@/models/direccion'

const mostrarDialog = ref<boolean>(false)
const direccionListRef = ref<typeof DireccionList | null>(null)
const direccionEdit = ref<Direccion | null>(null)

function handleCreate() {
  direccionEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(direccion: Direccion) {
  direccionEdit.value = direccion
  mostrarDialog.value = true
}

function handleSave() {
  direccionListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center">
    <h2>Direcciones de clientes</h2>
    <Button label="Nueva dirección" icon="pi pi-plus" @click="handleCreate" />
  </div>
  <DireccionList ref="direccionListRef" @edit="handleEdit" />
  <DireccionSave
    :mostrar="mostrarDialog"
    :direccion="direccionEdit ?? undefined"
    :modoEdicion="!!direccionEdit"
    @guardar="handleSave"
    @close="handleCloseDialog"
  />
</template>
