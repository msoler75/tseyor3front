<template>
  <SwipeX v-model="viendoCategoria" :values="categorias">

    <NLink v-if="soyMuul"
      class="btn absolute -top-12 right-4 w-12 h-12 flex justify-center items-center rounded-full sm:w-auto sm:h-auto sm:rounded-inherit"
      to="/eventos/editar/nuevo">
      <icon icon="edit" />
      <span class="ml-2 hidden sm:inline">Nuevo</span>
    </NLink>

    <div class="flex">
      <tabs compact group="fixed" v-model="viendoCategoria" :items="categorias" class="mx-auto mb-20 lg:mb-32" />
    </div>

    <section class="flex justify-evenly">
      <Glass>
        <div v-if="eventosProximos.length"
          class="my-nav hidden lg:block w-64 xl:w-96 2xl:w-128 3xl:w-144 mr-8 flex-shrink-0 py-4 px-2 sm:px-5">
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

      <div class v-if="eventosProximos.length">
        <h1 class="text-center">Próximos Eventos</h1>
        <CardEvent v-for="evento of eventosProximos" :key="'evvvv' + evento.id" :id="'evento-' + evento.id"
          :data="evento" collection="eventos" class="mb-4 max-w-md" />
      </div>
    </section>
    <divider />
    <h1 class="text-center">Eventos Pasados</h1>
    <Grid class="grid-cols-fill-w-64 text-center">
      <CardEvent v-for="evento of eventosPasados" :key="'past-' + evento.id" :id="'evento-' + evento.id" :data="evento"
        collection="eventos" />
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

import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      const { data: eventos, meta } = await $strapi.findList(route, {
        fields: ['id', 'slug', 'titulo', 'descripcion', 'publishedAt', 'updatedAt']
      })
      console.warn('NEWS', eventos)

      return { eventos, meta }
    }
    catch (e) {
      console.error(e)
      $error(503)
    }
  },
  data() {
    return {
      buscarPor: "",
      viendoCategoria: "Todos",
      categorias: ["Todos", "Cursos", "Encuentros", "Presentaciones"],
      // SEO:
      title: 'Eventos',
      description: 'Agenda de eventos',
      image: 'imagen_a_definir'
    }
  },
  methods: {
    onItemChanged(event, currentItem, lastActiveItem) { }
  },
  computed: {
    soyMuul() {
      return false
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
