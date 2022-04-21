<template>
  <div contained="no">
    <h1 class="text-center">{{ blog.nombre }}</h1>
    <div class="w-full mx-auto container container-lg py-5">

      <div class="w-full mx-auto container py-12 px-2 xm:px-5 sm:px-12">
        <CardEntry v-for="entrada of entradas" :key="entrada.id" :data="entrada" collection="entradas" class="mb-8 p-7">
          <div class="flex text-xs space-x-3">
            <div>
              <span class="text-gray text-xs">{{ $dayjs(entrada.published_at).format('d-MMM-YYYY') }}</span>
            </div>
          </div>
        </CardEntry>
      </div>

      <LoadMore v-if="hayMas" v-model="cargando" @click="cargarMas" class="my-7" />
    </div>


    <!-- share modal -->
    <Comparte v-model="viendoCompartir" />

    <SocialButtons id="social" :data="contenido" @like="like(contenido.id)" @dislike="dislike(contenido.id)"
      @share="viendoCompartir = true" class="mx-auto max-w-xl my-7 lg:my-16" />

    <SuscriptionSection id="suscription" :title="blog.nombre" :description="blog.descripcion" collection="blogs"
      :content-id="blog.id" :image="blog.imagen" class="bg-blue-gray-900 w-full" />


    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9"
      v-observe-visibility="(isVisible) => { mostrarComentarios = mostrarComentarios || isVisible }">
      <h3 v-if="contenido.comentarios" class="text-center">{{
        contenido.comentarios + ' Comentario' +
          (contenido.comentarios !== 1 ? 's' : '')
      }}</h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <LazyComments v-if="mostrarComentarios" :uid="uid" :content-title="ctitle"
        @count="$set(contenido, 'comentarios', $event)" class="px-1 xs:px-2" />
    </div>


  </div>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ $strapi, $renderMarkdownServer, route, $error }) {
    try {
      const id = route.params.id
      const paramsBlog = {
        filter: id.match(/^\d+$/) ? { id } : { slug: id },
        populate: {
          imagen: {
            fields: ['url', 'width', 'height']
          }
        }
      }
      const { data: [blog] } = await $strapi.find("blogs", paramsBlog)
      if (!blog)
        return $error(404, 'Blog no encontrado')

      /* blog.likes = await $strapi.find('likes', {
        uid: `/blogs/${blog.id}`
      }) */

      const paramsEntradas = {
        fields: ['id', 'titulo', 'texto', 'publishedAt', 'updatedAt'],
        filters: {
          blog: {
            id: {
              $eq: blog.id
            }
          }
        },
        populate: {
          blog: {
            fields: ['id', 'nombre', 'slug']
          },
          imagen: {
            fields: ['url', 'width', 'height']
          }
        },
        sort: ['publishedAt:desc']
      }

      const { data: entradas, meta } = await $strapi.find('entradas', paramsEntradas)
      entradas.forEach(entrada => {
        entrada.texto = $renderMarkdownServer(entrada.texto).replace(/<[^>]+>/g, '')
      })
      return { contenido: blog, blog, entradas, meta }
    } catch (e) {
      console.error(e)
      $error(503)
    }
  },
  data() {
    return {
      cargando: false,
      // SEO:
      title: 'Blogs',
      description: 'Blogs de la comunidad Tseyor',
      image: 'imagen_a_definir'
    }
  },
  computed: {
    hayMas() {
      if (!this.meta) return false
      const p = this.meta.pagination
      return p.page < p.pageCount
    },
  },
  methods: {
    async cargarMas() {
      if (!this.hayMas) return
      this.filters._start = this.entradas.length
      const filtro = this.filters
      this.cargando = true
      const entradas = await this.$strapi.find('entradas', filtro)
      this.hayMas = entradas.length === this.filters._limit
      for (const entrada of entradas) {
        if (!this.entradas.find(x => x.id === entrada.id)) {
          entrada.texto = this.$renderMarkdownServer(entrada.texto).replace(/<[^>]+>/g, '')
          this.entradas.push(entrada)
        }
      }
      this.cargando = false
    }
  }
}
</script>

<style scoped>
.card>>>.card-img {
  @apply h-72;
}
</style>