<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputText, Password, Select } from 'primevue'
import type { Usuario } from '@/models/usuario'
import type { Rol } from '@/models/rol'

const ENDPOINT = 'usuarios'
const props = defineProps({
  mostrar: Boolean,
  usuario: {
    type: Object as () => Usuario,
    default: () => ({}) as Usuario,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])
const usuario = ref<Usuario>({ ...props.usuario })
const roles = ref<Rol[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

async function obtenerRoles() {
  roles.value = await http.get('roles').then((res) => res.data)
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerRoles()
      usuario.value = props.usuario?.id
        ? { ...props.usuario, clave: '' }
        : ({} as Usuario)
    }
  },
)

async function handleSave() {
  try {
    const body: Record<string, unknown> = {
      idRol: usuario.value.idRol,
      nombres: usuario.value.nombres,
      usuario: usuario.value.usuario,
      email: usuario.value.email,
    }
    // Al crear la clave es obligatoria; al editar solo se envía si se escribió una nueva
    if (usuario.value.clave) body.clave = usuario.value.clave

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${usuario.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    usuario.value = {} as Usuario
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="props.modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario'"
    style="width: 32rem"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="rol" class="font-semibold w-4">Rol</label>
      <Select
        id="rol"
        v-model="usuario.idRol"
        :options="roles"
        optionLabel="nombre"
        optionValue="id"
        placeholder="Seleccione un rol"
        class="flex-auto"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="nombres" class="font-semibold w-4">Nombres</label>
      <InputText id="nombres" v-model="usuario.nombres" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="usuario" class="font-semibold w-4">Usuario</label>
      <InputText id="usuario" v-model="usuario.usuario" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="email" class="font-semibold w-4">Email</label>
      <InputText id="email" v-model="usuario.email" type="email" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-2">
      <label for="clave" class="font-semibold w-4">Contraseña</label>
      <Password
        inputId="clave"
        v-model="usuario.clave"
        :feedback="false"
        toggleMask
        class="flex-auto"
        inputClass="w-full"
        :placeholder="props.modoEdicion ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'"
        autocomplete="new-password"
      />
    </div>
    <small v-if="props.modoEdicion" class="text-muted d-block mb-4 ms-1">
      Solo escribe una contraseña si deseas cambiarla.
    </small>
    <div v-else class="mb-4"></div>
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