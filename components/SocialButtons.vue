<template>
  <section class="social-buttons">

    <!-- buttons -->
    <Grid class="font-thin whitespace-nowrap w-full px-3 sm:px-5 grid-cols-1" :class="likeButton?'sm:grid-cols-3':'sm:grid-cols-2'">
      <template v-if="likeButton">
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
        >{{ nComments + ' ' + (nComments !== 1 ? commentLabels[2] : commentLabels[1]) }}</span>
        <span v-else>{{commentLabels[0]}}</span>
      </a>
    </Grid>

    <template v-if="showLikes&&likesCount">
      <p class="mt-14 mb-2 font-bold text-center">Nos gusta este contenido:</p>
      <div class="flex flex-wrap justify-center">
        <Avatar v-for="like of likesList" :key="like.usuario.id" :data="like.usuario" class="w-12 h-12 m-1" />
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
    data: {
      type: Object,
      required: true,
    },
    likeButton: {
      type: Boolean, 
      required: false,
      default: true
    },
    commentLabels: {
      type: Array,
      required: false,
      default() { return ['Coméntalo','Comentario','Comentarios'] }
    },
    showLikes: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    nComments() {
      return ('comentarios' in this.data)?this.data.comentarios:0
    }
  }
}
</script>

<style scoped>
.social-buttons {
  font-family: "Arial Narrow", Arial, Tahoma, serif;
}
</style>