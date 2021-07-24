<template>
  <div v-html="hello"></div>
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