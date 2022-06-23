<template>
  <div class="w-full">
    <div
      v-if="!carpetasLocal.length && !archivosLocal.length"
      class="
        flex flex-col
        space-y-4
        w-full
        h-32
        text-lg
        justify-center
        items-center
        text-diminished
      "
    >
      <icon v-if="iconholder" :icon="iconholder" class="text-6xl opacity-25" />
      <span>{{ placeholder }}</span>
    </div>
    <list-transition
      group
      :duration="300"
      :isFlexGrid="vista != 'listado'"
      class="w-full"
      :class="vista == 'listado' ? 'block' : 'mygrid'"
      v-else
    >
      <template v-if="carpetasLocal">
        <Carpeta
          ref="carpetas"
          v-for="(carpeta, index) of carpetasLocal"
          :id="'carpeta-' + carpeta.id"
          :key="'carpeta-' + carpeta.id"
          v-model="carpetasLocal[index]"
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
          @click="$emit('click', { ...$event, forzarPadre: padre })"
          @papelera="onPapelera"
          @borrado="onBorrado"
          @copiado="$emit('copiado', $event)"
          @cortado="$emit('cortado', $event)"
          :vista="vista"
          :padre="padre"
        />
      </template>
      <template v-if="archivos">
        <Archivo
          ref="archivos"
          v-for="(archivo, index) of archivosLocal"
          :id="'archivo-' + archivo.id"
          :key="'archivo-' + archivo.id"
          v-model="archivosLocal[index]"
          :boxClass="boxClass"
          :iconClass="iconClass"
          :textClass="textClass"
          :subtextClass="subtextClass"
          :mostrarFecha="mostrarFecha"
          :mostrarTamano="mostrarTamano"
          :mostrarControles="mostrarControles"
          :borrarDefinitivo="borrarDefinitivo"
          @abrir-carpeta="$emit('click', $event)"
          @papelera="onPapelera"
          @borrado="onBorrado"
          @copiado="$emit('copiado', $event)"
          @cortado="$emit('cortado', $event)"
          :vista="vista"
          :padre="padre"
        />
      </template>
    </list-transition>
  </div>
</template>

<script>
export default {
  props: {
    carpetas: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    archivos: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    padre: {},
    vista: {},
    borrarDefinitivo: { type: Boolean, required: false, default: false },
    textClass: {},
    subtextClass: {},
    iconClass: { type: String, required: false, default: "" },
    boxClass: { type: String, required: false, default: "" },
    placeholder: {
      type: String,
      required: false,
      default: "No hay nada que mostrar",
    },
    iconholder: { type: String, required: false, default: "" },
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
      urlPapelera: this.$config.archivosRuta + "/papelera",
      carpetasLocal: [...this.carpetas],
      archivosLocal: [...this.archivos],
    };
  },
  watch: {
    carpetas(newValue) {
      this.carpetasLocal = [...newValue];
    },
    archivos(newValue) {
      this.archivosLocal = [...newValue];
    },
  },
  methods: {
    onBorrado(elem){
      this.quitarElem(elem, 0)
    },
    onPapelera(elem) {
      if (this.$route.path != this.urlPapelera)
        this.quitarElem(elem, 1500, true)      
    },
    quitarElem(elem, tiempo, papelera) {
      const that = this
      setTimeout(() => {
        if (elem.carpeta) {
          that.carpetasLocal = that.carpetasLocal.filter(
            (x) => !x.ruta.startsWith(elem.carpeta.ruta)
          );
          that.archivosLocal = that.archivosLocal.filter(
            (x) => !x.carpeta.ruta.startsWith(elem.carpeta.ruta)
          );
        } else {
          that.archivosLocal = that.archivosLocal.filter(
            (x) => x.id !== elem.archivo.id
          );
        }
        that.$emit(papelera?"papelera":"borrado", elem);
      }, tiempo);
    }
  },
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