<template>
  <div class="w-full">
    <div v-if="!carpetas.length" class="flex w-full h-32 text-lg justify-center items-center">
      <span>{{placeholder}}</span>
    </div>
    <Carpeta
      v-else
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
      :borrarDefinitivo="borrarDefinitivo"
      class="w-full lg:text-lg px-2 py-1 md:py-2"
      @dragenter="dragging = false"
      @dragleave="dragging = true"
      @click="$emit('click', {...$event, forzarPadre:padre})"
      @borrada="borrada"
      :padre="padre"
    />
  </div>
</template>

<script>
export default {
  props: {
    carpetas: { type: Array, required: true },
    padre: {},
    borrarDefinitivo:{type: Boolean, required: false, default: false},
    textClass: {},
    subtextClass: {},
    iconClass: { type: String, required: false, default: "text-6xl" },
    boxClass: { type: String, required: false, default: "w-16 mr-3" },
    placeholder:{},
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
  methods: {
    borrada(ruta) {
    const that = this
    setTimeout(()=>{
      const idx = that.carpetas.findIndex(x=>x.ruta===ruta)
      if(idx>=0)
      that.carpetas.splice(idx, 1)
    }, 1500)
  }
  }
};
</script>
