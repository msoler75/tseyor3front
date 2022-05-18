<template>
  <section
    class="archivos flex flex-col sm:flex-row justify-start"
    contained="no"
    background="no"
  >
    <div
      v-if="$strapi.user"
      class="
        surface
        !bg-gray-100
        dark:!bg-gray-900
        !border-l-0 !border-r-0 !border-b-0
        sm:!border-b-1
        py-5
        px-5
        lg:px-20
        xl:pl-32
        select-none
        whitespace-nowrap
      "
    >
      <div class="flex justify-between items-start">
        <div class="w-full overflow-y-auto">
          <template v-for="(menu, index) of options">
            <section
              v-if="menu.handler"
              :key="index"
              @click="onSelect(menu)"
              class="space-x-3 flex-grow items-center px-2"
              :class="
                (vista == menu.value ? 'item-selected' : '') +
                (viewMenu || vista == menu.value
                  ? ' flex'
                  : ' hidden sm:flex') +
                (viewMenu ? ' mb-3 sm:mb-5' : ' sm:mb-5')
              "
            >
              <icon :icon="menu.icon" :svg="menu.svg" class="w-5" />
              <span class="font-bold flex-grow">{{ menu.label }}</span>
            </section>
            <div
              v-else
              :class="viewMenu ? '' : 'hidden sm:block'"
              :key="index"
              class="pt-1 sm:pt-3 pb-1 sm:pb-1 text-diminished font-bold mb-3"
            >
              {{ menu.label }}
            </div>
          </template>
        </div>
        <icon
          :icon="viewMenu ? 'chevron-up' : 'chevron-down'"
          class="cursor-pointer sm:hidden py-1 px-2"
          @click.native="viewMenu = !viewMenu"
        />
      </div>
    </div>
    <div
      class="
        surface
        w-full
        flex-grow
        py-5
        px-5
        sm:px-10
        lg:px-14
        !border-l
        -0
        !border-r-0
        !sm:border-l-1
      "
    >
      <div v-if="idCarpetaActual == urlNoArchivos">
        <h3>Tus archivos</h3>
        No tienes espacio para archivos
      </div>
      <div v-else-if="idCarpetaActual == urlCompartidas">
        <h3>Compartidas para ti</h3>
        <FilesFolder
          v-model="compartidasContigo"
          placeholder="Ninguna carpeta compartida"
        />

        <divider />

        <h3>Compartes con los demás</h3>
        <FilesFolder
          v-model="carpetasQueCompartes"
          placeholder="Ninguna carpeta compartida"
        />
      </div>
      <div v-else-if="idCarpetaActual == urlPapelera">
        <h3>Papelera</h3>
        <FilesFolder v-model="elementosBorrados" />
      </div>
      <div v-else-if="idCarpetaActual == urlEquipos">
        <div v-if="equiposFiltrados.length">
          <div v-for="equipo of equiposFiltrados" :key="equipo.id">
            <h4>{{ equipo.nombre }}</h4>
            <FilesFolder
              v-if="equipo.carpeta"
              v-model="equipo.carpeta"
              navigationMode="Click"
              @click="onClicked"
              :showTitle="false"
            />
            <FilesFolder
              v-if="equipo.carpetasLectura.length"
              v-model="equipo.carpetasLectura"
              navigationMode="Click"
              @click="onClicked"
            />
            <FilesFolder
              v-if="equipo.carpetasEscritura.length"
              v-model="equipo.carpetasEscritura"
              navigationMode="Click"
              @click="onClicked"
            />
          </div>
        </div>
        <div v-else>No hay nada que mostrar</div>
      </div>
      <div v-else-if="idCarpetaActual == urlGrupos">
        <div v-if="gruposFiltrados.length">
          <div v-for="grupo of gruposFiltrados" :key="grupo.id">
            <span>{{ grupo.nombre }}</span>
            <FilesFolder
              v-if="grupo.carpetasLectura.length"
              v-model="grupo.carpetasLectura"
              navigationMode="Click"
              @click="onClicked"
            />
            <FilesFolder
              v-if="grupo.carpetasEscritura.length"
              v-model="grupo.carpetasEscritura"
              navigationMode="Click"
              @click="onClicked"
            />
          </div>
        </div>
        <div v-else>No hay nada que mostrar</div>
      </div>
      <FilesFolder
        v-else
        v-model="idCarpetaActual"
        navigationMode="Click"
        @click="onClicked"
        :updateBreadcrumb="true"
        :inside="true"
        :idRootFolder="idRootActual"
      />
    </div>
  </section>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  components: { vSelect },
  async asyncData({ route, $strapi, $error }) {
    try {
      const parts = route.fullPath
        .replace(/\?.*$/, "")
        .split("/")
        .filter((x) => !!x);
      const ruta = parts.length > 0 ? "/" + parts.join("/") : "/";
      /*const {
        data: [contenido],
      } = await $strapi.find("carpetas", {
        filters: {
          ruta: {
            $eq: ruta,
          },
        },
        // populate: '*'
      });*/
      // if (!contenido) return $error(404, "Carpeta no encontrada");
      const data = $strapi.user
        ? await $strapi.find("users/me", {
            fields: ["id"],
            populate: {
              carpeta: "*",
              carpetasCreadas: { publicationState: "preview" },
              carpetasLectura: "*",
              carpetasEscritura: "*",
              carpetasAdministracion: "*",
              equipos: {
                populate: ["carpeta", "carpetasLectura", "carpetasEscritura"],
              },
              grupos: {
                populate: ["carpetasLectura", "carpetasEscritura"],
              },
            },
          })
        : {
            carpeta: null,
            carpetasCreadas: [],
            carpetasLectura: [],
            carpetasEscritura: [],
            carpetasAdministracion: [],
            equipos: [],
            grupos: [],
          };

      const root = $strapi.findOne("carpetas", {
        filters: {
          ruta: {
            $eq: "/archivos",
          },
        },
      });

      console.warn("DATA", data);
      return {
        ...data,
        idCarpetaActual: ruta,
        idRoot: root.id,
        idRootActual: root.id,
      };
    } catch (e) {
      console.log(e);
      $error(503);
    }
  },
  data() {
    return {
      urlCompartidas: this.$config.archivosRuta + "/___compartidas",
      urlSubidos: this.$config.archivosRuta + "/___subidos",
      urlPapelera: this.$config.archivosRuta + "/___papelera",
      urlEquipos: this.$config.archivosRuta + "/___equipos",
      urlGrupos: this.$config.archivosRuta + "/___grupos",
      urlNoArchivos: this.$config.archivosRuta + "/___noarchivos",
      vista: "",
      viewMenu: false,
      options: [
        {
          label: "Archivos Tseyor",
          value: "general",
          icon: "home",
          handler: this.onArchivos,
        },
        {
          label: "Mis Archivos",
          value: "misArchivos",
          icon: "far fa-user",
          handler: this.onMisArchivos,
        },
        {
          label: "Subidas Recientes",
          value: "subidos",
          icon: "svg iconUpload",
          handler: this.onSubidos,
        },
        {
          label: "Papelera",
          value: "papelera",
          icon: "far fa-trash-alt",
          handler: this.onPapelera,
        },
        {
          label: "Colaboración",
        },
        {
          label: "Carpetas Compartidas",
          value: "compartidas",
          icon: "link",
          handler: this.onCompartidas,
        },

        {
          label: "Equipos",
          value: "equipos",
          icon: "people-carry",
          handler: this.onEquipos,
        },
        {
          label: "Grupos",
          value: "grupos",
          icon: "users",
          handler: this.onGrupos,
        },
      ],
    };
  },
  mounted() {
    if (this.carpeta && this.$route.path === this.urlNoArchivos)
      this.$router.push(this.carpeta.ruta);
    this.vista = "general";
    switch (this.$route.path) {
      case this.urlCompartidas:
        this.vista = "compartidas";
        break;
      case this.urlPapelera:
        this.vista = "papelera";
        break;
      case this.urlEquipos:
        this.vista = "equipos";
        break;
      case this.urlGrupos:
        this.vista = "grupos";
        break;
      case this.urlNoArchivos:
        this.vista = "misArchivos";
      case this.urlSubidos:
        this.vista = "subidos";
        break;
    }
    if (this.carpeta && this.idCarpetaActual == this.carpeta.ruta)
      this.vista = "misArchivos";
  },
  computed: {
    equiposFiltrados() {
      return this.equipos.filter(
        (x) =>
          x.carpeta || x.carpetasLectura.length || x.carpetasEscritura.length
      );
    },
    gruposFiltrados() {
      return this.grupos.filter(
        (x) => x.carpetasLectura.length || x.carpetasEscritura.length
      );
    },
    compartidasContigo: {
      get() {
        let carpetas = this.carpetasLectura || [];
        return carpetas
          .concat(this.carpetasEscritura)
          .filter((x) => x.publishedAt);
      },
      set(newValue) {},
    },
    carpetasQueCompartes: {
      get() {
        return this.carpetasCreadas
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
      },
      set(newValue) {},
    },
    elementosBorrados: {
      get() {
        return this.carpetasCreadas.filter((x) => !x.publishedAt);
      },
      set(newValue) {},
    },
  },
  methods: {
    pushRoute(obj, updateBreadcrumb) {
      let ruta = typeof obj === "object" ? obj.ruta : obj;
      console.log("pushRoute", ruta, "original", obj);
      this.idCarpetaActual = ruta;
      history.pushState({}, null, ruta);
      if(updateBreadcrumb)
       this.$store.commit("updateBreadcrumb", ruta);
    },
    onSelect(menu) {
      if (screen.width < 640) {
        if (this.viewMenu) menu.handler();
        this.viewMenu = !this.viewMenu;
      } else {
        menu.handler();
        this.viewMenu = false;
      }
    },
    onArchivos() {
      this.vista = "general";
      this.idRootActual = this.idRoot;
      // this.idRootActual = this.carpeta.id
      this.pushRoute(this.$config.archivosRuta);
    },
    onMisArchivos() {
      this.vista = "misArchivos";
      if (this.carpeta) {
        this.idRootActual = this.carpeta.id;
        this.pushRoute(this.carpeta.ruta);
      } else {
        this.pushRoute(this.urlNoArchivos, true);
      }
      // this.idRootActual = this.carpeta.id
    },
    onSubidos() {
      // alert("No implementado");
      this.vista = "subidos";
      this.pushRoute(this.urlSubidos, true);
    },
    onCompartidas() {
      this.vista = "compartidas";
      this.pushRoute(this.urlCompartidas, true);
    },
    onPapelera() {
      this.vista = "papelera";
      this.pushRoute(this.urlPapelera, true);
    },
    onEquipos() {
      this.vista = "equipos";
      this.pushRoute(this.urlEquipos, true);
    },
    onGrupos() {
      this.vista = "grupos";
      this.pushRoute(this.urlGrupos, true);
    },
    onClicked(carpeta) {
      console.warn("onClicke", carpeta);
      // this.idRootActual = this.idRoot;
      // this.idRootActual = this.carpeta.id
      this.pushRoute(carpeta);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Karla:wght@500&display=swap");
.xarchivos {
  font-family: "Karla", sans-serif;
}
.archivos >>> h1,
.archivos h3 {
  @apply text-lg mb-4 text-diminished opacity-75;
}
.archivos h4 {
  @apply mt-0 text-base mb-4 font-bold text-diminished;
}
.item-selected {
  @apply text-sello-centro dark:text-orange;
}
</style>