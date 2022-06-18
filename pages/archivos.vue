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
      <div
        class="
          flex
          justify-between
          items-start
          sticky
          top-[60px]
          md:top-[80px]
          xl:top-[85px]
        "
      >
        <div class="w-full overflow-y-auto"
        :class="borrando?'activar-papelera':''"
        >
          <template v-for="(menu, index) of menuItems">
            <section
              :key="index"
              v-if="menu.value"
              @click="onMenu(menu.value)"
              class="
                px-5
                2xl:pl-16
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
              class="px-5 pt-3 pb-1 sm:pt-4 text-diminished font-bold"
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
      class="right-panel flex-grow surface w-full"
      :class="explorandoCarpeta ? 'explorador' : ''"
    >
      <div class="w-full px-4 sm:px-8 lg:px-10 xl:px-12 py-4 order-0">
        <Breadcrumb
          v-if="explorandoCarpeta"
          class="text-sm mt-2"
          :class="seleccionando ? 'pointer-events-none opacity-50' : ''"
        />
      </div>
      <div
        class="
          surface
          !border-0
          options
          overflow-x-auto
          order-3
          lg:order-1 lg:row-span-2 
          sticky
          lg:static lg:overflow-visible
          bottom-0
          lg:top-[72px]
          xl:top-[76px]
          z-30
          select-none
          whitespace-nowrap
          px-2
          sm:px-5
          py-4
          lg:py-6
        "
        :class="estaVacio&&!explorandoCarpeta?'':'lg:bg-gray-100 lg:dark:bg-gray-900'"
      >
        <div
          v-if="!estaVacio||explorandoCarpeta||copiados.length"
          class="
            sticky
            top-[115px]
            flex
            justify-start
            space-x-2
            lg:space-y-4 lg:space-x-0 lg:flex-col
          "
        >
          <div v-if="seleccionando" class="hidden lg:block">
            Selecciona los elementos...
          </div>
          <div v-else-if="copiados.length">Elige la carpeta destino...</div>

          <Btn
            v-if="seleccionados.length"
            class="btn-mini btn-gray text-sm"
            icon="copy"
            label="Copiar Seleccionados"
            @click="copiar"
          />
          <Btn
            v-if="seleccionados.length && seleccionadosMovibles"
            class="btn-mini btn-gray text-sm"
            icon="cut"
            label="Mover Seleccionados"
            @click="cortar"
          />
          <Btn
            v-if="seleccionados.length && seleccionadosAdministrables"
            class="btn-mini btn-gray text-sm"
            icon="far fa-trash-alt"
            label="Borrar Seleccionados"
            @click="borrar"
          />

          <Btn
            v-if="copiados.length"
            class="btn-mini btn-success text-sm"
            icon="paste"
            :label="
              esCortar
                ? 'Mover Aquí'
                : $route.path == rutaCopia
                ? 'Duplicar Aquí'
                : 'Copiar Aquí'
            "
            :disabled="!permisoEscritura"
            @click="pegar"
          />

          <Btn
            v-if="copiados.length"
            class="btn-mini btn-error text-sm"
            icon="times"
            label="Cancelar operación"
            @click="cancelar"
          />

          <Btn
            v-if="
              !estaVacio &&
              $route.path != urlPapelera &&
              !seleccionando &&
              !copiando &&
              !copiados.length              
            "
            class="btn-mini btn-gray text-sm"
            icon="search"
            label="Buscar Archivos"
            @click="buscar"
          />

          <Btn
            v-if="             
              $route.path == urlPapelera              
              && !estaVacio            
            "
            class="btn-mini btn-gray text-sm"
            icon="trash"
            label="Vaciar Papelera"
            @click="vaciarPapelera"
          />

          <Btn
            v-if="              
              !estaVacio &&
              !copiando
            "
            class="btn-mini btn-gray text-sm"
            :icon="modoLista ? 'list' : 'th-large'"
            label="Cambiar Vista"
            @click="modoLista = !modoLista"
          />

          <Btn
            v-if="
              permisoEscritura &&
              !seleccionando &&
              !copiados.length &&
              !copiando
            "
            class="btn-mini btn-gray text-sm"
            icon="folder-plus"
            label="Nueva Carpeta"
            @click="nuevaCarpeta"
          />

          <InputFiles
            v-if="
              !loading &&
              !specialFolders.includes($route.path) &&
              permisoEscritura &&
              !seleccionando &&
              !copiados.length &&
              !copiando
            "
            class="lg:w-full"
            :onlyInput="true"
            classButton="btn-mini text-sm whitespace-nowrap"
            :multiple="true"
            icon="fas fa-cloud-upload-alt"
            textButton="Subir Archivos"
            v-on:change="addFiles"
          />

          <Btn
            v-if="
              $strapi.user &&
              !loading &&
              !specialFolders.includes($route.path) &&
              carpeta &&
              carpeta.archivos &&
              (carpeta.archivos.length || carpeta.subcarpetas.length) &&
              !copiados.length &&
              !copiando
            "
            class="btn-mini btn-gray text-sm flex"
            @click="seleccionando = !seleccionando"
          >
            <Check v-model="seleccionando" class="w-6" />
            <span>{{
              !seleccionando ? "Seleccionar" : "Cancelar Selección"
            }}</span>
          </Btn>
        </div>
      </div>
      <div
        v-if="!loading"
        class="
          child
          order-2
          w-full
          flex-grow flex flex-col
          !border-l-0 !border-r-0
        "
        :class="copiados.length ? '' : ''"
      >
        <nuxt-child
          ref="child"
          v-show="!loading"
          :nuxt-child-key="$route.fullPath"
          :seleccionando="seleccionando"
          @click="onRuta"
          @papelera="onPapelera"
          @carpeta="onCarpeta"
          @seleccion="onSeleccion"
          @copiado="onCopiado"
          @cortado="onCortado"
          :mostrarArchivos="true"
          :seleccionandoCarpeta="!!copiados.length"
          :vista="modoLista ? 'listado' : 'miniaturas'"
        />
      </div>
      <div
        v-show="loading"
        class="
          p-2
          w-full
          overflow-hidden
          flex-grow
          !border-l-0 !border-r-0
          opacity-50
          order-2
        "
      >
        <LoaderFolders
          :items="itemsPrevistos"
          :vista="modoLista ? 'listado' : 'miniaturas'"
          class="w-full py-5 px-4 sm:px-8 lg:px-10 xl:px-12 h-full text-2xl surface"
          :class="
            loading ? 'max-h-[80vh]' : 'max-h-0 transform translate-x-[9999px]'
          "
        />
      </div>
    </div>
  </section>
