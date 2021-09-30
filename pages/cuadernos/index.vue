<template>
    <div class="max-w-md mx-auto flex flex-col items-center text-center">
        <h1>Página en construcción...</h1>
        <nuxt-img src="/imagenes/trabajando.png" />
    </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  data () {
    return {
      // SEO:
      title: 'Cuadernos de trabajo',
      description: 'Listado de cuadernos varios con objetivos de trabajo interior y de divulgación',
      image: 'imagen_a_definir'
    }
  },
}
</script>