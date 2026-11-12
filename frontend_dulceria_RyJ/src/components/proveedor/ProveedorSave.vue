<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputText } from 'primevue'
import type { Proveedor } from '@/models/proveedor'

const ENDPOINT = 'proveedores'
const props = defineProps({
  mostrar: Boolean,
  proveedor: {
    type: Object as () => Proveedor,
    default: () => ({}) as Proveedor,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])
const proveedor = ref<Proveedor>({ ...props.proveedor })

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      proveedor.value = props.proveedor?.id ? { ...props.proveedor } : ({} as Proveedor)
    }
  },
)

async function handleSave() {
  try {
    const body = {
      razonSocial: proveedor.value.razonSocial,
      nit: proveedor.value.nit,
      telefono: proveedor.value.telefono,
      direccion: proveedor.value.direccion || undefined,
      email: proveedor.value.email || undefined,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${proveedor.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    proveedor.value = {} as Proveedor
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="props.modoEdicion ? 'Editar Proveedor' : 'Nuevo Proveedor'"
    style="width: 32rem"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="razonSocial" class="font-semibold w-4">Razón social</label>
      <InputText
        id="razonSocial"
        v-model="proveedor.razonSocial"
        class="flex-auto"
        autocomplete="off"
        autofocus
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="nit" class="font-semibold w-4">NIT</label>
      <InputText id="nit" v-model="proveedor.nit" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="telefono" class="font-semibold w-4">Teléfono</label>
      <InputText id="telefono" v-model="proveedor.telefono" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="direccion" class="font-semibold w-4">Dirección</label>
      <InputText
        id="direccion"
        v-model="proveedor.direccion"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-4">
      <label for="email" class="font-semibold w-4">Email</label>
      <InputText
        id="email"
        v-model="proveedor.email"
        type="email"
        class="flex-auto"
        autocomplete="off"
      />
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
