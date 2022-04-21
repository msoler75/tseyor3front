<template>
  <div contained="no">
    <section class="bg-blue-gray-900 py-12 w-full text-center">
      <div class="container mx-auto px-2 xm:px-5 sm:px-12">
        <div class="flex justify-center">
          <Card v-for="blog of blogs" :data="blog" :key="blog.id" collection="blogs" :noDate="true" class="w-1/2 sm:w-1/3" />
        </div>
      </div>
    </section>

    <div class="w-full mx-auto container container-lg max-w-lg py-12 px-2 xm:px-5 sm:px-12">
      <h2>Recientes</h2>
      <CardEntry v-for="entrada of entradas" :key="entrada.id" :data="entrada" collection="entradas" class="mb-8 p-7"
        :category-function="getBlogAndDate">
        <div class="flex text-xs space-x-3">
          <div v-if="entrada && entrada.blog">
            <icon icon="circle" class="text-sello-fuerte transform scale-75" />
            <NLink class="font-bold font-sans tracking-widest text-diminished opacity-80 hover:opacity-100 uppercase"
              :to="`/blogs/${entrada.blog.slug}`">{{ entrada.blog.nombre }}</NLink>
          </div>
          <div>
            <icon icon="circle" class="text-gray transform scale-75" />
            <span class="text-gray text-xs">{{ $dayjs(entrada.published_at).format('d-MMM-YYYY') }}</span>
          </div>
        </div>
      </CardEntry>
      <LoadMore v-if="hayMas" v-model="cargando" @click="cargarMas" class="my-7" />
    </div>

  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ $strapi, $renderMarkdownServer, $error }) {
    try {

      const paramsBlogs = {
        fields: ['id', 'slug', 'nombre', 'descripcion', 'publishedAt', 'updatedAt'],
        populate: {
          imagen: {
            fields: ['url', 'width', 'height']
          }
        },
        sort: ['nombre']
      }

      const paramsEntradas = {
        fields: ['id', 'titulo', 'texto', 'publishedAt', 'updatedAt'],
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

      const { data: blogs } = await $strapi.find('blogs', paramsBlogs)
      const { data: entradas, meta } = await $strapi.find('entradas', paramsEntradas)

      entradas.forEach(entrada => {
        entrada.texto = $renderMarkdownServer(entrada.texto).replace(/<[^>]+>/g, '')
      })

      return { blogs, entradas, meta }
    }
    catch (e) {
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
</style>