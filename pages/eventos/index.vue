<template>
  <SwipeX
    v-model="viendoCategoria"
    :values="categorias"
  >
    <tabs compact group="fixed" v-model="viendoCategoria" :labels="categorias" class=""/>
    <divider class="mt-0" />
    <section class="flex justify-evenly">
      <Glass>
      <scrollactive
        v-if="eventosProximos.length"
        class="my-nav hidden lg:block w-64 xl:w-96 2xl:w-128 3xl:w-144 mr-8 flex-shrink-0 py-4 px-2 sm:px-5"
        @itemchanged="onItemChanged"
        bezier-easing-value=".5,0,.35,1"
        :duration="800"
      >


        <div class="hidden lg:grid lg:grid-cols-1 xl:grid-cols-3 gap-4">
          <template v-for="evento of eventosProximos">
            <div class="hidden xl:block font-bold" :key="evento.id">
              {{ $ucFirst($dayjs(evento.fechaInicio).fromNow()) }}
            </div>
            <a
              :key="'ev-'+evento.id"
              :href="'#evento-' + evento.id"
              class="scrollactive-item xl:col-span-2"
              ><span class="font-bold text-lg">{{
                $dayjs(evento.fechaInicio).format("D MMM YYYY")
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
              class="scrollactive-item xl:col-span-2"
              ><span class="font-bold text-lg">{{
                $dayjs(evento.fechaInicio).format("D MMM YYYY")
              }}</span>
              <br />
              <span>{{ evento.titulo }}</span>
            </a>
          </template>
        </div>
      </scrollactive>
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
        />
</Grid>
  </SwipeX>
</template>

<script>
export default {
  asyncData({ app }) {
    const eventos = [];
    for (let i = 1; i < 44; i++) {
      eventos.push({
        id: i,
        clase: i%4===1?"cursos":"eventos",
        imagen: "imagen" + ((i % 8) + 1) + ".jpg",
        titulo: i%4===1?"Curso Holístico online":app.$lorem(1, 5, 12),
        texto: app.$lorem(3),
        fechaInicio:
          2018 +
          Math.floor(Math.random() * 4) +
          "/" +
          Math.ceil(Math.random() * 12) +
          "/" +
          Math.ceil(Math.random() * 28)
      });
    }
    // eventos.sort((a,b)=>app.$dayjs(b.fechaInicio).diff(app.$dayjs(a.fechaInicio)))
    return { eventos };
  },
  data() {
    return  {
      viendoCategoria: "Todos",
      categorias: ["Todos", "Cursos", "Eventos"]
    }
  },
  methods: {
    onItemChanged(event, currentItem, lastActiveItem) {}
  },
  computed: {
    eventosFiltrados () {
      const vc = this.viendoCategoria.toLowerCase()
      return this.eventos.filter(x=>{return vc==='todos'||x.clase===vc})
    },
    eventosProximos() {
        const now = this.$dayjs()
      return this.eventosFiltrados
        .filter(x => this.$dayjs(x.fechaInicio).isAfter(now))
        .sort((a, b) =>
          this.$dayjs(a.fechaInicio).diff(this.$dayjs(b.fechaInicio))
        );
    },
    eventosPasados() {
        const now = this.$dayjs()
      return this.eventosFiltrados
        .filter(x => !this.$dayjs(x.fechaInicio).isAfter(now))
        .sort((a, b) =>
          this.$dayjs(b.fechaInicio).diff(this.$dayjs(a.fechaInicio))
        );
    }
  }
};
</script>
