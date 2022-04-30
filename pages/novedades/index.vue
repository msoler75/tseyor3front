<template>
  <SwipeX v-model="viendoCategoria" :values="categorias" breadcrumb="no">
    <h1 class="text-center">
      <icon icon="bolt" class="text-yellow-800 mr-3" />Novedades
    </h1>
    
    <p>mostrando: {{ mostrando }}</p>
    <p>novedades: {{ novedades.length }}</p>
    <p>meta: {{ meta }}</p>
    <p>novedadesFiltradas: {{ novedadesFiltradas.length }}</p>
    <p>novedadesListado: {{ novedadesListado.length }}</p>
    <p>hayMas: {{hayMas}}</p>

    {{lista}}

    <Tabs ref="tabs" v-model="viendoCategoria" :items="categorias" class="mb-7 justify-center" @change="cargarMas" />
    <Grid class="grid-cols-fill-w-72 text-center">
      <template v-for="item of novedadesListado">
        <CardDynamic :key="item.coleccion + '.' + item.id" :data="item" :imageWidth="400" />
      </template>
    </Grid>

    <LoadMore v-if="hayMas" v-model="cargando" @click="cargarMas" class="my-7" />
    <!-- v-observe-visibility="cargarMas" -->
  </SwipeX>
</template>

<script>
const CATEGORIAS = ["Todo", "Noticias", "Comunicados", "Eventos", "Libros", "Blogs" /*, "Otros" */]
const COLECCIONES =  ['noticias', 'comunicados', 'eventos', 'libros', 'entradas']

const perPage = 24
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  // components: { Hooper, Slide },
  async asyncData({ $strapi, $error }) {
    try {
      const { data: novedades, meta, error } = await $strapi.find('contenidos', $strapi.filterByList({
        filters: {
          coleccion: {
            $in: COLECCIONES
          }
        },
        pagination: {
          start: 0,
          limit: perPage,
        },
      }))
      if (!novedades)
        return $error(error && error.status ? error.status : 503)
      return { novedades, meta, loaded: novedades.length }
    } catch (e) {
      console.error(e)
      $error(503)
    }
  },
  data() {
    return {
      cargando: false,
      mostrando: perPage,
      viendoCategoria: "Todo",
      categorias: CATEGORIAS,
      metas: {},
      // SEO:
      title: 'Novedades',
      description: 'Noticias, Comunicados, Libros, Eventos, Artículos, Cursos... ',
      image: 'imagen_a_definir'
    };
  },
  mounted() {
    this.metas['todo'] = { ...this.meta }
  },
  watch: {
    viendoCategoria(newValue) {
      this.mostrando = perPage
      this.meta = this.vc in this.metas ? this.metas[this.vc] : {
        pagination: {
          start: 0,
          total: 9999
        }
      }
    }
  },
  methods: {
    async cargarMas() {
      this.mostrando += perPage
      if (this.mostrando < this.novedadesFiltradas.length) {
        return
      }

      if (this.cargando) return
      this.cargando = true
      const params = this.vc === 'todo' ? {
        filters: {
          coleccion: {
            $in: COLECCIONES
          }
        },
        pagination: {
          start: this.loaded, limit: perPage
        }
      }
        :
        {
          filters: {
            coleccion: {
              $eq: this.vc
            }
          },
          pagination: {
            start: this.novedadesFiltradas.length,
            limit: perPage
          }
        }
      this.$strapi.find('contenidos', this.$strapi.filterByList(params))
        .then(result => {
          const { data: novedades, meta } = result
          this.metas[this.vc] = { ...meta }
          this.meta = meta
          if (this.vc === 'todo')
            this.loaded += novedades.length
          for (const n of novedades) {
            if (!this.novedades.find(x => x.id === n.id))
              this.novedades.push(n)
          }
          this.cargando = false
        })
    }
  },
  computed: {
    hayMas() {
      return this.mostrando < this.novedadesFiltradas.length || this.novedadesFiltradas.length < this.meta.pagination.total
    },
    vc() {
      return this.viendoCategoria.toLowerCase().replace('blogs', 'entradas')
    },
    novedadesFiltradas() {
      if (this.vc === "todo") return this.novedades
      return this.novedades.filter(x => x.coleccion === this.vc);
    },
    novedadesListado() {
      // .sort((b,a)=>this.$dayjs(a.updated_at).unix() - this.$dayjs(b.updated_at).unix())
      return this.novedadesFiltradas.slice(0, this.mostrando).map(item => {
        if (item.coleccion === 'eventos')
          item.fechaComienzo = item.extra
        item.id = item.idref
        item.slug = item.slugref
        return item
      })
    },
    lista() {
      let r = []
      if (this.vc === "todo") r = []
      else r = this.novedades.filter(x => x.coleccion !== this.vc)
      return r.map(x=>({id: x.id, c: x.coleccion}))
    }
  }
}
</script>
