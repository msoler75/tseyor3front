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
          <div class="my-3 cursor-pointer" v-scroll-to="'#social'">
            <icon class="5xl:w-4" icon="far fa-heart" />
            {{ contenido.likes.length }}
          </div>
          <a class="my-3" href="#comentarios" v-scroll-to="'#comentarios'">
            <icon class="5xl:w-4" icon="far fa-comment" />
            {{ contenido.comentarios }}</a
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
            <div class="cursor-pointer" v-scroll-to="'#social'">
              <icon class="ml-3" icon="far fa-heart" />
              {{ contenido.likes.length }}
            </div>
            <a class="ml-3" href="#comentarios" v-scroll-to="'#comentarios'">
              <icon icon="far fa-comment" /> {{ contenido.comentarios }}</a
            >
            <div class="cursor-pointer" @click="viendoCompartir = true">
              <icon class="ml-3" icon="fas fa-share-alt" />
            </div>
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
      class="mx-auto max-w-3xl my-7 lg:my-16"
    />

    <SuscriptionSection
      title="Noticias TSEYOR"
      description="Noticias de la comunidad Tseyor"
      to="/novedades"
      image="./imagenes/imagen2.jpg"
      class="bg-blue-gray-900 w-full"
    />

    <!-- contenido relacionado -->
    <div
      class="container mx-auto my-9"
      v-observe-visibility="cargarRelacionados"
    >
      <h3 class="text-center">Y también...</h3>
      <HCarousel
        center
        :items="relacionados"
        collection="noticias"
        :no-text="true"
      />
    </div>

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9">
      <h3 v-if="contenido.comentarios" class="text-center">
        {{
          contenido.comentarios +
            " Comentario" +
            (contenido.comentarios !== 1 ? "s" : "")
        }}
      </h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <Comentarios
        :uid="uid"
        @count="$set(contenido, 'comentarios', $event)"
        class="px-1 xs:px-2"
      />
    </div>
  </div>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
import seo from "@/mixins/seo.js";
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ app, $strapi, route }) {
    const id = route.params.id;
    const noticias = await $strapi.find(
      "noticias",
      id.match(/^\d+$/) ? { id } : { slug: id }
    );
    const contenido = noticias[0];
    contenido.textoHTML = app.$renderMarkdownServer(
      contenido.texto,
      contenido.imagenes
    );
    contenido.likes = await $strapi.find("likes", {
      uid: `noticias-${contenido.id}`
    });
    return { contenido, noticia: contenido };
  },
  methods: {
    async cargarRelacionados() {
      const filtro = {
        id_ne: this.contenido.id,
        id_lt: this.contenido.id + 10,
        id_gt: this.contenido.id - 10
      };
      this.relacionados = await this.$strapi.find("noticias", {
        ...filtro,
        _limit: 7
      });
    }
  },
  data() {
    return {
      relacionados: []
    };
  }
};
</script>
