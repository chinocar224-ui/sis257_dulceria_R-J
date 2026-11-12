<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import type { Proveedor } from '@/models/proveedor'

const ENDPOINT = 'proveedores'
const proveedores = ref<Proveedor[]>([])
const busqueda = ref<string>('')
const proveedorDelete = ref<Proveedor | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const emit = defineEmits(['edit'])

async function obtenerLista() {
  proveedores.value = await http.get(ENDPOINT).then((response) => response.data)
}

const proveedoresFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return proveedores.value.filter(
    (proveedor) =>
      proveedor.razonSocial.toLowerCase().includes(texto) ||
      proveedor.nit.toLowerCase().includes(texto) ||
      proveedor.telefono.toLowerCase().includes(texto),
  )
})

function emitirEdicion(proveedor: Proveedor) {
  emit('edit', proveedor)
}

function mostrarEliminarConfirm(proveedor: Proveedor) {
  proveedorDelete.value = proveedor
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${proveedorDelete.value?.id}`)
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
        placeholder="Buscar por razón social, NIT o teléfono"
      />
    </InputGroup>

    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Nro.</th>
          <th>Razón social</th>
          <th>NIT</th>
          <th>Teléfono</th>
          <th>Dirección</th>
          <th>Email</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(proveedor, index) in proveedoresFiltrados" :key="proveedor.id">
          <td>{{ index + 1 }}</td>
          <td>{{ proveedor.razonSocial }}</td>
          <td>{{ proveedor.nit }}</td>
          <td>{{ proveedor.telefono }}</td>
          <td>{{ proveedor.direccion || '—' }}</td>
          <td>{{ proveedor.email || '—' }}</td>
          <td class="text-center">
            <Button
              icon="pi pi-pencil"
              aria-label="Editar"
              text
              @click="emitirEdicion(proveedor)"
            />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(proveedor)"
            />
          </td>
        </tr>
        <tr v-if="proveedoresFiltrados.length === 0">
          <td colspan="7" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de eliminar al proveedor "{{ proveedorDelete?.razonSocial }}"?</p>
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
