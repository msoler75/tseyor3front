<template>
  <nuxt-link v-if="href" :to="href" class="nlink inline-block mx-auto"
  :class="compact?'compact':'normal'">
    <Icon v-if="icon" :icon="icon" class="mr-2"/><slot />
  </nuxt-link>
  <div v-else class="bg-error">
    <icon icon="exclamation" /> <span>Enlace Incorrecto</span>
  </div>
</template>

<script>
export default {
  props: {
    to: {
      validator (v) {
        return v === null || typeof v === 'string' || typeof v === 'object'
      },
      required: false,
      default: ''
    },
    icon: {
      type: String, required: false, default: ''
    },
    compact: {
      type: Boolean, required: false, default: false
    }
  },
  computed: {
    href () {
      if(this.to === null) return ''
      return typeof this.to === 'object'? `/${this.to.clase}/${this.to.id}` : this.to
    }
  }
}
</script>

<style scoped>
a.nlink:not([class*=btn]):not([class*=whitespace]) {
  @apply whitespace-nowrap;
}
a.nlink.btn {
  width: fit-content;
   }
a.normal.btn {
  min-width: 12rem;
}
</style>
