<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Checkbox, Dialog, InputText, Select } from 'primevue'
import type { Direccion } from '@/models/direccion'
import type { Cliente } from '@/models/cliente'

const ENDPOINT = 'direcciones'
const props = defineProps({
  mostrar: Boolean,
  direccion: {
    type: Object as () => Direccion,
    default: () => ({}) as Direccion,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])
const direccion = ref<Direccion>({ ...props.direccion })
const clientes = ref<Cliente[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

// Lista de clientes con el nombre completo, para mostrar en el Select
const opcionesClientes = computed(() =>
  clientes.value.map((c) => ({
    id: c.id,
    etiqueta: `${c.nombres} ${c.apellidos} (${c.ciNit})`,
  })),
)

async function obtenerClientes() {
  clientes.value = await http.get('clientes').then((res) => res.data)
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerClientes()
      direccion.value = props.direccion?.id
        ? { ...props.direccion }
        : ({ principal: false } as Direccion)
    }
  },
)

async function handleSave() {
  try {
    const body = {
      idCliente: direccion.value.idCliente,
      direccion: direccion.value.direccion,
      zona: direccion.value.zona,
      referencia: direccion.value.referencia || undefined,
      principal: direccion.value.principal ?? false,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${direccion.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    direccion.value = {} as Direccion
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="props.modoEdicion ? 'Editar Dirección' : 'Nueva Dirección'"
    style="width: 34rem"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="cliente" class="font-semibold w-4">Cliente</label>
      <Select
        id="cliente"
        v-model="direccion.idCliente"
        :options="opcionesClientes"
        optionLabel="etiqueta"
        optionValue="id"
        placeholder="Seleccione un cliente"
        class="flex-auto"
        filter
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="direccion" class="font-semibold w-4">Dirección</label>
      <InputText
        id="direccion"
        v-model="direccion.direccion"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="zona" class="font-semibold w-4">Zona</label>
      <InputText id="zona" v-model="direccion.zona" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="referencia" class="font-semibold w-4">Referencia</label>
      <InputText
        id="referencia"
        v-model="direccion.referencia"
        class="flex-auto"
        autocomplete="off"
        placeholder="Opcional"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-4">
      <label for="principal" class="font-semibold w-4">¿Principal?</label>
      <Checkbox v-model="direccion.principal" inputId="principal" binary />
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
