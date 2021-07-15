<template>
   <div class="relative flex w-full items-stretch mb-4">
  <span class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
    <i class="fas fa-search"></i>
  </span>
  <input type="search" v-model="localValue" :placeholder="placeholder" class="search-input px-3 py-3 placeholder-blueGray-300 ring-blue-400 dark:ring-orange-800 text-gray focus:text-gray-dark-800 bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full pl-10"/>
</div>
</template>

<script>
// custom.vmodel.mixin.js
export default {
  props: {
    value : { type: String, required: true},
    placeholder: {
        type: String, required: false, default: 'Buscar...'
    }
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