<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Tag } from 'primevue'
import type { Direccion } from '@/models/direccion'

const ENDPOINT = 'direcciones'
const direcciones = ref<Direccion[]>([])
const busqueda = ref<string>('')
const direccionDelete = ref<Direccion | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const emit = defineEmits(['edit'])

async function obtenerLista() {
  direcciones.value = await http.get(ENDPOINT).then((response) => response.data)
}

const direccionesFiltradas = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return direcciones.value.filter(
    (d) =>
      d.direccion.toLowerCase().includes(texto) ||
      d.zona.toLowerCase().includes(texto) ||
      `${d.cliente?.nombres} ${d.cliente?.apellidos}`.toLowerCase().includes(texto),
  )
})

function emitirEdicion(direccion: Direccion) {
  emit('edit', direccion)
}

function mostrarEliminarConfirm(direccion: Direccion) {
  direccionDelete.value = direccion
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${direccionDelete.value?.id}`)
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
        placeholder="Buscar por cliente, dirección o zona"
      />
    </InputGroup>

    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Nro.</th>
          <th>Cliente</th>
          <th>Dirección</th>
          <th>Zona</th>
          <th>Referencia</th>
          <th class="text-center">Principal</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(direccion, index) in direccionesFiltradas" :key="direccion.id">
          <td>{{ index + 1 }}</td>
          <td>{{ direccion.cliente?.nombres }} {{ direccion.cliente?.apellidos }}</td>
          <td>{{ direccion.direccion }}</td>
          <td>{{ direccion.zona }}</td>
          <td>{{ direccion.referencia || '—' }}</td>
          <td class="text-center">
            <Tag v-if="direccion.principal" value="Principal" severity="success" />
            <span v-else>—</span>
          </td>
          <td class="text-center">
            <Button
              icon="pi pi-pencil"
              aria-label="Editar"
              text
              @click="emitirEdicion(direccion)"
            />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(direccion)"
            />
          </td>
        </tr>
        <tr v-if="direccionesFiltradas.length === 0">
          <td colspan="7" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de eliminar la dirección "{{ direccionDelete?.direccion }}"?</p>
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
