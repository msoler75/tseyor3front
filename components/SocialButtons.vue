<template>
  <section class="social-buttons">
    <!-- buttons -->
    <Grid class="font-thin whitespace-nowrap w-full px-3 sm:px-5 grid-cols-1" :class="likebutton?'sm:grid-cols-3':'sm:grid-cols-2'">
      <template v-if="likebutton">
        <div
          v-if="likeit"
          class="max-w-xs mx-auto min-w-40 btn flex items-center justify-center"
          @click="$emit('dislike')"
          title="Pulsa aquí si ya no te gusta"
        >
          <icon class="text-red mr-2 xs:mr-4" icon="fas fa-heart" />
          {{ data.likes.length }}
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
          v-if="data.comentarios"
        >{{ data.comentarios + ' ' + (data.comentarios !== 1 ? commentLabels[2] : commentLabels[1]) }}</span>
        <span v-else>{{commentLabels[0]}}</span>
      </a>
    </Grid>

    <template v-if="likeslist.length&&showWhoLiked">
      <p class="mt-14 mb-2 font-bold text-center">Nos gusta este contenido:</p>
      <div class="flex flex-wrap justify-center">
        <Avatar v-for="user of likeslist" :key="user.id" :data="user" class="w-12 h-12 m-1" />
      </div>
    </template>
  </section>
</template>

<script>
export default {
  props: {
    data: {},
    likebutton: {
      type: Boolean, 
      required: false,
      default: true
    },
    commentLabels: {
      type: Array,
      required: false,
      default() { return ['Coméntalo','Comentario','Comentarios'] }
    },
    showWhoLiked: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    likeslist() {
      if (!this.data.likes) return []
      return this.data.likes.slice(0, 16).map(x => x.user)
    },
    // LIKE
    likeit() {
      // console.log('likeit?', this.contenido.likes)
      if(typeof this.data.likes === 'undefined')
        return console.error('Falta poner campo likes en contenido')
      return this.$strapi.user && this.data.likes.find(x => x.user && x.user.id === this.$strapi.user.id)
    }
  }
}
</script>

<style scoped>
.social-buttons {
  font-family: "Arial Narrow", Arial, Tahoma, serif;
}
</style>