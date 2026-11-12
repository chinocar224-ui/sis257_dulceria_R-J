<script setup lang="ts">
import ProveedorList from '@/components/proveedor/ProveedorList.vue'
import ProveedorSave from '@/components/proveedor/ProveedorSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Proveedor } from '@/models/proveedor'

const mostrarDialog = ref<boolean>(false)
const proveedorListRef = ref<typeof ProveedorList | null>(null)
const proveedorEdit = ref<Proveedor | null>(null)

function handleCreate() {
  proveedorEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(proveedor: Proveedor) {
  proveedorEdit.value = proveedor
  mostrarDialog.value = true
}

function handleSave() {
  proveedorListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center">
    <h2>Proveedores</h2>
    <Button label="Nuevo proveedor" icon="pi pi-plus" @click="handleCreate" />
  </div>
  <ProveedorList ref="proveedorListRef" @edit="handleEdit" />
  <ProveedorSave
    :mostrar="mostrarDialog"
    :proveedor="proveedorEdit ?? undefined"
    :modoEdicion="!!proveedorEdit"
    @guardar="handleSave"
    @close="handleCloseDialog"
  />
</template>
