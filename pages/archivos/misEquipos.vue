<template>
  <div class="py-5 px-4 sm:px-8 lg:px-10 xl:px-12">
    <div v-if="equiposFiltrados.length">
      <div v-for="equipo of equiposFiltrados" :key="equipo.id">
        <h4 class="px-2">{{ equipo.nombre }}</h4>
        <ExploradorListado
          v-if="equipo.carpetas.length"
          :carpetas="equipo.carpetas"
          @click="$emit('click', $event)"
          :padre="{ ruta: $route.path + '', publishedAt: 1 }"
          :vista="vista"
          @papelera="$emit('papelera', $event)"
          @copiado="$emit('copiado', $event)"
          @cortado="$emit('cortado', $event)"        
        />
      </div>
    </div>
    <div v-else>
      <ExploradorListado :carpetas="[]" placeholder="No hay nada que mostrar" />
    </div>
  </div>
</template>

<script>
import {populateCarpeta} from '@/assets/js/carpeta'
export default {
  middleware: ["logged"],
  props: {
    vista: {}
  },
  async asyncData({ $strapi, $config, $error }) {
    try {
      const response = await $strapi.find("users/me", {
        fields: ["id"],
        populate: {
          equipos: {
            populate: {
              carpeta: { populate: populateCarpeta },
              carpetasLectura: {
                populate: populateCarpeta,
              },
              carpetasEscritura: {
                populate: populateCarpeta,
              },
            },
          },
        },
      });
      const equipos = response.equipos.map((e) => {
        e.carpetas = [];
        if (e.carpeta) e.carpetas.push(e.carpeta);
        e.carpetas = e.carpetas
          .concat(e.carpetasLectura)
          .concat(e.carpetasEscritura)
          .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i);
        return e;
      });
      return { equipos };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
  computed: {
    equiposFiltrados() {
      return this.equipos.filter((x) => x.carpetas.length);
    },
    numElements() {
      return this.equiposFiltrados.length
    }
  },
};
</script>
