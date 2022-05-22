<template>
  <div class="select-none">
    <div
      v-if="thereErrors"
      class="flex w-full h-full text-3xl justify-center items-center"
    >
      <span>{{ errors.message }}</span>
    </div>
    <div
      v-else-if="cargando"
      class="flex w-full h-full text-3xl justify-center items-center text-gray"
    >
      <icon icon="spinner spin" />
    </div>
    <div v-else-if="carpetaActual" class="flex flex-col">
      <h1
        v-if="
          mostrarTitulo && (carpetaActual.nombreOriginal || carpetaActual.nombre)
        "
        class="flex justify-between"
      >
        <span>{{ carpetaActual.nombreOriginal || carpetaActual.nombre }}</span>
        <span
          v-if="mostrarControles"
          class="self-center cursor-pointer text-gray text-xl ml-2 pl-2 pr-1"
          @click="mostrarPropsCarpetaActual = true"
          >&vellip;</span
        >
      </h1>
      <FolderProps
        v-if="mostrarTitulo && mostrarControles"
        textAccept="Guardar"
        :value="carpetaActual"
        @accept="guardarPropsCarpeta"
        :showIt="mostrarPropsCarpetaActual"
        @close="mostrarPropsCarpetaActual = false"
      />
      <div
        v-if="!carpetas.length && (!mostrarArchivos || !archivos || !archivos.length)"
      >
        {{ placeholder }}
      </div>
      <Carpeta 
        v-for="carpeta of carpetas"
        :key="'carpeta-' + carpeta.id"
        :boxClass=boxClass
        :iconClass=iconClass
        :textClass=textClass
        :subtextClass=subtextClass
        :mostrarFecha=mostrarFecha
        :mostrarControles=mostrarControles
        class="w-full text-lg md:text-xl lg:text-2xl"
        :data="carpeta"
        @click="flexNavigateTo"
        />
      <template v-if="mostrarArchivos">
        <Archivo
          v-for="archivo of archivos"
          :key="'archivo-' + archivo.id"
          :boxClass=boxClass
          :iconClass=iconClass
          :textClass=textClass
          :subtextClass=subtextClass
          :mostrarFecha=mostrarFecha
          :mostrarControles=mostrarControles
          class="w-full"
          :data="archivo"
        />
      </template>
    </div>
  </div>
</template>

