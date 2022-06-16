<template>
  <span @click.stop="localValue = !localValue" class="inline-flex justify-center items-center">
    <icon v-if="localValue" icon="fas fa-check-square" />
    <icon v-else icon="far fa-square" />
  </span>
</template>

<script>
import vmodel from "~/mixins/vmodel.js";
export default {
  mixins: [vmodel],
};
</script>
