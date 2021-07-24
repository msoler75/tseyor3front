<template>
  <div v-if="svg || icon.startsWith('svg')" class="svg-container inline-block" v-html="getSvg(icon)" />
  <fa v-else-if="icon && farotate && !faflip" :icon="faicon" :rotation="farotate" :spin="faspin"/>
  <fa v-else-if="icon && !farotate && faflip " :icon="faicon" :flip="faflip" :spin="faspin"/>
  <fa v-else-if="icon && farotate && faflip" :icon="faicon" :rotation="farotate" :flip="faflip" :spin="faspin"/>
  <fa v-else-if="icon" :icon="faicon" :spin="faspin"/>
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
  computed: {
    facleanicon() {
      return this.icon.replace(/fa-(rotate|flip|spin|pulse)-?.*/g, '').replace(/\s+/g, ' ')
    },
    faicon () {
      const words = this.facleanicon.split(/\s+/)
      const family = words.length>=2?words[0]:'fas'
      const icon = words.length>=2?words[1]:words[0] || ''
      return [family, icon.replace(/^fa\-?/,'')]
    },
    farotate () {
      const matches = this.icon.match(/fa-rotate-(\d+)/)
      return matches&&matches.length>1?parseInt(matches[1]) || 0:0
    },
    faflip () {
      const matches = this.icon.match(/fa-flip-(\w+)/)
      return matches&&matches.length>1?matches[1]:''
    },
    faspin() {
      return !!this.icon.match(/fa-spin/)
    },
    fapulse() {
      return !!this.icon.match(/fa-pulse/)
    }
  }
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