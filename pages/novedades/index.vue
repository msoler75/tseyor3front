<template>
  <SwipeX
    v-model="viendoCategoria"
    :values="categorias" 
  >
    <Tabs ref="tabs" v-model="viendoCategoria" :labels="categorias"/>
    <Grid class="grid-cols-fill-w-72 text-center">
      <template v-for="item of novedadesFiltradas(viendoCategoria)">
        <CardDynamic          
          :key="item.categoria+'-'+item.id"
          :data="item"
        />
      </template>
    </Grid>
  </SwipeX>
</template>

<script>
// import { Hooper, Slide } from "hooper";
// import "hooper/dist/hooper.css";

export default {
  // components: { Hooper, Slide },
  async asyncData({app}) {
    // fetch our article here
    const novedades = [];
    const clases = ['comunicados', 'noticias', 'eventos', 'libros', 'equipos', 'cursos', 'reuniones']
    for (let i = 0; i <38; i++) {
      const clase = clases[(i*13)%clases.length]
      novedades.push({
        id: i,
        titulo: app.$lorem(1),
        clase,
        fechaInicio: (2021+Math.floor(Math.random()*2))+'/'+Math.ceil(Math.random()*12)+'/'+Math.ceil(Math.random()*28),
        imagen: "imagen" + ((i % 8) + 1) + ".jpg",
        texto: app.$lorem(3)
      });
    }
    return { novedades };
  },
  data() {
    return {
      viendoCategoria: "Noticias",
      categorias: ["Todo", "Noticias", "Comunicados", "Eventos", "Libros", "Otros"]
    };
  },
  methods:{
    novedadesFiltradas(categoria) {
      if (!categoria || categoria === "Todo") return this.novedades;
      if (!categoria === "Otros")
        return this.novedades.filter(
          x => !["noticias", "comunicados", "eventos", "libros"].includes(x.clase)
        );
      return this.novedades.filter(x => this.$ucFirst(x.clase) === categoria );
    },
  }
};
</script>

<style scoped>
.hooper-wrap >>> .hooper {height: auto}
</style>