<template>
    <Card class="p-10 max-w-2xl text-justify">
        <h2 class="text-center">{{ctitle}} </h2>
        <nuxt-img :src="cimage"/>
        <div class="mt-4" v-html="ctext"></div>
    </Card>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
export default {
  mixins: [vercontenidomixin],
  asyncData ({ app, route }) {
    // const noticiasGuays = await $strapi.$noticias.find({ id: 1 })
    const id = parseInt(route.params.id)
    console.log('noticias_id - asyncData id:', id)
    const contenido =
        {
          id,
          clase: 'noticias',
          titular: app.$lorem(1),
          imagen: 'imagen' + (id % 6 + 1) + '.jpg',
          texto: app.$lorem(-12)
        }
    return { contenido, noticia: contenido }
  }
}
</script>