<script>
import vmodel from "~/mixins/vmodel.js";
import fileIcon from "~/mixins/fileIcon.js";
import validation from "@/mixins/validation";
export default {
  props: {
    inside: {
      type: Boolean,
      required: false,
      default: false,
    },
    idRootFolder: { type: Number, required: false, default: 0 },
    modoNavegacion: {
      type: String,
      validator(value) {
        return ["Route", "Main", "Embed", "Click"].includes(value);
      },
      required: false,
      default: "Click",
    },
    updateBreadcrumb: { type: Boolean, required: false, default: false },
    textClass: {},
    subtextClass: {},
    iconClass: { type: String, required: false, default: "text-6xl" },
    boxClass: { type: String, required: false, default: "w-16 mr-3" },
    mostrarTitulo: { default: true },
    mostrarControles: {
      type: Boolean,
      required: false,
      default: false,
    },
    mostrarArchivos: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarUploader: {},
    mostrarFecha: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarDescripcion: {},
    mostrarTamano: {},
    placeholder: {
      type: String,
      required: false,
      default: "No hay nada que mostrar",
    },
  },
  mixins: [vmodel, fileIcon, validation],
 // fetchOnServer: false,
  computed: {
    carpetaActualJSON() {
      return JSON.stringify(this.carpetaActual)
    }
  },
  watch: {
    localValue(newValue) {
      console.log("localValue changed!!", newValue, this.localValue);
      this.$fetch();
      // this.updateBreadcrumb()
    },
    carpetaActualJSON() {
      console.warn("CARPETAACTUAL.WATCH");
      this.carpetas = []
      this.archivos = []
      if (!this.carpetaActual) return;
      if (this.updateBreadcrumb && this.carpetaActual.ruta) this._updateBreadcrumb();
      
      if(!Array.isArray(this.carpetaActual) && this.inside)
        this.archivos= this.carpetaActual.archivos
      
      console.warn("INSIDE", this.inside);
      console.warn("carpetaActual", this.carpetaActual);
      const r =
        !Array.isArray(this.carpetaActual) && this.inside
          ? [...this.carpetaActual.subcarpetas]
          : Array.isArray(this.carpetaActual)
          ? {...this.carpetaActual}
          : [this.carpetaActual];
      if (
        this.carpetaActual.padre &&
        (this.carpetaActual.id !== this.idRootFolder || this.inside)
      )
        r.unshift({ ...this.carpetaActual.padre, nombreMostrar: ".." });
      console.warn("R", r);
      this.carpetas = r
    },
  },
  // created() {
  // this.myfetch()
  // },
  data() {
    return {
      carpetaActual: null,
      cargando: true,
      carpetas: [],
      archivos: [],
      mostrarPropsCarpetaActual: false,
    };
  },

  // no consigo que funcione si lo pongo como el normal fetch()
  async fetch() {
    console.log("fetch!", this.localValue);
    this.clearErrors();
    if (this.localValue && typeof this.localValue === "object") {
      console.warn("ES UN OBJETO O ARRAY");
      this.carpetaActual = this.localValue;
      this.cargando = false;
    } else {
      console.warn("ES UN ID/RUTA");
      console.log("go on");
      this.cargando = true;
      //this.$strapi.findOne(
      //"carpetas",
      //this.localValue
      //)
      //.then((carpeta) => {

      await this.$strapi
        .find("carpetas", {
          filters: {
            ...(typeof this.localValue === "number"
              ? { id: { $eq: this.localValue } }
              : { ruta: { $eq: this.localValue } }),
          },
          populate: "*",
        })
        .then((res) => {
          console.log("myfetch result", res);
          if (res.error) {
            this.setErr(res.error);
            if (typeof this.localValue === "string")
              this.carpetaActual = {
                nombre: '',
                ruta: this.localValue,
                padre: null,
                subcarpetas: [],
                archivos: [],
              };
          } else {
            const carpeta = res.data[0];
            console.log("fetch result", carpeta);
            if (carpeta) {
              // this.$set(this, 'carpetaActual', carpeta)
              this.carpetaActual = carpeta;
              // for(const k in carpeta)
              // this.$set(this.carpetaActual, k, carpeta[k])
              this.$emit("loaded", carpeta);
            } else this.carpetaActual = null;
          }
          this.cargando = false;
        })
        .catch((e) => {
          console.error("error", e);
          this.setErr(e);
          this.cargando = false;
        });
    }
  },
  methods: {
    flexNavigateTo(carpeta) {
      console.warn('FLEXNAVIGATETO', carpeta)
      if (!carpeta.publishedAt) return;
      console.log("navigated to", carpeta.id, this.modoNavegacion);
      if (this.modoNavegacion === "Embed") this.localValue = carpeta.id;
      else if (this.modoNavegacion === "Main") {
        this.localValue = carpeta.id;
        console.log();
        history.pushState({}, null, carpeta.ruta);
        this.$emit("navigated", carpeta);
      } else if (this.modoNavegacion === "Click") {
        this.$emit("click", carpeta);
      } else this.$router.push(carpeta.ruta);
    },
    _updateBreadcrumb() {
      console.log("archivos.updateBreadcrumb()");
      const carpeta = this.carpetaActual;
      if (!carpeta.ruta) return;
      const rootData = this.$store.getters.getRouteData(
        this.$config.archivosRuta
      );
      const breadcrumb = [];
      const parts = carpeta.ruta.split("/").filter((x) => !!x);
      // parts.shift()
      let rutaParcial = "";
      const that = this;
      while (parts.length) {
        const part = parts.shift();
        rutaParcial += "/" + part;
        const ruta = rutaParcial;
        // const base = ruta===this.$config.archivosRuta?this.$store.getters.getRouteData(ruta):{}
        breadcrumb.push({
          name: part,
          href: rutaParcial,
          click:
            this.modoNavegacion === "Click"
              ? async (event) => {
                  this.$emit("click", ruta);
                }
              : this.modoNavegacion === "Main"
              ? async (event) => {
                  console.log("clicked!", event, ruta);
                  event.preventDefault();
                  event.stopPropagation();
                  const [carpeta] = await this.$strapi.find("carpetas", {
                    ruta,
                  });
                  console.log("carpeta", carpeta);
                  console.log("current carpetaId", that.carpetaActualId);
                  if (carpeta) that.carpetaActualId = carpeta.id;
                  history.pushState({}, null, carpeta.ruta);
                  // that.updateBreadcrumb()
                  return false;
                }
              : null,
          icon: rootData.icon,
        });
      }

      this.$store.commit("setNextPathBreadcrumb", breadcrumb);
      this.$store.commit("updateBreadcrumb");
    },
    guardarPropsCarpeta(carpeta) {
      console.log("GuardarPropsCarpeta", carpeta);
      this.$strapi
        .update("carpetas", carpeta.id, carpeta)
        .then((result) => {
          if (result.id === parseInt(this.carpetaActual.id))
            this.$set(this, "carpetaActual", result);
          else {
            const idx = this.carpetaActual.subcarpetas.findIndex(
              (x) => parseInt(x.id) === result.id
            );
            this.$set(this.carpetaActual.subcarpetas, idx, result);
          }

          this.$toast.success("Datos de carpeta guardados", {
            position: "bottom-left",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false,
          });
        })
        .catch((error) => {
          console.warn(JSON.stringify(error));
          let msg = "Error al guardar";
          switch (error.statusCode) {
            case 403:
              msg = "No tienes permisos";
          }
          this.$toast.error(msg, {
            position: "bottom-left",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false,
          });
        });
    },
  },
};
</script>