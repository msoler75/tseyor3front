<template>
    <!-- Sin padding -->
    <!-- No tiene imagen de fondo -->
  <div class="flex flex-col items-center" contained="no" background="no" focused >

    <!-- article container -->
    <div
      class="px-3 sm:px-5 md:px-7 relative w-full shrink-0 flex-grow-1 max-w-3xl flex flex-col items-start"
    >
      <div class="hidden 4xl:block absolute right-0 translate-x-3 5xl:translate-x-10 h-full">
        <SocialIcons
          class="sticky top-32 mb-6 text-xs 5xl:text-sm"
          :content="contenido"
          @share="viendoCompartir = true"
        />
      </div>

      <!-- article wrapper -->
      <ArticleWrapper>
        <!-- article heading -->
        <h1 class>{{ ctitle }}</h1>

        <div class="w-full flex mb-5 items-center justify-start text-xs sm:text-sm">
          <span>
            <icon icon="far fa-calendar-alt" />17-may
          </span>
          <div class="ml-8 hidden sm:block">
            <span class="capitalize">
              <icon icon="far fa-user" />
              {{ entrada.blog.nombre }}
            </span>
            <a
              href="#blog-info"
              v-scroll-to="'#blog-info'"
              class="ml-2 rounded-full py-.5 px-2 text-xs bg-blue-400 text-blue-contrast"
            >Seguir</a>
          </div>

          <div class="4xl:hidden ml-auto">
            <SocialIcons :content="contenido" :horizontal="true" @share="viendoCompartir = true" />
          </div>
        </div>

        <!-- <nuxt-img :src="'./imagenes/' + entrada.imagen" /> -->
        <!-- <nuxt-img :src="cimage" /> -->

        <!-- article content -->
        <Article class="my-9 text-justify" v-html="entrada.textoHTML" />
      </ArticleWrapper>
    </div>

    <!-- share modal -->
    <Comparte v-model="viendoCompartir" />

    <SocialButtons
      id="social"
      :data="contenido"
      @like="like(contenido.id)"
      @dislike="dislike(contenido.id)"
      @share="viendoCompartir = true"
      class="mx-auto max-w-xl my-7 lg:my-16"
    />

    <!-- contenido relacionado -->
    <div class="container mx-auto my-9">
      <h3 class="text-center">Y también...</h3>
      <HCarousel center :items="entrada.relacionados" />
    </div>

    <SuscriptionSection
      id="suscription"
      title="Blogs TSEYOR"
      description="Artículos de la comunidad Tseyor"
      to="/blogs"
      image="./imagenes/grupo-1.jpg"
      class="bg-blue-gray-900 w-full"
    />

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9">
      <h3
        v-if="contenido.comentarios"
        class="text-center"
      >{{ contenido.comentarios + ' Comentario' + (contenido.comentarios !== 1 ? 's' : '') }}</h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <Comentarios :uid="uid" :content-title="ctitle" @count="$set(contenido, 'comentarios', $event)" class="px-1 xs:px-2" />
    </div>
  </div>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ app, $strapi, route, $error }) {
    try {
      const id = route.params.id
      const entradas = await $strapi.find('entradas', id.match(/\d+/) ? { id } : { slug: id })
      if(!entradas.length)
        return $error(404, 'Entrada no encontrada')
      const contenido = entradas[0]
      contenido.textoHTML = app.$renderMarkdownServer(contenido.texto, contenido.imagenes)
      contenido.likes = await $strapi.find('likes', { uid: `/entradas/${contenido.id}` })
      return { contenido, entrada: contenido };
    }
    catch (e) {
      $error(503)
    }
  }
};
</script>

<style scoped>
section >>> .article h2:first-of-type {
  display: none;
}
</style>