<template>
  <SwipeX v-model="viendoCategoria" :values="categorias">
    <h1 class="mb-5">Catálogo de Libros</h1>
    <div class="w-full block xl:flex justify-between">
      <Tabs
        v-model="viendoCategoria"
        :labels="categorias"
        class="overflow-x-auto md:flex-wrap mr-2 mb-4"
        :compact="true"
        :group="false"
      />
      <div class="ml-left">
        <SearchInput
          v-model="buscarPor"
          class="w-64 mb-3"
          placeholder="Buscar por título o descripción..."
        />
      </div>
    </div>
    <Grid class="grid-cols-fill-w-64 text-center">
      <CardBook
        book-size="book-sm"
        v-for="libro of librosFiltrados"
        :key="libro.id"
        :data="libro"
        :noText="true"
      />
    </Grid>
    <div
      v-show="hayMas && !cargando"
      v-observe-visibility="cargarMas"
      class="mt-3 flex justify-center"
    >
      <!-- <button @click="cargarMas" class="btn">Cargar Más...</button> -->
    </div>
    <div v-show="cargando" class="mt-16 h-10 flex justify-center">
      <span class="text-xs">Cargando...</span>
    </div>
  </SwipeX>
</template>


<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ $strapi, $error }) {
    try {
      const filters = {
        _start: 0,
        _limit: 10,
        _sort: 'updated_at:DESC'
      }

      const etiquetas = await $strapi.find('etiquetas', { taxonomia: 'libros' })
      const categorias = ['Nuevos']
      for (const e of etiquetas)
        categorias.push(e)

      const libros = await $strapi.find('libros', filters)

      var hayMas = libros.length === filters._limit
      return { categorias, filters, libros, hayMas, ordenarPor: 'fecha' }
      
    } catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      buscarPor: "",
      viendoCategoria: "Nuevos",
      cargando: false,
      // SEO:
      title: 'Libros',
      description: 'Todos los libros emanados de las conversaciones interdimensionales mantenidas con nuestros Guías Estelares disponibles para descarga en formato PDF',
      image: '/imagenes/libros.jpg'
    };
  },
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
      for (const libro of libros) {
        if (!this.libros.find(x => x.id === libro.id))
          this.libros.push(libro)
      }
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
        // .map(x=>{if(!x.timestamp)x.timestamp = this.$  (x.updated_at)})
        .sort((a, b) => {
          return /* ob==='fecha'?a.timestamp-b.timestamp: */
          a - b // a.nombre.localeCompare(b.nombre)
        })
    }
  }
}
</script>


