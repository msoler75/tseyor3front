<template>
  <section
    class="archivos flex flex-col sm:flex-row justify-start h-full"
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
        select-none
        whitespace-nowrap
      "
    >
      <div class="flex justify-between items-start">
        <div class="w-full overflow-y-auto text-lg">
          <template v-for="(menu, index) of options">
            <section
              v-if="menu.handler"
              :key="index"
              @click="onSelect(menu)"
              class="px-5 lg:px-20 xl:pl-32 space-x-3 flex-grow items-center cursor-pointer hover:bg-white dark:hover:bg-black"
              :class="
                (vista == menu.value ? 'item-selected' : '') +
                (viewMenu || vista == menu.value
                  ? ' flex'
                  : ' hidden sm:flex') +
                (viewMenu ? ' py-4' : ' py-4')
              "
            >
              <icon :icon="menu.icon" :svg="menu.svg" class="w-5" />
              <span class="font-bold flex-grow">{{ menu.label }}</span>
            </section>
            <div
              v-else
              :class="viewMenu ? '' : 'hidden sm:block'"
              :key="index"
              class="px-5 lg:px-20 xl:pl-32 pt-3 pb-1 sm:pt-4 text-diminished font-bold"
            >
              {{ menu.label }}
            </div>
          </template>
        </div>
        <icon
          :icon="viewMenu ? 'chevron-up' : 'chevron-down'"
          class="cursor-pointer sm:hidden py-5 px-2"
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
      <div v-if="vista == 'noArchivos'">
        <h3>Tus archivos</h3>
        No tienes espacio para archivos
      </div>
      <div v-else-if="vista == 'compartidas'">
        <h3>Compartidas para ti</h3>
        <Archivos
          @click="onClicked"
          v-model="compartidasContigo"
          placeholder="Ninguna carpeta compartida"
        />

        <divider />

        <h3>Compartes con los demás</h3>
        <Archivos
          @click="onClicked"
          v-model="carpetasQueCompartes"
          placeholder="Ninguna carpeta compartida"
        />
      </div>
      <div v-else-if="vista == 'papelera'">
        <h3>Papelera</h3>
        <Archivos v-model="elementosBorrados" />
      </div>
      <div v-else-if="vista == 'equipos'">
        <div v-if="equiposFiltrados.length">
          <div v-for="equipo of equiposFiltrados" :key="equipo.id">
            <h4>{{ equipo.nombre }}</h4>
            <Archivos
              v-if="equipo.carpeta"
              v-model="equipo.carpeta"
              modoNavegacion="Click"
              @click="onClicked"
              :mostrarTitulo="false"
            />
            <Archivos
              v-if="equipo.carpetasLectura.length"
              v-model="equipo.carpetasLectura"
              modoNavegacion="Click"
              @click="onClicked"
            />
            <Archivos
              v-if="equipo.carpetasEscritura.length"
              v-model="equipo.carpetasEscritura"
              modoNavegacion="Click"
              @click="onClicked"
            />
          </div>
        </div>
        <div v-else>No hay nada que mostrar</div>
      </div>
      <div v-else-if="vista == 'grupos'">
        <div v-if="gruposFiltrados.length">
          <div v-for="grupo of gruposFiltrados" :key="grupo.id">
            <span>{{ grupo.nombre }}</span>
            <Archivos
              v-if="grupo.carpetasLectura.length"
              v-model="grupo.carpetasLectura"
              modoNavegacion="Click"
              @click="onClicked"
            />
            <Archivos
              v-if="grupo.carpetasEscritura.length"
              v-model="grupo.carpetasEscritura"
              modoNavegacion="Click"
              @click="onClicked"
            />
          </div>
        </div>
        <div v-else>No hay nada que mostrar</div>
      </div>
      <Archivos
      v-else
        class="h-min-[60vh] h-full"
        v-model="idCarpetaActual"
        modoNavegacion="Click"
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
      vista: "archivos",
      viewMenu: false,
      options: [
        {
          label: "Base",
        },
        {
          label: "Archivos",
          value: "archivos",
          icon: "folder-open",
          handler: this.onArchivos,
        },
        {
          label: "Mi carpeta",
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
    //if (this.carpeta && this.$route.path === this.urlNoArchivos)
    //this.$router.push(this.carpeta.ruta);
    this.onRuta(this.$router.path);
    // escuchamos eventos de breadcrumb
    this.$store.commit("setBreadcrumbHandler", this.onBreadcrumbClicked);
    window.onpopstate = (event) => this.onRuta(location.pathname);
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
      history.pushState({}, null, ruta);
      if (updateBreadcrumb) this.$store.commit("updateBreadcrumb", ruta);
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
      this.idRootActual = this.idRoot;
      // this.idRootActual = this.carpeta.id
      this.onClicked(this.$config.archivosRuta);
    },
    onMisArchivos() {
      console.log("onMisArchivos", "carpeta", this.carpeta);
      if (this.carpeta) {
        this.vista = "misArchivos";
        this.idRootActual = this.carpeta.id;
        this.onClicked(this.carpeta);
      } else {
        this.vista = "noArchivos";
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
      console.warn("onClicked", carpeta);
      // this.idRootActual = this.idRoot;
      // this.idRootActual = this.carpeta.id
      /* if (carpeta && this.carpeta && carpeta.id === this.carpeta.id && this.vista==='general')
        this.vista = "misArchivos"
      else this.vista="general" */
      this.vista = "archivos";
      this.idCarpetaActual =
        typeof carpeta === "object" ? carpeta.ruta : carpeta;
      console.log("idCArpetaActual", carpeta);
      this.pushRoute(carpeta);
    },
    onBreadcrumbClicked(ruta) {
      console.log("clicked breadcrumb");
      // alert(ruta);
      this.onRuta(ruta);
      //this.onClicked(ruta);
    },
    onRuta(ruta) {
      this.vista = "archivos";
      switch (ruta) {
        case this.urlCompartidas:
          this.onArchivos();
          break;
        case this.urlPapelera:
          this.onPapelera();
          break;
        case this.urlEquipos:
          this.onEquipos();
          break;
        case this.urlGrupos:
          this.onGrupos();
          break;
        case this.urlNoArchivos:
          this.vista = "noArchivos";
          break;
        case this.urlSubidos:
          this.onSubidos();
          break;
        default:
          this.onClicked(ruta);
      }
      if (this.carpeta && this.idCarpetaActual == this.carpeta.ruta)
        this.vista = "misArchivos";
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