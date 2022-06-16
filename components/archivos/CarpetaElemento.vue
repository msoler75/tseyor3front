<template>
  <component
    :is="tag"
    class="elem-grid grid gap-x-4 gap-y-1"
    :vista="vista"
    :seleccionando="seleccionando"
    :class="
      (vista == 'listado'
        ? 'flex-row'
        : 'flex-col justify-center items-center') +
      ' ' +
      (!publishedAt || uploading ? 'pointer-events-none' : '') +
      (seleccionando && seleccionado ? ' !bg-yellow-200' : '') +
      (seleccionando ? ' pointer-events-auto cursor-pointer' : '')
    "
    @click="seleccionar"
  >
    <Check      
      v-model="seleccionado"
      class="w-8"
      :class="seleccionando && checkable ? '' : 'opacity-0 pointer-events-none'"
    />

    <div
      class="flex flex-shrink-0 justify-center items-center"
      :class="boxClass"
    >
      <slot name="icon" />
    </div>

    <div
      :title="nombre"
      class="              
        max-w-full
        overflow-hidden overflow-ellipsis
        whitespace-nowrap
        font-bold
        text-gray-dark-900
        dark:text-gray-50
      "
      :class="
      vista=='listado'?'w-40 xm:w-48 lg:w-64 ':'text-center ' + 
        textClass + (publishedAt ? ' cursor-pointer' : ' pointer-events-none')
      "
    >
      {{ nombre }}
    </div>

    <div
      class="flex w-full justify-start text-xs text-diminished"
      :class="
        (vista == 'listado' ? '' : 'text-center scale-75') + ' ' + subtextClass
      "
    >
      <slot v-if="mostrarDescripcion" name="description"
      :class="vista=='listado'?'':'text-center'">
        {{ descripcion }}
      </slot>
    </div>

    <span      
      class="inline-block cursor-pointer text-gray text-xl w-5 h-5 group"
      :class="!seleccionando ? '' : 'opacity-0 pointer-events-none'"
      @click="onControls"
    >
      <Loader
        v-if="procesando"
        class="flex flex-shrink-0 self-center"
      />
      <span v-else-if="mostrarControles && !uploading" class="opacity-75 group-hover:opacity-100">
        {{ vista == "listado" ? "&vellip;" : "&hellip;" }}
      </span>
      <span v-else>&nbsp;</span>

      
    </span>


    <slot/>

  </component>
</template>

<script>
export default {
  props: {
    tag: { type: String, required: false, default: "div" },
    vista: { type: String, required: false, default: "listado" },
    seleccionando: { type: Boolean, required: false, default: false },
    iconClass: { type: String, required: false, default: "" },
    boxClass: { type: String, required: false, default: "" },
    textClass: {},
    subtextClass: {},
    mostrarTitulo: { default: true },
    mostrarControles: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarTamano: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarUploader: {},
    mostrarFecha: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarDescripcion: { type: Boolean, required: false, default: true },
    // estados:
    uploading: {},
    publishedAt: {},
    checkable: { type: Boolean, required: false, default: true },
    procesando: {},
    // datos:
    nombre: {},
    descripcion: {},
  },
  data() {
    return {
      seleccionado: false,
    };
  },
  watch: {
    seleccionado(newValue) {
      if (newValue) this.$emit("seleccionado");
      else this.$emit("deseleccionado");
    },
  },
  methods: {
    seleccionar() {
      if (this.seleccionando &&this.publishedAt)
        this.seleccionado = !this.seleccionado;
    },
    onControls(ev) {
        if(!this.procesando&&!this.uploading)
        this.$emit('propiedades', ev)
    }
  },
};
</script>

<style scoped>
.elem-grid[vista="listado"] {
  grid-template-columns: 0 72px 1fr 16px;
  grid-template-rows: 1.1fr .9fr;
}

[seleccionando='true'] .elem-grid[vista="listado"] { 
    grid-template-columns: 30px 72px 1fr 0;
}

.elem-grid[vista="listado"] > *:nth-child(1), 
.elem-grid[vista="listado"] > *:nth-child(2),
.elem-grid[vista="listado"] > *:nth-child(5) {
  grid-row: span 2;
}

.elem-grid[vista="listado"] > *:nth-child(4) {
  order: 5;
}

.elem-grid[vista="miniaturas"] {
  /*display: flex;
  flex-direction: column;
  align-items: center;*/
  grid-template-columns: 1fr;
  grid-template-rows: 0 120px 1fr 1fr 12px;
}
</style>