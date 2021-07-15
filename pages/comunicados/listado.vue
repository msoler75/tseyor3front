<template>
    <div>
        <h1>Listado de comunicados en formato web</h1>
        <ul class="list-disc">
          <li v-for="comunicado of comunicados" :key="comunicado.id">
            <NLink :to="'/comunicados/' + comunicado.id">
              {{ comunicado.titulo }}
            </NLink>
          </li>
        </ul>
        </div>
</template>


<script>
export default {
  asyncData({ app }) {
    const comunicados = [];
    for (let i = 0; i < 300; i++) {
      comunicados.push({
        id: i,
        clase: "comunicados",
        imagen: "imagen" + ((i % 8) + 1) + ".jpg",
        titulo: i + '. ' + app.$lorem(1, 7, 20),
        texto: app.$lorem(7)
      });
    }
    return { comunicados };
  },
};
</script>
