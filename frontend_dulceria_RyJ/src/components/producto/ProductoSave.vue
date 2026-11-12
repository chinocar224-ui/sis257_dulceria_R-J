<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText, Select, Textarea } from 'primevue'
import type { Producto } from '@/models/producto'
import type { Categoria } from '@/models/categoria'
import type { Proveedor } from '@/models/proveedor'

const ENDPOINT = 'productos'
const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto,
    default: () => ({}) as Producto,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])
const producto = ref<Producto>({ ...props.producto })
const categorias = ref<Categoria[]>([])
const proveedores = ref<Proveedor[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

async function obtenerCategorias() {
  categorias.value = await http.get('categorias').then((res) => res.data)
}

async function obtenerProveedores() {
  proveedores.value = await http.get('proveedores').then((res) => res.data)
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerCategorias()
      obtenerProveedores()
      producto.value = props.producto?.id
        ? { ...props.producto }
        : ({ precio: 0, stock: 0 } as Producto)
    }
  },
)

async function handleSave() {
  try {
    const body = {
      idCategoria: producto.value.idCategoria,
      idProveedor: producto.value.idProveedor ?? null,
      codigo: producto.value.codigo,
      nombre: producto.value.nombre,
      descripcion: producto.value.descripcion || undefined,
      precio: producto.value.precio,
      stock: producto.value.stock,
      fechaVencimiento: producto.value.fechaVencimiento || undefined,
      imagen: producto.value.imagen || undefined,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${producto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    producto.value = {} as Producto
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="props.modoEdicion ? 'Editar Producto' : 'Nuevo Producto'"
    style="width: 40rem"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="categoria" class="font-semibold w-3">Categoría</label>
      <Select
        id="categoria"
        v-model="producto.idCategoria"
        :options="categorias"
        optionLabel="nombre"
        optionValue="id"
        placeholder="Seleccione una categoría"
        class="flex-auto"
        filter
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="proveedor" class="font-semibold w-3">Proveedor</label>
      <Select
        id="proveedor"
        v-model="producto.idProveedor"
        :options="proveedores"
        optionLabel="razonSocial"
        optionValue="id"
        placeholder="Opcional"
        class="flex-auto"
        filter
        showClear
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="codigo" class="font-semibold w-3">Código</label>
      <InputText
        id="codigo"
        v-model="producto.codigo"
        class="flex-auto"
        autocomplete="off"
        placeholder="Ej: CHOC-001"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="nombre" class="font-semibold w-3">Nombre</label>
      <InputText id="nombre" v-model="producto.nombre" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="descripcion" class="font-semibold w-3">Descripción</label>
      <Textarea
        id="descripcion"
        v-model="producto.descripcion"
        class="flex-auto"
        rows="2"
        placeholder="Opcional"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="precio" class="font-semibold w-3">Precio</label>
      <InputNumber
        inputId="precio"
        v-model="producto.precio"
        mode="decimal"
        :minFractionDigits="2"
        :maxFractionDigits="2"
        :min="0"
        prefix="Bs. "
        class="flex-auto"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="stock" class="font-semibold w-3">Stock</label>
      <InputNumber
        inputId="stock"
        v-model="producto.stock"
        :min="0"
        showButtons
        class="flex-auto"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="fechaVencimiento" class="font-semibold w-3">Vencimiento</label>
      <InputText
        id="fechaVencimiento"
        v-model="producto.fechaVencimiento"
        type="date"
        class="flex-auto"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="imagen" class="font-semibold w-3">Imagen (URL)</label>
      <InputText
        id="imagen"
        v-model="producto.imagen"
        class="flex-auto"
        autocomplete="off"
        placeholder="https://..."
      />
    </div>
    <div v-if="producto.imagen" class="text-center mb-3">
      <img :src="producto.imagen" alt="vista previa" class="vista-previa" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Cancelar"
        icon="pi pi-times"
        severity="secondary"
        @click="dialogVisible = false"
      />
      <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
    </div>
  </Dialog>
</template>

<style scoped>
.vista-previa {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
