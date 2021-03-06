<template>
  <div>
    <SwipeX v-model="viendoSeccion" :values="secciones">
      <section class="block lg:flex">
        <div class="lg:mr-10">
          <h1 class="text-center capitalize">{{ guia.nombre }}</h1>
          <p class="text-center italic bold mb-7">{{ guia.subtitulo }}</p>

          <Tabs :items="secciones" v-model="viendoSeccion" class="mb-5" />

          <Card v-show="viendoSeccion === 'descripcion'" class="p-5" v-html="guia.descripcion" />

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
                <p>{{ cita }}</p>
              </blockquote>
            </div>
          </Card>

          <Card v-show="viendoSeccion === 'bibliografia'" class="p-5">
            <div v-html="guia.bibliografiaHTML" />
          </Card>

          <Grid
            v-show="viendoSeccion === 'bibliografia'"
            class="grid-cols-fill-w-56 text-center mt-3"
          >
            <CardBook
              v-for="libro of guia.libros"
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

    <LazyGuiasCollection class="mt-16" />
  </div>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ app, $strapi, route, $error }) {
    try {
      const slug = route.params.slug;
      const guias = await $strapi.find("guias", { slug });
      if(!guias.length)
        return $error(404, 'Guía Estelar no encontrado')
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
      return { contenido, guia: contenido }
    }
    catch (e) {
      $error(503)
    }
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
      if (this.guia.presentacionHTML && this.guia.presentacionHTML.length > 21) r.presentacion = "Presentación";
      if (this.guia.comunicadoHTML && this.guia.comunicadoHTML.length > 21) r.comunicado = "Comunicado";
      if (this.guia.experienciaHTML && this.guia.experienciaHTML.length > 21) r.experiencia = "Experiencia";
      if (this.guia.citas && this.guia.citas.length > 21) r.citas = "Citas";
      if ((this.guia.libros && this.guia.libros.length) || (this.guia.bibliografiaHTML && this.guia.bibliografiaHTML.length > 21))
        r.bibliografia = "Bibliografía";
      return r;
    },
    citas() {
      return (this.guia.citas || '').split(/\n/).filter(x => x);
    }
  }
};
</script>
