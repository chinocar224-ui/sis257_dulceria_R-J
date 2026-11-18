<script setup lang="ts">
import { ref } from 'vue'
import { isAxiosError } from 'axios'
import { Button, InputText, Password } from 'primevue'
import { useAuthStore } from '@/stores/index'

const usuario = ref('')
const clave = ref('')
const error = ref('')
const cargando = ref(false)

async function onSubmit() {
  error.value = ''
  cargando.value = true
  try {
    await useAuthStore().login(usuario.value, clave.value)
  } catch (e) {
    const mensaje = isAxiosError(e) ? e.response?.data?.message : undefined
    error.value = Array.isArray(mensaje)
      ? mensaje.join(', ')
      : mensaje || 'No se pudo iniciar sesión'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center py-5">
    <div class="card shadow login-card">
      <div class="card-body p-4">
        <div class="text-center mb-4">
          <i class="bi bi-cake2 icono"></i>
          <h3 class="fw-bold mt-2">Dulcería R&amp;J</h3>
          <p class="text-muted mb-0">Inicia sesión para continuar</p>
        </div>

        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <label for="usuario" class="form-label fw-semibold">Usuario</label>
            <InputText id="usuario" v-model="usuario" class="w-full" autocomplete="username" autofocus />
          </div>
          <div class="mb-3">
            <label for="clave" class="form-label fw-semibold">Contraseña</label>
            <Password
              inputId="clave"
              v-model="clave"
              :feedback="false"
              toggleMask
              class="w-full"
              inputClass="w-full"
              autocomplete="current-password"
            />
          </div>

          <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

          <Button
            type="submit"
            label="Ingresar"
            icon="pi pi-sign-in"
            class="w-full boton-login"
            :loading="cargando"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  border: none;
  border-top: 5px solid #d63384;
}
.icono {
  font-size: 3rem;
  color: #d63384;
}
.boton-login {
  background: #d63384;
  border-color: #d63384;
}
</style>
