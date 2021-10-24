<template>
  <div class="flex flex-col items-center">
    <!-- Sin padding -->
    <!-- No tiene imagen de fondo -->
    <Config :contained="false" :background="false" />

    <!-- article container -->
    <div
      class="px-3 sm:px-5 md:px-7 relative w-full shrink-0 flex-grow-1 max-w-3xl flex flex-col items-start"
    >
      <div class="hidden 4xl:block absolute right-0 translate-x-3 5xl:translate-x-10 h-full">
        <SocialIcons
          class="sticky top-32 mb-6 text-xs 5xl:text-sm"
          :likes="false"
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

          <div class="4xl:hidden ml-auto">
            <SocialIcons :content="contenido" :horizontal="true" @share="viendoCompartir = true" />
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

      <SocialButtons
        id="social"
        :data="contenido"
        :likebutton="false"
        @share="viendoCompartir = true"
        class="mx-auto max-w-xl my-7 lg:my-16"
      />
    </section>

    <SuscriptionSection
      id="suscription"
      title="reunion.equipo.nombre"
      description="reunion.equipo.descripcion"
      :to="'/equipo/' + reunion.equipo.id"
      image="reunion.equipo.imagen"
      label="Ver Equipo"
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
import vercontenidomixin from '@/mixins/vercontenido.js'
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ app, $strapi, route, $error }) {
    try {
      const id = route.params.id
      const reuniones = await $strapi.find('reuniones', { id })
      if(!reuniones.length)
        return $error(404, 'Reunión no encontrada')
      const contenido = reuniones[0]
      contenido.odHTML = app.$renderMarkdownServer(contenido.od)
      return { contenido, reunion: contenido }
    }
    catch (e) {
      $error(503)
    }
  }
}
</script>

<style scoped>
section >>> .article h2:first-of-type {
  display: none;
}
</style>