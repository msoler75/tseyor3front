<template>
  <section
    class="archivos h-expand flex flex-col sm:flex-row justify-start"
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
        select-none
        whitespace-nowrap
      "
    >
      <div class="flex justify-between items-start sticky top-[60px] md:top-[80px] xl:top-[85px]">
        <div class="w-full overflow-y-auto">
          <template v-for="(menu, index) of options">
            <section
              :key="index"
              v-if="menu.value"
              @click="onMenu(menu.value)"
              class="
                px-5
                lg:px-10
                xl:pl-20
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
                lg:px-10
                xl:pl-22
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
    <div class="surface w-full flex flex-col">
      <div class="w-full flex justify-between px-2 sm:px-5 lg:px-10">
        <Breadcrumb
          v-if="verBreadcrumb"
          class="text-sm mt-2"
        />
        <div v-else />
        <div
          v-if="!loading && !specialFolders.includes($route.path) && escritura"
          class="flex items-center py-4 px-1 ml-auto"
        >
          <div v-if="carpeta&&(carpeta.archivos.length||carpeta.subcarpetas.length)" class="btn btn-mini btn-gray text-sm whitespace-nowrap" @click="seleccionando=!seleccionando">
            <Check v-model="seleccionando"/>
            <span class="ml-2 hidden lg:inline">Seleccionar</span>
          </div>
        </div>
        <div
          v-if="!loading && !specialFolders.includes($route.path) && escritura"
          class="flex items-center py-4 px-1 sm:px-2 lg:px-4"
        >
          <InputFiles
            :onlyInput="true"
            classButton="btn-mini text-sm whitespace-nowrap"
            classButtonText="hidden lg:inline"
            :multiple="true"
            icon="fas fa-cloud-upload-alt"
            textButton="Subir"
            v-on:change="addFiles"
          />
        </div>
      </div>
      <div v-if="!loading" class="w-full flex-grow !border-l-0 !border-r-0">
        <nuxt-child
          v-show="!loading"
          :nuxt-child-key="$route.fullPath"
          :seleccionando="seleccionando"
          @click="onRuta"
          @borrada="onBorrada"
          @carpeta="onCarpeta"
          @seleccion="onSeleccion"
        />
      </div>
      <div
        class="
          p-2
          w-full
          overflow-hidden
          flex-grow
          !border-l-0 !border-r-0
          opacity-50
        "
      >
        <LoaderFolders
          :items="itemsPrevistos"
          class="py-5 px-5 sm:px-10 lg:px-14 h-full text-2xl surface"
          :class="
            loading ? 'max-h-[80vh]' : 'max-h-0 transform translate-x-[9999px]'
          "
        />
      </div>
    </div>
  </section>
</template>

