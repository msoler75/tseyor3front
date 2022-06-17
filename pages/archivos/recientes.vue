<template>
  <div class="py-5 px-4 sm:px-8 lg:px-10 xl:px-12">
    <h3>Recientes</h3>
    <ListadoCarpetas
      :carpetas="recientes"
      @click="$emit('click', $event)"
      placeholder="Sin actividad reciente"
      :padre="{ ruta: $route.path + '', publishedAt: 1 }"
      @borrada="$emit('borrada', $event)"
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
          carpetasPropietario: {
            populate: populateCarpeta,
          },
        },
        publicationState: "preview",
      });
      let recientes = response.carpetasPropietario
        .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i)
      return { recientes };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
};
</script>
