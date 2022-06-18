<template>
  <div
    class="vistaArchivos w-full h-full"
    :class="loading ? 'flex max-h-[70vh] justify-center' : ''"
  >
    <div v-if="loading">Cargando...</div>
    <slot v-else />
  </div>
</template>

<script>
export default {
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
  },
};
</script>