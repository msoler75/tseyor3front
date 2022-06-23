<template>
  <div class="py-5 px-4 sm:px-8 lg:px-10 xl:px-12">
    <template
      v-if="
        carpetasPropietarioFiltradas.length ||
        archivosPropietarioFiltrados.length
      "
    >
      <h3>Alguien ha borrado tus archivos</h3>
      <ExploradorListado
        ref="exp1"
        :carpetas="carpetasPropietarioFiltradas"
        :archivos="archivosPropietarioFiltrados"
        @click="$emit('click', $event)"
        :padre="{ ruta: $route.path + '', publishedAt: 1 }"
        :borrarDefinitivo="true"
        :vista="vista"
        @papelera="$emit('papelera', $event)"
        @borrado="onBorrado"
      />
      <divider />
    </template>
    <h3>Papelera</h3>
    <ExploradorListado
      ref="exp2"
      :carpetas="carpetasPapeleraFiltradas"
      :archivos="archivosPapeleraFiltrados"
      @click="$emit('click', $event)"
      placeholder="Tu papelera está vacía"
      iconholder="far fa-trash-alt"
      :padre="{ ruta: $route.path + '', publishedAt: 1 }"
      :borrarDefinitivo="true"
      :vista="vista"
      @papelera="$emit('papelera', $event)"
      @borrado="onBorrado"
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
            publicationState: "preview",
          },
          carpetasPropietario: {
            populate: populateCarpeta,
            filters: {
              $or: [
                {
                  eliminadaPor: {
                    id: {
                      $null: true,
                    },
                  },
                },
                {
                  eliminadaPor: {
                    id: {
                      $ne: $strapi.user.id,
                    },
                  },
                },
              ],
              publishedAt: {
                $null: true,
              },
            },
            publicationState: "preview",
          },
          archivosPropietario: {
            populate: { ...populateArchivo, carpeta: "*" },
            filters: {
              $or: [
                {
                  eliminadoPor: {
                    id: {
                      $null: true,
                    },
                  },
                },
                {
                  eliminadoPor: {
                    id: {
                      $ne: $strapi.user.id,
                    },
                  },
                },
              ],
              publishedAt: {
                $null: true,
              },
            },
            publicationState: "preview",
          },
          archivosPapelera: {
            populate: { ...populateArchivo, carpeta: "*" },
            filters: {
              publishedAt: {
                $null: true,
              },
            },
            publicationState: "preview",
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
    // alguien (no yo) me borró mis carpetas
    carpetasPropietarioFiltradas() {
      return this.carpetasPropietario;
      //.filter(x=>!x.borrada)
      // .filter((v, i, a) => a.findIndex((x) => x.id!=v.id && v.ruta.startsWith(x.ruta)) == -1)
    },
    // carpetas que yo borré
    carpetasPapeleraFiltradas() {
      return this.carpetasPapelera
        .filter((x) => !x.borrada)
        .filter(
          (v, i, a) =>
            a.findIndex((x) => x.id != v.id && v.ruta.startsWith(x.ruta)) == -1
        );
    },
    // alguien (no yo) me borró mis archivos
    archivosPropietarioFiltrados() {
      return this.archivosPropietario;
      //.filter(x=>!x.publishedAt&&!x.borrado)
    },
    // archivos que yo borré
    archivosPapeleraFiltrados() {
      return this.archivosPapelera.filter((x) => !x.borrado);
    },
    numElements() {
      return (
        this.carpetasPropietarioFiltradas.length +
        this.carpetasPapeleraFiltradas.length +
        this.archivosPropietarioFiltrados.length +
        this.archivosPapeleraFiltrados.length
      );
    },
  },
  methods: {
    onBorrado(elem) {
      console.log("papelera.onBorrado", elem);
      if (elem.carpeta) {
        console.log("1");
        this.carpetasPropietario = this.carpetasPropietario.filter(
          (x) => !x.ruta.startsWith(elem.carpeta.ruta)
        );
        console.log("2");
        this.carpetasPapelera = this.carpetasPapelera.filter(
          (x) => !x.ruta.startsWith(elem.carpeta.ruta)
        );
        console.log("3");
        this.archivosPropietario = this.archivosPropietario.filter(
          (x) => !x.carpeta || !x.carpeta.ruta.startsWith(elem.carpeta.ruta)
        );
        console.log("4");
        this.archivosPapelera = this.archivosPapelera.filter(
          (x) => !x.carpeta || !x.carpeta.ruta.startsWith(elem.carpeta.ruta)
        );
      } else {
        this.archivosPropietario = this.archivosPropietario.filter(
          (x) => x.id != elem.archivo.id
        );
        this.archivosPapelera = this.archivosPapelera.filter(
          (x) => x.id != elem.archivo.id
        );
      }
    },
    vaciarPapelera() {
      if (this.$refs.exp1) {
        if (this.$refs.exp1.$refs.carpetas)
          this.$refs.exp1.$refs.carpetas.forEach((c) =>
            c.eliminarDefinitivamente()
          );
        if (this.$refs.exp1.$refs.archivos)
          this.$refs.exp1.$refs.archivos.forEach((c) =>
            c.eliminarDefinitivamente()
          );
      }
      if (this.$refs.exp2) {
        if (this.$refs.exp2.$refs.carpetas)
          this.$refs.exp2.$refs.carpetas.forEach((c) =>
            c.eliminarDefinitivamente()
          );
        if (this.$refs.exp2.$refs.archivos)
          this.$refs.exp2.$refs.archivos.forEach((c) =>
            c.eliminarDefinitivamente()
          );
      }
    },
  },
};
</script>
