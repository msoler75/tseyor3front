<template>
  <SwipeX v-model="viendoSeccion" :values="secciones">
    <section class="block lg:flex">
      <div class="lg:mr-10">
        <h1 class="text-center capitalize">{{ guia.nombre }}</h1>
        <p class="text-center italic bold mb-7">{{guia.subtitulo}}</p>

        <Tabs :labels="secciones" v-model="viendoSeccion" class="mb-5"/>

        <Card
          v-show="viendoSeccion === 'descripcion'"
          class="p-5"
          v-html="guia.descripcion"
        />

        <Card v-show="viendoSeccion === 'presentacion'" class="p-5">
          <div v-html="guia.presentacionHTML" />
        </Card>

        <Card v-show="viendoSeccion === 'comunicado'" class="p-5">
          <div v-html="guia.comunicadoHTML" />
        </Card>

        <Card v-show="viendoSeccion === 'experiencia'" class="p-5">
          <div v-html="guia.experienciaHTML" />
        </Card>

        <Card v-show="viendoSeccion === 'citas'" class="p-5">
          <div v-for="cita of citas" :key="cita" class="mb-4">
            <blockquote>
              <p>
                {{ cita }}
              </p>
            </blockquote>
          </div>
        </Card>

        <Card v-show="viendoSeccion === 'bibliografia'" class="p-5">
          <div v-html="guia.experienciaHTML" />
        </Card>

        <Grid
          v-show="viendoSeccion === 'bibliografia'"
          class="grid-cols-fill-w-56 text-center"
        >
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
        <nuxt-img :src="guia.imagen.url" />
      </div>
    </section>
  </SwipeX>
</template>

<script>
export default {
  head() {
    return {
      title: this.guia.nombre + " — Guías Estelares — TSEYOR"
    };
  },
  async asyncData({ app, $strapi, route }) {
    const slug = route.params.slug;
    const guias = await $strapi.find("guias", { slug });
    console.log(guias);
    const contenido = guias[0];
    contenido.presentacionHTML = app.$renderMarkdownServer(
      contenido.presentacion
    );
    contenido.comunicadoHTML = app.$renderMarkdownServer(contenido.comunicado);
    contenido.experienciaHTML = app.$renderMarkdownServer(
      contenido.experiencia
    );
    contenido.bibliografiaHTML = app.$renderMarkdownServer(
      contenido.bibliografia
    );
    return { contenido, guia: contenido };
  },
  data() {
    return {
      viendoSeccion: "descripcion"
    };
  },
  computed: {
    secciones() {
      const r = {
        descripcion: "Descripción"
      };
      if (this.guia.presentacion) r.presentacion = "Presentación";
      if (this.guia.comunicado) r.presentacion = "Comunicado";
      if (this.guia.experiencia) r.citas = "Experiencia";
      if (this.guia.citas) r.citas = "Citas";
      if (this.guia.libros || this.guia.bibliografia)
        r.bibliografia = "Bibliografía";
      return r;
    },
    citas() {
      return this.guia.citas.split(/\n/).filter(x => x);
    }
  }
};
</script>
