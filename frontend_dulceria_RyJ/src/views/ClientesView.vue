<script setup lang="ts">
import ClienteList from '@/components/cliente/ClienteList.vue'
import ClienteSave from '@/components/cliente/ClienteSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Cliente } from '@/models/cliente'

const mostrarDialog = ref<boolean>(false)
const clienteListRef = ref<typeof ClienteList | null>(null)
const clienteEdit = ref<Cliente | null>(null)

function handleCreate() {
  clienteEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(cliente: Cliente) {
  clienteEdit.value = cliente
  mostrarDialog.value = true
}

function handleSave() {
  clienteListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center">
    <h2>Clientes</h2>
    <Button label="Nuevo cliente" icon="pi pi-plus" @click="handleCreate" />
  </div>
  <ClienteList ref="clienteListRef" @edit="handleEdit" />
  <ClienteSave
    :mostrar="mostrarDialog"
    :cliente="clienteEdit ?? undefined"
    :modoEdicion="!!clienteEdit"
    @guardar="handleSave"
    @close="handleCloseDialog"
  />
</template>
