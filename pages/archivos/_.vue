<template>
  <section
    class="archivos flex flex-col sm:flex-row justify-start h-full"
    contained="no"
    background="no"
    breadcrumb="no"
    footer="no"
    style="font-family: 'Trebuchet MS'"
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
        <div class="w-full overflow-y-auto">
          <template v-for="(menu, index) of options">
            <section
              v-if="menu.handler"
              :key="index"
              @click="onSelect(menu)"
              class="
                px-5
                lg:px-20
                xl:pl-32
                space-x-3
                flex-grow
                items-center
                cursor-pointer
                sm:hover:bg-white sm:dark:hover:bg-black
              "
              :class="
                (menuActual == menu.value ? 'item-selected' : '') +
                (viewMenu || menuActual == menu.value
                  ? ' flex'
                  : ' hidden sm:flex') +
                (viewMenu ? ' py-2' : ' py-4 sm:py-2')
              "
            >
              <icon :icon="menu.icon" :svg="menu.svg" class="w-5" />
              <span class="font-bold flex-grow">{{ menu.label }}</span>
            </section>
            <div
              v-else
              :class="viewMenu ? '' : 'hidden sm:block'"
              :key="index"
              class="
                px-5
                lg:px-20
                xl:pl-32
                pt-3
                pb-1
                sm:pt-4
                text-diminished
                font-bold
              "
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
      class="surface w-full flex-grow !border-l -0 !border-r-0 !sm:border-l-1"
      :class="vista == 'archivos' ? '' : 'py-5 px-5 sm:px-10 lg:px-14'"
    >
      <VistaArchivos
        v-if="vista == 'misCarpetas'"
        :cargando="cargandoMisCarpetas"
      >
        <h3>Mis carpetas</h3>
        <ListadoCarpetas
          :carpetas="misCarpetas"
          @click="onRuta"
          placeholder="No tienes ninguna carpeta"
          :padre="{ ruta: urlMisCarpetas, publishedAt: 1 }"
        />
      </VistaArchivos>
      <VistaArchivos
        v-else-if="vista == 'compartidas'"
        :cargando="cargandoCompartidas"
      >
        <h3>Compartidas para ti</h3>
        <ListadoCarpetas
          @click="onRuta"
          :carpetas="compartidasContigo"
          placeholder="Ninguna carpeta compartida"
          :padre="{ ruta: urlCompartidas, publishedAt: 1 }"
        />

        <divider />

        <h3>Compartes con los demás</h3>
        <ListadoCarpetas
          @click="onRuta"
          :carpetas="carpetasQueCompartes"
          placeholder="Ninguna carpeta compartida"
          :padre="{ ruta: urlCompartidas, publishedAt: 1 }"
        />
      </VistaArchivos>
      <VistaArchivos
        v-else-if="vista == 'papelera'"
        :cargando="cargandoPapelera"
      >
        <h3>Papelera</h3>
        <ListadoCarpetas
          :carpetas="elementosBorrados"
          class="w-full lg:text-lg px-2 py-1 md:py-2"
          :padre="{ ruta: urlPapelera, publishedAt: 1 }"
        />
      </VistaArchivos>
      <VistaArchivos v-else-if="vista == 'equipos'" :cargando="cargandoEquipos">
        <div v-if="equiposFiltrados.length">
          <div v-for="equipo of equiposFiltrados" :key="equipo.id">
            <h4>{{ equipo.nombre }}</h4>
            <ListadoCarpetas
              v-if="equipo.carpetas.length"
              :carpetas="equipo.carpetas"
              @click="onRuta"
              :padre="{ ruta: urlEquipos, publishedAt: 1 }"
            />
          </div>
        </div>
        <div v-else>No hay nada que mostrar</div>
      </VistaArchivos>
      <VistaArchivos v-else-if="vista == 'grupos'" :cargando="cargandoGrupos">
        <div v-if="gruposFiltrados.length">
          <div v-for="grupo of gruposFiltrados" :key="grupo.id">
            <h3>{{ grupo.nombre }}</h3>
            <ListadoCarpetas
              v-if="grupo.carpetas.length"
              :carpetas="grupo.carpetas"
              @click="onRuta"
              :padre="{ ruta: urlGrupos, publishedAt: 1 }"
            />
          </div>
        </div>
        <div v-else>No hay nada que mostrar</div>
      </VistaArchivos>
      <div v-else class="w-full flex flex-col">
        rp:{{rutaActual.replace(/\/$/,'')}} ar:{{$config.archivosRuta}}
        <Breadcrumb v-if="rutaActual.replace(/\/$/,'')!=$config.archivosRuta" class="text-sm py-2 px-5 sm:px-10 lg:px-14" />
      <Carpeta        
        id="explorador"
        class="w-full h-full py-5 px-5 sm:px-10 lg:px-14"
        :value="idCarpetaActual"
        modoNavegacion="Click"
        @click="onRuta"
        :updateBreadcrumb="true"
        :explorando="true"
        :idRootFolder="idRootActual"
        :padre="carpetaPadreActual"
      />
      </div>
    </div>
  </section>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  components: { vSelect },
  async asyncData({ route, $strapi, $config, $error }) {
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
      const data = {
        carpeta: null,
        carpetasCreadas: [],
        carpetasLectura: [],
        carpetasEscritura: [],
        carpetasAdministracion: [],
        equipos: [],
        grupos: [],
      };

      let {
        data: [root],
      } = await $strapi.find("carpetas", {
        filters: {
          ruta: {
            $eq: $config.archivosRuta,
          },
        },
      });
      if (!root) root = { id: 0 };

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
      urlArchivos: this.$config.archivosRuta,
      urlCompartidas: this.$config.archivosRuta + "/___compartidas",
      urlSubidos: this.$config.archivosRuta + "/___subidos",
      urlPapelera: this.$config.archivosRuta + "/___papelera",
      urlEquipos: this.$config.archivosRuta + "/___equipos",
      urlGrupos: this.$config.archivosRuta + "/___grupos",
      urlMisCarpetas: this.$config.archivosRuta + "/___miscarpetas",
      cargandoMisCarpetas: false,
      cargandoCompartidas: false,
      cargandoSubidos: false,
      cargandoPapelera: false,
      cargandoEquipos: false,
      cargandoGrupos: false,
      carpetaPadreActual: null,
      vista: "archivos",
      menuActual: "archivos",
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
          label: "Mis carpetas",
          value: "misCarpetas",
          icon: "far fa-user",
          handler: this.onMisCarpetas,
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
      populateCarpetaPermisos: {
        propietario: "*",
        lecturaUsuarios: "*",
        lecturaGrupos: "*",
        lecturaEquipos: "*",
        escrituraUsuarios: "*",
        escrituraGrupos: "*",
        escrituraEquipos: "*",
        administracionUsuarios: "*",
      },
    };
  },
  computed: {
    rutaActual() {
      /*if(process.client)
      {
        console.log('LOCATION PATH', location)
        return ''
      }*/
        console.log('ROUTE PATH', this.$route)
      return this.$route.path
    },
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
    compartidasContigo() {
      let carpetas = this.carpetasLectura || [];
      return carpetas
        .concat(this.carpetasEscritura)
        .filter((x) => x.publishedAt)
        .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i)
        .filter(x=>!this.carpetasQueCompartes.find(z=>z.id==x.id))
    },
    carpetasQueCompartes() {
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
    elementosBorrados() {
      return this.carpetasCreadas.filter((x) => !x.publishedAt);
    },
  },
  mounted() {
    // cargamos la ruta actual
    this.onRuta(this.$route.path);
    // escuchamos eventos de breadcrumb
    this.$store.commit("setBreadcrumbHandler", this.onBreadcrumbClicked);
    window.onpopstate = (event) => {
      this.onRuta(location.pathname);
      event.preventDefault();
      return false;
    };
  },
  destroy() {
    window.onpopstate = null;
  },
  methods: {
    pushRoute(obj, updateBreadcrumb) {
      let ruta = typeof obj === "object" ? obj.ruta : obj;
      console.log("pushRoute", ruta, "original", obj);
      // history.pushState({}, null, ruta);
      this.$router.push(ruta)
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
      this.vista = "archivos";
      this.menuActual = "archivos";
      this.idRootActual = this.idRoot;
      this.idCarpetaActual = this.idRoot;
      this.pushRoute(this.$config.archivosRuta, true);
      // this.onRuta(this.$config.archivosRuta);
    },
    onMisCarpetas() {
      // console.log("onMisCarpetas", "carpeta", this.carpeta);
      this.vista = "misCarpetas";
      this.menuActual = "misCarpetas";
      this.pushRoute(this.urlMisCarpetas, true);
      if (this.$strapi.user) {
        this.cargandoMisCarpetas = true;
        this.$strapi
          .find("users/me", {
            fields: ["id"],
            populate: {
              carpeta: {
                populate: this.populateCarpetaPermisos,
              },
              carpetasCreadas: {
                populate: this.populateCarpetaPermisos,
                publicationState: "preview",
              },
            },
          })
          .then((response) => {
            this.cargandoMisCarpetas = false;
            this.carpeta = response.carpeta;
            this.carpetasCreadas = response.carpetasCreadas;
            this.misCarpetas = [];            
            if (this.carpeta) this.misCarpetas.push(this.carpeta);
            this.misCarpetas = this.misCarpetas.concat(this.carpetasCreadas)
            .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i).filter(x=>x.publishedAt)
          });
      }
    },
    onSubidos() {
      // alert("No implementado");
      this.vista = "subidos";
      this.menuActual = "subidos";
      this.pushRoute(this.urlSubidos, true);
    },
    onCompartidas() {
      this.vista = "compartidas";
      this.menuActual = "compartidas";
      this.pushRoute(this.urlCompartidas, true);
      if (this.$strapi.user) {
        this.cargandoCompartidas = true;
        this.$strapi
          .find("users/me", {
            fields: ["id"],
            populate: {
              carpetasLectura: {
                populate: this.populateCarpetaPermisos,
              },
              carpetasEscritura: {
                populate: this.populateCarpetaPermisos,
              },
              carpetasCreadas: {
                populate: this.populateCarpetaPermisos,
                publicationState: "preview",
              },
            },
          })
          .then((response) => {
            this.cargandoCompartidas = false;
            this.carpetasLectura = response.carpetasLectura;
            this.carpetasEscritura = response.carpetasEscritura;
            this.carpetasCreadas = response.carpetasCreadas;
          });
      }
    },
    onPapelera() {
      this.vista = "papelera";
      this.menuActual = "papelera";
      this.pushRoute(this.urlPapelera, true);
      if (this.$strapi.user) {
        this.cargandoPapelera = true;
        this.$strapi
          .find("users/me", {
            fields: ["id"],
            populate: {
              carpetasCreadas: {
                populate: this.populateCarpetaPermisos,
                publicationState: "preview",
              },
            },
          })
          .then((response) => {
            this.cargandoPapelera = false;
            this.carpetasCreadas = response.carpetasCreadas;
          });
      }
    },
    onEquipos() {
      this.vista = "equipos";
      this.menuActual = "equipos";
      this.pushRoute(this.urlEquipos, true);
      if (this.$strapi.user) {
        this.cargandoEquipos = true;
        this.$strapi
          .find("users/me", {
            fields: ["id"],
            populate: {
              equipos: {
                populate: {
                  carpeta: { populate: this.populateCarpetaPermisos },
                  carpetasLectura: {
                    populate: this.populateCarpetaPermisos,
                  },
                  carpetasEscritura: {
                    populate: this.populateCarpetaPermisos,
                  },
                },
              },
            },
          })
          .then((response) => {
            this.cargandoEquipos = false;
            this.equipos = response.equipos.map((e) => {
              e.carpetas = [];
              if (e.carpeta) e.carpetas.push(e.carpeta);
              e.carpetas = e.carpetas
                .concat(e.carpetasLectura)
                .concat(e.carpetasEscritura)
                .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i);
              return e;
            });
          });
      }
    },
    onGrupos() {
      this.vista = "grupos";
      this.menuActual = "grupos";
      this.pushRoute(this.urlGrupos, true);
      if (this.$strapi.user) {
        this.cargandoGrupos = true;
        this.$strapi
          .find("users/me", {
            fields: ["id"],
            populate: {
              grupos: {
                populate: {
                  carpetasLectura: {
                    populate: this.populateCarpetaPermisos,
                  },
                  carpetasEscritura: {
                    populate: this.populateCarpetaPermisos,
                  },
                },
              },
            },
          })
          .then((response) => {
            this.cargandoGrupos = false;
            this.grupos = response.grupos.map((g) => {
              g.carpetas = g.carpetasLectura
                .concat(g.carpetasEscritura)
                .filter((v, i, a) => a.findIndex((x) => x.id == v.id) == i);
              return g;
            });
          });
      }
    },
    onBreadcrumbClicked(ruta) {
      console.log("clicked breadcrumb");
      // alert(ruta);
      this.onRuta(ruta);
      // this.menuActual = 'archivos'
      //this.cambiarACarpeta(ruta);
    },
    onRuta(carpeta) {
      console.log("OnRuta", carpeta);
      const ruta = typeof carpeta === "object" ? carpeta.ruta : carpeta;
      // this.vista = "archivos";
      switch (ruta) {
        case this.urlArchivos:
          this.onArchivos();
          break;
        case this.urlMisCarpetas:
          this.onMisCarpetas();
          break;
        case this.urlSubidos:
          this.onSubidos();
          break;
        case this.urlPapelera:
          this.onPapelera();
          break;
        case this.urlCompartidas:
          this.onCompartidas();
          break;
        case this.urlEquipos:
          this.onEquipos();
          break;
        case this.urlGrupos:
          this.onGrupos();
          break;
        default:
          console.warn("cambiarACarpeta", carpeta);
          if (carpeta.breadcrumb) {
            this.menuActual = "archivos";
            this.idRootActual = this.idRoot;
          }
          if (
            typeof carpeta === "object" &&
            "forzarPadre" in carpeta &&
            carpeta.forzarPadre
          )
            this.carpetaPadreActual = carpeta.forzarPadre;
          else this.carpetaPadreActual = null;
          this.vista = "archivos";
          this.idCarpetaActual =
            typeof carpeta === "object" ? carpeta.ruta : carpeta;
          console.log("idCArpetaActual", carpeta);
          // this.pushRoute(carpeta, false);
          this.pushRoute(this.idCarpetaActual, true);
      }
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