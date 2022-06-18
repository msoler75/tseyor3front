<template>
  <div class="py-5 px-4 sm:px-8 lg:px-10 xl:px-12">
    <h3>Mis carpetas</h3>
    <ExploradorListado
      :carpetas="carpetas"
      @click="$emit('click', $event)"
      placeholder="No tienes ninguna carpeta"
      :padre="{ ruta: $route.path+'', publishedAt: 1 }"
      :vista="vista"      
      @papelera="$emit('papelera', $event)"
      @copiado="$emit('copiado', $event)"
      @cortado="$emit('cortado', $event)"        
    />

    <divider />

    <h3>Mis archivos</h3>
    <ExploradorListado
      :archivos="archivos"
      @click="$emit('click', $event)"
      placeholder="No tienes ningún archivo"
      :padre="{ ruta: $route.path+'', publishedAt: 1 }"
      :vista="vista"      
      @papelera="$emit('papelera', $event)"
      @copiado="$emit('copiado', $event)"
      @cortado="$emit('cortado', $event)"        
    />

  </div>
</template>

<script>
import {populateCarpeta, populateArchivo} from '@/assets/js/carpeta'
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
          archivosPropietario: {
            populate: {...populateArchivo, carpeta:'*'},
            publicationState: "preview"
          }
        },
      });
      let carpetas = [];
      if (response.carpeta) carpetas.push(response.carpeta);
      carpetas = carpetas
        .concat(response.carpetasPropietario)
        .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i)
        .filter((x) => x.publishedAt);

      let archivos = response.archivosPropietario
      return { carpetas, archivos };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
};
</script>
