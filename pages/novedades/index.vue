<template>
  <SwipeX v-model="viendoCategoria" :values="categorias" breadcrumb="no">
    <h1 class="text-center">
      <icon icon="bolt" class="text-yellow-800 mr-3" />Novedades
    </h1>

    <Tabs ref="tabs" v-model="viendoCategoria" :items="categorias" class="mb-7 justify-center" @change="cargarMas" />
    <Grid class="grid-cols-fill-w-72 text-center">
      <template v-for="item of novedadesListado">
        <CardDynamic :key="item.tipo + '-' + item.id" :data="item" :collection="item.tipo" :imageWidth="400" :noText="true" />
      </template>
    </Grid>

    <LoadMore v-if="hayMas" v-model="cargando" @click="cargarMas" class="my-7"/>
    <!-- v-observe-visibility="cargarMas" -->
  </SwipeX>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  // components: { Hooper, Slide },
  async asyncData({ $strapi, $error }) {
    try {
      const novedades = await $strapi.find('novedades')
      return { novedades }
    } catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      hayMas: true,
      cargando: false,
      mostrando: 8,
      viendoCategoria: "Todo",
      categorias: ["Todo", "Noticias", "Comunicados", "Eventos", "Libros", "Blogs" /*, "Otros" */],
      // SEO:
      title: 'Novedades',
      description: 'Noticias, Comunicados, Libros, Eventos, Artículos, Cursos... ',
      image: 'imagen_a_definir'
    };
  },
  watch: {
    viendoCategoria(newValue) {
      this.hayMas = true
      this.mostrando = 8
    }
  },
  methods: {
    async cargarMas() {
      if (this.novedadesFiltradas.length > this.novedadesListado.length) {
        this.mostrando += 8
        return
      }

      if (this.cargando) return
      this.cargando = true
      const vc = this.viendoCategoria.toLowerCase().replace('blogs', 'entradas')
      let last = null
      // console.log('novedades', this.novedades)
      if (vc !== 'todo') {
        for (const n of this.novedades)
          if (n.tipo === vc) last = n
      }
      console.log('last', last)
      const filtro = vc === 'todo' ? { _start: this.novedades.length, _limit: 20 } : { _tipo: vc, _limit: 20 }
      if (last)
        filtro._upd = last.updated_at
      // console.log('filtro', filtro)
      const novedades = await this.$strapi.find('novedades', filtro)
      this.hayMas = novedades.length && novedades.length === filtro._limit
      for (const n of novedades) {
        if (!this.novedades.find(x => x.id === n.id && x.tipo === n.tipo))
          this.novedades.push(n)
      }
      this.cargando = false
    }
  },
  computed: {
    novedadesFiltradas() {
      const c = this.viendoCategoria.toLowerCase().replace('blogs', 'entradas')
      if (!c || c === "todo") return this.novedades;
      /* if (c === "otros")
        return this.novedades.filter(
          x => !["noticias", "comunicados", "eventos", "libros", "entradas"].includes(x.tipo)
        ); */
      return this.novedades.filter(x => x.tipo === c);
    },
    novedadesListado() {
      // .sort((b,a)=>this.$dayjs(a.updated_at).unix() - this.$dayjs(b.updated_at).unix())
      return this.novedadesFiltradas.slice(0, this.mostrando).map(x => {
        if (x.tipo === 'eventos')
          x.fechaComienzo = x.extra
        return x
      })
    }
  }
};
</script>

<style scoped>
.hooper-wrap>>>.hooper {
  height: auto;
}
</style>