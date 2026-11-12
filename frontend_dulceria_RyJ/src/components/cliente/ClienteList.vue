<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Tag } from 'primevue'
import type { Cliente } from '@/models/cliente'

const ENDPOINT = 'clientes'
const clientes = ref<Cliente[]>([])
const busqueda = ref<string>('')
const clienteDelete = ref<Cliente | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const emit = defineEmits(['edit'])

async function obtenerLista() {
  clientes.value = await http.get(ENDPOINT).then((response) => response.data)
}

const clientesFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return clientes.value.filter(
    (cliente) =>
      cliente.ciNit.toLowerCase().includes(texto) ||
      cliente.nombres.toLowerCase().includes(texto) ||
      cliente.apellidos.toLowerCase().includes(texto),
  )
})

function emitirEdicion(cliente: Cliente) {
  emit('edit', cliente)
}

function mostrarEliminarConfirm(cliente: Cliente) {
  clienteDelete.value = cliente
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${clienteDelete.value?.id}`)
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
        placeholder="Buscar por CI/NIT, nombres o apellidos"
      />
    </InputGroup>

    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Nro.</th>
          <th>CI/NIT</th>
          <th>Nombre completo</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th class="text-center">Direcciones</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cliente, index) in clientesFiltrados" :key="cliente.id">
          <td>{{ index + 1 }}</td>
          <td>{{ cliente.ciNit }}</td>
          <td>{{ cliente.nombres }} {{ cliente.apellidos }}</td>
          <td>{{ cliente.telefono || '—' }}</td>
          <td>{{ cliente.email || '—' }}</td>
          <td class="text-center">
            <Tag
              :value="cliente.direcciones?.length ?? 0"
              :severity="cliente.direcciones?.length ? 'success' : 'secondary'"
              rounded
            />
          </td>
          <td class="text-center">
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(cliente)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(cliente)"
            />
          </td>
        </tr>
        <tr v-if="clientesFiltrados.length === 0">
          <td colspan="7" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>
        ¿Estás seguro de eliminar al cliente "{{ clienteDelete?.nombres }}
        {{ clienteDelete?.apellidos }}"?
      </p>
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
