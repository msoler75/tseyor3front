<template>
  <SwipeX
    v-model="viendoCategoria"
    :values="categorias"
  >
    <!-- 
    <h2>Novedades</h2>
       <HCarousel :items="nuevos" class="mb-10" /> 
    -->
    <h1 class="mb-5">Catálogo de Libros</h1>
    <div class="w-full block xl:flex justify-between">
      <Tabs v-model="viendoCategoria" :labels="categorias" class="mr-2"/>
      <div class="ml-left">
        <SearchInput v-model="buscarPor" class="w-64 mb-3" placeholder="Buscar por título o descripción..."/>
      </div>
    </div>
    <Grid class="grid-cols-fill-w-64 text-center">
        <CardBook book-size="book-sm" v-for="libro of librosFiltrados" :key="libro.id" :data="libro" :noText="true"/>
    </Grid>
  </SwipeX>
</template>

<script>
export default {
  asyncData({app}) {
    const libros = [];
    for (let i = 0; i < 23; i++) {
      const tags = [];
      if (i % 3 === 2) tags.push("monografías");
      if (i % 4 === 0) tags.push("obras de consulta");
      if (i % 5 === 1) tags.push("resúmenes");
      if (i % 11 === 4) tags.push("cuentos");
      if (i % 7 === 3) tags.push("otros");
      libros.push({
        id: i,
        clase: "libros",
        imagen: "imagen" + ((i % 8) + 1) + ".jpg",
        titulo: app.$lorem(1),
        descripcion: app.$lorem(3),
        tags
      });
    }
    return { libros };
  },
  data() {
    return {
      buscarPor: "",
      viendoCategoria: "Todos",
      categorias: ["Todos", "Monografías", "Resúmenes", "Cuentos", "Otros"]
    };
  },
  computed: {
    nuevos() {
      return this.libros.slice(0, 12);
    },
    librosFiltrados() {
      const v = this.viendoCategoria.toLowerCase();
      const bp = this.slugify(this.buscarPor);
      return this.libros.filter(
        libro => 
          (v === "todos" || libro.tags.includes(v)) &&
          (bp === "" ||
            this.slugify(libro.titulo).search(bp)>-1 ||
            this.slugify(libro.descripcion).search(bp)>-1)
      );
    }
  },
  methods: {
    slugify(str) {
      str = str.replace(/^\s+|\s+$/g, ""); // trim
      str = str.toLowerCase();

      // remove accents, swap ñ for n, etc
      const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
      const to = "aaaaeeeeiiiioooouuuunc------";

      for (let i = 0, l = from.length; i < l; i++)
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));

      str = str
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace and replace by -
        .replace(/-+/g, "-"); // collapse dashes

      return str;
    }
  }
};
</script>


