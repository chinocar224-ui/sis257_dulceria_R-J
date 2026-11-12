<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Tag } from 'primevue'
import type { Usuario } from '@/models/usuario'

const ENDPOINT = 'usuarios'
const usuarios = ref<Usuario[]>([])
const busqueda = ref<string>('')
const usuarioDelete = ref<Usuario | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const emit = defineEmits(['edit'])

async function obtenerLista() {
  usuarios.value = await http.get(ENDPOINT).then((response) => response.data)
}

const usuariosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return usuarios.value.filter(
    (u) =>
      u.nombres.toLowerCase().includes(texto) ||
      u.usuario.toLowerCase().includes(texto) ||
      u.email.toLowerCase().includes(texto) ||
      (u.rol?.nombre ?? '').toLowerCase().includes(texto),
  )
})

function emitirEdicion(usuario: Usuario) {
  emit('edit', usuario)
}

function mostrarEliminarConfirm(usuario: Usuario) {
  usuarioDelete.value = usuario
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${usuarioDelete.value?.id}`)
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
      <InputText
        v-model="busqueda"
        type="text"
        placeholder="Buscar por nombre, usuario, email o rol"
      />
    </InputGroup>

    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Nro.</th>
          <th>Nombres</th>
          <th>Usuario</th>
          <th>Email</th>
          <th>Rol</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usuario, index) in usuariosFiltrados" :key="usuario.id">
          <td>{{ index + 1 }}</td>
          <td>{{ usuario.nombres }}</td>
          <td><i class="pi pi-user me-1"></i>{{ usuario.usuario }}</td>
          <td>{{ usuario.email }}</td>
          <td>
            <Tag
              :value="usuario.rol?.nombre"
              :severity="usuario.rol?.nombre === 'ADMIN' ? 'danger' : 'info'"
            />
          </td>
          <td class="text-center">
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(usuario)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(usuario)"
            />
          </td>
        </tr>
        <tr v-if="usuariosFiltrados.length === 0">
          <td colspan="6" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de eliminar al usuario "{{ usuarioDelete?.usuario }}"?</p>
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
