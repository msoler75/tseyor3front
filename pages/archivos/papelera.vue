<template>
  <div class="py-5 px-4 sm:px-8 lg:px-10 xl:px-12">
    <h3>Papelera</h3>
    <template v-if="carpetasPropietario.length || archivosPropietario.length">
      <h4>Alguien ha borrado tus archivos</h4>
      <ExploradorListado
        ref="exp1"
        :carpetas="carpetasPropietarioFiltradas"
        :archivos="archivosPropietarioFiltrados"
        @click="$emit('click', $event)"
        :padre="{ ruta: $route.path + '', publishedAt: 1 }"
        :borrarDefinitivo="true"
        :vista="vista"
        @papelera="$emit('papelera', $event)"
      />
      <divider />
    </template>
      <ExploradorListado
        ref="exp2"
        :carpetas="carpetasPapeleraFiltradas"
        :archivos="archivosPapeleraFiltrados"
        @click="$emit('click', $event)"
        placeholder="Tu papelera está vacía"
        :padre="{ ruta: $route.path + '', publishedAt: 1 }"
        :borrarDefinitivo="true"
        :vista="vista"
        @papelera="$emit('papelera', $event)"
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
          carpetasPapelera: {
            populate: populateCarpeta,
            filters: {
              publishedAt: {
                $null: true,
              },
            },
            // publicationState: "preview",
          },
          carpetasPropietario: {
            populate: populateCarpeta,
            filters: {
              publishedAt: {
                $null: true,
              },
              eliminadaPor: {
                id: {
                  $ne: $strapi.user.id,
                },
              },
              // publicationState: "preview",
            },
          },
          archivosPropietario: {
            populate: populateArchivo,
            filters: {
              publishedAt: {
                $null: true,
              },
              eliminadoPor: {
                id: {
                  $ne: $strapi.user.id,
                },
              },
            },
            // publicationState: "preview",
          },
          archivosPapelera: {
            populate: populateArchivo,
            filters: {
              publishedAt: {
                $null: true,
              },
            },
            // publicationState: "preview",
          },
        },
      });
      console.warn("PAPE RES", response);
      return { ...response };
    } catch (e) {
      console.error(e);
      $error(503);
    }
  },
  computed: {
    carpetasPropietarioFiltradas() {
      return this.carpetasPropietario.filter(x=>!x.borrada)
    },
    carpetasPapeleraFiltradas() {
      return this.carpetasPapelera.filter(x=>!x.borrada)
    }, 
    archivosPropietarioFiltrados() {
      return this.archivosPropietario.filter(x=>!x.publishedAt&&!x.borrado)
    },
    archivosPapeleraFiltrados() {
      return this.archivosPapelera.filter(x=>!x.publishedAt&&!x.borrado)
    },
    numElements() {
      return this.carpetasPropietarioFiltradas.length + 
      this.carpetasPapeleraFiltradas.length + 
      this.archivosPropietarioFiltrados.length + 
      this.archivosPapeleraFiltrados.length 
    }
  },
  methods: {
    vaciarPapelera() {
      if(this.$refs.exp1) 
      {
        if(this.$refs.exp1.$refs.carpetas) 
          this.$refs.exp1.$refs.carpetas.forEach(c=>c.eliminarDefinitivamente())
        if(this.$refs.exp1.$refs.archivos) 
          this.$refs.exp1.$refs.archivos.forEach(c=>c.eliminarDefinitivamente())
      }
      if(this.$refs.exp2) 
      {
        if(this.$refs.exp2.$refs.carpetas) 
          this.$refs.exp2.$refs.carpetas.forEach(c=>c.eliminarDefinitivamente())
        if(this.$refs.exp2.$refs.archivos) 
          this.$refs.exp2.$refs.archivos.forEach(c=>c.eliminarDefinitivamente())
      }
    }
  }
};
</script>
