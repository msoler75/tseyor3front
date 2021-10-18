<template>
  <div v-if="horizontal" class="flex">
    <div v-if="likes" title="Ver a quién le gustó" class="cursor-pointer" v-scroll-to="'#social'">
      <icon class="ml-5" icon="far fa-heart" /> {{ content.likes?content.likes.length:0 }}
    </div>
    <div title="Ver comentarios"
        class="ml-5 cursor-pointer" href="#comentarios" v-scroll-to="'#comentarios'">
      <icon icon="far fa-comment" /> {{ content.comentarios }}
    </div>
    <div
      title="Compartir en redes sociales"
      class="ml-5 cursor-pointer"
      @click="$emit('share')"
    >
      <icon icon="fas fa-share-alt" />
    </div>
    <div
      class="ml-5 cursor-pointer"
      v-scroll-to="'#suscription'"
      title="Recibir en tu correo"
    >
      <icon class="5xl:w-4" icon="far fa-bell" />
    </div>
  </div>
  <aside v-else class="flex flex-col">
    <div v-if="likes" title="Ver a quién le gustó" class="my-3 cursor-pointer" v-scroll-to="'#social'">
      <icon class="5xl:w-4" icon="far fa-heart" />
      {{ content.likes?content.likes.length:0 }}
    </div>
    <div title="Ver comentarios"
        class="my-3 cursor-pointer" href="#comentarios" v-scroll-to="'#comentarios'">
      <icon class="5xl:w-4" icon="far fa-comment" />
      {{ content.comentarios }}
    </div>
    <div
      title="Compartir en redes sociales"
      class="cursor-pointer my-3"
      @click="$emit('share')"
    >
      <icon class="5xl:w-4" icon="fas fa-share-alt" />
    </div>
    <div
      class="my-3 cursor-pointer"
      href="#suscription"
      v-scroll-to="'#suscription'"
      title="Recibir en tu correo"
    >
      <icon class="5xl:w-4" icon="far fa-bell" />
    </div>
  </aside>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    horizontal: {
      type: Boolean,
      required: false,
      default: false
    },
    likes: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>
