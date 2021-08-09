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

    <div class="w-full flex flex-wrap">
      <div class="lg:w-2/3 flex-shrink lg:pr-12">
        <Card
          v-for="comunicado of comunicados"
          :data="comunicado"
          :key="comunicado.id"
          collection="comunicados"
          class="mb-7 max-w-lg mx-auto"
        />
      </div>
      <Glass class="p-2 py-9 h-auto lg:w-1/3 flex-shrink self-start text-justify">
        <h2 class="text-center">Recientes</h2>
        <ul class="list-disc ml-5">
          <li v-for="comunicado of comunicadosListado" :key="comunicado.id">
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
export default {
  async asyncData({$strapi}) {
    const filters = {
        _start: 0,
        _limit: 10, 
        _sort:'published_at:DESC'
    }

    const comunicados = await $strapi.find('comunicados', filters)

    var hayMas = true
    return { comunicados, filters, hayMas, ordenarPor:'fecha' }
  },
  computed: {
    comunicadosListado() {
      return this.comunicados
    }
  }
};
</script>
