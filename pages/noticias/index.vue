<template>
  <div>
    <h1>Noticias</h1>

    <section class="flex flex-wrap sm:flex-nowrap justify-between items-baseline mb-5">
      <div class="mt-5 flex-grow order-2 sm:order-1">
      </div>
      <form @submit.prevent="buscar" class="w-full sm:w-auto flex justify-end order-1">
        <SearchInput v-model="buscarPor" class="w-48" placeholder="Buscar..." required @search="buscar" />
      </form>
    </section>

    <ais-instant-search v-show="!vistaInicial" ref="instaSearch" :search-client="searchClient" index-name="noticias"
      class="w-full h-full insta-search">
      <ais-search-box ref="searchbox" class="hidden" />

      <ais-state-results>
        <template v-slot="{ results: { hits, query } }">
          <ais-infinite-hits v-if="hits.length > 0">
            <Card v-for="noticia of hits" :key="noticia.id" :data="noticia" collection="noticias" />
            <template v-slot:loadMore="{ isLastPage, refineNext }">
              <div class="flex justify-center mt-4" v-if="!isLastPage">
                <TButton @click="refineNext">Más resultados</TButton>
              </div>
            </template>
          </ais-infinite-hits>
          <div v-else>No se encontraron resultados para {{ query }}.</div>
        </template>
      </ais-state-results>
    </ais-instant-search>

    <Grid v-if="vistaInicial">
      <Card v-for="noticia of noticiasListados" :key="noticia.id" :data="noticia" collection="noticias" />
    </Grid>
    <div v-if="vistaInicial" v-show="hayMas && !cargando" v-observe-visibility="cargarMas"
      class="mt-3 flex justify-center">
      <!-- <button @click="cargarMas" class="btn">Cargar Más...</button> -->
    </div>
  </div>
</template>

<script>
const minLengthBuscar = 2
// https://alexclark.co.nz/blog/using-apollo-and-graphql-with-nuxt-js/
const query_noticias = `query {
        noticias(start: %start, limit: %limit, sort: "published_at:desc" %where)  {
          id
          slug
          published_at
          titular
          descripcion
          imagen {
            url
            width
            height
          }
        }
      }`

const query_where = `, where: { _or: [{ titular_contains: "%search" }, { texto_contains: "%search" }] }`

import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import seo from '@/mixins/seo.js'
// import { noticiasQuery } from '@/graphql/query'
export default {
  mixins: [seo],
  async asyncData({ $strapi, $error }) {
    try {
      const filters = {
        _start: 0,
        _limit: 5,
      }

      // TO-DO: https://strapi.io/documentation/developer-docs/latest/development/plugins/graphql.html#customize-the-graphql-schema
      const resultado = await $strapi.graphql({
        query: query_noticias
          .replace('%start', filters._start)
          .replace('%limit', filters._limit)
          .replace('%where', '')
      })

      return { noticias: resultado.noticias, filters }
    }
    catch (e) {
      $error(503)
    }
  },
  computed: {
    noticiasListados() {
      return this.noticias
        .map(x => { if (!x.timestamp) x.timestamp = this.$dayjs(x.published_at).unix(); return x })
        .sort((a, b) => {
          return b.timestamp - a.timestamp
        })
    },
  },
  data() {
    return {
      searchClient: instantMeiliSearch(
        // https://github.com/meilisearch/instant-meilisearch
        this.$config.meilisearchUrl, this.$config.meilisearchKey,
        {
          placeholderSearch: false,
          primaryKey: 'id',
          keepZeroFacets: true,
          paginationTotalHits: 400,
        }
      ),
      timerDebounce: null,
      vistaInicial: true,
      //
      hayMas: true,
      buscarPor: '',
      buscandoPor: '',
      cargando: false,
      // SEO:
      title: 'Noticias',
      description: 'Noticias de interés de la comunidad Tseyor',
      image: '/imagenes/tierra.jpg'
    }
  },
  watch: {
    buscarPor(newValue) {
      // ignoramos las pulsaciones de espacio
      if (newValue.charAt(newValue.length - 1) == ' ') return
      // estamos usando un componente propio, del cual copiamos el valor y lo establecemos en el search box de instant search
      const that = this
      // usamos debounce 
      clearTimeout(this.timerDebounce)
      this.timerDebounce = setTimeout(() => {
        // console.log('REF IS', that.$refs.searchbox)
        that.setQuery()
      }, newValue ? Math.min(500, Math.max(100, 700 - newValue.length * 100)) : 0)
    },
    buscandoPor(newValue) {
      this.vistaInicial = !newValue
    },
  },
  methods: {
    buscar() {
      // console.log('buscar')
      if (this.buscarPor === this.buscandoPor) return

      this.noticias.splice(0, this.noticias.length)

      this.hayMas = true
      this.buscandoPor = this.buscarPor.replace(/[\[\]\(\)]/g, '')
      // this.cargarMas()
    },
    async cargarMas() {
      if (!this.hayMas) return
      this.filters._start = this.noticiasListados.length
      const filtro = this.buscandoPor && this.buscandoPor.length >= minLengthBuscar ? { ...this.filters, '_q': this.buscandoPor } : this.filters
      this.cargando = true

      const result = await this.$strapi.graphql({
        query: query_noticias
          .replace('%start', this.filters._start)
          .replace('%limit', this.filters._limit)
          .replace('%where', filtro._q ? query_where : '')
          .replace(/%search/g, filtro._q)
      })
      // console.log('result', result)
      this.hayMas = result.noticias.length === this.filters._limit
      for (const noticia of result.noticias) {
        if (!this.noticias.find(x => x.id === noticia.id))
          this.noticias.push(noticia)
      }
      this.cargando = false
    },
    setQuery() {
      console.log("SET QUERY", this.buscarPor)
      // this.entradaTeclado = true
      if (this.$refs.searchbox && this.$refs.searchbox.$el && this.$refs.searchbox.$el.querySelector) {
        const inp = this.$refs.searchbox.$el.querySelector("input[type='search']")
        this.buscandoPor = this.buscarPor
        inp.value = this.buscandoPor
        // disparamos el evento para que el instant search reconozca el cambio de valor en el search box
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }
}
</script>

<style scoped>
.card>>>.card-img {
  @apply h-60;
}

.ais-InstantSearch>>>.ais-Hits-list,
.ais-InstantSearch>>>.ais-InfiniteHits {
  @apply grid gap-4 grid-cols-fill-w-64 text-center;
}
</style>