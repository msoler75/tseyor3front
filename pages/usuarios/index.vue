<template>
  <div>
    <h1>Usuarios</h1>
    <section class="flex flex-wrap sm:flex-nowrap justify-between items-baseline mb-5">
      <div class="mt-5 flex-grow order-2 sm:order-1">
        <p v-if="buscandoPor" class="text-center font-bold">Viendo resultados de: {{ buscandoPor }}</p>
        <p v-else>&nbsp;</p>
      </div>
      <form @submit.prevent="buscar" class="w-full sm:w-auto flex justify-end order-1">
        <SearchInput v-model="buscarPor" class="w-48" placeholder="Nombre..." @search="buscar" />
        <button :disabled="buscarPor.length <= 1" type="submit" class="ml-2 btn">
          Buscar
          <span class="hidden md:inline">en Usuarios</span>
        </button>
      </form>
    </section>
    <Grid class="grid-cols-fill-w-40">
      <CardUser v-for="usuario of usuariosListados" :key="usuario.id" :data="usuario" />
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
import seo from '@/mixins/seo.js'

const minLengthBuscar = 2
const query_usuarios = `users(start: %start, limit: %limit, sort: "updated_at:desc" %where)  {
          id
          username
          updated_at
          nombreSimbolico
          imagen {
            url
            width
            height
          }
        }`

const query_where = `, where: { _or: [{ username_contains: "%search" }, { email_contains: "%search" }, {nombreSimbolico_contains: "%search"}] }`

export default {
  mixins: [seo],
  async asyncData({ $strapi }) {
    try {
      const filters = {
        _start: 0,
        _limit: 20,
      }

      const resultado = await $strapi.graphql({
        query:
          `query {
          ${query_usuarios}
        }`
            .replace('%start', filters._start)
            .replace('%limit', filters._limit)
            .replace('%where', '')
      })
      return { usuarios: resultado.users, filters }
    } catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      hayMas: true,
      buscarPor: '',
      buscandoPor: '',
      cargando: false,
      // SEO:
      title: 'Usuarios',
      description: 'Usuarios de Tseyor',
      image: 'imagen_a_definir'
    }
  },
  computed: {
    usuariosFiltrados() {
      const bp = this.buscarPor
      if (!bp)
        return this.usuarios || []
      return this.usuarios.filter(x => x.nombre.indexOf(bp) >= 0 || x.texto.indexOf(bp) >= 0)
    },
    usuariosListados() {
      return this.usuarios
        .map(x => { if (!x.timestamp) x.timestamp = this.$dayjs(x.updated_at).unix(); return x })
        .sort((a, b) => {
          return b.timestamp - a.timestamp
        })
    },
  },
  methods: {
    buscar() {
      // console.log('buscar')
      if (this.buscarPor === this.buscandoPor) return

      this.usuarios.splice(0, this.usuarios.length)

      this.hayMas = true
      this.buscandoPor = this.buscarPor.replace(/[\[\]\(\)]/g, '')
      // this.cargarMas()
    },
    async cargarMas() {
      if (!this.hayMas) return
      this.filters._start = this.usuariosListados.length
      const filtro = this.buscandoPor && this.buscandoPor.length >= minLengthBuscar ? { ...this.filters, '_q': this.buscandoPor } : this.filters
      this.cargando = true

      const result = await this.$strapi.graphql({
        query:
          `query {
          ${query_usuarios},
          } `
            .replace(/%start/g, this.filters._start)
            .replace(/%limit/g, this.filters._limit)
            .replace(/%where/g, filtro._q ? query_where : '')
            .replace(/%search/g, filtro._q)
      })
      // console.log('result', result)
      this.hayMas = result.users.length === this.filters._limit
      for (const usuario of result.users) {
        if (!this.usuarios.find(x => x.id === usuario.id))
          this.usuarios.push(usuario)
      }
      this.cargando = false
    },
  }
}
</script>
