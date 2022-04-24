<template>
  <div class="flex flex-col items-center">
    <Card class="p-8 text-center">
      <div class="flex justify-center my-7">
        <img class="w-32" src="~/assets/svg/online-meeting.svg" />
      </div>
      <h2>{{ sala.nombre }}</h2>
      <p>{{ sala.descripcion }}</p>
      <p class="mt-7">Tipo: {{ sala.tipo }}</p>
      <p class="my-9">
        <a target="_blank" class="btn" :href="sala.enlace">Acceder</a>
      </p>
    </Card>

    <Divider />

    <h1 class="mt-12">Eventos y Actividades</h1>
    <Grid class="justify-center grid-cols-fill-w-64 text-center">
      <CardEvent v-for="evento of sala.eventos" :key="'related-' + evento.id" :id="'evento-' + evento.id" :data="evento"
        :noText="true" collection="eventos" />
    </Grid>
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
      const { data: [contenido] } = await $strapi.findThis(route)
      if (!salas.length)
        return $error(404, 'Sala no encontrada')
      return { contenido, sala: contenido }
    } catch (e) {
      console.error(e)
      $error(503)
    }
  }
  /*
  methods: {
     async cargarRelacionados(isVisible) {
      if(!this.relacionados.length&&isVisible) {
        const filtro = { id_ne: id, id_lt: id + 10, id_gt: id - 10 }
        this.relacionados = await $strapi.find('salas', { ...filtro, _limit: 7 })
      }
    },
  },
  data() {
    return {
      relacionados: [],
    }
  }
  */
}
</script>
