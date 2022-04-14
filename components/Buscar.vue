<template>
  <div
    class="busqueda-global p-4 h-full sm:h-auto sm:xmax-h-[88vh] max-w-full w-full sm:w-[45em] overflow-hidden"
  >
    <ais-instant-search
      :search-client="searchClient"
      :search-function="searchFunction"
      index-name="contenidos"
      class="w-full h-full"
    >
      <!-- Barra superior de búsqueda -->
      <div class="search-bar flex justify-center items-center mb-4 h-[51px]">
        <!-- Ver/Ocultar panel de filtros -->
        <TButton
          class="sm:hidden h-full flex justify-center items-center w-12 flex-shrink-0 mr-3"
          @click="showFilters = !showFilters"
          :variant="showFilters ? 'gray' : 'primary'"
          :disabled="!buscando"
          v-show="buscando"
        >
          <icon :icon="showFilters?'chevron-left':'tasks'" class="dark:text-orange-800" />
        </TButton>

        <!-- Entrada de texto de búsqueda -->
        <SearchInput
          ref="searchInput"
          v-model="buscarPor"
          class="w-full text-xl flex-shrink-1"
          placeholder="Buscar..."
          @keydown.esc="$emit('close')"
          tabindex="1"
        />

        <ais-search-box ref="searchbox" placeholder="Buscar..." class="hidden" />

        <!-- Botón de micrófono -->
        <ais-voice-search
          button-title="Buscar por voz"
          disabled-button-title="Búsqueda por voz deshabilitada"
          class="text-xl h-full"
        >
          <template
            v-slot="{
              isListening,
              voiceListeningState,
              toggleListening,
              isBrowserSupported
            }"
          >
            <div v-if="isBrowserSupported" class="h-full ml-3">
              <TButton
                variant="success"
                title="Buscar por voz"
                @click="toggleListening"
                class="cursor-pointer w-12 h-full flex justify-center items-center my-0 flex-shrink-0"
              >
                <icon icon="microphone" />
              </TButton>
            </div>

            <Modal value="true" v-show="isListening" class="modal-voice">
              <div
                class="p-5 text-3xl surface w-[20em] min-h-40 max-w-full flex flex-col justify-center items-center space-y-6"
              >
                <icon icon="microphone" class="text-red" />
                <p>{{ voiceListeningState.transcript }}</p>
              </div>
            </Modal>
          </template>
        </ais-voice-search>
      </div>



      <!-- Panel inferior de resultados + filtros -->
      <div
        v-show="buscando"
        class="w-full h-full flex sm:space-x-3 panel-busquedas"
        :class="showFilters ? 'show-filters' : ''"
      >
        <!-- filtros -->
        <div class="panel-left space-y-2 select-none h-full overflow-y-auto flex-shrink-0">
          <h3 class="text-xs uppercase tracking-wide">Sección</h3>
          <ais-refinement-list attribute="coleccion" class="text-sm" ref="refCollection" />
          <h3 class="text-xs uppercase tracking-wide">Tipo</h3>
          <ais-refinement-list attribute="tipo" class="text-sm" />
          <h3 class="text-xs uppercase tracking-wide">Formato</h3>
          <ais-refinement-list attribute="formato" class="text-sm" />
        </div>

        <!-- panel derecho con resultados -->
        <div class="panel-right w-full flex flex-col overflow-auto max-h-full h-full">
          <!-- filtro activo (vista mobil) -->

          <ais-current-refinements class="sm:hidden mb-1">
            <template v-slot="{ items, createURL }">
              <ul class="list-none flex flex-wrap items-center">
                <li
                  v-for="item in items"
                  :key="item.attribute"
                  class="flex items-center space-x-3 mr-4 mb-2"
                >
                  <span
                    class="uppercase tracking-wide font-bold text-xs"
                  >{{ item.label.replace('coleccion', 'sección') }}:</span>
                  <ul class="list-none flex items-center space-x-2">
                    <li
                      v-for="refinement in item.refinements"
                      :key="[
                        refinement.attribute,
                        refinement.type,
                        refinement.value,
                        refinement.operator
                      ].join(':')"
                    >
                      <a
                        class="flex space-x-2 items-center filtro-etiqueta"
                        :href="createURL(refinement)"
                        @click.prevent="item.refine(refinement)"
                      >
                        <span>{{ refinement.label }}</span>
                        <icon icon="times" />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </template>
          </ais-current-refinements>

          <!-- resultados -->
          <ais-hits
            :transform-items="receivedItems"
            class="max-w-full w-full h-full overflow-y-auto surface rounded-lg"
          >
            <div
              slot="item"
              slot-scope="{ item }"
              class="bg-gray-200 text-gray-800 py-1 px-3 rounded max-w-full whitespace-nowrap"
            >
              <div class="flex space-x-2">
                <a v-if="item.coleccion == 'media'" :href="item.extra">{{ item.titulo }}</a>
                <NLink
                  v-else
                  @click.native="$emit('close')"
                  :to="`/${item.coleccion}/${item.slugref || item.idref}`"
                  class="font-bold inline-center overflow-hidden overflow-ellipsis max-w-full w-full inline-block"
                >{{ item.titulo }}</NLink>
                <span
                  :title="`Filtrar por ${item.coleccion}`"
                  v-show="!filteringCollection"
                  class="filtro-etiqueta cursor-pointer"
                  @click="setCollection(item.coleccion)"
                >{{ item.coleccion }}</span>
              </div>
            </div>
          </ais-hits>
        </div>
      </div>
    </ais-instant-search>
  </div>
