<template>
  <!-- Sin padding -->
  <!-- No tiene imagen de fondo -->
  <div class="flex flex-col items-center" contained="no" background="no" focused>

    <Contenido :contenido="contenido" @share="viendoCompartir = true"/>

    <!-- share modal -->
    <Comparte v-model="viendoCompartir" />

    <SocialBotones id="social" :uid="uid" :contenido="contenido" @like="like" @dislike="dislike" @share="viendoCompartir = true"
      class="mx-auto max-w-xl my-7 lg:my-16" />

    <SuscriptionSection id="suscription" title="Noticias TSEYOR"
      description="Noticias de interés de la comunidad Tseyor" collection="noticias" image="./imagenes/tierra.jpg"
      class="bg-teal-900 w-full" />

    <!-- contenido relacionado -->
    <div class="container mx-auto my-9" v-observe-visibility="cargarRelacionados">
      <h3 class="text-center">Y también...</h3>
      <HCarousel center :items="relacionados" collection="noticias" :no-text="true" />
    </div>

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9"
      v-observe-visibility="(isVisible) => { mostrarComentarios = mostrarComentarios || isVisible }">
      <h3 v-if="contenido.comentarios" class="text-center">
        {{
            contenido.comentarios +
            " Comentario" +
            (contenido.comentarios !== 1 ? "s" : "")
        }}
      </h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <LazyComentarios v-if="mostrarComentarios" :uid="uid" :contenido="contenido"
        @count="$set(contenido, 'comentarios', $event)" class="px-1 xs:px-2" />
    </div>
  </div>
</template>

<script>
import vercontenido from "@/mixins/vercontenido.js"
import likes from "@/mixins/likes.js"
import seo from "@/mixins/seo.js"
export default {
  mixins: [vercontenido, likes, seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      const contenido = await $strapi.getContent(route)
      if (!contenido)
        return $error(404, 'Noticia no encontrada')
      return { contenido, noticia: contenido }
    } catch (e) {
      console.error(e)
      $error(503)
    }
  }
};
</script>
