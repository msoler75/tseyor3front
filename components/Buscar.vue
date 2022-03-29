<template>
  <div
    class="busqueda-global sm:p-4 max-h-[95vh] sm:max-h-[88vh] w-full sm:w-[45em] overflow-hidden"
  >
    <ais-instant-search
      :search-client="searchClient"
      :search-function="searchFunction"
      index-name="contenidos"
      class="w-full h-full"
    >
      <div class="flex justify-center items-center space-x-3 w-full mb-4">
        <SearchInput
          ref="searchInput"
          v-model="buscarPor"
          class="w-full text-xl"
          placeholder="Buscar..."
          @keydown.esc="$emit('close')"
          tabindex="1"
        />

        <ais-search-box ref="searchbox" placeholder="Buscar..." class="xhidden" />

        <ais-voice-search
          button-title="Buscar por voz"
          disabled-button-title="Búsqueda por voz deshabilitada"
          class="mt-1 text-xl"
        >
          <template
            v-slot="{
              isListening,
              voiceListeningState,
              toggleListening,
              isBrowserSupported
            }"
          >
            <TButton
              variant="secondary"
              v-if="isBrowserSupported"
              title="Buscar por voz"
              @click="toggleListening"
              class="cursor-pointer px-3 h-full"
            >
              <icon icon="microphone" class="dark:text-orange-800" />
            </TButton>

            <Modal value="true" v-show="isListening">
              <div
                class="p-5 text-xl surface w-[20em] min-h-40 max-w-full flex flex-col justify-center items-center space-y-6"
              >
                <icon icon="microphone" class="text-4xl text-red" />
                <p>{{ voiceListeningState.transcript }}</p>
              </div>
            </Modal>
          </template>
        </ais-voice-search>
      </div>

      <div v-show="buscando" class="w-full h-full sm:flex sm:space-x-3 panel-resultados">
        <div class="sm:w-40 space-y-2 select-none h-full overflow-y-auto" style="flex-shrink: 0">
          <h3 class="text-xs uppercase tracking-wide">Sección</h3>
          <ais-refinement-list attribute="coleccion" class="text-sm" />
          <h3 class="text-xs uppercase tracking-wide">Tipo</h3>
          <ais-refinement-list attribute="tipo" class="text-sm" />
          <h3 class="text-xs uppercase tracking-wide">Formato</h3>
          <ais-refinement-list attribute="formato" class="text-sm" />
        </div>

        <ais-hits
          :transform-items="receivedItems"
          class="max-w-full w-full h-full overflow-y-auto surface rounded-lg"
        >
          <div
            slot="item"
            slot-scope="{ item }"
            class="bg-gray-200 text-gray-800 py-1 px-3 rounded max-w-full whitespace-nowrap mb-2"
          >
            <div class="flex space-x-2">
              <a v-if="item.coleccion == 'media'" :href="item.extra">{{ item.titulo }}</a>
              <NLink
                v-else
                @click.native="$emit('close')"
                :to="`/${item.coleccion}/${item.slugref || item.idref}`"
                class="font-bold inline-center overflow-hidden overflow-ellipsis max-w-full w-full inline-block"
              >{{ item.titulo }}</NLink>
              <span class="bg-blue-500 text-gray-50 text-xs rounded py-1 px-2">{{ item.coleccion }}</span>
            </div>
          </div>
        </ais-hits>
      </div>
    </ais-instant-search>
  </div>
</template>


<script>
var queryCalls = 0
let timerReset = null
const setTimeoutReset = () => {
  clearTimeout(timerReset)
  timerReset = setTimeout(() => {queryCalls = 0
  console.log('QUERYCALLS=0')}, 4000)
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
        queryCalls++
        console.log('SEARCH QUERY', queryCalls, helper.state.query, helper.state)
        // if (helper.state.query) {
        helper.search();
        // }
        setTimeoutReset()
      },
      buscarPor: '',
      buscando: '',
      buscarEspera: null,
      timerDebounce: null,
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
  },
  watch: {
    buscarPor(newValue) {
      // ignoramos las pulsaciones de espacio
      if(newValue.charAt(newValue.length-1)==' ') return
      // estamos usando un componente propio, del cual copiamos el valor y lo establecemos en el search box de instant search
      clearTimeout(this.timer)
      const that = this
      // usamos debounce 
      this.timerDebounce = setTimeout(() => {
        console.log('REF IS', that.$refs.searchbox)
        if (queryCalls >= 1)
          that.buscarEspera = true
        else {
          that.buscarEspera = false
          that.setQuery()
        }
      }, newValue ? Math.min(500, Math.max(100, 700 - newValue.length * 100)) : 0)
    },
    isSearchStalled(newValue) {
      console.log('isSearchStalled', newValue)
    }
  },
  methods: {
    receivedItems(items) {
      queryCalls -= 0.5
      console.log('received ITEMS', queryCalls, items)
      if (queryCalls < 1 && this.buscarEspera) {
        this.buscarEspera = false
        this.setQuery()
      }
      return items
    },
    setQuery() {
      console.log("SET QUERY", this.buscarPor)
      const inp = this.$refs.searchbox.$el.querySelector("input[type='search']")
      inp.value = this.buscarPor
      this.buscando = this.buscarPor
      // disparamos el evento para que el instant search reconozca el cambio de valor en el search box
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      //timeamos el reset
      setTimeoutReset()
    }
  }
}
</script>

<style scoped>
@screen sm {
  .busqueda-global .panel-resultados {
    height: calc(88vh - 150px);
  }
}
</style>
