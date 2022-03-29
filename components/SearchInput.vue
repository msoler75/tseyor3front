<template>
   <div class="relative flex w-full items-stretch">
  <span class="z-10 h-full leading-snug font-normal absolute text-center text-blue-300 bg-transparent items-center justify-center w-8 pl-3 py-3">
    <icon icon="search"/>
  </span>
  <input type="search" @search="$emit('search')" v-model="localValue" :placeholder="placeholder" :required="required" class="search-input !bg-gray-100 px-3 py-3 w-full"/>
</div>
</template>

<script>
// custom.vmodel.mixin.js
export default {
  props: {
    value : { type: String, required: true},
    placeholder: {
        type: String, required: false, default: 'Buscar...'
    },
    required: {type: Boolean, required: false, default: true}
  },
  data() {
    return {
      localValue: this.value,
    };
  },
  watch: {
    localValue (value) {
      this.$emit('input', value)
    },
    value (v) {
      this.localValue = v
    }
  }
}
</script>

<style scoped>
input[type=search]:not(class*='text-') {
  @apply text-sm;
}
</style>