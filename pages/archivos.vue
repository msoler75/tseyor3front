<template>
  <div class="w-full max-w-xl mx-auto">
    <Card class="p-1 sm:p-5 md:p-9">
      <nuxt-child :key="$route.fullPath">
          <NLink to="/archivos/">Ver Archivos</NLink>
      </nuxt-child>
    </Card>
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
