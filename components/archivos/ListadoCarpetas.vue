<template>
  <div class="w-full">
    <Carpeta
      v-for="(carpeta, index) of carpetas"
      :id="'carpeta-' + carpeta.id"
      :key="'carpeta-' + carpeta.id"
      v-model="carpetas[index]"
      :boxClass="boxClass"
      :iconClass="'text-6xl ' + iconClass"
      :textClass="textClass"
      :subtextClass="subtextClass"
      :mostrarFecha="mostrarFecha"
      :mostrarTamano="mostrarTamano"
      :mostrarControles="mostrarControles"
      class="w-full lg:text-lg px-2 py-1 md:py-2"
      @dragenter="dragging = false"
      @dragleave="dragging = true"
      @click="$emit('click', $event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    carpetas: { type: Array, required: true },
    textClass: {},
    subtextClass: {},
    iconClass: { type: String, required: false, default: "text-6xl" },
    boxClass: { type: String, required: false, default: "w-16 mr-3" },
    mostrarTitulo: { default: true },
    mostrarControles: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarArchivos: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarTamano: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarFecha: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>
