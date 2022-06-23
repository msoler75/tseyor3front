<template>
  <div class="py-5 px-4 sm:px-8 lg:px-10 xl:px-12">
    <h3>Recientes</h3>
    <ExploradorListado
      :carpetas="carpetas"
      :archivos="archivos"
      @click="$emit('click', $event)"
      placeholder="Sin actividad reciente"
      iconholder="history"
      :padre="{ ruta: $route.path + '', publishedAt: 1 }"
      :vista="vista"
      @papelera="$emit('papelera', $event)"
      @copiado="$emit('copiado', $event)"
      @cortado="$emit('cortado', $event)"
    />
  </div>
</template>

<script>
import { populateCarpeta, populateArchivo } from "@/assets/js/carpeta";
export default {
  middleware: ["logged"],
  props: {
    vista: {},
  },
  async asyncData({ $strapi, $error }) {
    try {
      const response = await $strapi.find("users/me", {
        fields: ["id"],
        populate: {
          carpetasVisitadas: {
            populate: populateCarpeta,
            filters: {
              publishedAt: {
                $null: false,
              },
            },
          },
          archivosVisitados: {
            populate: { ...populateArchivo, carpeta: "*" },
            filters: {
              publishedAt: {
                $null: false,
              },
              carpeta: {
                publishedAt: {
                  $null: false,
                },
              },
            },
          },
        },
        publicationState: "preview",
        sort: ["updatedAt"],
      });
      return {
        carpetas: response.carpetasVisitadas,
        archivos: response.archivosVisitados,
      };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
};
</script>
