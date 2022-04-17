<template>
  <div>
    <h1 class="text-center">Blogs de Tseyor</h1>
    <divider />
    <Grid class="text-center">
      <Card v-for="entrada of entradas" :data="entrada" :key="entrada.id" collection="entradas" />
    </Grid>
    <LoadMore v-if="hayMas" v-model="cargando" @click="cargarMas" class="my-7"/>
    <!-- v-observe-visibility="cargarMas" -->
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ $strapi, $error }) {
    try {
      const filters = {
        _start: 0,
        _limit: 12,
        _sort: 'updated_at:DESC'
      }

      // const etiquetas = await $strapi.find('etiquetas', {taxonomia: 'libros'})
      // const categorias = ['Nuevos']
      //for(const e of etiquetas)
      //categorias.push(e)

      const entradas = await $strapi.find('entradas', filters)

      var hayMas = entradas.length === filters._limit
      return { filters, entradas, hayMas }
    }
    catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      cargando: false,
      // SEO:
      title: 'Entradas de blog',
      description: 'Artículos de la comunidad Tseyor',
      image: '/imagenes/grupo-1.jpg'
    }
  },
  methods: {
    async cargarMas() {
      if (!this.hayMas) return
      this.filters._start = this.entradas.length
      const filtro = this.filters
      this.cargando = true
      const entradas = await this.$strapi.find('entradas', filtro)
      this.hayMas = entradas.length === this.filters._limit
      for (const entrada of entradas) {
        if (!this.entradas.find(x => x.id === entrada.id))
          this.entradas.push(entrada)
      }
      this.cargando = false
    }
  }
}
</script>

<style scoped>
.card >>> .card-img {
  @apply h-72;
}
</style>