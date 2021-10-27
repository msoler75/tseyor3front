<template>
  <Card class="p-11 max-w-md">{{ normativa }}</Card>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ app, $strapi, route, $error }) {
    try {
      const id = route.params.id
      const normativas = await $strapi.find(
        'normativas', 
        id.match(/^\d+$/) ? { id } : { slug: id }
      )
      if (!normativas.length)
        return $error(404, 'Normativa no encontrada')
      const contenido = normativas[0]
      contenido.textoHTML = app.$renderMarkdownServer(contenido.texto)
      return { contenido, normativa: contenido };
    }
    catch (e) {
      $error(503)
    }
  },
};
</script>
