<template>
  <div class="py-5 px-5 sm:px-10 lg:px-14">
    <h3>Mis carpetas</h3>
    <ListadoCarpetas
      :carpetas="misCarpetas"
      @click="$emit('click', $event)"
      placeholder="No tienes ninguna carpeta"
      :padre="{ ruta: $route.path+'', publishedAt: 1 }"
    />
  </div>
</template>

<script>
import {populateCarpeta} from '@/assets/js/carpeta'
export default {
  middleware: ["logged"],
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
      let misCarpetas = [];
      if (response.carpeta) misCarpetas.push(response.carpeta);
      misCarpetas = misCarpetas
        .concat(response.carpetasPropietario)
        .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i)
        .filter((x) => x.publishedAt);
      return { misCarpetas };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
};
</script>
