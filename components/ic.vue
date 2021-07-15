<template>
    <i v-if="icon.startsWith('fa')" :class="icon" />
    <component
        v-else-if="icon.startsWith('svg')"
        :is="svgIcon"
    />
</template>

<script >
export default {
  name: 'DynamicIcon',
  props: {
    icon: { type: String, required: false, default: null }
  },
  computed: {
    svgIcon () {
      this.icon // NOTE THIS IS THE REFERENCE(it's enough to trigger props change)
      const file = this.icon.replace(/^svg\s+/, '')
      const svgfile = `~/assets/svg/icons/${file}.svg`
      console.warn(svgfile)
      // ~
      const r = import(svgfile)
      r.then(x => { console.warn(x) })

      return null
      return () => import(
        /* webpackChunkName: "icons" */
        /* webpackMode: "lazy-once" */
        `./../assets/svg/icons/${file}.svg`
      )
    }
  }
}
</script>
