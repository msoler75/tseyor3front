<template>
  <div class="flex flex-col items-center">
    <!-- Sin padding -->
    <!-- No tiene imagen de fondo -->
    <Config :contained="false" :background="false" />
    
      <!-- article container -->
      <div
        class="px-3 sm:px-5 md:px-7 relative w-full shrink-0 flex-grow-1 max-w-3xl flex flex-col items-start"
      >
        <div
          class="hidden 4xl:block absolute right-0 translate-x-3 5xl:translate-x-10 h-full"
        >
          <aside class="sticky top-32 mb-6 text-xs 5xl:text-sm flex flex-col">
            <a class="my-3" href="#comentarios" v-scroll-to="'#comentarios'">
              <icon class="5xl:w-4" icon="far fa-comment" />
              {{ reunion.comentarios }}</a
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
              <a class="ml-3" href="#comentarios" v-scroll-to="'#comentarios'">
                <icon icon="far fa-comment" /> {{ reunion.comentarios }}</a
              >
              <div class="cursor-pointer" @click="viendoCompartir = true">
                <icon class="ml-3" icon="fas fa-share-alt" />
              </div>
            </div>
          </div>

          <Card class="my-9 p-10">
            <div class="text-justify" v-html="reunion.odHTML" />
          </Card>
        </ArticleWrapper>
      </div>

      <section class="my-7 lg:my-16">
        <!-- modal -->
        <Comparte v-model="viendoCompartir" />

        <!-- buttons -->
        <Grid class="w-full px-3 sm:px-5 grid-cols-1 sm:grid-cols-3">
          
          <div class="max-w-xs mx-auto min-w-40 btn flex items-center justify-center" @click="viendoCompartir = true">
            <icon class="mr-2 xs:mr-4" icon="fas fa-share-alt" />
            Comparte
          </div>

          <a class="max-w-xs mx-auto min-w-40 btn flex items-center justify-center" href="#comentarios" v-scroll-to="'#comentarios'">
            <icon class="mr-2 xs:mr-4" icon="far fa-comment" />
            <span v-if="reunion.comentarios">
              {{ reunion.comentarios }} Comentarios</span
            >
            <span v-else>
              Coméntalo
            </span>
          </a>
        </Grid>
      </section>

   <SuscriptionSection
    :title="reunion.equipo.nombre"
    :description="reunion.equipo.descripcion"
    :to="'/equipo/'+reunion.equipo.id"
    :image="reunion.equipo.imagen"
    label="Ver Equipo"
    class="bg-blue-gray-900 w-full"
   />

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9">
      <h3 v-if="reunion.comentarios" class="text-center">
        {{ reunion.comentarios }} Comentarios
      </h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <Comentarios :uid="'reunion-' + id" class="px-1 xs:px-2" />
    </div>
  </div>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
export default {
  mixins: [vercontenidomixin],
  async asyncData({ app, $strapi, route }) {
    const id = route.params.id
    const reuniones = await $strapi.find('reuniones', {id})
    const contenido = reuniones[0]
    contenido.odHTML = app.$renderMarkdownServer(contenido.od)
    contenido.comentarios = 3
    return { contenido, reunion: contenido };
  }
}
</script>

<style scoped>
  section >>> .article h2:first-of-type {display: none}
</style>