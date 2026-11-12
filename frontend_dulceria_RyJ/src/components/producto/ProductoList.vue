<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Tag } from 'primevue'
import type { Producto } from '@/models/producto'

const ENDPOINT = 'productos'
const STOCK_MINIMO = 10
const productos = ref<Producto[]>([])
const busqueda = ref<string>('')
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const emit = defineEmits(['edit'])

async function obtenerLista() {
  productos.value = await http.get(ENDPOINT).then((response) => response.data)
}

const productosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return productos.value.filter(
    (p) =>
      p.codigo.toLowerCase().includes(texto) ||
      p.nombre.toLowerCase().includes(texto) ||
      (p.categoria?.nombre ?? '').toLowerCase().includes(texto) ||
      (p.proveedor?.razonSocial ?? '').toLowerCase().includes(texto),
  )
})

function estaVencido(fecha?: string) {
  if (!fecha) return false
  return new Date(fecha) < new Date()
}

function formatearFecha(fecha?: string) {
  if (!fecha) return '—'
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}

function emitirEdicion(producto: Producto) {
  emit('edit', producto)
}

function mostrarEliminarConfirm(producto: Producto) {
  productoDelete.value = producto
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${productoDelete.value?.id}`)
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
        placeholder="Buscar por código, nombre, categoría o proveedor"
      />
    </InputGroup>

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Nro.</th>
            <th>Imagen</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th class="text-end">Precio (Bs.)</th>
            <th class="text-center">Stock</th>
            <th>Vence</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(producto, index) in productosFiltrados" :key="producto.id">
            <td>{{ index + 1 }}</td>
            <td>
              <img
                v-if="producto.imagen"
                :src="producto.imagen"
                alt="producto"
                class="img-producto"
              />
              <i v-else class="bi bi-image text-muted fs-3"></i>
            </td>
            <td>{{ producto.codigo }}</td>
            <td>{{ producto.nombre }}</td>
            <td>{{ producto.categoria?.nombre }}</td>
            <td>{{ producto.proveedor?.razonSocial || '—' }}</td>
            <td class="text-end">{{ producto.precio.toFixed(2) }}</td>
            <td class="text-center">
              <Tag
                :value="producto.stock"
                :severity="producto.stock <= STOCK_MINIMO ? 'danger' : 'success'"
              />
            </td>
            <td>
              <span :class="{ 'text-danger fw-bold': estaVencido(producto.fechaVencimiento) }">
                {{ formatearFecha(producto.fechaVencimiento) }}
              </span>
              <Tag
                v-if="estaVencido(producto.fechaVencimiento)"
                value="Vencido"
                severity="danger"
                class="ms-1"
              />
            </td>
            <td class="text-center text-nowrap">
              <Button
                icon="pi pi-pencil"
                aria-label="Editar"
                text
                @click="emitirEdicion(producto)"
              />
              <Button
                icon="pi pi-trash"
                aria-label="Eliminar"
                text
                severity="danger"
                @click="mostrarEliminarConfirm(producto)"
              />
            </td>
          </tr>
          <tr v-if="productosFiltrados.length === 0">
            <td colspan="10" class="text-center">No se encontraron resultados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de eliminar el producto "{{ productoDelete?.nombre }}"?</p>
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

<style scoped>
.img-producto {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
