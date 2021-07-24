<template>
<div>
  <nuxt-img src="sello-utg.jpg"/>
  <div v-html="hello"></div>
</div>
</template>

<script>
  import hello from '@/content/presentacion.md'

  export default {
    computed: {
      hello() {
        return hello
      }
    }
  }
</script>