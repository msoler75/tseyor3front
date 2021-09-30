<template>
  <Grid class="grid-cols-fill-w-40 text-center">
    <div v-for="guia of guias" :key="guia.slug" class="p-3">
      <NLink :to="'/guias-estelares/' + guia.slug">
        <h2 class="text-lg mb-2">{{ guia.nombre }}</h2>
        <nuxt-img v-if="guia.imagen"
          loading="lazy"
          :alt="guia.nombre"
          :src="guia.imagen.url"
          :width="guia.imagen.width"
          :height="guia.imagen.height"
          sizes="xs:100vw"
          class="hidden sm:block mx-auto"
        />
      </NLink>
    </div>
  </Grid>
</template>

<script>
const query_guias = `guias(sort: "nombre:asc")  {
          slug
          nombre
          imagen {
            url
            width
            height
          }
        }`

import seo from '@/mixins/seo.js'
export default {
 mixins: [seo],
 async asyncData({$strapi}) {
   const resultado = await $strapi.graphql({
      query:
        `query {
          ${query_guias}
        }`
    })
   return {guias: resultado.guias}
 },
 data() {
   return {
      // SEO:
      title: 'Guías Estelares',
      description: 'Hermanos de la Confederación de Mundos Habitados de la Galaxia que tutelan al grupo Tseyor',
      image: 'imagen_a_definir'
   }
 }
};
</script>