</template>

<script>
import { tengoPermiso, soyPropietario, uploadFiles } from "@/assets/js/carpeta";
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
      "/misArchivos",
      "/recientes",
      "/papelera",
      "/compartidos",
      "/misEquipos",
      "/misGrupos",
    ];
    specialFolders = specialFolders.map((x) => this.$config.archivosRuta + x);
    return {
      carpeta: {},      
      currentChild: null,
      borrando: false,
      urlPapelera: this.$config.archivosRuta + "/papelera",
      menuActual: this.$route.path.substr(
        this.$route.path.lastIndexOf("/") + 1
      ),
      modoLista: true, //vista de los contenidos en modo lista o grid
      seleccionando: false,
      seleccionados: [],
      copiados: [],
      esCortar: false,
      rutaCopia: null,
      copiando: false,
      viewMenu: false,
      itemsPrevistos: Math.round(Math.random() * 4),
      menuItems: [
        {
          label: "Zona de archivos",
        },
        {
          label: "Todos",
          value: "archivos",
          icon: "folder-open",
        },
        {
          label: "Mis archivos",
          value: "misArchivos",
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
          label: "Compartidos",
          value: "compartidos",
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
    estaVacio() {
      if(!this.currentChild) return true
      return this.currentChild.numElements==0
    },
    loading() {
      return this.$store.getters.loading;
    },
    explorandoCarpeta() {
      return (
        !this.specialFolders.includes(this.$route.path) &&
        !this.specialFolders.includes(this.ultimoClick)
      );
    },
    permisoEscritura() {
      if (!this.carpeta) return false;
      const r = tengoPermiso(this.carpeta, this.$strapi.user, "escritura");
      console.warn("permisoEscritura", r);
      return r;
    },
    permisoAdministracion() {
      if (!this.carpeta) return false;
      return tengoPermiso(this.carpeta, this.$strapi.user, "escritura");
    },
    seleccionadosMovibles() {
      for (const s of this.seleccionados) {
        if (s.tipo == "archivo") {
          const archivo = this.carpeta.archivos.find((x) => x.id == s.id);
          if (!archivo) return false;
          if (
            !this.permisoAdministracion &&
            !soyPropietario(archivo, this.$strapi.user)
          )
            return false;
        } else {
          const carpeta = this.carpeta.subcarpetas.find((x) => x.id == s.id);
          if (!carpeta) return false;
          if (carpeta.inamovible) return false;
          if (!tengoPermiso(carpeta, this.$strapi.user, "administracion"))
            return false;
        }
      }
      return true;
    },
    seleccionadosAdministrables() {
      for (const s of this.seleccionados) {
        if (s.tipo == "archivo") {
          const archivo = this.carpeta.archivos.find((x) => x.id == s.id);
          if (!archivo) return false;
          if (
            !this.permisoAdministracion &&
            !soyPropietario(archivo, this.$strapi.user)
          )
            return false;
        } else {
          const carpeta = this.carpeta.subcarpetas.find((x) => x.id == s.id);
          if (!carpeta) return false;
          if (!tengoPermiso(carpeta, this.$strapi.user, "administracion"))
            return false;
        }
      }
      return true;
    },
  },
  watch: {
    loading(newValue) {
      if (newValue) this.$set(this, "carpeta", {});
      else 
      this.$nextTick(()=> {
        this.currentChild = this.$refs.child
      })
    },
    seleccionando(newValue) {
      this.seleccionados.splice(0, this.seleccionados.length);
    },
    modoLista(newValue) {
      this.$store.commit(
        "setVistaArchivos",
        newValue ? "listado" : "miniaturas"
      );
    },
  },
  mounted() {
    if (!this.menuItems.find((x) => x.value === this.menuActual))
      this.menuActual = "archivos";
    this.modoLista = this.$store.state.vistaArchivos == "listado";
    this.currentChild = this.$refs.child
  },
  methods: {
    addFiles(files) {
      console.log("addFiles", files);
      if (this.carpeta)
        uploadFiles(this.carpeta, files, this.$strapi, this.$toast);
    },
    onMenu(value) {
      if (screen.width < 640 && !this.viewMenu) {
        this.viewMenu = true;
        return;
      }
      this.menuActual = value;
      const ruta =
        value === "archivos"
          ? this.$config.archivosRuta
          : this.$config.archivosRuta + "/" + value;
      this.ultimoClick = ruta;
      this.$router.push(ruta);
      if (screen.width < 640) this.viewMenu = false;
    },
    onRuta(obj) {
      console.log("onRuta", obj);
      this.ultimoClick = null;
      this.seleccionando = false;
      const ruta = typeof obj === "object" ? obj.ruta : obj;
      this.itemsPrevistos =
        typeof obj === "object" && "archivos" in obj
          ? obj.archivos.length + obj.subcarpetas.length
          : Math.floor(Math.random(3)) + 1;
      this.$router.push(ruta);
      this._updateBreadcrumb(ruta);
    },
    async onPapelera(elem) {
      console.log("ruta Actual", this.$route.path);
      this.borrando = true
      const that = this
      setTimeout(()=>{
        that.borrando = false
      }, 1500)
      if (elem.carpeta && elem.carpeta.ruta == this.$route.path) {
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
      console.log("onSeleccion", lista);
      this.seleccionados.splice(0, this.seleccionados.length);
      for (const id of lista.carpetas)
        this.seleccionados.push({ tipo: "carpeta", id });
      for (const id of lista.archivos)
        this.seleccionados.push({ tipo: "archivo", id });
    },
    buscar() {},    
    borrar() {
      console.log('BORRAR SELECCIONADOS')
      for(const item of this.seleccionados) {
        console.log('carpetas', this.$refs.child.$refs.carpeta.$refs.carpetas)
        console.log('archivos', this.$refs.child.$refs.carpeta.$refs.archivos)
        if(item.tipo=='carpeta')
        {
          const comp = this.$refs.child.$refs.carpeta.$refs.carpetas.find(x=>x.carpeta.id==item.id)
          console.log('found', comp)
          if(comp)
          comp.enviarAPapelera()
        }
        else {
          const comp = this.$refs.child.$refs.carpeta.$refs.archivos.find(x=>x.localValue.id==item.id)
          console.log('found', comp)
          if(comp)
          comp.enviarAPapelera()
        }
      }
      this.seleccionando = false
      console.log('FIN BORRAR S')
    },
    vaciarPapelera() {
      this.$confirm({
        message: `Esto eliminará permanentemente todos los archivos y carpetas en la papelera.<br> Esta operación es irreversible.<br>¿Desea continuar?`,
        yes: `Vaciar Papelera`,
        no: "Cancelar",
        confirmed: async () => {
          this.$refs.child.vaciarPapelera()
        },
      })      
    },
    nuevaCarpeta() {
      this.$refs.child.$refs.carpeta.nueva()
    },
    copiar() {
      this.copiados.splice(0, this.copiados.length);
      for (const item of this.seleccionados) {
        this.copiados.push(item);
      }
      this.seleccionados.splice(0, this.seleccionados.length);
      this.esCortar = false;
      this.rutaCopia = this.$route.path;
      this.seleccionando = false;
    },
    cortar() {
      this.copiar();
      this.esCortar = true;
    },    
    onCopiado(elem) {
      console.log('onCopiado', elem)
      this.copiados.push(elem)
      this.esCortar = false;
      this.rutaCopia = elem.ruta
    },
    onCortado(elem) {
      console.log('onCortado', elem)
      this.copiados.push(elem)
      this.esCortar = true;
      this.rutaCopia = elem.ruta
    },
    cancelar() {
      this.copiando = false;
      this.copiados.splice(0, this.copiados.length);
    },
    async pegar() {
      if (this.rutaCopia != this.$route.path) {
        this.copiando = true;
        return new Promise(async (resolve, reject) => {
          for (const item of this.copiados) {
            if (this.esCortar) {
              await this.$strapi
                .update(item.tipo + "s", item.id, {
                  data: {
                    padre: this.carpeta.id,
                  },
                })
                .catch((e) => {
                  reject(e);
                });
            } else {
              const entry = await this.$strapi
                .findOne(item.tipo, item.id)
                .update(item.tipo + "s", item.id, {
                  data: {
                    padre: this.carpeta.id,
                  },
                })
                .catch((e) => {
                  reject(e);
                });
            }
          }
          resolve("ok");
        })
          .then((result) => {
            this.copiando = false;
            this.copiados.splice(0, this.copiados.length);
          })
          .catch((e) => {
            this.copiando = false;
            this.$toast.error("Ha habido un error");
          });
      }
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

.right-panel {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0rem 1fr;
}

.right-panel.explorador {
  grid-template-rows: 4rem 1fr;
}

@screen lg {
  .right-panel {
    grid-template-columns: 1fr 270px;
  }

  .options .btn {
    width: 100%;
  }
}

.activar-papelera .fa-trash-alt {
  animation: 1s shake cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}


</style>