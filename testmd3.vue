<template>
  <div v-html="$md.render(model)"></div>
</template>

<script>
export default {
  data() {
    return {
      model: '# Hello World!'
    }
  }
}
</script>