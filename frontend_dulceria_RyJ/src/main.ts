import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.min.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

// Template Poseify + ajustes propios (siempre después de Bootstrap)
import './assets/css/poseify.css'
import './assets/css/tema.css'

import App from './App.vue'
import router from './router'

// PrimeVue con el dorado del tema
const DulceriaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{amber.50}',
      100: '{amber.100}',
      200: '{amber.200}',
      300: '{amber.300}',
      400: '{amber.400}',
      500: '{amber.500}',
      600: '{amber.600}',
      700: '{amber.700}',
      800: '{amber.800}',
      900: '{amber.900}',
      950: '{amber.950}',
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  license: import.meta.env.VITE_PRIMEUI_LICENSE,
  theme: {
    preset: DulceriaPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.modo-oscuro',
      cssLayer: false,
    },
  },
})
// Seguridad: al recargar la página se cierra la sesión y se vuelve al login
const authStore = useAuthStore()
if (authStore.token) {
  authStore.logout()
}

app.mount('#app')
