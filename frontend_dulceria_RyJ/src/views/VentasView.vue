<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { isAxiosError } from 'axios'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Select, Tag } from 'primevue'
import { useAuthStore } from '@/stores'
import type { Venta } from '@/models/venta'

const authStore = useAuthStore()
const ventas = ref<Venta[]>([])
const busqueda = ref('')
const filtroEstado = ref('TODAS')
const ventaDetalle = ref<Venta | null>(null)
const mostrarDetalle = ref(false)
const ventaAnular = ref<Venta | null>(null)
const mostrarConfirmAnular = ref(false)

const estados = [
  { label: 'Todas', value: 'TODAS' },
  { label: 'Pagadas', value: 'PAGADA' },
  { label: 'Anuladas', value: 'ANULADA' },
]

async function obtenerLista() {
  ventas.value = await http.get('ventas').then((res) => res.data)
}

const ventasFiltradas = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return ventas.value.filter((v) => {
    const coincideTexto =
      String(v.id).includes(texto) ||
      `${v.cliente?.nombres} ${v.cliente?.apellidos}`.toLowerCase().includes(texto) ||
      (v.cliente?.ciNit ?? '').includes(texto) ||
      (v.usuario?.nombres ?? '').toLowerCase().includes(texto)
    const coincideEstado = filtroEstado.value === 'TODAS' || v.estado === filtroEstado.value
    return coincideTexto && coincideEstado
  })
})

// Resumen del día (solo ventas PAGADAS de hoy)
const ventasDeHoy = computed(() => {
  const hoy = new Date().toDateString()
  return ventas.value.filter(
    (v) => v.estado === 'PAGADA' && new Date(v.fecha).toDateString() === hoy,
  )
})
const totalHoy = computed(() => ventasDeHoy.value.reduce((suma, v) => suma + v.total, 0))

function formatearFecha(fecha?: string) {
  return fecha ? new Date(fecha).toLocaleString('es-BO') : ''
}

async function verDetalle(venta: Venta) {
  ventaDetalle.value = await http.get(`ventas/${venta.id}`).then((res) => res.data)
  mostrarDetalle.value = true
}

function confirmarAnular(venta: Venta) {
  ventaAnular.value = venta
  mostrarConfirmAnular.value = true
}

async function anular() {
  try {
    await http.patch(`ventas/${ventaAnular.value?.id}/anular`)
    mostrarConfirmAnular.value = false
    await obtenerLista()
  } catch (e) {
    const mensaje = isAxiosError(e) ? e.response?.data?.message : undefined
    alert(mensaje || 'No se pudo anular la venta')
  }
}

onMounted(() => {
  obtenerLista()
})
</script>

