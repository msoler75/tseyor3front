<template>
  <div>
    <h1 class="text-center">Boletines de Tseyor</h1>
    <divider />
    <Grid class="text-center">
      <Card v-for="boletin of boletines"
        :data="boletin"
        :key="boletin.id"
        collection="boletines"          
      />
    </Grid>
    <div v-show="hayMas && !cargando" v-observe-visibility="cargarMas" class="mt-3 flex justify-center">
      <!-- <button @click="cargarMas" class="btn">Cargar Más...</button> -->
    </div>
    <div v-show="cargando" class="mt-16 h-10 flex justify-center">
      <span class="text-xs">
        Cargando...
      </span>
    </div>
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({$strapi}) {
      const filters = {
          _start: 0,
          _limit: 12, 
          _sort:'updated_at:DESC'
      }

      // const etiquetas = await $strapi.find('etiquetas', {taxonomia: 'libros'})
      // const categorias = ['Nuevos']
      //for(const e of etiquetas)
        //categorias.push(e)

      const boletines = await $strapi.find('boletines', filters)

      var hayMas = boletines.length === filters._limit
      return { filters, boletines, hayMas }
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
      if(!this.hayMas) return
      this.filters._start = this.boletines.length
      const filtro = this.filters
      this.cargando = true
      const boletines = await this.$strapi.find('boletines', filtro)
      this.hayMas = boletines.length===this.filters._limit
      for(const boletin of boletines)
      {
        if(!this.boletines.find(x=>x.id===boletin.id))
          this.boletines.push(boletin)
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