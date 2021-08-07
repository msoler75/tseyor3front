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
    <div v-observe-visibility="cargarMas">
      ...
    </div>
  </SwipeX>
</template>

<script>

export default {
  async asyncData({$strapi}) {
    const filters = {
        _start: 0,
        _limit: 20, 
        _sort:'updated_at:DESC'
    }

    const etiquetas = await $strapi.find('etiquetas', {taxonomia: 'libros'}) 
    const categorias = ['Nuevos']
    for(const e of etiquetas)
      categorias.push(e.nombre)

    const libros = await $strapi.find('libros', filters)

    var hayMas = libros.length === filters._limit
    return { categorias, filters, libros, hayMas }
  },
  data() {
    console.warn('data', this)
    return {
      buscarPor: "",
      viendoCategoria: "Nuevos"
    };
  },
  watch: {
    viendoCategoria(newValue) {
      this.hayMas = true
      this.filter._start = 0
      this.cargarMas(true)
    }
  },
  methods: {
    async cargarMas(keepStart) {
      if(!this.hayMas) return
      if(!keepStart)
        this.filter._start = this.libros.length
        const filtro =this.viendoCategoria!=='Nuevos'? {etiquetas:{nombre:viendoCategoria}} : this.filter
      const cargando = await this.$strapi.find('libros', filtro)
      this.hayMas = cargando.length===this.filters._limit
      for(const libro of cargando)
        this.libros.push(libro)
    },
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
          (v === "nuevos" || libro.tags.includes(v)) &&
          (bp === "" ||
            this.slugify(libro.titulo).search(bp)>-1 ||
            this.slugify(libro.descripcion).search(bp)>-1)
      );
    }
  },
};
</script>


