<template>
  <Carpeta
    class="w-full py-5 px-5 sm:px-10 lg:px-14"
    :value="carpeta"
    modoNavegacion="Click"
    @click="$emit('click', $event)"
    :updateBreadcrumb="false"
    :explorando="true"
    :idRootFolder="idRootActual"
    :padre="carpetaPadreActual"
    @borrada="$emit('borrada', $event)"
    @carpeta="$emit('carpeta', $event)"
    :seleccionando="seleccionando"
    @seleccion="$emit('seleccion', $event)"
  />
</template>


<script>
import { populateCarpeta } from "@/assets/js/carpeta";
export default {
  props: {
    idRoot: {},
    idRootActual: { default: 0 },
    carpetaPadreActual: {},
    seleccionando: {type: Boolean, required: false, default: false}
  },
  async asyncData({ route, $strapi, $error }) {
    try {
      const response = await $strapi.find("carpetas", {
        filters: {
          ruta: { $eq: route.path },
        },
        populate: populateCarpeta,
      });
      if (response.error) return $error(response.error.status);
      const carpeta = response.data[0];
      return {
        carpeta: carpeta ? carpeta : route.path,
      };
    } catch (e) {
      console.warn("error", e);
      $error(307);
    }
  }
};
</script>