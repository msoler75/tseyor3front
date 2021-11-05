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

          <div class="4xl:hidden ml-auto">
            <SocialIcons :content="contenido" :horizontal="true" @share="viendoCompartir = true" />
          </div>
        </div>

        <!-- <nuxt-img :src="cimage" /> -->

        <!-- article content -->
        <Article class="my-9 text-justify" v-html="noticia.textoHTML" />
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

    <SuscriptionSection
      id="suscription"
      title="Noticias TSEYOR"
      description="Noticias de interés de la comunidad Tseyor"
      to="/novedades"
      image="./imagenes/tierra.jpg"
      class="bg-teal-900 w-full"
    />

    <!-- contenido relacionado -->
    <div class="container mx-auto my-9" v-observe-visibility="cargarRelacionados">
      <h3 class="text-center">Y también...</h3>
      <HCarousel center :items="relacionados" collection="noticias" :no-text="true" />
    </div>

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9" v-observe-visibility="(isVisible)=>{mostrarComentarios=mostrarComentarios||isVisible}">
      <h3 v-if="contenido.comentarios" class="text-center">
        {{
          contenido.comentarios +
            " Comentario" +
            (contenido.comentarios !== 1 ? "s" : "")
        }}
      </h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <LazyComments v-if="mostrarComentarios" :uid="uid" :content-title="ctitle" @count="$set(contenido, 'comentarios', $event)" class="px-1 xs:px-2" />
    </div>
  </div>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
import seo from "@/mixins/seo.js";
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ app, $strapi, route, $error }) {
    try {
      const id = route.params.id;
      const noticias = await $strapi.find(
        "noticias",
        id.match(/^\d+$/) ? { id } : { slug: id }
      );
      if (!noticias.length)
        return $error(404, 'Noticia no encontrada')
      const contenido = noticias[0];
      contenido.textoHTML = app.$renderMarkdownServer(
        contenido.texto,
        contenido.imagenes
      );
      contenido.likes = await $strapi.find("likes", {
        uid: `/noticias/${contenido.id}`
      });
      return { contenido, noticia: contenido }
    } catch (e) {
      $error(503)
    }
  },
  methods: {
     async cargarRelacionados(isVisible) {
      if(!this.relacionados.length&&isVisible) {
        const filtro = {
          id_ne: this.contenido.id,
          id_lt: this.contenido.id + 10,
          id_gt: this.contenido.id - 10
        };
        this.relacionados = await this.$strapi.find("noticias", {
          ...filtro,
          _limit: 7
        })
      }
    }
  },
  data() {
    return {
      relacionados: []
    };
  }
};
</script>
