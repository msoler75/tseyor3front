<template>
  <!-- Sin padding -->
  <!-- No tiene imagen de fondo -->
  <section class="flex flex-col items-center" contained="no" background="no" focused>

    <Contenido :contenido="contenido" @share="viendoCompartir = true" :fecha="contenido.fechaComunicado"/>
    
    <!-- share modal -->
    <Comparte v-model="viendoCompartir" />

    <SocialBotones id="social" :uid="uid" :contenido="contenido" @like="like" @dislike="dislike"
      @share="viendoCompartir = true" class="mx-auto max-w-xl my-7 lg:my-16" />

    <SuscriptionSection id="suscription" title="Comunicados TSEYOR"
      description="Comunicados telepáticos mantenidos con los Guías Estelares a través de Chac Mool Puente"
      collection="comunicados" image="./imagenes/espacio-color.jpg" class="bg-blue-dark-700 w-full" />

    <!-- contenido relacionado -->
    <div class="container mx-auto my-9" v-observe-visibility="cargarRelacionados">
      <h3 class="text-center">Y también...</h3>
      <HCarousel center :items="relacionados" collection="comunicados" />
    </div>

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9"
      v-observe-visibility="(isVisible) => { mostrarComentarios = mostrarComentarios || isVisible }">
      <h3 v-if="contenido.comentarios" class="text-center">{{ contenido.comentarios + ' Comentario' +
          (contenido.comentarios !== 1 ? 's' : '')
      }}</h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <LazyComentarios v-if="mostrarComentarios" :uid="uid" :contenido="contenido"
        @count="$set(contenido, 'comentarios', $event)" class="px-1 xs:px-2" />
    </div>
  </section>
</template>

<script>
const query_relacionados = `query {
        comunicados(limit: %limit, sort: "published_at:desc", where: { id_ne: %id, id_lt: %idp10, id_gt: %idm10 } )  {
          id
          slug
          published_at
          titulo
          imagen {
            url
            width
            height
          }
        }
      }`

import vercontenido from "@/mixins/vercontenido.js"
import likes from "@/mixins/likes.js"
import seo from "@/mixins/seo.js"
export default {
  mixins: [vercontenido, likes, seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      const contenido = await $strapi.getContent(route, {
        populate: ['equipo', 'autor']
      })
      if (!contenido)
        return $error(404, 'Comunicado no encontrado')
      return { contenido, comunicado: contenido }
    }
    catch (e) {
      console.error(e)
      $error(503)
    }
  },
  data() {
    return {
      relacionados: [],
    }
  },
  methods: {
    async cargarRelacionados(isVisible) {
      return []
      /*
      if(!this.relacionados.length&&isVisible) {
        const resultado = await this.$strapi.graphql({
          query: query_relacionados
              .replace('%limit', 12)
              .replace('%id', this.contenido.id)
              .replace('%idm10', this.contenido.id - 10)
              .replace('%idp10', this.contenido.id + 10)
        })      
        this.relacionados = resultado.comunicados
        }
        */
    },
  }
  /*
    asyncData ({ app, route }) {
      const id = parseInt(route.params.id)
      const relacionados = [];
  
      for (var i = 0; i < 9; i++) {
        relacionados.push({
          id: i + 1,
          clase: "comunicados",
          titulo: app.$lorem(1),
          imagen: "imagen" + (((i + 1) % 6) + 1) + ".jpg"
        });
      }
      const contenido =
          {
            id,
            clase: 'comunicados',
            titulo: id + '. ' + app.$lorem(1),
            imagen: 'imagen' + (id % 6 + 1) + '.jpg',
            texto: app.$lorem(-14)
            .replace(/<p>/g, "\n")
            .replace(/<\/p>/g, ""),
            comentarios: Math.round(Math.random() * 33),
            likes: Math.round(Math.random() * 77),
            relacionados
          }
      return { contenido, comunicado: contenido }
    }
    */
}
</script>

<style scoped>
section>>>.article h2:first-of-type {
  display: none;
}
</style>