<script>
import { tengoPermiso, uploadFiles } from "@/assets/js/carpeta";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  components: { vSelect },
  async asyncData({ route, $strapi, $config, $error }) {
    try {
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

      return {
        idcarpetaActual: route.$path,
        idRoot: root.id,
        idRootActual: root.id,
      };
    } catch (e) {
      console.warn(e);
      $error(503);
    }
  },
  data() {
    let specialFolders = [
      "",
      "/misCarpetas",
      "/recientes",
      "/papelera",
      "/compartidas",
      "/misEquipos",
      "/misGrupos",
    ];
    specialFolders = specialFolders.map((x) => this.$config.archivosRuta + x);
    return {
      carpeta: {},
      menuActual: this.$route.path.substr(
        this.$route.path.lastIndexOf("/") + 1
      ),
      seleccionando: false,
      viewMenu: false,
      itemsPrevistos: Math.round(Math.random() * 4),
      options: [
        {
          label: "Base",
        },
        {
          label: "Archivos",
          value: "archivos",
          icon: "folder-open",
        },
        {
          label: "Mis carpetas",
          value: "misCarpetas",
          icon: "far fa-user",
        },
        {
          label: "Recientes",
          value: "recientes",
          icon: "history",
        },
        {
          label: "Papelera",
          value: "papelera",
          icon: "far fa-trash-alt",
        },
        {
          label: "Colaboración",
        },
        {
          label: "Carpetas Compartidas",
          value: "compartidas",
          icon: "link",
        },

        {
          label: "Equipos",
          value: "misEquipos",
          icon: "people-carry",
        },
        {
          label: "Grupos",
          value: "misGrupos",
          icon: "users",
        },
      ],
      ultimoClick: "",
      specialFolders,
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    verBreadcrumb() {
      return (
        !this.specialFolders.includes(this.$route.path) &&
        !this.specialFolders.includes(this.ultimoClick)
      );
    },
    escritura() {
      if (!this.carpeta) return false;
      const r = tengoPermiso(this.carpeta, this.$strapi.user, "escritura");
      console.warn("escritura", r);
      return r;
    },
    administracion() {
      if (!this.carpeta) return false;
      return tengoPermiso(this.carpeta, this.$strapi.user, "escritura");
    },
  },
  watch: {
    loading(newValue) {
      if (newValue) this.$set(this, "carpeta", {});
    },
  },
  mounted() {
    if (!this.options.find((x) => x.value === this.menuActual))
      this.menuActual = "archivos";
  },
  methods: {
    addFiles(files) {
      console.log("addFiles", files);
      if (this.carpeta)
        uploadFiles(this.carpeta, files, this.$strapi, this.$toast);
    },
    onMenu(value) {
      this.menuActual = value;
      const ruta =
        value === "archivos"
          ? this.$config.archivosRuta
          : this.$config.archivosRuta + "/" + value;
      this.ultimoClick = ruta;
      this.$router.push(ruta);
    },
    onRuta(obj) {
      console.log("onRuta", obj);
      this.ultimoClick = null;
      const ruta = typeof obj === "object" ? obj.ruta : obj;
      this.itemsPrevistos =
        typeof obj === "object" && "archivos" in obj
          ? obj.archivos.length + obj.subcarpetas.length
          : Math.floor(Math.random(3)) + 1;
      this.$router.push(ruta);
      this._updateBreadcrumb(ruta);
    },
    async onBorrada(rutaBorrada) {
      console.log("CARPETA BORRADA", rutaBorrada);
      console.log("ruta Actual", this.$route.path);
      if (rutaBorrada == this.$route.path) {
        let ruta = this.$route.path.substr(
          0,
          this.$route.path.lastIndexOf("/")
        );
        const response = await this.$strapi.find("carpetas", {
          ruta: {
            $eq: ruta,
          },
        });
        if (response.error) ruta = this.$config.archivosRuta;
        this.$router.replace({ path: ruta });
        this._updateBreadcrumb(ruta);
      }
    },
    onCarpeta(carpeta) {
      console.warn("onCarpeta!!", carpeta);
      for (const key in carpeta) this.$set(this.carpeta, key, carpeta[key]);
    },
    onSeleccion(lista) {
      console.log('onSeleccion', lista)
    },
    _updateBreadcrumb(ruta) {
      console.log("archivos._updateBreadcrumb", ruta);
      const breadcrumb = [];
      ruta
        .split("/")
        .filter((x) => !!x)
        .reduce((pv, cv) => {
          breadcrumb.push({
            name: cv,
            href: pv + "/" + cv,
            click: this.onRuta,
            icon: "folder-open",
          });
          return pv + "/" + cv;
        }, "");
      this.$store.commit("updateBreadcrumb", breadcrumb);
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
.archivos >>> h3 {
  @apply text-lg mb-4 text-diminished opacity-75;
}
.archivos >>> h4 {
  @apply !mt-0 text-base mb-4 font-bold text-diminished;
}
.item-selected {
  @apply text-sello-centro dark:text-orange;
}
</style>