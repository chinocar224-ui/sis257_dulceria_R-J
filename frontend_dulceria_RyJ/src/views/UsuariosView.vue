<script setup lang="ts">
import UsuarioList from '@/components/usuario/UsuarioList.vue'
import UsuarioSave from '@/components/usuario/UsuarioSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Usuario } from '@/models/usuario'

const mostrarDialog = ref<boolean>(false)
const usuarioListRef = ref<typeof UsuarioList | null>(null)
const usuarioEdit = ref<Usuario | null>(null)

function handleCreate() {
  usuarioEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(usuario: Usuario) {
  usuarioEdit.value = usuario
  mostrarDialog.value = true
}

function handleSave() {
  usuarioListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center">
    <h2>Usuarios</h2>
    <Button label="Nuevo usuario" icon="pi pi-plus" @click="handleCreate" />
  </div>
  <UsuarioList ref="usuarioListRef" @edit="handleEdit" />
  <UsuarioSave
    :mostrar="mostrarDialog"
    :usuario="usuarioEdit ?? undefined"
    :modoEdicion="!!usuarioEdit"
    @guardar="handleSave"
    @close="handleCloseDialog"
  />
</template>