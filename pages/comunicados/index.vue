<template>
  <div class="container max-w-4xl mx-auto">
    <div class="px-1 xs:px-3 sm:px-7">
      <div class="mb-7">
        <h1>Comunicados Recientes</h1>
        <p>
          Aquí se publican los últimos comunicados, que progresivamente se van archivando en nuestro
          <NLink to="/biblioteca/comunicados" class="btn btn-gray py-1 px-2 inline-block whitespace-nowrap font-light">archivo de comunicados</NLink>
        </p>
      </div>
    </div>

    <section class="flex flex-wrap sm:flex-nowrap justify-between items-baseline mb-5">
      <div class="mt-5 flex-grow order-2 sm:order-1"><p v-if="buscandoPor" class="text-center font-bold">Viendo resultados de: {{buscandoPor}}</p><p v-else>&nbsp;</p></div>
      <form @submit.prevent="buscar" class="w-full sm:w-auto flex justify-end order-1">
        <SearchInput v-model="buscarPor" class="w-48" placeholder="Título o palabras clave" required @search="buscar"/>
        <button :disabled="buscarPor.length<=3" type="submit" class="ml-2 btn">Buscar<span class="hidden md:inline"> en Comunicados</span></button>
      </form>
    </section>

    <div class="w-full flex flex-wrap">
      <div 
      class="lg:w-2/3 flex-shrink lg:pr-12">
        <div 
          v-if="comunicadosListados.length"
        >
        <Card
          v-for="comunicado of comunicadosListados"
          :data="comunicado"
          :key="comunicado.id"
          collection="comunicados"
          class="mb-7 max-w-lg mx-auto"
        />
          </div>
        <div v-show="hayMas && !cargando" v-observe-visibility="cargarMas" class="mt-3 flex justify-center">
          <!-- <button @click="cargarMas" class="btn">Cargar Más...</button> -->
        </div>
        <div v-show="cargando" class="mt-16 h-10 flex justify-center">
          <span class="text-xs">
            Cargando...
          </span>
        </div>
        <p v-if="!hayMas" class="text-center">No hay más comunicados con esos criterios.</p>
      </div>

      <Glass class="p-2 py-9 h-auto lg:w-1/3 flex-shrink self-start text-justify">
        <h2 class="text-center">Recientes</h2>
        <ul class="list-disc ml-5">
          <li v-for="comunicado of comunicadosRecientes" :key="comunicado.id">
            <NLink :to="'/comunicados/' + comunicado.id">
              {{ comunicado.titulo }}
            </NLink>
          </li>
        </ul>
        <div class="m-7 flex justify-center">
          <NLink to="/comunicados/listado" class="btn btn-primar">Listado Completo</NLink>
        </div>
      </Glass>
    </div>
  </div>
</template>


<script>
const minLengthBuscar = 2
const query_comunicados = `comunicados(start: %start, limit: %limit, sort: "fechaComunicado:desc" %where)  {
          id
          slug
          fechaComunicado
          titulo
          descripcion
          imagen {
            url
            width
            height
          }
        }`

const query_where = `, where: { _or: [{ titulo_contains: "%search" }, { texto_contains: "%search" }] }`

export default {
  async asyncData({$strapi}) {

   const filters = {
        _start: 0,
        _limit: 5, 
        _sort:'fechaComunicado:DESC'
    }

    // TO-DO: https://strapi.io/documentation/developer-docs/latest/development/plugins/graphql.html#customize-the-graphql-schema
    const resultado = await $strapi.graphql({
      query:
        `query {
          ${query_comunicados}
          recientes:comunicados(limit: 10, sort: "fechaComunicado:desc") {
            id 
            slug
            titulo
          }
        }`
        .replace('%start',filters._start) 
        .replace('%limit',filters._limit) 
        .replace('%where', '')
    })

    return {comunicados: resultado.comunicados, recientes: resultado.recientes, filters}

    // const comunicados = await $strapi.find('comunicados', filters)
    // return { comunicados, filters }
  },
  computed: {
    comunicadosListados() {
      return this.comunicados
      .map(x=>{if(!x.timestamp)x.timestamp = this.$dayjs(x.fechaComunicado).unix(); return x})
      .sort((a,b)=>{
        return b.timestamp-a.timestamp
      })
    },
    comunicadosRecientes() {
      return this.recientes
    }
  },
  data() {
    return {
      hayMas: true,
      buscarPor: '',
      buscandoPor: '',
      cargando: false
    }
  },
  methods: {
    buscar() {
      // console.log('buscar')
      if(this.buscarPor===this.buscandoPor) return
      
      this.comunicados.splice(0, this.comunicados.length)

      this.hayMas = true
      this.buscandoPor = this.buscarPor.replace(/[\[\]\(\)]/g, '')
      // this.cargarMas()
    },
    async cargarMas() {
      if(!this.hayMas) return
      this.filters._start = this.comunicadosListados.length
      const filtro = this.buscandoPor&&this.buscandoPor.length>=minLengthBuscar? {...this.filters, '_q':this.buscandoPor} : this.filters
      this.cargando = true
      // const comunicados = await this.$strapi.find('comunicados', filtro)

      const result = await this.$strapi.graphql({
        query:
          `query {
          ${query_comunicados},
          } `
          .replace(/%start/g,this.filters._start) 
          .replace(/%limit/g,this.filters._limit) 
          .replace(/%where/g, filtro._q ? query_where : '') 
          .replace(/%search/g, filtro._q)
      })
      // console.log('result', result)
      this.hayMas = result.comunicados.length===this.filters._limit
      for(const comunicado of result.comunicados)
      {
        if(!this.comunicados.find(x=>x.id===comunicado.id))
          this.comunicados.push(comunicado)
      }
      this.cargando = false
    },
  }
};
</script>

<style scoped>
.card >>> .card-img {
  @apply h-72;
}
</style>