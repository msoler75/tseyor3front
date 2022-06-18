<template>
  <span class="flex flex-wrap">
    <span
      v-for="(item, index) of localValue"
      :key="index"
      class="elem flex items-center space-x-2 m-1"
      >
      <span>{{ item.titulo || item.nombre || item.nombreSimbolico || item.username }}</span>
      <span
        v-if="administracion"
        @click="borrar(index)"
      >
      <icon
        icon="times"
        class="opacity-50 hover:opacity-100 cursor-pointer"
      />
      </span>
    </span>
  </span>
</template>

<script>
import vmodel from "~/mixins/vmodel.js";
export default {
  mixins: [vmodel],
  props: {
    administracion: { type: Boolean, required: false, default: false },
  },
  methods: {
    borrar(index) {
      this.localValue.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.elem {
  @apply px-2 rounded bg-gray-100 dark:bg-gray-900 text-sm text-gray-dark-700 dark:text-gray-300 whitespace-nowrap;
}
</style>