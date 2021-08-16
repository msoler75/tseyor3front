<template>
  <div>
    <h1 class="text-center">Blogs de Tseyor</h1>
    <divider />
    <Grid class="text-center">
      <Card v-for="entrada of entradas"
        :data="entrada"
        :key="entrada.id"
        collection="entradas"          
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
export default {
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

      const entradas = await $strapi.find('entradas', filters)

      var hayMas = entradas.length === filters._limit
      return { filters, entradas, hayMas }
  },
  data() {
    return {
      cargando: false
    }
  },
  methods: {
    async cargarMas() {
      if(!this.hayMas) return
      this.filters._start = this.entradas.length
      const filtro = this.filters
      this.cargando = true
      const entradas = await this.$strapi.find('entradas', filtro)
      this.hayMas = entradas.length===this.filters._limit
      for(const entrada of entradas)
      {
        if(!this.entradas.find(x=>x.id===entradas.id))
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