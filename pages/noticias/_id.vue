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
              <icon class="5xl:w-4" icon="far fa-heart" /> {{ noticia.likes }}
            </div>
            <a class="scrollactive-item my-3" href="#comentarios"
              ><icon class="5xl:w-4" icon="far fa-comment" />
              {{ noticia.comentarios }}</a
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
        <section>
          <!-- article heading -->
          <h1 class="">{{ ctitle }}</h1>

          <div
            class="w-full flex mb-5 items-center justify-start text-xs sm:text-sm"
          >
            <span><icon icon="far fa-calendar-alt" /> 17-may</span>

            <div class="4xl:hidden flex ml-auto">
              <div>
                <icon class="ml-3" icon="far fa-heart" /> {{ noticia.likes }}
              </div>
              <a class="scrollactive-item ml-3" href="#comentarios"
                ><icon icon="far fa-comment" /> {{ noticia.comentarios }}</a
              >
              <div class="cursor-pointer" @click="viendoCompartir = true">
                <icon class="ml-3" icon="fas fa-share-alt" />
              </div>
            </div>
          </div>

          <nuxt-img :src="cimage" />

          <!-- article content -->
          <Article class="my-9 text-justify" v-html="renderMarkdown(noticia.texto)" />
        </section>
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
            <span v-if="noticia.comentarios">
              {{ noticia.comentarios }} Comentarios</span
            >
            <span v-else>
              Coméntalo
            </span>
          </a>
        </Grid>
      </section>
    </scrollactive>


  <SuscriptionSection
    title="Noticias TSEYOR"
    description="Noticias de la comunidad Tseyor"
    to="/novedades"
    image="./images/imagen2.jpg"
    class="bg-blue-gray-900 w-full"
   />    

    <!-- contenido relacionado -->
    <div class="container mx-auto my-9">
      <h3 class="text-center">Y también...</h3>
      <HCarousel center :items="noticia.relacionados" />
    </div>

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9">
      <h3 v-if="noticia.comentarios" class="text-center">
        {{ noticia.comentarios }} Comentarios
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
  asyncData ({ app, route }) {
    // const noticiasGuays = await $strapi.$noticias.find({ id: 1 })
    const id = parseInt(route.params.id)
    console.log('noticias_id - asyncData id:', id)
    const relacionados = [];

    for (var i = 0; i < 9; i++) {
          relacionados.push({
            id: i + 1,
            clase: "noticias",
            titulo: app.$lorem(1),
            imagen: "imagen" + (((i + 1) % 6) + 1) + ".jpg"
          });
        }

    const contenido =
        {
          id,
          clase: 'noticias',
          titular: app.$lorem(1),
          imagen: 'imagen' + (id % 6 + 1) + '.jpg',
          texto: app.$lorem(-12)
           .replace(/<p>/g, "\n")
           .replace(/<\/p>/g, ""),
          comentarios: Math.round(Math.random() * 33),
          likes: Math.round(Math.random() * 77),
          relacionados
        }
    return { contenido, noticia: contenido }
  }
}
</script>
