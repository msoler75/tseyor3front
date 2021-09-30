<template>
  <div class="flex flex-col items-center">
    <Card class="p-8 text-center">
      <div class="flex justify-center my-7">
        <img class="w-32" src="~/assets/svg/online-meeting.svg" />
      </div>
    <h2>
      {{sala.nombre}}
    </h2>
    <p>
      {{sala.descripcion}}
    </p>
    <p class="mt-7">
      Tipo: {{sala.tipo}}
    </p>
    <p class="my-9">
      <a target="_blank" class="btn" :href="sala.enlace">Acceder</a>
    </p>
    </Card>

    <Divider />

    <h1 class="mt-12">Eventos y Actividades</h1>
    <Grid class="justify-center grid-cols-fill-w-64 text-center">
         <CardEvent
          v-for="evento of sala.eventos"
          :key="'related-'+evento.id"
          :id="'evento-' + evento.id"
          :data="evento"
          :noText="true"
          collection="eventos"
        />
        </Grid>
  </div>
</template>


<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ app, $strapi, route, redirect }) {
    const id = route.params.id
    const salas = await $strapi.find('salas', id.match(/^\d+$/)?{id}:{slug:id})
    const contenido = salas[0]
    return { contenido, sala: contenido };
  },
  methods: {
    async cargarRelacionados(){
      const filtro = { id_ne: id, id_lt: id+10, id_gt: id-10 }
      this.relacionados = await $strapi.find('salas', {...filtro, _limit: 7})
    },
  },
  data() {
    return {
      relacionados: [],
    }
  }
}
</script>
