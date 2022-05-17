<template>
  <div class="catalogo-libros">
    <h1 class="mb-5">Catálogo de Libros</h1>

    <ais-instant-search
      :search-client="searchClient"
      index-name="libros"
      class="w-full sm:flex sm:space-x-5"
    >
      <div class="sm:w-60 sm:mt-20 mb-5" style="flex-shrink: 0">
        <ais-refinement-list
          attribute="etiquetas"
          :sort-by="['isRefined', 'fecha:asc']"
          class="select-none mb-7"
        />
      </div>

      <div class="w-full">
        <div class="flex justify-end items-center space-x-4">
          <ais-voice-search
            button-title="Buscar por voz"
            disabled-button-title="Búsqueda por voz deshabilitada"
            class="-mt-3"
          >
            <template
              v-slot="{
                isListening,
                voiceListeningState,
                toggleListening,
                isBrowserSupported
              }"
            >
              <span
                v-if="isBrowserSupported"
                title="Buscar por voz"
                @click="toggleListening"
                class="cursor-pointer"
              >
                <icon icon="microphone" />
              </span>
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
          <ais-search-box
            placeholder="Buscar por título o descripción..."
            class="w-64 sm:w-72 max-w-full"
          />
        </div>
        <ais-hits
          class="surface w-full rounded-lg border border-blue-gray-900 border-opacity-20 py-7 px-2 md:p-7"
        >
          <div slot="item" slot-scope="{ item }">
            <CardLibro
              book-size="book-xs md:book-sm"
              :key="item.id"
              :data="item"
              :noText="true"
              class="pb-5"
            />
          </div>
        </ais-hits>
      </div>
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
        this.$config.meilisearchUrl, this.$config.meilisearchKey,
        {
          primaryKey: 'slug', 
          keepZeroFacets: true
        }
      ),
      // buscarPor: "",
      // viendoCategoria: "Nuevos",
      // cargando: false,
      // SEO:
      title: 'Libros',
      description: 'Todos los libros emanados de las conversaciones interdimensionales mantenidas con nuestros Guías Estelares disponibles para descarga en formato PDF',
      image: '/imagenes/libros.jpg'
    };
  }
  /*
  watch: {
    viendoCategoria(newValue) {
      this.hayMas = true
    }
  },
  methods: {
    async cargarMas() {
      if (!this.hayMas) return
      this.filters._start = this.librosFiltrados.length
      const filtro = this.viendoCategoria !== 'Nuevos' ? { 'etiquetas.nombre': this.viendoCategoria } : this.filters
      this.cargando = true
      const libros = await this.$strapi.find('libros', filtro)
      this.hayMas = libros.length === this.filters._limit
      // let agregados = false
      for (const libro of libros) {
        if (!this.libros.find(x => x.id === libro.id)) {
          this.libros.push(libro)
          // agregados = true
        }
      }
      // if(!agregados) this.hayMas = false
      this.cargando = false
    },
  },
  computed: {
    librosFiltrados() {
      const cat = this.viendoCategoria
      const bp = this.$slugify(this.buscarPor)
      return this.libros.filter(
        libro =>
          (cat === "Nuevos" || libro.etiquetas.find(x => x.nombre === cat)) &&
          (bp === "" ||
            this.$slugify(libro.titulo).search(bp) > -1 ||
            this.$slugify(libro.descripcion).search(bp) > -1)
      );
    },
    librosListados() {
      const ob = this.ordenarPor
      return this.librosFiltrados
        // .map(x=>{if(!x.timestamp)x.timestamp = this.$  (x.updatedAt)})
        .sort((a, b) => {
          return 
          a - b // a.nombre.localeCompare(b.nombre)
        })
    }
  }
  */
}
</script>


<style scoped>
.card {
  @apply bg-transparent shadow-none border-0;
}

.card >>> .card-title > * {
  @apply text-base text-black dark:text-white;
}

.catalogo-libros >>> .ais-InstantSearch ol.ais-Hits-list {
  @apply list-none grid gap-4 grid-cols-fill-w-40 md:grid-cols-fill-w-48 text-center;
}
</style>