<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputText, Textarea } from 'primevue'
import type { Categoria } from '@/models/categoria'

const ENDPOINT = 'categorias'
const props = defineProps({
  mostrar: Boolean,
  categoria: {
    type: Object as () => Categoria,
    default: () => ({}) as Categoria,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])
const categoria = ref<Categoria>({ ...props.categoria })

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
      categoria.value = props.categoria?.id ? { ...props.categoria } : ({} as Categoria)
    }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: categoria.value.nombre,
      descripcion: categoria.value.descripcion,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${categoria.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    categoria.value = {} as Categoria
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="props.modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'"
    style="width: 28rem"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="nombre" class="font-semibold w-4">Nombre</label>
      <InputText
        id="nombre"
        v-model="categoria.nombre"
        class="flex-auto"
        autocomplete="off"
        autofocus
      />
    </div>
    <div class="flex align-items-center gap-3 mb-4">
      <label for="descripcion" class="font-semibold w-4">Descripción</label>
      <Textarea id="descripcion" v-model="categoria.descripcion" class="flex-auto" rows="3" />
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
