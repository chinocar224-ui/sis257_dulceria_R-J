<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputText } from 'primevue'
import type { Cliente } from '@/models/cliente'

const ENDPOINT = 'clientes'
const props = defineProps({
  mostrar: Boolean,
  cliente: {
    type: Object as () => Cliente,
    default: () => ({}) as Cliente,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])
const cliente = ref<Cliente>({ ...props.cliente })

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
      cliente.value = props.cliente?.id ? { ...props.cliente } : ({} as Cliente)
    }
  },
)

async function handleSave() {
  try {
    const body = {
      ciNit: cliente.value.ciNit,
      nombres: cliente.value.nombres,
      apellidos: cliente.value.apellidos,
      telefono: cliente.value.telefono || undefined,
      email: cliente.value.email || undefined,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${cliente.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    cliente.value = {} as Cliente
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="props.modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente'"
    style="width: 32rem"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="ciNit" class="font-semibold w-4">CI/NIT</label>
      <InputText
        id="ciNit"
        v-model="cliente.ciNit"
        class="flex-auto"
        autocomplete="off"
        autofocus
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="nombres" class="font-semibold w-4">Nombres</label>
      <InputText id="nombres" v-model="cliente.nombres" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="apellidos" class="font-semibold w-4">Apellidos</label>
      <InputText id="apellidos" v-model="cliente.apellidos" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="telefono" class="font-semibold w-4">Teléfono</label>
      <InputText
        id="telefono"
        v-model="cliente.telefono"
        class="flex-auto"
        autocomplete="off"
        placeholder="Opcional"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-4">
      <label for="email" class="font-semibold w-4">Email</label>
      <InputText
        id="email"
        v-model="cliente.email"
        type="email"
        class="flex-auto"
        autocomplete="off"
        placeholder="Opcional"
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
