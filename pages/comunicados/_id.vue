<template>
    <!-- Sin padding -->
    <!-- No tiene imagen de fondo -->
  <div class="flex flex-col items-center" contained="no" background="no" focused>

    <!-- article container -->
    <div
      class="px-3 sm:px-5 md:px-7 relative w-full shrink-0 flex-grow-1 max-w-3xl flex flex-col items-start"
    >
      <div class="hidden 4xl:block absolute right-0 translate-x-3 5xl:translate-x-10 h-full">
        <SocialIcons
          class="sticky top-32 mb-6 text-xs 5xl:text-sm"
          :content="contenido"
          @share="viendoCompartir = true"
        />
      </div>

      <!-- article wrapper -->
      <ArticleWrapper>
        <!-- article heading -->
        <h1 class>{{ ctitle }}</h1>

        <div class="w-full flex mb-5 items-center justify-start text-xs sm:text-sm">
          <div>
            <icon icon="far fa-calendar-alt"  class="mr-1"/>
            <span>{{$dayjs(contenido.fechaComunicado).format("DD-MMM-YYYY")}}</span>
          </div>

          <div class="4xl:hidden ml-auto">
            <SocialIcons :content="contenido" :horizontal="true" @share="viendoCompartir = true" />
          </div>
        </div>

        <!-- article content -->
        <Article class="my-9 text-justify" v-html="comunicado.textoHTML" />
      </ArticleWrapper>
    </div>

    <!-- share modal -->
    <Comparte v-model="viendoCompartir" />

    <SocialButtons
      id="social"
      :data="contenido"
      @like="like(contenido.id)"
      @dislike="dislike(contenido.id)"
      @share="viendoCompartir = true"
      class="mx-auto max-w-xl my-7 lg:my-16"
    />

    <SuscriptionSection
      id="suscription"
      title="Comunicados TSEYOR"
      description="Comunicados telepáticos mantenidos con los Guías Estelares a través de Chac Mool Puente"
      collection="comunicados"
      image="./imagenes/espacio-color.jpg"
      class="bg-blue-dark-700 w-full"
    />

    <!-- contenido relacionado -->
    <div class="container mx-auto my-9" v-observe-visibility="cargarRelacionados">
      <h3 class="text-center">Y también...</h3>
      <HCarousel center :items="relacionados" collection="comunicados" />
    </div>

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9" v-observe-visibility="(isVisible)=>{mostrarComentarios=mostrarComentarios||isVisible}">
      <h3
        v-if="contenido.comentarios"
        class="text-center"
      >{{ contenido.comentarios + ' Comentario' + (contenido.comentarios !== 1 ? 's' : '') }}</h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <LazyComments v-if="mostrarComentarios" :uid="uid" :content-title="ctitle" @count="$set(contenido, 'comentarios', $event)" class="px-1 xs:px-2" />
    </div>
  </div>
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

import vercontenidomixin from '@/mixins/vercontenido.js'
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ $strapi, $renderMarkdownServer, route, $error }) {
    try {
      const id = route.params.id
      const {data:comunicados} = await $strapi.find(
        'comunicados', 
        id.match(/^\d+$/) ? { id } : { slug: id }
      )
      if (!comunicados.length)
        return $error(404, 'Comunicado no encontrado')
      const contenido = comunicados[0]
      // contenido.likes = await $strapi.find('likes', { uid: `/comunicados/${contenido.id}` })
      contenido.textoHTML = $renderMarkdownServer(contenido.texto, contenido.imagenes)
      return { contenido, comunicado: contenido }
    }
    catch (e) {
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
section >>> .article h2:first-of-type {
  display: none;
}
</style>