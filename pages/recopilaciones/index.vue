<template>
  <section class="px-1 xs:px-5 text-center">
    <h1>Recopilaciones de experiencias</h1>
    <p>{{ description }}</p>
    <nuxt-img :src="image" sizes="xm:100vw sm:480px" class="rounded-xl my-4 mx-auto" />
    <section class="my-7">
      <NLink to="/recopilaciones/editar/nueva" class="btn mx-auto">
        <icon class="!w-6" icon="plus-square" /> Crear nueva recopilación
      </NLink>
    </section>
    <Grid class="mt-12">
      <Card v-for="reco of recopilaciones" :key="reco.id" :data="reco" creation="true" collection="recopilaciones" />
    </Grid>
    <div v-show="hayMas && !cargando" v-observe-visibility="cargarMas" class="mt-3 flex justify-center">
      <!-- <button @click="cargarMas" class="btn">Cargar Más...</button> -->
    </div>
  </section>
</template>

<script>
import seo from '@/mixins/seo.js'

export default {
  mixins: [seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      const { data: recopilaciones, meta } = await $strapi.find('recopilaciones', { sort: 'updatedAt:desc' })
      return { meta, recopilaciones }
    }
    catch (e) {
      console.log('error', JSON.stringify(e))
      $error(e.response && e.response.status ? e.response && e.response.status : 503)
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
      title: 'Recopilaciones de experiencias',
      description: 'Recopilaciones de experiencias de campo, rescate adimensional y otros trabajos grupales',
      image: '/imagenes/meditar-campo.jpg'
    }
  },
  methods: {
    async cargarMas() {
      if (!this.hayMas) return
      this.cargando = true
      return
      this.filters._start = this.recopilaciones.length

      const result = await this.$strapi.find('recopilaciones', this.filters)
      // console.log('result', result)
      this.hayMas = result.recopilaciones.length === this.filters._limit
      for (const reco of result.recopilaciones) {
        this.recopilaciones.push(reco)
      }
      this.cargando = false
    },
  }
};
</script>
