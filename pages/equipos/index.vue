<template>
  <div class="max-w-3xl">
    <h1>Equipos</h1>
    <section class="flex">
      <div></div>
      <div class="ml-auto">
        <SearchInput
          v-model="buscarPor"
          class="w-40 xl:mb-0"
          placeholder="Buscar equipo..."
        />
      </div>
    </section>
    <div v-for="equipo of equiposFiltrados" :key="equipo.id" class="mt-4">
      <Card class="p-3">
        <div class="flex items-center whitespace-nowrap">
          <div class="w-14 h-14 mr-5 flex-shrink-0">
            <nuxt-img
              :src="equipo.imagen.url"
              :width="70"
              :height="70"
              class="w-full h-full rounded-full"
              fit="cover"
            />
          </div>
          <div class="flex-shrink pr-4 whitespace-normal">
            <div>
              <div class="font-bold text-lg"><NLink :to="'/equipos/'+equipo.slug">{{ equipo.nombre }}</NLink></div>
              <div class="text-sm text-diminished">
                {{ equipo.descripcion }}
              </div>
            </div>
          </div>
          <div class="ml-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="flex flex-col justify-center items-center">
              <div class="uppercase font-bold text-sm">miembros</div>
              <span
                ><icon icon="user" class="mr-2 text-gray" />
                {{ equipo.users.length }}</span
              >
            </div>
            <div class="flex flex-col justify-center items-center">
              <div class="uppercase font-bold text-sm">actividades</div>
              <span
                ><icon icon="hiking" class="mr-2 text-gray" />
                {{ equipo.actividades.length }}</span
              >
            </div>
            <div class="flex flex-col justify-center items-center">
              <div class="uppercase font-bold text-sm">reuniones</div>
              <span
                ><icon icon="calendar-day" class="mr-2 text-gray" />
                {{ equipo.reuniones.length }}</span
              >
            </div>
            <div class="flex flex-col justify-center items-center">
              <div class="uppercase font-bold text-sm">actas</div>
              <span
                ><icon icon="file-alt" class="mr-2 text-gray" />
                {{ equipo.actas.length }}</span
              >
            </div>
          </div>
        </div>
      </Card>
    </div>

     <div v-show="hayMas && !cargando" v-observe-visibility="cargarMas" class="mt-3 flex justify-center">
        <!-- <button @click="cargarMas" class="btn">Cargar Más...</button> -->
    </div>

  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ $strapi }) {
    const filters = {
        _start: 0,
        _limit: 10
    }
    const equipos = await $strapi.find("equipos", filters)
    return { equipos, filters };
  },
  data() {
    return {
      buscarPor: "",
      hayMas: true,
      cargando: false,
      // SEO:
      title: 'Equipos de Tseyor',
      description: 'Listado de los diferentes equipos y Departamentos de Tseyor',
      image: 'imagen_a_definir'
    };
  },
  computed: {
    equiposFiltrados() {
      if (!this.buscarPor) return this.equipos;
      return this.equipos.filter(
        (x) =>
          (x.nombre + x.descripcion).search(new RegExp(this.buscarPor, "i")) >
          -1
      );
    },
  },
  methods: {
    async cargarMas() {
      if(!this.hayMas) return
      this.filters._start = this.equipos.length
      const filtro = this.buscarPor.length>=1? {...this.filters, '_q':this.buscarPor} : this.filters
      this.cargando = true

      const equipos = await this.$strapi.find('equipos', filtro)
      
      this.hayMas = equipos.length===this.filters._limit
      for(const equipo of equipos)
      {
        if(!this.equipos.find(x=>x.id===equipo.id))
          this.equipos.push(equipo)
      }
      this.cargando = false
    },
  }
};
</script>
