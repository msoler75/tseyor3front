<template>
  <Carpeta
    ref="carpeta"
    class="w-full flex-grow py-5 px-4 sm:px-8 lg:px-10 xl:px-12"
    :value="carpeta"
    modoNavegacion="Click"
    @click="$emit('click', $event)"
    :updateBreadcrumb="false"
    :explorando="true"
    :idRootFolder="idRootActual"
    :padre="carpetaPadreActual"
    @papelera="$emit('papelera', $event)"
    @carpeta="$emit('carpeta', $event)"
    :seleccionando="seleccionando"
    @seleccion="$emit('seleccion', $event)"
    @copiado="$emit('copiado', $event)"
    @cortado="$emit('cortado', $event)"
    :vista="vista"
    :mostrarArchivos="mostrarArchivos"
    :seleccionandoCarpeta="seleccionandoCarpeta"
  />
</template>


<script>
import { populateCarpeta } from "@/assets/js/carpeta";
export default {
  props: {
    idRoot: {},
    idRootActual: { default: 0 },
    carpetaPadreActual: {},
    seleccionando: { type: Boolean, required: false, default: false },
    seleccionandoCarpeta: { type: Boolean, required: false, default: false },
    vista: { type: String, required: false, default: "listado" },
    mostrarArchivos: {},
  },
  async asyncData({ route, store, $strapi, $error }) {
    try {
      console.warn("async data _.vue");
      let carpeta = store.state.carpeta;
      if (!carpeta || typeof carpeta != "object") {
        const response = await $strapi.find("carpetas", {
          filters: {
            ruta: { $eq: route.path },
          },
          populate: populateCarpeta,
        });
        console.warn('BG', JSON.stringify(response))
        if (response.error) return $error(response.error.status);
        carpeta = response.data[0];
        if(carpeta)
        // la carpeta padre de las subcarpetas es la propia carpeta
            for(const sc of carpeta.subcarpetas)
              sc.padre = {...carpeta}
      }
      else 
      carpeta.actualizar = true
      return {
        carpeta: carpeta ? carpeta : route.path,
      };
    } catch (e) {
      console.warn("error", e);
      $error(307);
    }
  },
  computed: {
    numElements() {
      return this.carpeta
        ? (this.carpeta.subcarpetas ? this.carpeta.subcarpetas.length : 0) +
            (this.carpeta.archivos ? this.carpeta.archivos.length : 0)
        : 0;
    },
  },
};
</script>