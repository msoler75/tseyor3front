<template>
<section class="relative">
  <Config :contained="false"/>

  <div
    class="grid grid-fluid gap-8"
  >
    <div class="grid-block" v-if="equipo.imagen&&equipo.imagen.url">
    <nuxt-img
        :src="equipo.imagen.url"
        :width="300"
        :height="300"
        class="w-full h-full rounded-full"
        fit="cover"
      />
    </div>

    <div class="grid-block">
        <h1>
          <Icon :icon="people-carry" /><span>{{ equipo.nombre }}</span>
        </h1>
        <p>
          {{equipo.descripcion}}
        </p>
    </div>

    <div class="grid-block" v-if="equipo.pizarra.length>4">
      <div v-html="equipo.textoHTML"/>
    </div>
  
  </div>

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
      contenido.textoHTML = app.$renderMarkdownServer(contenido.pizarra/*, contenido.imagenes*/)
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
.grid-fluid {
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(360px, 1fr));
  grid-auto-columns: minmax(320px, 360px);
  grid-auto-rows: minmax(320px, 460px);
  grid-auto-flow: dense;
  place-items: stretch stretch;
}

.grid-block.cols-2 {
  grid-column-end: span 2;
}
.grid-block.rows-2 {
  grid-row-end: span 2;
}
</style>