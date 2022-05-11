<template>
  <section class="social-buttons">

    <!-- buttons -->
    <Grid class="font-thin whitespace-nowrap w-full px-3 sm:px-5 grid-cols-1" :class="mostrarLike?'sm:grid-cols-3':'sm:grid-cols-2'">
      <template v-if="mostrarLike">
        <div
          v-if="likeing"
          class="max-w-xs mx-auto min-w-40 btn flex items-center justify-center"
          @click="$emit('dislike')"
          title="Pulsa aquí si ya no te gusta"
        >
          <icon class="text-red mr-2 xs:mr-4" icon="fas fa-heart" />
          {{ likesCount }}
        </div>
        <div
          v-else
          class="max-w-xs mx-auto min-w-40 btn flex items-center justify-center"
          @click="$emit('like')"
        >
          <icon class="mr-2 xs:mr-4" icon="far fa-heart" />Me Gusta
        </div>
      </template>

      <div
        class="max-w-xs mx-auto min-w-40 btn flex items-center justify-center"
        @click="$emit('share')"
      >
        <icon class="mr-2 xs:mr-4" icon="fas fa-share-alt" />Comparte
      </div>

      <a
        class="max-w-xs mx-auto min-w-40 btn flex items-center justify-center"
        href="#comentarios"
        v-scroll-to="'#comentarios'"
      >
        <icon class="mr-2 xs:mr-4" icon="far fa-comment" />
        <span
          v-if="nComments"
        >{{ nComments + ' ' + (nComments !== 1 ? etiquetasComentarios[2] : etiquetasComentarios[1]) }}</span>
        <span v-else>{{etiquetasComentarios[0]}}</span>
      </a>
    </Grid>

    <template v-if="mostrarQuienDioLike&&likesCount">
      <p class="mt-14 mb-2 font-bold text-center">Nos gusta este contenido:</p>
      <div class="flex flex-wrap justify-center">
        <Avatar v-for="like of likesList" :key="like.usuario.id" :user="like.usuario" class="w-12 h-12 m-1" />
      </div>
    </template>
  </section>
</template>

<script>
import likes from "@/mixins/likes.js"
export default {
  mixins: [likes],
  props: {
    uid: {
      type: String,
      required: true
    },
    contenido: {
      type: Object,
      required: true,
    },
    mostrarLike: {
      type: Boolean, 
      required: false,
      default: true
    },
    etiquetasComentarios: {
      type: Array,
      required: false,
      default() { return ['Coméntalo','Comentario','Comentarios'] }
    },
    mostrarQuienDioLike: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    nComments() {
      return ('comentarios' in this.contenido)?this.contenido.comentarios:0
    }
  }
}
</script>

<style scoped>
.social-buttons {
  font-family: "Arial Narrow", Arial, Tahoma, serif;
}
</style>