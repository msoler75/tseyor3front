<template>
  <div>
    <h1>salas</h1>

    <section class="flex flex-wrap sm:flex-nowrap justify-between items-baseline mb-5">
      <div class="mt-5 flex-grow order-2 sm:order-1">
        <p v-if="buscandoPor" class="text-center font-bold">Viendo resultados de: {{ buscandoPor }}</p>
        <p v-else>&nbsp;</p>
      </div>
      <form @submit.prevent="buscar" class="w-full sm:w-auto flex justify-end order-1">
        <SearchInput
          v-model="buscarPor"
          class="w-48"
          placeholder="Título o palabras clave"
          required
          @search="buscar"
        />
        <button :disabled="buscarPor.length <= 3" type="submit" class="ml-2 btn">
          Buscar
          <span class="hidden md:inline">en salas</span>
        </button>
      </form>
    </section>

    <Grid>
      <Card v-for="sala of salasListados" :key="sala.id" :data="sala" collection="salas" />
    </Grid>
    <div
      v-show="hayMas && !cargando"
      v-observe-visibility="cargarMas"
      class="mt-3 flex justify-center"
    >
      <!-- <button @click="cargarMas" class="btn">Cargar Más...</button> -->
    </div>
  </div>
</template>

<script>
const minLengthBuscar = 2
// https://alexclark.co.nz/blog/using-apollo-and-graphql-with-nuxt-js/
const query_salas = `salas(start: %start, limit: %limit, sort: "published_at:desc" %where)  {
          id
          slug
          nombre
          descripcion
          imagen {
            url
            width
            height
          }
        }`

const query_where = `, where: { _or: [{ nombre_contains: "%search" }, { descripcion_contains: "%search" }] }`


// import { salasQuery } from '@/graphql/query'
import seo from '@/mixins/seo.js'
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
        query:
          `query {
          ${query_salas}
        }`
            .replace('%start', filters._start)
            .replace('%limit', filters._limit)
            .replace('%where', '')
      })
      return { salas: resultado.salas, filters }
    }
    catch (e) {
      $error(503)
    }
  },
  computed: {
    salasListados() {
      return this.salas
        .map(x => { if (!x.timestamp) x.timestamp = this.$dayjs(x.published_at).unix(); return x })
        .sort((a, b) => {
          return b.timestamp - a.timestamp
        })
    },
  },
  data() {
    return {
      hayMas: true,
      buscarPor: '',
      buscandoPor: '',
      cargando: false,
      // SEO:
      title: 'Salas',
      description: 'Salas virtuales de los diferentes equipos de Tseyor',
      image: 'imagen_a_definir'
    }
  },
  methods: {
    buscar() {
      // console.log('buscar')
      if (this.buscarPor === this.buscandoPor) return

      this.salas.splice(0, this.salas.length)

      this.hayMas = true
      this.buscandoPor = this.buscarPor.replace(/[\[\]\(\)]/g, '')
      // this.cargarMas()
    },
    async cargarMas() {
      if (!this.hayMas) return
      this.filters._start = this.salasListados.length
      const filtro = this.buscandoPor && this.buscandoPor.length >= minLengthBuscar ? { ...this.filters, '_q': this.buscandoPor } : this.filters
      this.cargando = true

      const result = await this.$strapi.graphql({
        query:
          `query {
          ${query_salas},
          } `
            .replace(/%start/g, this.filters._start)
            .replace(/%limit/g, this.filters._limit)
            .replace(/%where/g, filtro._q ? query_where : '')
            .replace(/%search/g, filtro._q)
      })
      // console.log('result', result)
      this.hayMas = result.salas.length === this.filters._limit
      for (const sala of result.salas) {
        if (!this.salas.find(x => x.id === sala.id))
          this.salas.push(sala)
      }
      this.cargando = false
    },
  }
};
</script>

<style scoped>
.card >>> .card-img {
  @apply h-80;
}
</style>