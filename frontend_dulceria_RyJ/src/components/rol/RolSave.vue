<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputText, Textarea } from 'primevue'
import type { Rol } from '@/models/rol'

const ENDPOINT = 'roles'
const props = defineProps({
  mostrar: Boolean,
  rol: {
    type: Object as () => Rol,
    default: () => ({}) as Rol,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])
const rol = ref<Rol>({ ...props.rol })

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
      rol.value = props.rol?.id ? { ...props.rol } : ({} as Rol)
    }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: rol.value.nombre,
      descripcion: rol.value.descripcion,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${rol.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    rol.value = {} as Rol
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="props.modoEdicion ? 'Editar Rol' : 'Nuevo Rol'"
    style="width: 28rem"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="nombre" class="font-semibold w-4">Nombre</label>
      <InputText
        id="nombre"
        v-model="rol.nombre"
        class="flex-auto"
        autocomplete="off"
        placeholder="Ej: CAJERO"
        autofocus
      />
    </div>
    <div class="flex align-items-center gap-3 mb-4">
      <label for="descripcion" class="font-semibold w-4">Descripción</label>
      <Textarea id="descripcion" v-model="rol.descripcion" class="flex-auto" rows="3" />
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
