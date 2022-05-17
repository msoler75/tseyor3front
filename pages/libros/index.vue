<template>
  <div>
    <h1 class="mb-5">Libros Tseyor</h1>
    <div class="w-full block xl:flex justify-between mb-1">
      <Tabs v-model="viendoCategoria" :items="categorias" class="overflow-x-auto md:flex-wrap mr-2" :compact="true"
        :group="false" />
      <div class="ml-left">
        <SearchInput v-model="buscarPor" class="w-64 mb-3" placeholder="Buscar por título..." />
      </div>
    </div>

    <ais-instant-search v-show="!vistaInicial" ref="instaSearch" :search-client="searchClient"
      :search-function="searchFunction" index-name="libros" class="w-full h-full insta-search">
      <ais-search-box ref="searchbox" class="hidden" />

      <ais-refinement-list attribute="categoria" ref="refCollection" class="hidden"
        :transform-items="receivedCategories" />

      <ais-infinite-hits v-show="!cambiandoVista" ref="hits">
        <template v-slot="{ items, refineNext, isLastPage }">
          <Grid class="grid-cols-fill-w-64 text-center">
            <CardLibro v-for="item of items" :key="item.id" book-size="book-sm" :data="item" :noText="true" :noDate="true"/>
          </Grid>
          <div class="flex justify-center mt-4" v-if="!isLastPage">
            <LoadMore @click="refineNext" class="my-7"/>
          </div>
        </template>
      </ais-infinite-hits>

      <div :style="{ minHeight: `${cambiandoVista}px` }" />

      <ais-state-results>
        <template v-slot="{ state: { query }, results: { hits } }">
          <div v-show="!hits.length">No se encontraron resultados para {{ query }}.</div>
        </template>
      </ais-state-results>
    </ais-instant-search>

    <Grid v-if="vistaInicial" class="grid-cols-fill-w-64 text-center">
      <CardLibro v-for="libro of libros" :key="libro.id" book-size="book-sm" :data="libro" :noText="true" :noDate="true"/>
    </Grid>

  </div>
</template>


<script>
// https://www.sitepoint.com/premium/library/
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      const { data: libros, meta } = await $strapi.findList(route, {
        fields: ['id', 'titulo', 'descripcion', 'categoria', 'publishedAt', 'updatedAt']
      })
      return { libros, meta }
    }
    catch (e) {
      console.error(e)
      $error(503)
    }
  },
  data() {
    return {
      searchClient: instantMeiliSearch(
        // https://github.com/meilisearch/instant-meilisearch
        this.$config.meilisearchUrl, this.$config.meilisearchKey,
        {
          placeholderSearch: true,
          primaryKey: 'id',
          keepZeroFacets: true,
          paginationTotalHits: 400,
        }
      ),
      searchFunction(helper) {
        const that = this.client.myVueComponent
        const query = helper.state.query
        // es una búsqueda con filtros?
        // that.filteringCategoria = helper.state.disjunctiveFacetsRefinements.categoria.length
        console.warn('SEARCH HELPER', helper)
        if (that.lastSearch != query) {
          that.nuevaBusqueda = true
          that.categoriasBusqueda = []
          if (query && !that.lastSearch) {
            that.viendoCategoria = 'Todos'
          }
          else if (!query) {
            that.vistaInicial = true
            that.viendoCategoria = 'Nuevos'
          }
        } else {

        }
        that.lastSearch = query
        // that.categoriasBusqueda = helper.state.disjunctiveFacetsRefinements.categoria
        // ejecutamos la query
        helper.search();
      },
      // indexDefaultSortBy: 'libros:published_at:desc',
      // filteringCategoria: null,
      timerDebounce: null,
      nuevaBusqueda: true,
      categoriasBusqueda: [],
      categoriasBase: [],
      lastSearch: '',
      //
      vistaInicial: true,
      cambiandoVista: 0,
      buscarPor: "",
      buscandoPor: '',
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
    hayMas() {
      if (!this.meta) return false
      const p = this.meta.pagination
      return p.page < p.pageCount
    },
    categorias() {
      return this.vistaInicial ? ['Nuevos', ...this.categoriasBase] : this.categoriasBusqueda.length > 1 ? ['Todos', ...this.categoriasBusqueda] : this.categoriasBusqueda
    }
  },
  watch: {
    buscarPor(newValue) {
      if (!newValue) {
        if (this.viendoCategoria == 'Todos' || this.viendoCategoria == 'Nuevos' || this.viendoCategoria == 0)
          this.viendoCategoria = 'Nuevos'
      }
      else
        this.viendoCategoria = this.vistaInicial?'Nuevos':'Todos'
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
      if (!newValue) {
        //this.categoriasBusqueda = []
        // this.nuevaBusqueda= true
      }
      else
        this.vistaInicial = false
    },
    viendoCategoria(cat) {
      console.log('watch viendoCategoria', cat)
      this.setCategoria(cat)
      this.vistaInicial = cat == 'Nuevos'
    },
    vistaInicial(newValue) {
      console.log('watch vistaInicial', newValue)
      if (newValue && this.viendoCategoria === 'Todos')
        this.viendoCategoria = 'Nuevos'
    }
  },
  methods: {
    receivedCategories(items) {
      console.log('RECEIVED CATS', items)
      console.log('lastSearch', this.lastSearch)
      console.log('buscandoPor', this.buscandoPor)
      if (this.nuevaBusqueda) {
        this.categoriasBusqueda = items.filter(x => x.count)
        //if (!this.categoriasBusqueda.length)
        //this.vistaInicial = true
        this.nuevaBusqueda = false
      }
      if (!this.categoriasBase.length)
        this.categoriasBase = items.filter(x => x.count)
      return items
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
    },
    setCategoria(cat) {
      console.log('setCategoria', cat)
      const checks = this.$refs.refCollection ? this.$refs.refCollection.$el : null
      console.log('checks', checks)
      if (checks && checks.querySelectorAll) {
        const inputs = checks.querySelectorAll(`input[type=checkbox]:checked`)
        console.warn('INPUTS', inputs)
        // desactiva todos los inputs
        let inpCur = checks.querySelector(`input[type=checkbox][value='${cat}']`)
        for (const inp of inputs) {
          if (inp !== inpCur && inp.checked) inp.click()
        }
        // activa el input de la categoría seleccionada
        if (!inpCur || !inpCur.checked) {
          const that = this
          const rect = this.$refs.hits.$el.getBoundingClientRect()
          this.cambiandoVista = rect.height
          setTimeout(function () {
            that.cambiandoVista = 0
            inpCur = checks.querySelector(`input[type=checkbox][value='${cat}']`)
            if (inpCur) {
              console.log('going to click', inpCur)
              inpCur.click()
            }
          }, 1)
        }
        else if (inpCur && !inpCur.checked)
          inpCur.click()
      }
    }
  }
}
</script>
