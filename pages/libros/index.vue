<template>
  <div>
    <h1 class="mb-5">Catálogo de Libros</h1>
    vx: {{ viendoCategoria }}
    <div class="w-full block xl:flex justify-between">
      <Tabs
        v-model="viendoCategoria"
        :items="categorias"
        class="overflow-x-auto md:flex-wrap mr-2 mb-4"
        :compact="true"
        :group="false"
      />
      <div class="ml-left">
        <SearchInput v-model="buscarPor" class="w-64 mb-3" placeholder="Buscar por título..." />
      </div>
    </div>

    <ais-instant-search
      :search-client="searchClient"
      :search-function="searchFunction"
      index-name="libros"
      class="w-full h-full insta-search"
    >
      <ais-search-box ref="searchbox" class="xhidden" />

      <ais-sort-by
        :items="[
          { value: 'libros:published_at:desc', label: 'Nuevos' },
          { value: 'libros', label: 'Featured' },
        ]"
      />

      <ais-refinement-list
        attribute="categoria"
        ref="refCollection"
        class="xhidden"
        :transform-items="receivedCategories"
      />

      <ais-state-results>
        <template v-slot="{ results: { hits, query } }">
          <ais-infinite-hits v-if="hits.length > 0">
            <template v-slot:loadMore="{ isLastPage, refineNext }">
              <div class="flex justify-center mt-4" v-if="!isLastPage">
                <TButton @click="refineNext">Más resultados</TButton>
              </div>
            </template>
            <CardBook
              book-size="book-sm"
              slot="item"
              slot-scope="{ item }"
              :data="item"
              :noText="true"
            />
          </ais-infinite-hits>

          <div v-else>No se encontraron resultados para {{ query }}.</div>
        </template>
      </ais-state-results>
    </ais-instant-search>
  </div>
</template>


<script>
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  data() {
    return {
      searchClient: instantMeiliSearch(
        // https://github.com/meilisearch/instant-meilisearch
        this.$config.meilisearchUrl, this.$config.meilisearchKey,
        {
          placeholderSearch: true,
          primaryKey: 'id',
          keepZeroFacets: true,
          paginationTotalHits: 70,
          // hitsPerPage: 100,
          // paginationTotalHits: 70
        }
      ),
      searchFunction(helper) {
        const that = this.client.myVueComponent
        // es una búsqueda con filtros?
        that.filteringCategoria = helper.state.disjunctiveFacetsRefinements.categoria.length
        console.warn('SEARCH HELPER', helper)
        if (that.lastSearch != helper.state.query) {
          that.viendoCategoria = 'Todos'
          //that.lastSearch=helper.state.query
          // that.setCategoria('Todos')
          //return
        }
        that.lastSearch = helper.state.query
        // that.categoriasBusqueda = helper.state.disjunctiveFacetsRefinements.categoria
        // ejecutamos la query
        helper.search();
      },
      filteringCategoria: null,
      showFilters: false,
      timerDebounce: null,
      categoriasBusqueda: [],
      lastSearch: '',
      //
      buscarPor: "",
      buscando: '',
      viendoCategoria: 0,
      cargando: false,
      // SEO:
      title: 'Libros',
      description: 'Todos los libros emanados de las conversaciones interdimensionales mantenidas con nuestros Guías Estelares disponibles para descarga en formato PDF',
      image: '/imagenes/libros.jpg'
    };
  },
  mounted() {
    this.searchClient.myVueComponent = this
  },
  computed: {
    categorias() {
      return this.buscando ? ['Todos', ...this.categoriasBusqueda] : ['Nuevos', ...this.categoriasBusqueda]
    }
  },
  watch: {
    buscarPor(newValue) {
      if (!newValue) {
        this.categoriasBusqueda = []
      }
      // ignoramos las pulsaciones de espacio
      if (newValue.charAt(newValue.length - 1) == ' ') return
      // estamos usando un componente propio, del cual copiamos el valor y lo establecemos en el search box de instant search
      clearTimeout(this.timerDebounce)
      const that = this
      // usamos debounce 
      this.timerDebounce = setTimeout(() => {
        // console.log('REF IS', that.$refs.searchbox)
        that.setQuery()
      }, newValue ? Math.min(500, Math.max(100, 700 - newValue.length * 100)) : 0)
    },
    viendoCategoria(cat) {
      this.setCategoria(cat)
    }
  },
  methods: {
    receivedCategories(items) {
      console.log('RECEIVED CATS', items)
      /*if (this.categoriasBusqueda && this.buscando === this.lastSearch) {
        // ha cambiado la categoría tan solo
        //if (!this.buscando&&!this.categoriasBusqueda)
          //this.setQuery()
      }
      else
        this.categoriasBusqueda = items*/
      if (!this.categoriasBusqueda.length)
        this.categoriasBusqueda = items
      return items
    },
    setQuery() {
      console.log("SET QUERY", this.buscarPor)
      // this.entradaTeclado = true
      if (this.$refs.searchbox && this.$refs.searchbox.$el && this.$refs.searchbox.$el.querySelector) {
        const inp = this.$refs.searchbox.$el.querySelector("input[type='search']")
        inp.value = this.buscarPor
        this.buscando = this.buscarPor
        // disparamos el evento para que el instant search reconozca el cambio de valor en el search box
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }
    },
    setCategoria(cat) {
      // console.log('setCollection', collection)
      const checks = this.$refs.refCollection.$el
      if (checks) {

        const inputs = checks.querySelectorAll(`input[type=checkbox]:checked`)
        console.warn('INPUTS', inputs)
        // desactiva todos los inputs
        let inpCur = checks.querySelector(`input[type=checkbox][value='${cat}']`)
        for (const inp of inputs) {
          if (inp !== inpCur && inp.checked) inp.click()
        }
        // activa el input de la categoría seleccionada
        if (!inpCur || !inpCur.checked)
          setTimeout(function () {
            inpCur = checks.querySelector(`input[type=checkbox][value='${cat}']`)
            if (inpCur) {
              console.log('coing to click', inpCur)
              inpCur.click()
            }
          }, 1)
      }
    }
  }
}
</script>

<style scoped>
.ais-InstantSearch >>> .ais-Hits-list,
.ais-InstantSearch >>> .ais-InfiniteHits-list {
  @apply grid gap-4 grid-cols-fill-w-64 text-center;
}
</style>