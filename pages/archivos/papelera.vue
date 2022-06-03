<template>
  <div class="py-5 px-5 sm:px-10 lg:px-14">
    <h3>Papelera</h3>
    <ListadoCarpetas
      :carpetas="papelera"
      @click="$emit('click', $event)"
      placeholder="No tienes ninguna carpeta"
      :padre="{ ruta: $route.path + '', publishedAt: 1 }"
    />
  </div>
</template>

<script>
import {populateCarpetaPermisos} from '@/assets/js/carpeta'
export default {
  middleware: ["logged"],
  async asyncData({ $strapi, $error }) {
    try {
      const response = await $strapi.find("users/me", {
        fields: ["id"],
        filters: {
          publishedAt: {
            $null: true,
          },
        },
        populate: {
          carpetasCreadas: {
            populate: populateCarpetaPermisos,
          },
        },
        publicationState: "preview",
      });
      let papelera = response.carpetasCreadas
        .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i)
      return { papelera };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
};
</script>
