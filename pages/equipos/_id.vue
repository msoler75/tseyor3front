<template>
<section class="relative">
  <Config :contained="false"/>

  {{equipo}}

</section>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
export default {
  mixins: [vercontenidomixin],
  async asyncData({ app, $strapi, route, redirect }) {
    try {
      const id = route.params.id
      const equipos = await $strapi.find('equipos', id.match(/\d+/)?{id}:{slug:id})
      const contenido = equipos[0]
      return { contenido, equipo: contenido };
    }
    catch(error)
    {
      console.error(error)
    }
  },
};
</script>

<style scoped>
</style>