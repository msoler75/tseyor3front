<template>
  <section>
    <section class="block lg:flex">
      <div class="lg:mr-10">
        <h1 class="capitalize">{{ nombre }}</h1>
        <Tabs :labels="secciones" v-model="viendoSeccion" tabClass="px-6" />
        <Card v-show="viendoSeccion === 'descripcion'"
          class="p-5"
          v-html="descripcion"
        />
        <Card v-show="viendoSeccion === 'citas'" class="p-5" >
          <div v-for="cita of citas" :key="cita" class="mb-4">
            <blockquote>
              <p>
                {{ cita }}
              </p>
            </blockquote>
          </div>
        </Card>
        <Grid class="grid-cols-fill-w-56 text-center" v-show="viendoSeccion === 'libros'">
          <CardBook
            v-for="libro of libros"
            :key="libro.id"
            :data="libro"
            :noText="true"
            book-size="book-sm"
          />
        </Grid>
      </div>
      <div class="ml-auto lg:w-1/3 flex-shrink-0 max-w-sm">
        <nuxt-img :src="imagen" />
      </div>
    </section>
  </section>
</template>

<script>
export default {
  head() {
    return {
      title: this.nombre + " — Guías Estelares — TSEYOR",
    };
  },
  async asyncData({ app, params }) {
    const slug = params.slug.toLowerCase(); // When calling /privacy-policy the slug will be "privacy-policy"
    const descripcion = app.$lorem(-7);
    const citas = [];
    for (var i = 0; i < 4; i++) citas.push(app.$lorem(1));
    const libros = [];
    for (var i = 0; i < 3; i++)
      libros.push({
        id: i * 7 + 1,
        imagen: "imagen" + ((i % 8) + 1) + ".jpg",
        clase: "libros",
        titulo: app.$lorem(1),
      });

    return { slug, descripcion, citas, libros };
  },
  data() {
    return {
      secciones: {
        descripcion: "Descripción",
        citas: "Citas",
        libros: "Bibliografía",
      },
      viendoSeccion: "descripcion",
    };
  },
  computed: {
    nombre() {
      var str = this.slug.replace(/[^a-z]/g, " ");
      const words = str.split(/\s/);
      for (const i in words) words[i] = this.$ucFirst(words[i]);
      str = words.join(" ");
      return str;
    },
    imagen() {
      var str = this.slug.replace(/[^a-z]/g, "");
      return "/assets/images/guias/" + str + ".jpg";
    },
  },
};
</script>