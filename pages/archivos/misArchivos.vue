<template>
  <div class="xm:px-2 py-5 sm:px-8 lg:px-10 xl:px-12">
    <h3>Mis carpetas</h3>
    <ExploradorListado v-if="carpetasFiltradas.length||!carpetasBorradas.length"
      :carpetas="carpetasFiltradas"
      @click="$emit('click', $event)"
      placeholder="No tienes ninguna carpeta"
      iconholder="folder-open"
      :padre="{ ruta: $route.path + '', publishedAt: 1 }"
      :vista="vista"
      @papelera="$emit('papelera', $event)"
      @copiado="$emit('copiado', $event)"
      @cortado="$emit('cortado', $event)"
    />
    <div v-if="carpetasBorradas.length" class="flex justify-center py-4 text-diminished">
      <span>(Tienes carpetas en la papelera)</span>
    </div>

    <divider />

    <h3>Mis archivos</h3>
    <ExploradorListado v-if="archivosFiltrados.length||!archivosBorrados.length"
      :archivos="archivosFiltrados"
      @click="$emit('click', $event)"
      placeholder="No tienes ningún archivo"
      iconholder="file"
      :padre="{ ruta: $route.path + '', publishedAt: 1 }"
      :vista="vista"
      @papelera="$emit('papelera', $event)"
      @copiado="$emit('copiado', $event)"
      @cortado="$emit('cortado', $event)"
    />
    <div v-if="archivosBorrados.length" class="flex justify-center py-4 text-diminished">
      <span>(Tienes archivos en la papelera)</span>
    </div>
  </div>
</template>

<script>
// import { populateCarpeta, populateArchivo } from "@/assets/js/carpeta";
export default {
  middleware: ["logged"],
  props: {
    vista: {},
  },
  async asyncData({ $strapi, $error }) {
    try {
      /*const response = await $strapi.find("users/me", {
        fields: ["id"],
        populate: {
          carpeta: {
            populate: populateCarpeta,
          },
          carpetasPropietario: {
            populate: populateCarpeta,
            publicationState: "preview"            
          },
          archivosPropietario: {
            populate: {
              ...populateArchivo,
              carpeta: {
                populate: populateCarpeta                
              },
            },
            filters: {
              carpeta:{
                  propietario: {
                    id: {
                      $ne: $strapi.user.id,
                    },
                  },
                },
            },
            publicationState: "preview",
          },
        },
      });
      let carpetas = [];
      if (response.carpeta) carpetas.push(response.carpeta);
      carpetas = carpetas
        .concat(response.carpetasPropietario)
        .filter((x) => x.publishedAt)
        .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i)
        .filter((v, i, a) => a.findIndex((x) => x.id!=v.id && v.ruta.startsWith(x.ruta)) == -1)
        
      // removemos los archivos que ya estén ubicados en carpetas y que han 'escapado' del filters
      const rutas = carpetas.map((carpeta) => carpeta.ruta);
      let archivos = response.archivosPropietario.filter((archivo) => {
        for (const ruta of rutas)
          if (
            archivo.carpeta &&
            archivo.carpeta.ruta &&
            archivo.carpeta.ruta.startsWith(ruta)
          )
            return false;
        return true;
      });
      return { carpetas, archivos };*/

      const response =  await $strapi.find("archivos/misArchivos")
  console.warn('RESSS', response)
      return response

    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
  computed: {
    carpetasFiltradas() {
      return this.carpetas.filter(x=>!!x.publishedAt)
    },
    carpetasBorradas() {
      return this.carpetas.filter(x=>!x.publishedAt)
    },
    archivosFiltrados() {
      return this.archivos.filter(x=>!!x.publishedAt)
    },
    archivosBorrados() {
      return this.archivos.filter(x=>!x.publishedAt)
    }
  }
};
</script>
