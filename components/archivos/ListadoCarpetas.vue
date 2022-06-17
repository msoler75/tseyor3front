<template>
  <div class="w-full">
    <div v-if="!carpetas.length" class="flex w-full h-32 text-lg justify-center items-center">
      <span>{{placeholder}}</span>
    </div>
    <div 
      class="w-full"
          :class="vista == 'listado' ? 'flex flex-col' : 'mygrid'"
      v-else
    >
    <Carpeta
      v-for="(carpeta, index) of carpetas"
      :id="'carpeta-' + carpeta.id"
      :key="'carpeta-' + carpeta.id"
      v-model="carpetas[index]"
      :boxClass="boxClass"
      :iconClass="iconClass"
      :textClass="textClass"
      :subtextClass="subtextClass"
      :mostrarFecha="mostrarFecha"
      :mostrarTamano="mostrarTamano"
      :mostrarControles="mostrarControles"
      :borrarDefinitivo="borrarDefinitivo"      
      @dragenter="dragging = false"
      @dragleave="dragging = true"
      @click="$emit('click', {...$event, forzarPadre:padre})"
      @borrada="borrada"
      :vista="vista"
      :padre="padre"
    />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    carpetas: { type: Array, required: true },
    padre: {},
    vista:{},
    borrarDefinitivo:{type: Boolean, required: false, default: false},
    textClass: {},
    subtextClass: {},
    iconClass: { type: String, required: false, default: "" },
    boxClass: { type: String, required: false, default: "" },
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
  data() {
    return {
      urlPapelera: this.$config.archivosRuta + "/papelera"
    }
  },
  methods: {
    borrada(ruta) {
      console.warn('ListadoCarpetas.borrada', ruta)
      this.$emit('borrada', ruta)
    // caso excepcional
    if (this.$route.path == this.urlPapelera) return;
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

<style scoped>
.mygrid {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-columns: minmax(150px, 200px);
  grid-auto-rows: minmax(200px, 210px);
  grid-auto-flow: dense;
  place-items: stretch stretch;
}
</style>