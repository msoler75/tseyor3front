<template>
  <div class="py-5 px-4 sm:px-8 lg:px-10 xl:px-12">
    <h3>Mis carpetas</h3>
    <ListadoCarpetas
      :carpetas="misArchivos"
      @click="$emit('click', $event)"
      placeholder="No tienes ninguna carpeta"
      :padre="{ ruta: $route.path+'', publishedAt: 1 }"
      :vista="vista"      
    />

    <divider />

    <h3>Mis archivos</h3>
    <!-- <ListadoCarpetas
      :carpetas="misArchivos"
      @click="$emit('click', $event)"
      placeholder="No tienes ninguna carpeta"
      :padre="{ ruta: $route.path+'', publishedAt: 1 }"
    />
    -->

  </div>
</template>

<script>
import {populateCarpeta} from '@/assets/js/carpeta'
export default {
  middleware: ["logged"],
  props: {
    vista: {}
  },  
  async asyncData({ $strapi, $error }) {
    try {
      const response = await $strapi.find("users/me", {
        fields: ["id"],
        populate: {
          carpeta: {
            populate: populateCarpeta,
          },
          carpetasPropietario: {
            populate: populateCarpeta,
            publicationState: "preview",            
          },
        },
      });
      let misArchivos = [];
      if (response.carpeta) misArchivos.push(response.carpeta);
      misArchivos = misArchivos
        .concat(response.carpetasPropietario)
        .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i)
        .filter((x) => x.publishedAt);
      return { misArchivos };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
};
</script>
