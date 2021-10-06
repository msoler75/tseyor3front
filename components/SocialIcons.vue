<template>
  <div v-if="horizontal" class="flex">
    <div title="Ver a quién le gustó" v-scroll-to="'#social'">
      <icon class="ml-5" icon="far fa-heart" /> {{ content.likes.length }}
    </div>
    <a title="Ver comentarios"
        class="ml-5" href="#comentarios" v-scroll-to="'#comentarios'">
      <icon icon="far fa-comment" /> {{ content.comentarios }}
    </a>
    <div
      title="Compartir en redes sociales"
      class="ml-5 cursor-pointer"
      @click="$emit('share')"
    >
      <icon icon="fas fa-share-alt" />
    </div>
    <a
      class="ml-5 cursor-pointer"
      href="#suscription"
      v-scroll-to="'#suscription'"
      title="Recibir en tu correo"
    >
      <icon class="5xl:w-4" icon="far fa-bell" />
    </a>
  </div>
  <aside v-else class="flex flex-col">
    <div title="Ver a quién le gustó" class="my-3 cursor-pointer" v-scroll-to="'#social'">
      <icon class="5xl:w-4" icon="far fa-heart" />
      {{ content.likes.length }}
    </div>
    <a title="Ver comentarios"
        class="my-3" href="#comentarios" v-scroll-to="'#comentarios'">
      <icon class="5xl:w-4" icon="far fa-comment" />
      {{ content.comentarios }}</a
    >
    <a
      title="Compartir en redes sociales"
      class="cursor-pointer my-3"
      @click="$emit('share')"
    >
      <icon class="5xl:w-4" icon="fas fa-share-alt" />
    </a>
    <a
      class="my-3"
      href="#suscription"
      v-scroll-to="'#suscription'"
      title="Recibir en tu correo"
    >
      <icon class="5xl:w-4" icon="far fa-bell" />
    </a>
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
    }
  }
}
</script>
