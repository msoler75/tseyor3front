<template>
  <div>
    <h1>Listado de comunicados de lectura web</h1>
    <Card class="p-4">
    <ul class="list-none">
      <li v-for="comunicado of comunicados" :key="comunicado.id" class="flex justify-between">
        <NLink :to="'/comunicados/' + comunicado.id">
          {{ comunicado.titulo }}
        </NLink>
        <div>
          {{$dayjs(comunicado.fechaComunicado).format("DD/MMM/YYYY")}}
        </div>
      </li>
    </ul>
    </Card>
  </div>
</template>

<script>
export default {
  async asyncData({ $strapi }) {
    const comunicados = await $strapi.graphql({
      query: `query { 
        comunicados(sort: "fechaComunicado:desc") {
          fechaComunicado
          titulo
          id
        }
      }`
    });
    return comunicados
  }
}
</script>
