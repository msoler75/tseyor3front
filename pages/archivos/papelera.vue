<template>
  <div class="py-5 px-4 sm:px-8 lg:px-10 xl:px-12">
    <h3>Papelera</h3>
    <ListadoCarpetas
      :carpetas="papelera"
      @click="$emit('click', $event)"
      placeholder="Tu papelera está vacía"
      :padre="{ ruta: $route.path + '', publishedAt: 1 }"
      :borrarDefinitivo="true"
      :vista="vista"
      @borrada="$emit('borrada', $event)"
    />
  </div>
</template>

<script>
import { populateCarpeta } from "@/assets/js/carpeta";
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
          carpetasPropietario: {
            populate: populateCarpeta,
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
