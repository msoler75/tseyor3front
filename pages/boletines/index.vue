<template>
  <div>
    <h1 class="text-center">Boletines de Tseyor</h1>
    <divider />
    <Grid class="text-center">
      <Card v-for="boletin of boletines" :data="boletin" :key="boletin.id" collection="boletines" />
    </Grid>
    <LoadMore v-if="hayMas" v-model="cargando" @click="cargarMas" class="my-7" />
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      const { data: boletines, meta } = await $strapi.find('boletines', { sort: 'publishedAt:desc' })
      return { boletines, meta }
    } catch (e) {
      console.error(e)
      $error(503)
    }
  },
  computed: {
    hayMas() {
      if (!this.meta) return false
      const p = this.meta.pagination
      return p.page < p.pageCount
    },
  },
  data() {
    return {
      cargando: false,
      // SEO:
      title: 'Boletines',
      description: 'Boletines de Tseyor',
      image: 'imagen_a_definir'
    }
  },
  methods: {
    async cargarMas() {
      if (!this.hayMas) returnç
      return
      this.filters._start = this.boletines.length
      const filtro = this.filters
      this.cargando = true
      const boletines = await this.$strapi.find('boletines', filtro)
      this.hayMas = boletines.length === this.filters._limit
      for (const boletin of boletines) {
        if (!this.boletines.find(x => x.id === boletin.id))
          this.boletines.push(boletin)
      }
      this.cargando = false
    }
  }
}
</script>

<style scoped>
.card>>>.card-img {
  @apply h-72;
}
</style>