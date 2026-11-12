<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Tag } from 'primevue'
import type { Rol } from '@/models/rol'

const ENDPOINT = 'roles'
const roles = ref<Rol[]>([])
const busqueda = ref<string>('')
const rolDelete = ref<Rol | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const emit = defineEmits(['edit'])

async function obtenerLista() {
  roles.value = await http.get(ENDPOINT).then((response) => response.data)
}

const rolesFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return roles.value.filter(
    (rol) =>
      rol.nombre.toLowerCase().includes(texto) || rol.descripcion.toLowerCase().includes(texto),
  )
})

function emitirEdicion(rol: Rol) {
  emit('edit', rol)
}

function mostrarEliminarConfirm(rol: Rol) {
  rolDelete.value = rol
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${rolDelete.value?.id}`)
  await obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <InputGroup class="my-3">
      <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
      <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o descripción" />
    </InputGroup>

    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rol, index) in rolesFiltrados" :key="rol.id">
          <td>{{ index + 1 }}</td>
          <td>
            <Tag :value="rol.nombre" :severity="rol.nombre === 'ADMIN' ? 'danger' : 'info'" />
          </td>
          <td>{{ rol.descripcion }}</td>
          <td class="text-center">
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(rol)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(rol)"
            />
          </td>
        </tr>
        <tr v-if="rolesFiltrados.length === 0">
          <td colspan="4" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de eliminar el rol "{{ rolDelete?.nombre }}"?</p>
      <div class="flex justify-content-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" severity="danger" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>
