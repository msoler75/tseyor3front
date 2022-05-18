<template>
  <div class="w-full mx-auto">
      <nuxt-child :key="$route.fullPath">
          <NLink to="/archivos/">Ver Archivos</NLink>
      </nuxt-child>
  </div>
</template>

<script>
// poner a true para activar turbo navegación o false para navegación solo con $router
const NAVEGACION_TURBO = false

import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  middleware: 'redirect',
  data() {
      return {
          // SEO:
        title: 'Archivos',
        description: 'Zona de archivos',
        image: '/imagenes/poster-tseyor.jpg'
      }
  }
}
</script>
