<template>
  <div class="flex flex-col items-center">
    <!-- Sin padding -->
    <!-- No tiene imagen de fondo -->
    <Config :contained="false" :background="false" />

    <scrollactive bezier-easing-value=".5,0,.35,1" :duration="800" :offset="90">
      <!-- article container -->
      <div
        class="px-3 sm:px-5 md:px-7 relative w-full shrink-0 flex-grow-1 max-w-3xl flex flex-col items-start"
      >
        <div
          class="hidden 4xl:block absolute right-0 translate-x-3 5xl:translate-x-10 h-full"
        >
          <aside class="sticky top-32 mb-6 text-xs 5xl:text-sm flex flex-col">
            <div class="my-3">
              <icon class="5xl:w-4" icon="far fa-heart" /> {{ comunicado.likes }}
            </div>
            <a class="scrollactive-item my-3" href="#comentarios"
              ><icon class="5xl:w-4" icon="far fa-comment" />
              {{ comunicado.comentarios }}</a
            >
            <div
              class="cursor-pointer my-3 5xl:w-4"
              @click="viendoCompartir = true"
            >
              <icon class="ml-3" icon="fas fa-share-alt" />
            </div>
          </aside>
        </div>

        <!-- article wrapper -->
        <ArticleWrapper>
          <!-- article heading -->
          <h1 class="">{{ ctitle }}</h1>

          <div
            class="w-full flex mb-5 items-center justify-start text-xs sm:text-sm"
          >
            <span><icon icon="far fa-calendar-alt" /> 17-may</span>

            <div class="4xl:hidden flex ml-auto">
              <div>
                <icon class="ml-3" icon="far fa-heart" /> {{ comunicado.likes }}
              </div>
              <a class="scrollactive-item ml-3" href="#comentarios"
                ><icon icon="far fa-comment" /> {{ comunicado.comentarios }}</a
              >
              <div class="cursor-pointer" @click="viendoCompartir = true">
                <icon class="ml-3" icon="fas fa-share-alt" />
              </div>
            </div>
          </div>

          <!-- article content -->
          <Article class="my-9 text-justify" v-html="comunicado.textoHTML" />
        </ArticleWrapper>
      </div>

      <section class="my-7 lg:my-16">
        <!-- modal -->
        <Comparte v-model="viendoCompartir" />

        <!-- buttons -->
        <Grid class="w-full px-3 sm:px-5 grid-cols-1 sm:grid-cols-3">
          
          <div class="max-w-xs mx-auto min-w-40 btn flex items-center justify-center">
            <icon class="mr-2 xs:mr-4" icon="fas fa-heart" />
            Me Gusta
          </div>
          
          <div class="max-w-xs mx-auto min-w-40 btn flex items-center justify-center" @click="viendoCompartir = true">
            <icon class="mr-2 xs:mr-4" icon="fas fa-share-alt" />
            Comparte
          </div>

          <a class="max-w-xs mx-auto min-w-40 btn flex items-center justify-center scrollactive-item" href="#comentarios">
            <icon class="mr-2 xs:mr-4" icon="far fa-comment" />
            <span v-if="comunicado.comentarios">
              {{ comunicado.comentarios }} Comentarios</span
            >
            <span v-else>
              Coméntalo
            </span>
          </a>
        </Grid>
      </section>
    </scrollactive>

   <SuscriptionSection
    title="Comunicados TSEYOR"
    description="Comunicaciones recibidas de los hermanos de las estrellas"
    to="/comunicados"
    image="./images/imagen1.jpg"
    class="bg-blue-gray-900 w-full"
   />

    <!-- contenido relacionado -->
    <div class="container mx-auto my-9" v-observe-visibility="cargarRelacionados">
      <h3 class="text-center">Y también...</h3>
      <HCarousel center :items="relacionados" collection="comunicados" :no-text="true"/>
    </div>

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9">
      <h3 v-if="comunicado.comentarios" class="text-center">
        {{ comunicado.comentarios }} Comentarios
      </h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <Comentarios :uid="'comunicado-' + id" class="px-1 xs:px-2" />
    </div>
  </div>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
export default {
  mixins: [vercontenidomixin],
  async asyncData({ app, $strapi, route, redirect }) {
    const id = route.params.id
    const comunicados = await $strapi.find('comunicados', id.match(/^\d+$/)?{id}:{slug:id})
    const contenido = comunicados[0]
    contenido.textoHTML = app.$renderMarkdownServer(contenido.texto, contenido.imagenes)
    contenido.likes = 3
    contenido.comentarios = 3
    return { contenido, comunicado: contenido };
  },
  methods: {
    async cargarRelacionados(){
      const filtro = { id_ne: id, id_lt: id+10, id_gt: id-10 }
      this.relacionados = await $strapi.find('comunicados', {...filtro, _limit: 7})
    },
  },
  data() {
    return {
      relacionados: []
    }
  }
/*
  asyncData ({ app, route }) {
    const id = parseInt(route.params.id)
    const relacionados = [];

    for (var i = 0; i < 9; i++) {
      relacionados.push({
        id: i + 1,
        clase: "comunicados",
        titulo: app.$lorem(1),
        imagen: "imagen" + (((i + 1) % 6) + 1) + ".jpg"
      });
    }
    const contenido =
        {
          id,
          clase: 'comunicados',
          titulo: id + '. ' + app.$lorem(1),
          imagen: 'imagen' + (id % 6 + 1) + '.jpg',
          texto: app.$lorem(-14)
          .replace(/<p>/g, "\n")
          .replace(/<\/p>/g, ""),
          comentarios: Math.round(Math.random() * 33),
          likes: Math.round(Math.random() * 77),
          relacionados
        }
    return { contenido, comunicado: contenido }
  }
  */
}
</script>

<style scoped>
  section >>> .article h2:first-of-type {display: none}
</style>