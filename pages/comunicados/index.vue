<template>
  <div class="container max-w-4xl mx-auto">
    <div class="flex mb-5 items-center">
      <div class="mr-4">
        <h1>Comunicados Recientes</h1>
        <p>
          Aquí se publican los últimos comunicados, que progresivamente se van archivando en nuestro
          <NLink to="/biblioteca/comunicados" class="whitespace-nowrap font-bold">archivo de comunicados</NLink>, donde puedes
          encontrarlos todos.
        </p>
      </div>
      <div class="ml-auto">
        <NLink to="/biblioteca/comunicados" class="btn py-3"
          ><i class="fas fa-arrow-right mr-2" /> Archivo de Comunicados</NLink
        >
      </div>
    </div>
  <divider/>
    <div class="w-full flex flex-wrap">
      <div class="lg:w-2/3 flex-shrink lg:pr-12">
        <Card
          v-for="comunicado of comunicados"
          :data="comunicado"
          :key="comunicado.id"
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
  asyncData({ app }) {
    const comunicados = [];
    for (let i = 0; i < 30; i++) {
      comunicados.push({
        id: i,
        clase: "comunicados",
        imagen: "imagen" + ((i % 8) + 1) + ".jpg",
        titulo: app.$lorem(1, 7, 20),
        texto: app.$lorem(7)
      });
    }
    return { comunicados };
  },
  computed: {
    comunicadosListado() {
      return this.comunicados.slice(0, 10)
    }
  }
};
</script>
