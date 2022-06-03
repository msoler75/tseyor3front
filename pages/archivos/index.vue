<template>
    <Carpeta
      class="w-full h-full py-5 px-5 sm:px-10 lg:px-14"
      :value="idCarpetaActual"
      modoNavegacion="Click"
      @click="$emit('click', $event)"
      :updateBreadcrumb="false"
      :explorando="true"
      :idRootFolder="idRootActual"
      :padre="carpetaPadreActual"
    />
</template>


<script>
import {populateCarpeta} from '@/assets/js/carpeta'
export default {
  props: {
    idRoot: {},
    idRootActual: { default: 0 },
    carpetaPadreActual: {},
  },
  async asyncData({ route, $strapi, $config, $error }) {
    try {
      const {
        data: [carpeta],
      } = await $strapi.find("carpetas", {
        filters: {
          ruta: { $eq: route.path },
        },
        populate: populateCarpeta
      });
      return {
        idCarpetaActual: carpeta ? carpeta : route.path,
      };
    } catch (e) {
      console.warn(e);
      $error(503);
    }
  }
};
</script>