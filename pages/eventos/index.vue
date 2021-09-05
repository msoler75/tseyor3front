<template>
  <SwipeX
    v-model="viendoCategoria"
    :values="categorias"
  >
    <div class="flex">
      <tabs compact group="fixed" v-model="viendoCategoria" :labels="categorias" class="mx-auto mb-20 lg:mb-32"/>
    </div>
    
    <section class="flex justify-evenly">
      <Glass>
      <div
        v-if="eventosProximos.length"
        class="my-nav hidden lg:block w-64 xl:w-96 2xl:w-128 3xl:w-144 mr-8 flex-shrink-0 py-4 px-2 sm:px-5"
      >
        <div class="hidden lg:grid lg:grid-cols-1 xl:grid-cols-3 gap-4">
          <template v-for="evento of eventosProximos">
            <div class="hidden xl:block font-bold" :key="evento.id">
              {{ $ucFirst($dayjs(evento.fechaComienzo).fromNow()) }}
            </div>
            <a
              :key="'ev-'+evento.id"
              :href="'#evento-' + evento.id"
              v-scroll-to="'#evento-' + evento.id"
              class="xl:col-span-2"
              ><span class="font-bold text-lg">{{
                $dayjs(evento.fechaComienzo).format("D MMM YYYY")
              }}</span>
              <br />
              <span>{{ evento.titulo }}</span>
            </a>
          </template>
        </div>
        <divider />
        <div
          class="hidden lg:grid lg:grid-cols-1 xl:grid-cols-3 gap-4 opacity-60"
        >
          <h3 class="xl:hidden">Eventos pasados</h3>
          <template v-for="(evento, index) of eventosPasados">
            <div v-if="index<eventosProximos.length*3" class="hidden xl:block text-gray" :key="'evv-'+evento.id">
              Evento pasado
            </div>
            <a v-if="index<eventosProximos.length*3"
              :key="'evvv'+evento.id"
              :href="'#evento-' + evento.id"
              v-scroll-to="'#evento-' + evento.id"
              class="xl:col-span-2"
              ><span class="font-bold text-lg">{{
                $dayjs(evento.fechaComienzo).format("D MMM YYYY")
              }}</span>
              <br />
              <span>{{ evento.titulo }}</span>
            </a>
          </template>
        </div>
      </div>
      </Glass>

      <div class=""
      v-if="eventosProximos.length"
      >
        <h1 class="text-center">Próximos Eventos</h1>
        <CardEvent
          v-for="evento of eventosProximos"
          :key="'evvvv'+evento.id"
          :id="'evento-' + evento.id"
          :data="evento"
          collection="eventos"
          class="mb-4 max-w-md"
        />
      </div>
    </section>
        <divider />
    <h1 class="text-center">Eventos Pasados</h1>
        <Grid class="grid-cols-fill-w-64 text-center">
         <CardEvent
          v-for="evento of eventosPasados"
          :key="'past-'+evento.id"
          :id="'evento-' + evento.id"
          :data="evento"
          collection="eventos"
        />
</Grid>
  </SwipeX>
</template>

<script>
const minLengthBuscar = 2
const query_eventos = `eventos(start: %start, limit: %limit, sort: "fechaComienzo:desc" %where)  {
          id
          slug
          fechaComienzo
          titulo
          tipoEvento
          descripcion
          imagen {
            url
            width
            height
          }
        }`

const query_where = `, where: { _or: [{ titulo_contains: "%search" }, { descripcion_contains: "%search" }, { texto_contains: "%search" }] }`

export default {
  async asyncData({$strapi}) {

   const filters = {
        _start: 0,
        _limit: 5, 
    }

    // TO-DO: https://strapi.io/documentation/developer-docs/latest/development/plugins/graphql.html#customize-the-graphql-schema
    const resultado = await $strapi.graphql({
      query:
        `query {
          ${query_eventos}
        }`
        .replace('%start',filters._start) 
        .replace('%limit',filters._limit) 
        .replace('%where', '')
    })

    return {eventos: resultado.eventos, filters}
  },
  data() {
    return  {
      buscarPor: "",
      viendoCategoria: "Todos",
      categorias: ["Todos", "Cursos", "Encuentros", "Presentaciones"]
    }
  },
  methods: {
    onItemChanged(event, currentItem, lastActiveItem) {}
  },
  computed: {
    eventosFiltrados () {
      const vc = this.viendoCategoria.toLowerCase().replace(/[eo]s$/, '')
      return this.eventos.filter(x=>{return vc==='tod'||(x.tipoEvento||vc).search(vc)>-1})
    },
    eventosProximos() {
      const now = this.$dayjs()
      return this.eventosFiltrados
        .filter(x => this.$dayjs(x.fechaComienzo).isAfter(now))
        .sort((a, b) =>
          this.$dayjs(a.fechaComienzo).diff(this.$dayjs(b.fechaComienzo))
        );
    },
    eventosPasados() {
        const now = this.$dayjs()
      return this.eventosFiltrados
        .filter(x => !this.$dayjs(x.fechaComienzo).isAfter(now))
        .sort((a, b) =>
          this.$dayjs(b.fechaComienzo).diff(this.$dayjs(a.fechaComienzo))
        );
    }
  }
};
</script>
