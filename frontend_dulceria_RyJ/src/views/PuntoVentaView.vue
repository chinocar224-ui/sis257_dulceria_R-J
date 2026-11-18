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
import ClienteSave from '@/components/cliente/ClienteSave.vue'
import type { Producto } from '@/models/producto'
import type { Cliente } from '@/models/cliente'
import type { Venta } from '@/models/venta'

interface ItemCarrito {
  producto: Producto
  cantidad: number
}

const productos = ref<Producto[]>([])
const clientes = ref<Cliente[]>([])
const busqueda = ref('')
const carrito = ref<ItemCarrito[]>([])
const idCliente = ref<number | null>(null)
const metodo = ref('EFECTIVO')
const montoRecibido = ref<number | null>(null)
const referencia = ref('')
const guardando = ref(false)
const mostrarClienteDialog = ref(false)
const mostrarComprobante = ref(false)
const ventaRealizada = ref<(Venta & { cambio: number }) | null>(null)

const metodos = [
  { label: 'Efectivo', value: 'EFECTIVO' },
  { label: 'QR', value: 'QR' },
  { label: 'Tarjeta', value: 'TARJETA' },
]

const redondear = (valor: number) => Math.round(valor * 100) / 100

// ---------- Carga de datos ----------
async function obtenerProductos() {
  productos.value = await http.get('productos').then((res) => res.data)
}

async function obtenerClientes() {
  clientes.value = await http.get('clientes').then((res) => res.data)
  if (!idCliente.value) seleccionarClienteGenerico()
}

function seleccionarClienteGenerico() {
  const generico = clientes.value.find((c) => c.ciNit === '0')
  idCliente.value = generico?.id ?? null
}

const opcionesClientes = computed(() =>
  clientes.value.map((c) => ({ id: c.id, etiqueta: `${c.nombres} ${c.apellidos} (${c.ciNit})` })),
)

const productosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return productos.value.filter(
    (p) =>
      p.nombre.toLowerCase().includes(texto) ||
      p.codigo.toLowerCase().includes(texto) ||
      (p.categoria?.nombre ?? '').toLowerCase().includes(texto),
  )
})

// ---------- Carrito ----------
function cantidadEnCarrito(idProducto: number) {
  return carrito.value.find((i) => i.producto.id === idProducto)?.cantidad ?? 0
}

function agregar(producto: Producto) {
  const item = carrito.value.find((i) => i.producto.id === producto.id)
  if (item) {
    if (item.cantidad < producto.stock) item.cantidad++
  } else if (producto.stock > 0) {
    carrito.value.push({ producto, cantidad: 1 })
  }
}

function quitar(index: number) {
  carrito.value.splice(index, 1)
}

// ---------- Totales y pago ----------
const total = computed(() =>
  redondear(carrito.value.reduce((suma, i) => suma + i.producto.precio * i.cantidad, 0)),
)

const cambio = computed(() =>
  metodo.value === 'EFECTIVO' && montoRecibido.value
    ? redondear(montoRecibido.value - total.value)
    : 0,
)

const puedeVender = computed(
  () =>
    carrito.value.length > 0 &&
    !!idCliente.value &&
    (metodo.value !== 'EFECTIVO' || (montoRecibido.value ?? 0) >= total.value),
)

// ---------- Confirmar venta ----------
async function confirmarVenta() {
  guardando.value = true
  try {
    const body = {
      idCliente: idCliente.value,
      detalles: carrito.value.map((i) => ({ idProducto: i.producto.id, cantidad: i.cantidad })),
      pagos: [
        {
          metodo: metodo.value,
          monto: metodo.value === 'EFECTIVO' ? montoRecibido.value : total.value,
          referencia: referencia.value || undefined,
        },
      ],
    }
    ventaRealizada.value = await http.post('ventas', body).then((res) => res.data)
    mostrarComprobante.value = true
    limpiar()
    obtenerProductos()
  } catch (e) {
    const mensaje = isAxiosError(e) ? e.response?.data?.message : undefined
    alert(Array.isArray(mensaje) ? mensaje.join('\n') : mensaje || 'No se pudo registrar la venta')
  } finally {
    guardando.value = false
  }
}

function limpiar() {
  carrito.value = []
  montoRecibido.value = null
  referencia.value = ''
  metodo.value = 'EFECTIVO'
  seleccionarClienteGenerico()
}

// ---------- Cliente nuevo desde el punto de venta ----------
async function clienteGuardado() {
  await obtenerClientes()
  const ultimo = [...clientes.value].sort((a, b) => b.id - a.id)[0]
  if (ultimo) idCliente.value = ultimo.id
}

