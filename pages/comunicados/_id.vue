<template>
    <Card class="p-10 max-w-2xl text-justify">
        <h2 class="text-center">{{ctitle}} </h2>
        <nuxt-img :src="cimage"/>
        <div class="mt-4" v-html="ctext"/>
    </Card>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
export default {
  mixins: [vercontenidomixin],
  asyncData ({ app, route }) {
    // const noticiasGuays = await $strapi.$noticias.find({ id: 1 })
    const id = parseInt(route.params.id)
    const contenido =
        {
          id,
          clase: 'comunicados',
          titulo: id + '. ' + app.$lorem(1),
          imagen: 'imagen' + (id % 6 + 1) + '.jpg',
          texto: app.$lorem(-14)
        }
    return { contenido, comunicado: contenido }
  }
}
</script>
