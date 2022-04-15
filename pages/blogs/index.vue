<template>
  <div contained="no">
    <section class="bg-blue-gray-900 py-12 w-full text-center">
      <div class="container mx-auto px-2 xm:px-5 sm:px-12">
        <Grid class="xm:grid-cols-fill-w-64 sm:grid-cols-fit-w-48">
          <Card v-for="blog of blogs" :data="blog" :key="blog.id" collection="blogs" :noDate="true" />
        </Grid>
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
      <LoadMore v-if="hayMas" v-model="cargando" @click="cargarMas" />
    </div>

  </div>
</template>

<script>
const query_blogs = `query {
        blogs(sort: "nombre:asc")  {
          id
          slug
          published_at
          nombre
          descripcion
          imagen {
            url
            width
            height
          }
        }
      }`

import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ $strapi, app, $error }) {
    try {
      const filters = {
        _start: 0,
        _limit: 12,
        _sort: 'updated_at:DESC'
      }

      // const etiquetas = await $strapi.find('etiquetas', {taxonomia: 'libros'})
      // const categorias = ['Nuevos']
      //for(const e of etiquetas)
      //categorias.push(e)

      const entradas = await $strapi.find('entradas', filters)
      const resultado = await $strapi.graphql({
        query: query_blogs
      })
      entradas.forEach(entrada => {
        entrada.texto = app.$renderMarkdownServer(entrada.texto).replace(/<[^>]+>/g, '')
      })
      var hayMas = entradas.length === filters._limit
      return { filters, blogs: resultado.blogs, entradas, hayMas }
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