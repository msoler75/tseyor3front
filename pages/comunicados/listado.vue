<template>
  <div>
    <h1>Listado de comunicados de lectura web</h1>
    <Card class="p-4">
      <ul class="list-none">
        <li v-for="comunicado of comunicados" :key="comunicado.id" class="flex justify-between">
          <NLink :to="'/comunicados/' + comunicado.slug">{{ comunicado.titulo }}</NLink>
          <div>{{ $dayjs(comunicado.fechaComunicado).format("DD/MMM/YYYY") }}</div>
        </li>
      </ul>

      <LoadMore v-if="hayMas" v-model="cargando" @click="cargarMas" class="my-7"
        v-observe-visibility="cargarMas"
      />
    </Card>
  </div>
</template>

<script>
const query_comunicados =
  `query { 
        comunicados(start: %start, sort: "fechaComunicado:desc") {
          fechaComunicado
          titulo
          slug
          id
        }
      }`

import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ $strapi, $error }) {
    try {
      const result = await $strapi.graphql({
        query:
          query_comunicados
            .replace(/%start/g, "0")
      });
      return result
    }
    catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      hayMas: true,
      cargando: false,
      // SEO:
      title: 'Comunicados recientes',
      description: 'Listado de comunicados recientes',
      image: 'imagen_a_definir'
    }
  },
  methods: {
    async cargarMas() {
      if (this.cargando) return
      this.cargando = true
      const result = await this.$strapi.graphql({
        query:
          query_comunicados
            .replace(/%start/g, this.comunicados.length)
      })
      this.hayMas = result.comunicados.length > 0
      for (const comunicado of result.comunicados)
        this.comunicados.push(comunicado)
      this.cargando = false
    }
  }
}
</script>
