<template>
  <div>
    <Contenido :contenido="contenido" @share="viendoCompartir = true" />
  </div>
</template>

<script>
import vercontenido from "@/mixins/vercontenido.js"
import likes from "@/mixins/likes.js"
import seo from "@/mixins/seo.js"
export default {
  mixins: [vercontenido, likes, seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      const contenido = await $strapi.getContent(route)
      if (!contenido)
        return $error(404, 'Normativa no encontrada')
      return { contenido, normativa: contenido };
    }
    catch (e) {
      console.error(e)
      $error(503)
    }
  },
};
</script>