<template>
  <h2 class="mb-3"><i class="bi bi-receipt"></i> Historial de ventas</h2>

  <!-- Resumen del día -->
  <div class="row g-3 mb-3">
    <div class="col-md-6">
      <div class="card resumen">
        <div class="card-body">
          <small class="text-muted">Ventas de hoy</small>
          <div class="fs-3 fw-bold">{{ ventasDeHoy.length }}</div>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card resumen">
        <div class="card-body">
          <small class="text-muted">Total vendido hoy</small>
          <div class="fs-3 fw-bold">Bs. {{ totalHoy.toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Filtros -->
  <div class="d-flex gap-2 mb-3">
    <InputGroup>
      <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
      <InputText v-model="busqueda" placeholder="Buscar por N°, cliente, CI/NIT o cajero" />
    </InputGroup>
    <Select
      v-model="filtroEstado"
      :options="estados"
      optionLabel="label"
      optionValue="value"
      style="min-width: 10rem"
    />
  </div>

  <div class="table-responsive">
    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>N°</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Cajero</th>
          <th class="text-end">Total (Bs.)</th>
          <th class="text-center">Estado</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="venta in ventasFiltradas"
          :key="venta.id"
          :class="{ anulada: venta.estado === 'ANULADA' }"
        >
          <td>{{ venta.id }}</td>
          <td>{{ formatearFecha(venta.fecha) }}</td>
          <td>{{ venta.cliente?.nombres }} {{ venta.cliente?.apellidos }}</td>
          <td>{{ venta.usuario?.nombres }}</td>
          <td class="text-end fw-semibold">{{ venta.total.toFixed(2) }}</td>
          <td class="text-center">
            <Tag :value="venta.estado" :severity="venta.estado === 'PAGADA' ? 'success' : 'danger'" />
          </td>
          <td class="text-center text-nowrap">
            <Button icon="pi pi-eye" text aria-label="Ver detalle" @click="verDetalle(venta)" />
            <Button
              v-if="authStore.esAdmin && venta.estado === 'PAGADA'"
              icon="pi pi-ban"
              text
              severity="danger"
              aria-label="Anular"
              @click="confirmarAnular(venta)"
            />
          </td>
        </tr>
        <tr v-if="ventasFiltradas.length === 0">
          <td colspan="7" class="text-center">No se encontraron ventas</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Detalle de la venta -->
  <Dialog
    v-model:visible="mostrarDetalle"
    :header="`Venta N° ${ventaDetalle?.id ?? ''}`"
    :style="{ width: '34rem' }"
    modal
  >
    <div v-if="ventaDetalle">
      <p class="mb-1"><b>Fecha:</b> {{ formatearFecha(ventaDetalle.fecha) }}</p>
      <p class="mb-1">
        <b>Cliente:</b> {{ ventaDetalle.cliente?.nombres }} {{ ventaDetalle.cliente?.apellidos }}
        (CI/NIT: {{ ventaDetalle.cliente?.ciNit }})
      </p>
      <p class="mb-1"><b>Cajero:</b> {{ ventaDetalle.usuario?.nombres }}</p>
      <p class="mb-2">
        <b>Estado:</b>
        <Tag
          :value="ventaDetalle.estado"
          :severity="ventaDetalle.estado === 'PAGADA' ? 'success' : 'danger'"
          class="ms-1"
        />
      </p>

      <table class="table table-sm">
        <thead>
          <tr>
            <th>Producto</th>
            <th class="text-center">Cant.</th>
            <th class="text-end">P. Unit.</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in ventaDetalle.detalles" :key="d.id">
            <td>{{ d.producto?.nombre }}</td>
            <td class="text-center">{{ d.cantidad }}</td>
            <td class="text-end">{{ d.precioUnitario.toFixed(2) }}</td>
            <td class="text-end">{{ d.subtotal.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between fw-bold fs-5">
        <span>TOTAL</span><span>Bs. {{ ventaDetalle.total.toFixed(2) }}</span>
      </div>
      <div v-for="p in ventaDetalle.pagos" :key="p.id" class="d-flex justify-content-between">
        <span>
          Pago {{ p.metodo }}
          <small v-if="p.referencia" class="text-muted">(Ref: {{ p.referencia }})</small>
        </span>
        <span>Bs. {{ p.monto.toFixed(2) }}</span>
      </div>
    </div>
  </Dialog>

  <!-- Confirmar anulación -->
  <Dialog
    v-model:visible="mostrarConfirmAnular"
    header="Anular venta"
    :style="{ width: '26rem' }"
    modal
  >
    <p>
      ¿Seguro que deseas anular la <b>venta N° {{ ventaAnular?.id }}</b> por
      <b>Bs. {{ ventaAnular?.total.toFixed(2) }}</b>?
    </p>
    <p class="text-muted small">Los productos volverán al stock.</p>
    <div class="flex justify-content-end gap-2">
      <Button label="Cancelar" severity="secondary" @click="mostrarConfirmAnular = false" />
      <Button label="Anular" icon="pi pi-ban" severity="danger" @click="anular" />
    </div>
  </Dialog>
</template>

<style scoped>
.resumen {
  border-left: 5px solid var(--acento);
}
.anulada td {
  color: #777;
  text-decoration: line-through;
}
.anulada td:last-child,
.anulada td:nth-last-child(2) {
  text-decoration: none;
}
</style>
