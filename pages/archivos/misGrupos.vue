<template>
  <div class="py-5 px-4 sm:px-8 lg:px-10 xl:px-12">
    <div v-if="gruposFiltrados.length">
      <div v-for="grupo of gruposFiltrados" :key="grupo.id">
        <h4 class="px-2">{{ grupo.nombre }}</h4>
        <ExploradorListado
          v-if="grupo.carpetas.length"
          :carpetas="grupo.carpetas"
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
  async asyncData({ $strapi, $error }) {
    try {
      const response = await $strapi.find("users/me", {
        fields: ["id"],
        populate: {
          grupos: {
            populate: {
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
      const grupos = response.grupos.map((g) => {
        g.carpetas = g.carpetasLectura
          .concat(g.carpetasEscritura)
          .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i);
        return g;
      });
      return { grupos };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
  computed: {
    gruposFiltrados() {
      return this.grupos.filter((x) => x.carpetas.length);
    },
    numElements() {
      return this.gruposFiltrados.length
    }
  },
};
</script>
