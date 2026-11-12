<script setup lang="ts">
import RolList from '@/components/rol/RolList.vue'
import RolSave from '@/components/rol/RolSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Rol } from '@/models/rol'

const mostrarDialog = ref<boolean>(false)
const rolListRef = ref<typeof RolList | null>(null)
const rolEdit = ref<Rol | null>(null)

function handleCreate() {
  rolEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(rol: Rol) {
  rolEdit.value = rol
  mostrarDialog.value = true
}

function handleSave() {
  rolListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center">
    <h2>Roles</h2>
    <Button label="Nuevo rol" icon="pi pi-plus" @click="handleCreate" />
  </div>
  <RolList ref="rolListRef" @edit="handleEdit" />
  <RolSave
    :mostrar="mostrarDialog"
    :rol="rolEdit ?? undefined"
    :modoEdicion="!!rolEdit"
    @guardar="handleSave"
    @close="handleCloseDialog"
  />
</template>
