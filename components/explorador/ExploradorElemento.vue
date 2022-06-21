<template>
  <component
    :is="tag"
    class="elem-grid grid gap-x-1 xs:gap-x-2 xm:gap-x-4 gap-y-1
                lg:text-lg
                px-0
                xm:px-2
                py-2
                rounded-lg
                hover:bg-gray-100
                dark:hover:bg-gray-900
    "
    :vista="vista"
    :seleccionando="seleccionando"
    :class="
      (vista == 'listado'
        ? 'flex-row'
        : 'flex-col justify-center items-center') +
      (!publishedAt || procesando ? ' pointer-events-none' : 
      seleccionando && seleccionado ? ' !bg-yellow-100 dark:!bg-brown-700' : 
      seleccionando ? ' pointer-events-auto' : 
      ' cursor-pointer' )
    "
    @click="seleccionar"
  >
    <Check      
      v-model="seleccionado"
      class=""
      :class="seleccionando && checkable ? 'w-8' : 'opacity-0 pointer-events-none'"
    />

    <div
      class="flex flex-shrink-0 justify-center items-center max-h-[120px] overflow-hidden"
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
      vista=='listado'?'text-base zw-40 zxm:w-48 zlg:w-64 ':'text-sm text-center ' + 
        textClass + (publishedAt ? ' cursor-pointer' : ' pointer-events-none')
      "
    >
      {{ nombre }}
    </div>

    <div
      class="flex w-full text-xs text-diminished whitespace-nowrap"
      :class="
        (vista == 'listado' ? ' justify-start' : 'justify-center text-center scale-75') + ' ' + subtextClass
      "
    >
      <slot v-if="mostrarDescripcion" name="description"
      :class="vista=='listado'?'':'text-center'">
        {{ descripcion }}
      </slot>
    </div>

    <EllipBtnLoader
    :class="vista=='listado'?'':'mx-auto'"
            :vertical="vista=='listado'"
            :loader="procesando"
            :controls="mostrarControles&&!seleccionando"
            @click.stop.prevent="$emit('opciones', $event)"            
          />


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
    textClass: { type: String, required: false, default: "" },
    subtextClass: { type: String, required: false, default: "" },
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
    seleccionar(ev) {
      if (this.seleccionando) 
      {
        if(this.publishedAt && this.checkable)
        this.seleccionado = !this.seleccionado
      }
      else
        this.$emit('click', ev)
    },
    reset(){
      this.seleccionado = false
    }
  },
};
</script>

<style scoped>
.elem-grid[vista="listado"] {
  grid-template-columns: 0 72px 1fr 30px;
  grid-template-rows: 1.1fr .9fr;
}

.elem-grid[seleccionando='true'][vista="listado"] { 
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
  grid-template-columns: 1fr;
  grid-template-rows: 0 120px 1fr .8fr 20px;
}

.elem-grid[seleccionando='true'][vista="miniaturas"] { 
    grid-template-rows: 30px 120px 1fr .8fr 0;
}


</style>