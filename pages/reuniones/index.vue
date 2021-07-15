<template>
  <div class="w-full">
    <div class="flex flex-wrap w-full">
      <div>
        <h1>Reuniones</h1>
        <p>Actas, anexos, acuerdos, de los distintos equipos de Tseyor</p>
      </div>
      <div class="ml-auto">
        <NLink to="/equipos" class="btn"
          >Listado de Equipos</NLink
        >
      </div>
    </div>
    <divider />
    <div class="w-full">
      <div v-for="categoria of categorias" :key="categoria">
        {{ categoria }}
      </div>
      <div v-for="categoria of categorias" :key="categoria">
        <div v-for="item of datos[categoria.toLowerCase()]" :key="item.id">
          <Card :data="item" />
        </div>
      </div>
    </div>

    <h2>En Construcción...</h2>
     <nuxt-img width=300 src="/assets/images/trabajando.png" />

  </div>
</template>

<script>
export default {
  asyncData({ app }) {
    const actas = [];
    const anexos = [];
    const acuerdos = [];
    for (let i = 1; i < 24; i++) {
      const tags = [];
      actas.push({
        id: i,
        clase: "actas",
        nombre: app.$lorem(1)
      });
      anexos.push({
        id: i,
        clase: "anexos",
        nombre: app.$lorem(1)
      });
      acuerdos.push({
        id: i,
        clase: "acuerdos",
        nombre: app.$lorem(1)
      });
    }
    return { actas, anexos, acuerdos };
  },
  data() {
    return {
      categorias: ["Actas", "Anexos", "Acuerdos"],
      datos: [this.actas, this.anexos, this.acuerdos]
    };
  }
};
</script>
