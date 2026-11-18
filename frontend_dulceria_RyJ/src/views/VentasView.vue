<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { isAxiosError } from 'axios'
import http from '@/plugins/axios'
import {
  Button,
  Dialog,
  InputGroup,
  InputGroupAddon,
  InputNumber,
  InputText,
  Select,
  Tag,
} from 'primevue'
import type { Producto } from '@/models/producto'
import type { Usuario } from '@/models/usuario'

interface Movimiento {
  id: number
  idProducto: number
  idVenta: number | null
  tipo: string
  cantidad: number
  motivo: string
  fechaCreacion: string
  producto?: Producto
  usuario?: Usuario
}

const movimientos = ref<Movimiento[]>([])
const productos = ref<Producto[]>([])
const busqueda = ref('')
const filtroTipo = ref('TODOS')
const mostrarDialog = ref(false)
const guardando = ref(false)
const nuevo = ref({ idProducto: null as number | null, tipo: 'ENTRADA', cantidad: 1, motivo: '' })

const tiposFiltro = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Entradas', value: 'ENTRADA' },
  { label: 'Salidas', value: 'SALIDA' },
]
const tipos = [
  { label: 'ENTRADA (ingreso de mercadería)', value: 'ENTRADA' },
  { label: 'SALIDA (baja por vencimiento, daño, etc.)', value: 'SALIDA' },
]

async function obtenerLista() {
  movimientos.value = await http.get('movimientos-inventario').then((res) => res.data)
}

async function obtenerProductos() {
  productos.value = await http.get('productos').then((res) => res.data)
}

const opcionesProductos = computed(() =>
  productos.value.map((p) => ({
    id: p.id,
    etiqueta: `${p.codigo} - ${p.nombre} (stock: ${p.stock})`,
  })),
)

const movimientosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return movimientos.value.filter((m) => {
    const coincideTexto =
      (m.producto?.nombre ?? '').toLowerCase().includes(texto) ||
      (m.producto?.codigo ?? '').toLowerCase().includes(texto) ||
      m.motivo.toLowerCase().includes(texto)
    const coincideTipo = filtroTipo.value === 'TODOS' || m.tipo === filtroTipo.value
    return coincideTexto && coincideTipo
  })
})

function formatearFecha(fecha?: string) {
  return fecha ? new Date(fecha).toLocaleString('es-BO') : ''
}

function abrirDialog() {
  nuevo.value = { idProducto: null, tipo: 'ENTRADA', cantidad: 1, motivo: '' }
  obtenerProductos()
  mostrarDialog.value = true
}

async function guardar() {
  guardando.value = true
  try {
    await http.post('movimientos-inventario', nuevo.value)
    mostrarDialog.value = false
    await obtenerLista()
  } catch (e) {
    const mensaje = isAxiosError(e) ? e.response?.data?.message : undefined
    alert(Array.isArray(mensaje) ? mensaje.join('\n') : mensaje || 'No se pudo registrar')
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  obtenerLista()
})
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h2><i class="bi bi-box-seam"></i> Inventario</h2>
    <Button label="Registrar movimiento" icon="pi pi-plus" @click="abrirDialog" />
  </div>

  <div class="d-flex gap-2 mb-3">
    <InputGroup>
      <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
      <InputText v-model="busqueda" placeholder="Buscar por producto, código o motivo" />
    </InputGroup>
    <Select
      v-model="filtroTipo"
      :options="tiposFiltro"
      optionLabel="label"
      optionValue="value"
      style="min-width: 10rem"
    />
  </div>

  <div class="table-responsive">
    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Fecha</th>
          <th>Producto</th>
          <th class="text-center">Tipo</th>
          <th class="text-center">Cantidad</th>
          <th>Motivo</th>
          <th>Usuario</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in movimientosFiltrados" :key="m.id">
          <td>{{ formatearFecha(m.fechaCreacion) }}</td>
          <td>{{ m.producto?.codigo }} - {{ m.producto?.nombre }}</td>
          <td class="text-center">
            <Tag
              :value="m.tipo"
              :severity="m.tipo === 'ENTRADA' ? 'success' : 'danger'"
              :icon="m.tipo === 'ENTRADA' ? 'pi pi-arrow-down' : 'pi pi-arrow-up'"
            />
          </td>
          <td class="text-center fw-bold" :class="m.tipo === 'ENTRADA' ? 'text-success' : 'text-danger'">
            {{ m.tipo === 'ENTRADA' ? '+' : '−' }}{{ m.cantidad }}
          </td>
          <td>{{ m.motivo }}</td>
          <td>{{ m.usuario?.nombres }}</td>
        </tr>
        <tr v-if="movimientosFiltrados.length === 0">
          <td colspan="6" class="text-center">No hay movimientos</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Registrar movimiento -->
  <Dialog
    v-model:visible="mostrarDialog"
    header="Registrar movimiento de inventario"
    :style="{ width: '34rem' }"
    modal
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label class="font-semibold w-3">Producto</label>
      <Select
        v-model="nuevo.idProducto"
        :options="opcionesProductos"
        optionLabel="etiqueta"
        optionValue="id"
        placeholder="Seleccione un producto"
        class="flex-auto"
        filter
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label class="font-semibold w-3">Tipo</label>
      <Select
        v-model="nuevo.tipo"
        :options="tipos"
        optionLabel="label"
        optionValue="value"
        class="flex-auto"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label class="font-semibold w-3">Cantidad</label>
      <InputNumber v-model="nuevo.cantidad" :min="1" showButtons class="flex-auto" />
    </div>
    <div class="flex align-items-center gap-3 mb-4">
      <label class="font-semibold w-3">Motivo</label>
      <InputText
        v-model="nuevo.motivo"
        class="flex-auto"
        :placeholder="nuevo.tipo === 'ENTRADA' ? 'Ej: Compra a Distribuidora Dulce Sur' : 'Ej: Producto vencido'"
      />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button label="Cancelar" severity="secondary" @click="mostrarDialog = false" />
      <Button label="Guardar" icon="pi pi-save" :loading="guardando" @click="guardar" />
    </div>
  </Dialog>
</template>
