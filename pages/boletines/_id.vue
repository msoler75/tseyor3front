<template>
<section class="relative">
  <Config :contained="false"/>

  {{boletin}}

</section>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
export default {
  mixins: [vercontenidomixin],
  async asyncData({ app, $strapi, route, redirect }) {
    try {
      const id = route.params.id
      const boletines = await $strapi.find('boletines', id.match(/\d+/)?{id}:{slug:id})
      const contenido = boletines[0]
      return { contenido, boletin: contenido };
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