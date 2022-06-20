<template>
  <div class="w-full">
    <div
      v-if="!carpetasLocal.length&&!archivosLocal.length"
      class="flex w-full h-32 text-lg justify-center items-center"
    >
      <span>{{ placeholder }}</span>
    </div>
    <list-transition group :duration="300"
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
        @click="$emit('click', { ...$event, forzarPadre: padre })"
        @papelera="onPapelera"
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
        v-model="archivos[index]"
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
    carpetas: { type: Array, required: false, default() { return []} },
    archivos: { type: Array, required: false, default() { return []} },
    padre: {},
    vista: {},
    borrarDefinitivo: { type: Boolean, required: false, default: false },
    textClass: {},
    subtextClass: {},
    iconClass: { type: String, required: false, default: "" },
    boxClass: { type: String, required: false, default: "" },
    placeholder: {type: String, required: false, default: "No hay nada que mostrar"},
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
      archivosLocal: [...this.archivos]
    };
  },
  watch: {
    carpetas(newValue)
    {
      this.carpetasLocal = [...newValue]
    },
    archivos(newValue)
    {
      this.archivosLocal = [...newValue]
    }
  },
  methods: {
    onPapelera(elem) {
      this.$emit("papelera", elem);
      const that = this;
      if (elem.carpeta) {
        // caso excepcional
        if (this.$route.path == this.urlPapelera) return;
        setTimeout(() => {
          const idx = that.carpetasLocal.findIndex((x) => x.id === elem.carpeta.id);
          if (idx >= 0) that.carpetasLocal.splice(idx, 1);
        }, 1500);
      } else {
        setTimeout(() => {
          const idx = that.archivosLocal.findIndex((x) => x.id === elem.archivo.id);
          if (idx >= 0) that.archivosLocal.splice(idx, 1);
        }, 1500);
      }
    },
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