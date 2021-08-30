<template>
  <Card class="p-11 max-w-md">
    {{normativa}}
  </Card>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
export default {
  mixins: [vercontenidomixin],
  async asyncData({ app, $strapi, route, redirect }) {
    try {

      const id = route.params.id
    const normativas = await $strapi.find('normativas', id.match(/\d+/)?{id}:{slug:id})
    const contenido = normativas[0]
    contenido.textoHTML = app.$renderMarkdownServer(contenido.texto)
    return { contenido, normativa: contenido };
    }
    catch(error)
    {
      console.error(error)
    }
  },
};
</script>
