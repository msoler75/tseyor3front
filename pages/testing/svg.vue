<template>
<div>
<h1>Test SVG</h1>
<div class="w-9" v-html="iconUfo" />
</div>
</template>

<script>
import ufo from '~/assets/svg/icons/ufo.svg?raw'
export default {
  data () {
    return {
      ufo
    }
  }
}
</script>
