<template>
  <i v-if="icon && icon.startsWith('fa')" 
  :class="icon" />
  <div v-else-if="icon || svg" class="svg-container inline-block" v-html="getSvg(icon)" />
</template>

<script>
export default {
  props: {
    icon: { type: String, required: false, default: null },
    svg: { type: String, required: false, default: null}
  },
  methods: {
    getSvg(str) {
      if(this.svg) return this.svg
      str = str.replace(/^svg\s+/, "");
      return this.$store.state.svgIcons[str];
    },
  },
};
</script>

<style scoped>
.svg-container >>> svg {
   fill: currentColor;
    stroke: currentColor;
}
.text-xl .svg-container {
  @apply w-6;
}
.text-2xl .svg-container {
  @apply w-8;
}
.text-3xl .svg-container {
  @apply w-10;
}
.text-4xl .svg-container {
  @apply w-10;
}
.text-5xl .svg-container {
  @apply w-14;
}
.text-6xl .svg-container {
  @apply w-16;
}
.text-7xl .svg-container {
  @apply w-20;
}
.text-8xl .svg-container {
  @apply w-24;
}
</style>