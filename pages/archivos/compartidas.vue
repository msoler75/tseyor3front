<template>
  <div class="py-5 px-5 sm:px-10 lg:px-14">
    <h3>Compartidas para ti</h3>
    <ListadoCarpetas
      @click="$emit('click', $event)"
      :carpetas="compartidasContigo"
      placeholder="Ninguna carpeta compartida"
      :padre="{ ruta: $route.path + '', publishedAt: 1 }"
    />

    <divider />

    <h3>Compartes con los demás</h3>
    <ListadoCarpetas
      @click="$emit('click', $event)"
      :carpetas="carpetasQueCompartes"
      placeholder="Ninguna carpeta compartida"
      :padre="{ ruta: $route.path + '', publishedAt: 1 }"
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
          carpetasLectura: {
            populate: populateCarpeta,
          },
          carpetasEscritura: {
            populate: populateCarpeta,
          },
          carpetasPropietario: {
            populate: populateCarpeta,
            publicationState: "preview",
          },
        },
      });

      const carpetasQueCompartes = response.carpetasPropietario
        .filter((x) => x.publishedAt)
        .filter(
          (x) =>
            x.lecturaAcceso != "Nadie" ||
            x.escrituraAcceso != "Nadie" ||
            x.lecturaUsuarios.length ||
            x.escrituraUsuarios.length ||
            x.lecturaGrupos.length ||
            x.escrituraGrupos.length ||
            x.lecturaEquipos.length ||
            x.escrituraEquipos.length ||
            x.administracionUsuarios.length
        );

      let compartidasContigo = response.carpetasLectura
        .concat(response.carpetasEscritura)
        .filter((x) => x.publishedAt)
        .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i)
        .filter((x) => !carpetasQueCompartes.find((z) => z.id == x.id));

      return { carpetasQueCompartes, compartidasContigo };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
};
</script>