function formatearFecha(fecha?: string) {
  return fecha ? new Date(fecha).toLocaleString('es-BO') : ''
}

function imprimir() {
  window.print()
}

onMounted(() => {
  obtenerProductos()
  obtenerClientes()
})
</script>

<template>
  <h2 class="mb-3"><i class="bi bi-cart3"></i> Punto de venta</h2>

  <div class="row g-4">
    <!-- ================= PRODUCTOS ================= -->
    <div class="col-lg-7">
      <InputGroup class="mb-3">
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" placeholder="Buscar por nombre, código o categoría" />
      </InputGroup>

      <div class="row g-3 lista-productos">
        <div v-for="producto in productosFiltrados" :key="producto.id" class="col-6 col-md-4">
          <div
            class="card h-100 tarjeta-producto"
            :class="{ agotado: producto.stock - cantidadEnCarrito(producto.id) <= 0 }"
            @click="agregar(producto)"
          >
            <img v-if="producto.imagen" :src="producto.imagen" class="card-img-top" alt="producto" />
            <div v-else class="sin-imagen"><i class="bi bi-image"></i></div>
            <div class="card-body p-2">
              <div class="small text-muted">{{ producto.categoria?.nombre }}</div>
              <div class="fw-semibold nombre">{{ producto.nombre }}</div>
              <div class="d-flex justify-content-between align-items-center mt-1">
                <span class="precio">Bs. {{ producto.precio.toFixed(2) }}</span>
                <Tag
                  :value="`Stock: ${producto.stock - cantidadEnCarrito(producto.id)}`"
                  :severity="producto.stock - cantidadEnCarrito(producto.id) <= 0 ? 'danger' : 'success'"
                />
              </div>
            </div>
          </div>
        </div>
        <p v-if="productosFiltrados.length === 0" class="text-center text-muted">
          No se encontraron productos
        </p>
      </div>
    </div>

    <!-- ================= CARRITO ================= -->
    <div class="col-lg-5">
      <div class="card shadow-sm carrito">
        <div class="card-body">
          <!-- Cliente -->
          <label class="fw-semibold mb-1">Cliente</label>
          <div class="d-flex gap-2 mb-3">
            <Select
              v-model="idCliente"
              :options="opcionesClientes"
              optionLabel="etiqueta"
              optionValue="id"
              placeholder="Seleccione un cliente"
              class="flex-auto"
              filter
            />
            <Button
              icon="pi pi-user-plus"
              severity="secondary"
              aria-label="Nuevo cliente"
              @click="mostrarClienteDialog = true"
            />
          </div>

          <!-- Items -->
          <h5><i class="bi bi-basket"></i> Carrito</h5>
          <p v-if="carrito.length === 0" class="text-muted text-center py-3">
            Haz clic en un producto para agregarlo
          </p>
          <div v-for="(item, index) in carrito" :key="item.producto.id" class="item-carrito">
            <div class="flex-grow-1">
              <div class="fw-semibold">{{ item.producto.nombre }}</div>
              <small class="text-muted">Bs. {{ item.producto.precio.toFixed(2) }} c/u</small>
            </div>
            <InputNumber
              v-model="item.cantidad"
              :min="1"
              :max="item.producto.stock"
              showButtons
              buttonLayout="horizontal"
              inputClass="text-center input-cantidad"
              size="small"
            />
            <div class="subtotal">Bs. {{ (item.producto.precio * item.cantidad).toFixed(2) }}</div>
            <Button icon="pi pi-trash" text severity="danger" size="small" @click="quitar(index)" />
          </div>

          <hr />
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fs-5 fw-bold">TOTAL</span>
            <span class="fs-4 fw-bold total">Bs. {{ total.toFixed(2) }}</span>
          </div>

          <!-- Pago -->
          <label class="fw-semibold mb-1">Método de pago</label>
          <Select
            v-model="metodo"
            :options="metodos"
            optionLabel="label"
            optionValue="value"
            class="w-full mb-3"
          />

          <template v-if="metodo === 'EFECTIVO'">
            <label class="fw-semibold mb-1">Monto recibido</label>
            <InputNumber
              v-model="montoRecibido"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :min="0"
              prefix="Bs. "
              class="w-full mb-2"
              inputClass="w-full"
            />
            <div class="d-flex justify-content-between mb-3">
              <span>Cambio</span>
              <span class="fw-bold" :class="cambio < 0 ? 'text-danger' : 'text-success'">
                Bs. {{ cambio.toFixed(2) }}
              </span>
            </div>
          </template>
          <template v-else>
            <label class="fw-semibold mb-1">Referencia / Nro. de transacción</label>
            <InputText v-model="referencia" class="w-full mb-3" placeholder="Opcional" />
          </template>

          <Button
            label="Confirmar venta"
            icon="pi pi-check"
            class="w-full boton-vender"
            size="large"
            :disabled="!puedeVender"
            :loading="guardando"
            @click="confirmarVenta"
          />
          <Button
            v-if="carrito.length > 0"
            label="Cancelar"
            text
            severity="secondary"
            class="w-full mt-2"
            @click="limpiar"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Registrar cliente nuevo sin salir del punto de venta -->
  <ClienteSave
    :mostrar="mostrarClienteDialog"
    :modoEdicion="false"
    @guardar="clienteGuardado"
    @close="mostrarClienteDialog = false"
  />

  <!-- ================= COMPROBANTE ================= -->
  <Dialog
    v-model:visible="mostrarComprobante"
    header="Venta registrada"
    :style="{ width: '30rem' }"
    modal
  >
    <div v-if="ventaRealizada" class="comprobante">
      <div class="text-center mb-3">
        <h4 class="fw-bold mb-0">Dulcería R&amp;J</h4>
        <small>Comprobante de venta N° {{ ventaRealizada.id }}</small><br />
        <small>{{ formatearFecha(ventaRealizada.fecha) }}</small>
      </div>
      <p class="mb-1">
        <b>Cliente:</b> {{ ventaRealizada.cliente?.nombres }} {{ ventaRealizada.cliente?.apellidos }}
        (CI/NIT: {{ ventaRealizada.cliente?.ciNit }})
      </p>
      <p class="mb-2"><b>Cajero:</b> {{ ventaRealizada.usuario?.nombres }}</p>

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
          <tr v-for="d in ventaRealizada.detalles" :key="d.id">
            <td>{{ d.producto?.nombre }}</td>
            <td class="text-center">{{ d.cantidad }}</td>
            <td class="text-end">{{ d.precioUnitario.toFixed(2) }}</td>
            <td class="text-end">{{ d.subtotal.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between fw-bold fs-5">
        <span>TOTAL</span><span>Bs. {{ ventaRealizada.total.toFixed(2) }}</span>
      </div>
      <div v-for="p in ventaRealizada.pagos" :key="p.id" class="d-flex justify-content-between">
        <span>Pago {{ p.metodo }}</span><span>Bs. {{ p.monto.toFixed(2) }}</span>
      </div>
      <div v-if="ventaRealizada.cambio > 0" class="d-flex justify-content-between">
        <span>Cambio</span><span>Bs. {{ ventaRealizada.cambio.toFixed(2) }}</span>
      </div>
      <p class="text-center mt-3 mb-0"><small>¡Gracias por su compra! 🍬</small></p>
    </div>

    <div class="flex justify-content-end gap-2 mt-3 no-imprimir">
      <Button label="Imprimir" icon="pi pi-print" severity="secondary" @click="imprimir" />
      <Button label="Nueva venta" icon="pi pi-plus" @click="mostrarComprobante = false" />
    </div>
  </Dialog>
</template>

<style scoped>
.lista-productos {
  max-height: 70vh;
  overflow-y: auto;
}
.tarjeta-producto {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.tarjeta-producto:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(214, 51, 132, 0.25);
}
.tarjeta-producto.agotado {
  opacity: 0.45;
  cursor: not-allowed;
}
.card-img-top,
.sin-imagen {
  height: 110px;
  object-fit: cover;
}
.sin-imagen {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fce7f3;
  color: #d63384;
  font-size: 2rem;
}
.nombre {
  font-size: 0.9rem;
  line-height: 1.2;
}
.precio {
  color: #d63384;
  font-weight: bold;
}
.carrito {
  border-top: 5px solid #d63384;
  position: sticky;
  top: 80px;
}
.item-carrito {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px dashed #eee;
}
.subtotal {
  width: 80px;
  text-align: right;
  font-weight: 600;
}
:deep(.input-cantidad) {
  width: 3rem;
}
.total {
  color: #d63384;
}
.boton-vender {
  background: #d63384;
  border-color: #d63384;
}
</style>

<style>
/* Al imprimir, solo se muestra el comprobante */
@media print {
  body * {
    visibility: hidden;
  }
  .comprobante,
  .comprobante * {
    visibility: visible;
  }
  .comprobante {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .no-imprimir {
    display: none !important;
  }
}
</style>
