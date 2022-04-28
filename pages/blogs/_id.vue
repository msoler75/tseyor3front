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

    <SocialButtons id="social" :uid="uid" :data="contenido" @like="like" @dislike="dislike"
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
import vercontenido from "@/mixins/vercontenido.js"
import likes from "@/mixins/likes.js"
import seo from "@/mixins/seo.js"
export default {
  mixins: [vercontenido, likes, seo],
  async asyncData({ route, $strapi, $mdToHtml, $error }) {
    try {
      const blog = await $strapi.getContent(route, {
        populate: {
          imagen: {
            fields: ['url', 'width', 'height']
          }
        }
      })
      if (!blog)
        return $error(404, 'Blog no encontrado')

      const { data: entradas, meta } = await $strapi.find('entradas',
        {
          fields: ['id', 'slug', 'titulo', 'texto', 'publishedAt', 'updatedAt'],
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
      )
      entradas.forEach(entrada => {
        entrada.texto = $mdToHtml(entrada.texto).replace(/<[^>]+>/g, '')
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
          entrada.texto = this.$mdToHtml(entrada.texto).replace(/<[^>]+>/g, '')
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