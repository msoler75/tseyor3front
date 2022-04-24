<template>
  <div class="max-w-3xl">
    <h1>Equipos</h1>
    <section class="flex">
      <div></div>
      <div class="ml-auto">
        <SearchInput v-model="buscarPor" class="w-44 xl:mb-0" placeholder="Buscar equipo..." />
      </div>
    </section>
    <div v-for="equipo of equiposFiltrados" :key="equipo.id" class="mt-4">
      <Card class="p-3">
        <div class="flex items-center whitespace-nowrap">
          <div class="w-14 h-14 mr-5 flex-shrink-0">
            <nuxt-img
              :src="equipo.imagen ? equipo.imagen.url : '/imagenes/equipo.jpg'"
              :width="70"
              :height="70"
              class="w-full h-full rounded-full"
              fit="cover"
            />
          </div>
          <div class="flex-shrink pr-4 whitespace-normal">
            <div>
              <div class="font-bold text-lg">
                <NLink :to="'/equipos/' + equipo.slug">{{ equipo.nombre }}</NLink>
              </div>
              <div class="text-sm text-diminished">{{ equipo.descripcion }}</div>
            </div>
          </div>
          <div class="ml-auto flex space-x-4 pr-5">
            <div class="flex flex-col justify-center items-center">
              <span title="miembros">
                <icon icon="user" class="mr-1 text-gray" />
                {{ miembros(equipo) }}
              </span>
            </div>
            <div class="flex flex-col justify-center items-center">
              <span title="actividades">
                <icon icon="hiking" class="mr-1 text-gray" />
                {{ equipo.actividades.length }}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>

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
import Fuse from "fuse.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      const filters = {
        _start: 0,
        _limit: 10
      }
      const equipos = await $strapi.find("equipos", filters)
      return { equipos, filters }
    }
    catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      buscarPor: "",
      hayMas: true,
      cargando: false,
      // SEO:
      title: 'Equipos',
      description: 'Listado de los diferentes equipos y Departamentos de Tseyor',
      image: '/imagenes/reunion.jpg'
    };
  },
  computed: {
    equiposFiltrados() {
      if (!this.buscarPor) return this.equipos;
      const fuse = new Fuse(this.equipos.map(x => ({
        ...x, _search: (x.nombre + ' ' + x.descripcion).toLowerCase()
          .replace(/á/, 'a')
          .replace(/é/, 'e')
          .replace(/í/, 'i')
          .replace(/ó/, 'o')
          .replace(/ú/, 'u')
      })), {
        keys: ["nombre", "descripcion", "_search"],
        shouldSort: true,
        threshold: 0.3
      });
      return fuse.search(this.buscarPor).map(({ item }) => item)
    },
  },
  methods: {
    miembros(equipo) {
      const m = equipo.coordinadores
      for (const user of equipo.miembros)
        if (!equipo.coordinadores.find(x => x.id === user.id))
          m.push(user)
      return m.length
    },
    async cargarMas() {
      if (!this.hayMas) return
      this.filters._start = this.equipos.length
      const filtro = this.buscarPor.length >= 1 ? { ...this.filters, '_q': this.buscarPor } : this.filters
      this.cargando = true

      const equipos = await this.$strapi.find('equipos', filtro)

      this.hayMas = equipos.length === this.filters._limit
      for (const equipo of equipos) {
        if (!this.equipos.find(x => x.id === equipo.id))
          this.equipos.push(equipo)
      }
      this.cargando = false
    },
  }
};
</script>