</template>


<script>
// contorlaremos el nº de llamadas simultáneas de red
var queryCalls = 0
// con este timeout estabilizamos un desfase y reseteamos a 0 cada cierto tiempo de inactividad
let timerReset = null
const setTimeoutReset = () => {
  clearTimeout(timerReset)
  timerReset = setTimeout(() => {
    queryCalls = 0
    // console.log('QUERYCALLS=0')
  }, 4000)
}
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
// import { AisInstantSearch, AisSearchBox, AisVoiceSearch, AisHits } from 'vue-instantsearch';
import seo from '@/mixins/seo.js'
export default {

  mixins: [seo],
  data() {
    return {
      searchClient: instantMeiliSearch(
        this.$config.meilisearchUrl, this.$config.meilisearchKey,
        {
          placeholderSearch: false,
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
        that.filteringCollection = helper.state.disjunctiveFacetsRefinements.coleccion.length
        // es una búsqueda por teclado o por voz?
        if (!that.entradaTeclado) {
          // es por voz, actualizamos los input
          that.buscarPor = helper.state.query
          that.buscando = helper.state.query
        }
        that.entradaTeclado = null
        // controlamos el nº de llamadas a red
        queryCalls++
        // console.log('SEARCH QUERY', this, queryCalls, helper, helper.state.query)
        // ejecutamos la query
        helper.search();
        // reseatmos un timeout estabilizador
        setTimeoutReset()
      },
      entradaTeclado: true,
      buscarPor: '',
      buscando: '',
      buscarEspera: null,
      timerDebounce: null,
      filteringCollection: null,
      showFilters: false,
      // SEO:
      title: 'Buscar en la web',
      description: 'Búsqueda global',
      image: 'imagen_a_definir'
    };
  },
  mounted() {
    // atributo autofocus no funciona 
    if (process.client)
      // this.$nextTick(() => this.$refs.searchInput.$el.querySelector("input[type='search']").focus())
      this.$refs.searchInput.$el.querySelector("input[type='search']").focus()

    this.searchClient.myVueComponent = this
  },
  watch: {
    buscarPor(newValue) {
      // ignoramos las pulsaciones de espacio
      if (newValue.charAt(newValue.length - 1) == ' ') return
      // estamos usando un componente propio, del cual copiamos el valor y lo establecemos en el search box de instant search
      clearTimeout(this.timerDebounce)
      const that = this
      // usamos debounce 
      this.timerDebounce = setTimeout(() => {
        // console.log('REF IS', that.$refs.searchbox)
        if (queryCalls >= 1)
          that.buscarEspera = true
        else {
          that.buscarEspera = false
          that.setQuery()
        }
      }, newValue ? Math.min(500, Math.max(100, 700 - newValue.length * 100)) : 0)
    }
  },
  methods: {
    receivedItems(items) {
      queryCalls -= 0.5
      // console.log('received ITEMS', queryCalls, items)
      if (queryCalls < 1 && this.buscarEspera) {
        this.buscarEspera = false
        this.setQuery()
      }
      return items
    },
    setQuery() {
      // console.log("SET QUERY", this.buscarPor)
      this.buscando = this.buscarPor
      this.entradaTeclado = true
      const inp = this.$refs.searchbox.$el.querySelector("input[type='search']")
      inp.value = this.buscarPor
      // disparamos el evento para que el instant search reconozca el cambio de valor en el search box
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      //timeamos el reset
      setTimeoutReset()
    },
    setCollection(collection) {
      // console.log('setCollection', collection)
      const inp = this.$refs.refCollection.$el.querySelector(`input[type=checkbox][value=${collection}]`)
      if (inp)
        inp.click()
    }

  }
}
</script>

<style scoped>
.filtro-etiqueta {
  @apply bg-blue-500 hover:bg-blue-300 transition duration-200 text-gray-50 text-xs rounded py-1 px-2;
}

.busqueda-global {
  width: 100vw;
}
.busqueda-global .panel-busquedas {
  height: calc(100vh - 60px)
}
.busqueda-global .search-bar {
  width: calc(100% - 40px);
}

.panel-right{
  height: calc(100% - 20px)
}
.panel-left {
  @apply w-32 -ml-32 transition-all duration-300 opacity-0;
}
.show-filters .panel-left {
  @apply ml-0 opacity-100;
}

.busqueda-global >>> .ais-Hits-list {
  @apply space-y-2;
}
@screen sm {
  .busqueda-global {
  @apply w-auto;
}
  .busqueda-global .search-bar {
    width: 100%;
  }
  .panel-right{
  height: 100%
}
  .panel-left {
    @apply ml-0 w-40 opacity-100;
  }

  .busqueda-global .panel-busquedas {
  height: calc(98vh - 160px)
}
}
.modal-voice >>> .card {
  @apply h-full sm:h-40;
}
</style>
