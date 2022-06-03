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
        select-none
        whitespace-nowrap
      "
    >
      <div class="flex justify-between items-start">
        <div class="w-full overflow-y-auto">
          <template v-for="(menu, index) of options">
            <section
              :key="index"
              v-if="menu.value"
              @click="onMenu(menu.value)"
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
    <div class="surface w-full flex flex-col">
      <Breadcrumb
        v-if="verBreadcrumb"
        class="text-sm py-2 px-5 sm:px-10 lg:px-14"
      />
      <div
        v-if="loading"
        class="w-full flex-grow !border-l-0 !border-r-0"
      >
        <Loader class="h-full text-2xl" />
      </div>
      <div
        v-else
        class="w-full flex-grow !border-l-0 !border-r-0"
      >
        <nuxt-child
          v-show="!loading"
          :nuxt-child-key="$route.fullPath"
          @click="onRuta"
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
        idCarpetaActual: route.$path,
        idRoot: root.id,
        idRootActual: root.id,
      };
    } catch (e) {
      console.warn(e);
      $error(503);
    }
  },
  data() {
    return {
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
      loadingDelay: false,
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    verBreadcrumb() {
      const specialFolders = [
        "",
        "/misCarpetas",
        "/recientes",
        "/papelera",
        "/compartidas",
        "misEquipos",
        "/misGrupos",
      ].map((x) => this.$config.archivosRuta + x);
      return (
        !specialFolders.includes(this.$route.path) &&
        !specialFolders.includes(this.ultimoClick)
      );
    },
  },
  watch: {
    loading(newValue) {
      if (newValue) this.loadingDelay = true;
      else this.loadingDelay = false;
      /*this.$nextTick(() => {
          this.$nextTick(() => {
            this.$nextTick(() => {
              this.loadingDelay = false;
            });
          });
        });*/
    },
  },
  methods: {
    onMenu(value) {
      this.menuActual = value;
      const ruta =
        value === "archivos"
          ? this.$config.archivosRuta
          : this.$config.archivosRuta + "/" + value;
      this.ultimoClick = ruta;
      this.$router.push(ruta);
    },
    onRuta(carpeta) {
      console.log("onRuta", carpeta);
      this.ultimoClick = null;
      const ruta = typeof carpeta === "object" ? carpeta.ruta : carpeta;
      this.$router.push(ruta);
      this.updateBreadcrumb(ruta)
    },
    updateBreadcrumb(ruta) {
      const breadcrumb = []
      ruta.split("/").filter((x) => !!x)
      .reduce((pv,cv)=>{
        breadcrumb.push({
          name: cv,
          href: pv+'/'+cv,
          click: this.flexNavigateTo,
          icon: 'folder-open',
        })
        return pv+'/'+cv},
      '')
      this.$store.commit("updateBreadcrumb", breadcrumb);
    },
    onBreadcrumbClicked(ruta) {
      console.log("clicked breadcrumb");
      // alert(ruta);
      // this.onRuta(ruta);
      // this.menuActual = 'archivos'
      //this.cambiarACarpeta(ruta);
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