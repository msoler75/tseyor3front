<template>
  <!-- Sin padding -->
  <!-- No tiene imagen de fondo -->
  <div class="flex flex-col items-center" contained="no" background="no" focused>


    <Contenido :contenido="contenido" @share="viendoCompartir = true">
      <template #subtitulo>
        <div class="ml-8 hidden sm:block">
          <span class="capitalize">
            <icon icon="far fa-user" />
            {{ entrada.blog.nombre }}
          </span>
          <a href="#suscription" v-scroll-to="'#suscription'"
            class="ml-2 rounded-full py-.5 px-2 text-xs bg-blue-400 text-blue-contrast">Seguir</a>
        </div>
      </template>
    </Contenido>


    <!-- share modal -->
    <Comparte v-model="viendoCompartir" />

    <SocialBotones id="social" :uid="uid" :contenido="contenido" @like="like" @dislike="dislike"
      @share="viendoCompartir = true" class="mx-auto max-w-xl my-7 lg:my-16" />

    <!-- contenido relacionado -->
    <div class="container mx-auto my-9" v-observe-visibility="cargarRelacionados">
      <h3 class="text-center">Y también...</h3>
      <HCarousel center :items="relacionados" collection="entradas" />
    </div>

    <SuscripcionSeccion id="suscription" :title="entrada.blog.nombre" :description="entrada.blog.descripcion"
      collection="blogs" :content-id="entrada.blog.id" image="./imagenes/grupo-1.jpg" class="bg-blue-gray-900 w-full" />

    <!-- comentarios -->
    <section id="comentarios" class="w-full py-12 bg-gray-200 dark:bg-transparent" 
      v-observe-visibility="(isVisible) => { mostrarComentarios = mostrarComentarios || isVisible }">
      <h3 v-if="contenido.comentarios" class="text-center">{{
          contenido.comentarios + ' Comentario' +
          (contenido.comentarios !== 1 ? 's' : '')
      }}</h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <LazyComentarios v-if="mostrarComentarios" :uid="uid" :contenido="contenido"
        @count="$set(contenido, 'comentarios', $event)" class="mx-auto px-1 xs:px-2 container container-md" />
    </section>
  </div>
</template>

<script>
import vercontenido from "@/mixins/vercontenido.js"
import likes from "@/mixins/likes.js"
import seo from "@/mixins/seo.js"
export default {
  mixins: [vercontenido, likes, seo],
  async asyncData({ route, $strapi, $mdToHtml, $error }) {
    try {
      const contenido = await $strapi.getContent(route, {
        populate: {
          blog: {
            fields: ['nombre', 'id', 'slug', 'descripcion'],
            populate: {
              imagen: {
                fields: ['url', 'width', 'height']
              }
            }
          }
        }
      })
      if (!contenido)
        return $error(404, 'Entrada de Blog no encontrada')
      return { contenido, entrada: contenido, relacionados: [] }
    } catch (e) {
      $error(503)
    }
  },
  mounted() {
    setTimeout(this.cargarRelacionados.bind(this), 200)
  },
  methods: {
    async cargarRelacionados() {
      if (!this.relacionados.length) {
        const { data: relacionados } = await this.$strapi.find('entradas',
          {
            fields: ['id', 'slug', 'titulo', 'texto', 'publishedAt', 'updatedAt'],
            populate: {
              imagen: {
                fields: ['url', 'width', 'height']
              },
              blog: {
                fields: ['id', 'nombre', 'slug']
              }
            },
            filters: {
              id: {
                $ne: this.contenido.id
              }
            },
            sort: ['publishedAt:desc']
          })
        this.relacionados = relacionados
      }
    }
  }
};
</script>

<style scoped>
section>>>.article h2:first-of-type {
  display: none;
}
</style>