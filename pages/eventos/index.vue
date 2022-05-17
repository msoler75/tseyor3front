<template>
  <SwipeX v-model="viendoCategoria" :values="categorias" contained="no" focused>

    <NLink v-if="soyMuul"
      class="btn absolute -top-12 right-4 w-12 h-12 flex justify-center items-center rounded-full sm:w-auto sm:h-auto sm:rounded-inherit"
      to="/eventos/nuevo/editar">
      <icon icon="edit" />
      <span class="ml-2 hidden sm:inline">Nuevo</span>
    </NLink>

    <section v-if="eventosProximos.length">

      <div class="flex">
        <tabs compact group="fixed" v-model="viendoCategoria" :items="categorias" class="mx-auto mb-16 xl:mb-28" />
      </div>

      <div class="container mx-auto flex justify-evenly">
        <Glass>
          <div class="my-nav hidden lg:block w-64 xl:w-96 2xl:w-128 3xl:w-144 mr-8 flex-shrink-0 py-4 px-2 sm:px-5">
            <div class="hidden lg:grid lg:grid-cols-1 xl:grid-cols-3 gap-4">
              <template v-for="evento of eventosProximos">
                <div class="hidden xl:block font-bold" :key="evento.id">{{
                    $ucFirst($dayjs(evento.fechaComienzo).fromNow())
                }}</div>
                <a :key="'ev-' + evento.id" :href="'#evento-' + evento.id" v-scroll-to="'#evento-' + evento.id"
                  class="xl:col-span-2">
                  <span class="font-bold text-lg">
                    {{
                        $dayjs(evento.fechaComienzo).format("D MMM YYYY")
                    }}
                  </span>
                  <br />
                  <span>{{ evento.titulo }}</span>
                </a>
              </template>
            </div>
            <divider />
            <div class="hidden lg:grid lg:grid-cols-1 xl:grid-cols-3 gap-4 opacity-60">
              <h3 class="xl:hidden">Eventos pasados</h3>
              <template v-for="(evento, index) of eventosPasados">
                <div v-if="index < eventosProximos.length * 3" class="hidden xl:block text-gray"
                  :key="'evv-' + evento.id">Evento pasado</div>
                <a v-if="index < eventosProximos.length * 3" :key="'evvv' + evento.id" :href="'#evento-' + evento.id"
                  v-scroll-to="'#evento-' + evento.id" class="xl:col-span-2">
                  <span class="font-bold text-lg">
                    {{
                        $dayjs(evento.fechaComienzo).format("D MMM YYYY")
                    }}
                  </span>
                  <br />
                  <span>{{ evento.titulo }}</span>
                </a>
              </template>
            </div>
          </div>
        </Glass>

        <div>
          <h1 class="text-center">Próximos Eventos</h1>
          <CardEvento v-for="evento of eventosProximos" :key="'evvvv' + evento.id" :id="'evento-' + evento.id"
            :data="evento" collection="eventos" class="mb-4 max-w-md" />
        </div>
      </div>

    </section>


    <Card v-else
      class="bg-opacity-25 dark:bg-opacity-75 flex flex-col mx-auto mb-4 w-sm max-w-full justify-center items-center text-center"
      style="height: 50vh">
      <h2>No hay eventos programados</h2>
      <Suscribe />

      <div class="cursor-pointer mt-7 text-xs text-diminished hover:text-orange" v-scroll-to="'#eventos-pasados'">
        <span>Ver eventos pasados</span>
      </div>
    </Card>

    <SuscripcionSeccion id="suscription" title="Eventos TSEYOR" description="Eventos de la comunidad Tseyor"
      collection="eventos" :image="$imagenColeccion('eventos')"
      class="border-t-4 border-b-4 border-gray-100 dark:border-t-gray-500 dark:border-b-gray-dark-700 dark:border-black bg-white/75 dark:bg-gray-dark-900 w-full" />

    <div id="eventos-pasados" class="container mx-auto my-12 px-2 sm:px-7">
      <h1 class="text-center mb-12">Eventos Pasados</h1>
      <Grid class="grid-cols-fill-w-64 text-center">
        <CardEvento v-for="evento of eventosPasados" :key="'past-' + evento.id" :id="'evento-' + evento.id"
          :data="evento" collection="eventos" />
      </Grid>
    </div>
  </SwipeX>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      const { data: eventos, meta, error } = await $strapi.findList(route, {
        fields: ['id', 'slug', 'titulo', 'descripcion', 'fechaComienzo', 'publishedAt', 'updatedAt'],
        filters: {
          titulo: {
            $contains: 'h'
          }
        },
        sort: ['fechaComienzo:desc']
      })
      if (!eventos)
        return $error(error && error.status ? error.status : 503)
      return { eventos, meta }
    }
    catch (e) {
      console.error(e)
      $error(503)
    }
  },
  data() {
    return {
      viendoCategoria: "Todos",
      categorias: ["Todos", "Cursos", "Encuentros", "Presentaciones"],
      // SEO:
      title: 'Eventos',
      description: 'Agenda de eventos',
      image: this.$imagenUrlColeccion('eventos')
    }
  },
  methods: {
    onItemChanged(event, currentItem, lastActiveItem) { }
  },
  computed: {
    soyMuul() {
      return true
      if (!this.$strapi.user) return false
      console.warn('soyMuul?', this.$strapi.user)
      return !!this.$strapi.user.grupos.find(x => x.nombre.toLowerCase() === 'muul')
    },
    eventosFiltrados() {
      const vc = this.viendoCategoria.toLowerCase().replace(/[eo]s$/, '')
      return this.eventos.filter(x => { return vc === 'tod' || (x.tipoEvento || vc).search(vc) > -1 })
    },
    eventosProximos() {
      const now = this.$dayjs()
      console.warn('PROXIMOS', this.eventosFiltrados)
      return this.eventosFiltrados
        .filter(x => this.$dayjs(x.fechaComienzo).isAfter(now))
        .sort((a, b) =>
          this.$dayjs(a.fechaComienzo).diff(this.$dayjs(b.fechaComienzo))
        );
    },
    eventosPasados() {
      const now = this.$dayjs()
      return this.eventosFiltrados
        .filter(x => this.$dayjs(x.fechaComienzo).isBefore(now))
        .sort((a, b) =>
          this.$dayjs(b.fechaComienzo).diff(this.$dayjs(a.fechaComienzo))
        );
    }
  }
};
</script>
