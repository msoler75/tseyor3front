<template>
  <div class="py-5 px-5 sm:px-10 lg:px-14">
    <h3>Papelera</h3>
    <ListadoCarpetas
      :carpetas="papelera"
      @click="$emit('click', $event)"
      placeholder="No tienes ninguna carpeta"
      :padre="{ ruta: $route.path + '', publishedAt: 1 }"
      :borrarDefinitivo="true"
    />
  </div>
</template>

<script>
import { populateCarpetaPermisos } from "@/assets/js/carpeta";
export default {
  middleware: ["logged"],
  async asyncData({ $strapi, $error }) {
    try {
      const response = await $strapi.find("users/me", {
        fields: ["id"],
        populate: {
          carpetasPropietario: {
            populate: populateCarpetaPermisos,
            filters: {
              publishedAt: {
              $null: true,
            },
            },
           // publicationState: "preview",
          },
        },
      });
      let papelera = response.carpetasPropietario
      return { papelera };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
};
</script>
