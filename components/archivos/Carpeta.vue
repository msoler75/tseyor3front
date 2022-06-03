<template>
  <Droppable
    class="w-full flex select-none"
    v-model="dragging"
    :dropAllowed="escritura"
    :class="
      (dragging ? 'bg-yellow' : '') +
      (cargando || thereErrors ? ' max-h-[70vh] justify-center' : '')
    "
    @drop.prevent.stop="drop"
  >
    <div v-if="explorando">
      <div
        v-if="thereErrors"
        class="flex w-full h-full text-3xl justify-center items-center"
      >
        <span>{{ errors.message }}</span>
      </div>
      <Loader v-else-if="cargando" />
      <div v-else-if="carpeta" class="w-full flex flex-col">
        <h1
          v-if="mostrarTitulo && (carpeta.nombreOriginal || carpeta.nombre)"
          class="flex justify-between relative"
        >
          <span>{{ carpeta.nombreOriginal || carpeta.nombre }}</span>
          <span
            v-if="mostrarControles"
            class="self-center cursor-pointer text-gray text-xl ml-2 pl-2 pr-1"
            @click="mostrarMenu = true"
          >
            <Loader v-if="guardando" :spinner="true" />
            <span v-else>&vellip;</span></span
          >
          <MenuContextual v-model="mostrarMenu" :items="menuItems" />
        </h1>
        <PropiedadesCarpeta
          v-if="mostrarTitulo && mostrarControles"
          textAccept="Guardar"
          :carpeta="carpeta"
          @guardar="guardar"
          v-model="mostrarPropiedades"
          :administracion="administracion"
        />
        <div
          v-if="
            !carpetas.length &&
            (!mostrarArchivos || !archivos || !archivos.length)
          "
        >
          {{ placeholder }}
        </div>
        <Carpeta
          v-for="(subcarpeta, index) of carpetas"
          :id="'carpeta-' + subcarpeta.id"
          :key="'carpeta-' + subcarpeta.id"
          v-model="carpetas[index]"
          :boxClass="boxClass"
          :iconClass="'text-6xl ' + iconClass"
          :textClass="textClass"
          :subtextClass="subtextClass"
          :mostrarFecha="mostrarFecha"
          :mostrarTamano="mostrarTamano"
          :mostrarControles="mostrarControles"
          class="w-full lg:text-lg px-2 py-1 md:py-2"
          @click="$emit('click', $event)"
          @dragenter="dragging = false"
          @dragleave="dragging = true"
        />
        <template v-if="mostrarArchivos">
          <Archivo
            v-for="(archivo, index) of archivos"
            :key="'archivo-' + archivo.id"
            v-model="archivos[index]"
            :boxClass="boxClass"
            :iconClass="'text-5xl ' + iconClass"
            :textClass="textClass"
            :subtextClass="subtextClass"
            :mostrarFecha="mostrarFecha"
            :mostrarTamano="mostrarTamano"
            :mostrarControles="mostrarControles"
            class="
              w-full
              lg:text-lg
              px-2
              py-1
              md:py-2
              hover:bg-gray-100
              dark:hover:bg-gray-900
              rounded-lg
            "
          />
        </template>
      </div>
    </div>
    <div v-else>
      <a
        class="flex w-full overflow-hidden group"
        target="_blank"
        @click.stop.prevent="flexNavigateTo(carpeta)"
        :href="carpeta ? carpeta.ruta : ''"
      >
        <div
          class="flex flex-shrink-0 justify-center items-center"
          :class="
            boxClass +
            (localValue.publishedAt ? ' text-orange-200' : ' text-gray-500')
          "
        >
          <div
            v-if="localValue.nombreMostrar === '..'"
            class="relative flex justify-center items-center"
            :class="localValue.publishedAt ? 'cursor-pointer' : ''"
          >
            <icon icon="fas fa-folder" class="absolute" :class="iconClass" />
            <icon
              icon="fas fa-arrow-left"
              class="group-hover:-translate-x-1 text-xs text-black absolute"
            />
          </div>
          <div v-else class="flex items-center justify-center">
            <icon
              icon="folder"
              :class="
                iconClass +
                (localValue.publishedAt
                  ? ' group-hover:hidden cursor-pointer'
                  : '')
              "
            />
            <icon
              v-if="localValue.publishedAt"
              icon="folder-open"
              class="hidden group-hover:block cursor-pointer"
              :class="iconClass"
              style="transform: translate(2.5px, -1px)"
            />
          </div>
        </div>
        <div class="w-full flex flex-col justify-center items-start">
          <span
            :title="localValue.nombreMostrar || localValue.nombre"
            class="
              xm:w-48
              lg:w-64
              max-w-full
              overflow-hidden overflow-ellipsis
              whitespace-nowrap
              font-bold
              text-gray-dark-900
              dark:text-gray-50
            "
            :class="
              textClass +
              (localValue.publishedAt
                ? ' cursor-pointer'
                : ' pointer-events-none')
            "
            >{{ localValue.nombreMostrar || localValue.nombre }}</span
          >
          <div
            class="flex w-full justify-start text-xs text-diminished"
            :class="subtextClass"
          >
            <span v-if="mostrarTamano" class="capitalize">
              {{ numItems }} elem.&nbsp;
            </span>
            <span v-if="mostrarFecha" class="capitalize">{{
              $dayjs(localValue.createdAt).format("DD. MMM. YYYY, HH:mm")
            }}</span>
          </div>
        </div>
        <span
          v-if="mostrarControles && localValue.nombreMostrar !== '..'"
          class="self-center cursor-pointer text-gray text-xl ml-2 pl-2 pr-1"
          >&vellip;</span
        >
        <span v-else-if="mostrarControles" class="ml-2 pl-2 pr-1">&nbsp;</span>
      </a>
    </div>
  </Droppable>
</template>

<script>
import { populateCarpeta } from "@/assets/js/carpeta";
import loadImage from "blueimp-load-image";
import vmodel from "~/mixins/vmodel.js";
import validation from "@/mixins/validation";
export default {
  mixins: [vmodel, validation],
  props: {
    explorando: {
      type: Boolean,
      required: false,
      default: false,
    },
    padre: {},
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
      default: true,
    },
    mostrarArchivos: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarUploader: {},
    mostrarTamano: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarFecha: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarDescripcion: {},
    placeholder: {
      type: String,
      required: false,
      default: "No hay nada que mostrar",
    },
  },
  data() {
    return {
      /* ESTA VARIABLE SE TIENE QUE ASIGNAR LOS DATOS DE LA CARPETA */
      carpeta: null,
      dragging: false,
      cargando: true,
      guardando: false,
      carpetas: [],
      archivos: [],
      mostrarMenu: false,
      mostrarPropiedades: false,
    };
  },
  // fetchOnServer: false,
  computed: {
    menuItems() {
      const items = [];
      if (this.administracion) {
        items.push({
          label: "Renombrar",
          click: this.renombrar,
        });
      }
      items.push({
        label: "Propiedades",
        click: () => {
          this.mostrarPropiedades = true;
        },
      });
      return items;
    },
    carpetaJSON() {
      console.warn("CARPETA ACTUAL", this.carpeta);
      return JSON.stringify(this.carpeta);
    },
    escritura() {
      return this.tengoPermiso("escritura");
    },
    administracion() {
      return this.tengoPermiso("administracion");
    },
    numItems() {
      if (!this.carpeta) return 0;
      return (
        (this.carpeta.subcarpetas ? this.carpeta.subcarpetas.length : 0) +
        (this.carpeta.archivos ? this.carpeta.archivos.length : 0)
      );
    },
  },
  watch: {
    localValue(newValue) {
      console.warn("LOCAL CHANGED");
      this.$fetch();
    },
    cargando(newValue) {
      console.warn("CARGANDO", newValue);
    },
    carpetaJSON() {
      console.log("watch carpetaJSNO", this.padre);
      if (!this.carpeta || !("subcarpetas" in this.carpeta)) return;

      if (this.padre) this.carpeta.padre = this.padre;

      console.warn("carpeta.WATCH", this.localValue);

      this.carpetas = [];
      this.archivos = [];
      //      if (this.updateBreadcrumb && this.carpeta.ruta) this.updateBreadcrumb();

      if (!Array.isArray(this.carpeta) && this.explorando)
        this.archivos = this.carpeta.archivos;

      console.warn("explorando", this.explorando);
      console.warn("carpeta", this.carpeta);
      const r =
        !Array.isArray(this.carpeta) && this.explorando
          ? [...this.carpeta.subcarpetas]
          : Array.isArray(this.carpeta)
          ? { ...this.carpeta }
          : [this.carpeta];
      if (this.carpeta.padre && this.carpeta.id !== this.idRootFolder)
        r.unshift({ ...this.carpeta.padre, nombreMostrar: ".." });
      console.warn("R", r);
      this.carpetas = r;
    },
    dragging(newValue) {
      // if (newValue) this.$emit("dragenter");
      // else this.$emit("dragleave");
    },
  },
  async fetch() {
    console.log("fetch!", this.localValue);
    this.clearErrors();
    let toFetch = this.localValue;
    if (
      this.localValue &&
      typeof this.localValue === "object" &&
      "ruta" in this.localValue
    ) {
      console.warn("ES UN OBJETO DE TIPO CARPETA");
      this.carpeta = this.localValue;
      this.cargando = false;
      //if ("lecturaUsuarios" in this.carpeta) return;
      //toFetch = this.carpeta.id;
      if (this.updateBreadcrumb) this._updateBreadcrumb();
      return;
    }

    this.cargando = true;
    if (typeof this.localValue === "string") {
      this.carpeta = { ruta: this.localValue };
      if (this.updateBreadcrumb) this._updateBreadcrumb();
    }
    console.warn("ES UN ID/RUTA");

    console.log("go on");
    await this.$strapi
      .find("carpetas", {
        filters: {
          ...(typeof toFetch === "number"
            ? { id: { $eq: toFetch } }
            : { ruta: { $eq: toFetch } }),
        },
        populate: populateCarpeta,
      })
      .then((res) => {
        console.log("myfetch result", res);
        if (res.error) {
          this.setErr(res.error);
          if (typeof toFetch === "string")
            this.carpeta = {
              nombre: "",
              ruta: toFetch,
              padre: null,
              subcarpetas: [],
              archivos: [],
            };
        } else {
          const carpeta = res.data[0];
          console.log("fetch result", carpeta);
          if (carpeta) {
            // this.$set(this, 'carpeta', carpeta)
            this.carpeta = carpeta;
            // for(const k in carpeta)
            // this.$set(this.carpeta, k, carpeta[k])
            this.$emit("loaded", carpeta);
          } else {
            this.setErr({ message: "Esta carpeta no existe" });
            this.carpeta = null;
          }
        }
        this.cargando = false;
      })
      .catch((e) => {
        console.error("error", e);
        this.setErr(e);
        this.cargando = false;
      });
  },
  methods: {
    renombrar() {
      this.$prompt({
        message: "Nuevo nombre",
        response: this.carpeta.nombre,
        accepted: async (response) => {
          //const regex = new RegExp(this.carpeta.nombre + "$");
          //this.carpeta.ruta = this.carpeta.ruta.replace(regex, "");
          //this.carpeta.ruta += "/" + response;
          //this.carpeta.nombre = response;
          await this.guardar(response);
          this.$router.replace(this.carpeta.ruta);
        },
      });
    },
    async drop(e) {
      const items = e.detail
        ? e.detail.dataTransfer.items
        : e.dataTransfer.items;
      /*var someFile = false
      for (const item of items)
        if (item.kind == 'file') someFile = true*/

      const files = e.dataTransfer.files;

      const formData = new FormData();
      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        let media = {
          url: null,
          size: file.size / 1024,
        };
        if (this.isImage(file.name)) {
          let src = await new Promise((success) => {
            loadImage(
              file,
              function (canvas) {
                console.log("IMG", canvas);
                success(canvas.toDataURL());
              },
              {
                maxWidth: 600,
                maxHeight: 300,
                minWidth: 100,
                minHeight: 50,
                canvas: true,
              } // Options
            );
          });
          /*src = await new Promise((success) => {
              var reader = new FileReader();
              reader.addEventListener("load", function () {
                  success(this.result);
              }, false);
              reader.readAsDataURL(file);
          })*/
          media = {
            url: src,
            size: file.size / 1024,
          };
        }

        if ("archivos" in this.carpeta)
          this.carpeta.archivos.push({
            id: 0,
            nombre: file.name,
            uploading: true,
            carpeta: this.carpeta.id,
            media,
          });
        formData.append("files", file);
      }

      const toastId = this.$toast("Subiendo archivos... 0%", {
        timeout: 99999999,
        pauseOnHover: false,
        closeOnClick: false,
        draggable: false,
        showCloseButtonOnHover: false,
        closeButton: false,
        icon: false,
      });

      this.$strapi
        .upload(formData, (e) => {
          console.warn(this.progreso, e);
          let percent_completed = Math.round((e.loaded / e.total) * 100);
          console.log(percent_completed);
          //dataObj.max=e.total
          //dataObj.value=e.loaded
          //this.progreso =
          this.$toast.update(toastId, {
            content: `Subiendo archivos... ${percent_completed}%`,
          });
        })
        .then((res) => {
          this.$toast.update(toastId, {
            content: "¡Completado!",
            options: {
              timeout: 1000,
            },
          });
          /*setTimeout(function(){
            this.$toast.dismiss(toastId);
          }.bind(this), 1000)
*/
          console.log("res", res);
          for (const file of res) {
            this.$strapi
              .create(
                "archivos",
                {
                  nombre: file.name,
                  carpeta: this.carpeta.id,
                  media: file.id,
                },
                {
                  populate: ["media"],
                }
              )
              .then((res) => {
                console.warn("ARCHIVO RES", res);
                if (res.data && "archivos" in this.carpeta) {
                  const a = this.carpeta.archivos.find(
                    (x) => x.uploading && x.nombre == file.name
                  );
                  if (a) {
                    a.id = res.data.id;
                    // a.media = res.data.media
                    delete a.uploading;
                  }
                }
              });
          }
        });
      //this.$axios.post('/upload', formData
    },
    isImage(url) {
      return url.match(/\.(png|webp|svg|jpe?g)$/i);
    },
    // comprueba si el usuario tiene acceso segun los permisos indicados
    tengoPermiso(modo) {
      // return true;
      console.warn("tengopermisos", modo);
      console.log("carpeta", this.carpeta);
      if (!modo) return false;
      if (!this.carpeta) return false;
      if (!("lecturaUsuarios" in this.carpeta)) return false;

      const user = this.$strapi.user;

      if (this.soyPropietario()) return true;

      if (this.carpeta.soloSuperAdmin) return false;

      if (modo == "lectura" && this.tengoPermiso("escritura")) return true;
      if (modo == "escritura" && this.tengoPermiso("administracion"))
        return true;

      var acceso = modo == "escritura" ? this.carpeta.escrituraAcceso : "Nadie";

      if (acceso === "Todos") return true;
      if (!user || !user.id) return false;
      if (acceso === "Autenticados") return true;

      const rol = user.role.name;
      if (acceso === "Delegados" && rol.match(/elegado/)) return true;
      if (acceso === "Muul" && rol.match(/uul/)) return true;

      if (this.carpeta[modo + "Usuarios"].find((x) => x.id === user.id))
        return true;

      if (modo != "administracion") {
        for (const g of this.carpeta[modo + "Grupos"]) {
          if (user.grupos.find((x) => x.id === g.id)) {
            return true;
          }
        }
        for (const e of this.carpeta[modo + "Equipos"]) {
          if (user.equipos.find((x) => x.id === e.id)) {
            return true;
          }
        }
      }
      return false;
    },

    soyPropietario() {
      if (!this.carpeta) return false;
      const user = this.$strapi.user ? this.$strapi.user : null;
      if (
        !user ||
        !user.id ||
        !("propietario" in this.carpeta) ||
        !this.carpeta.propietario
      )
        return false;
      const aid = this.carpeta.propietario.id;
      return aid === user.id || parseInt(aid) === user.id;
    },

    // guarda datos de la carpeta, o solo el nombre
    guardar(datos) {
      this.guardando = true;
      console.log("guardar carpeta", JSON.stringify(datos));
      const carpeta = typeof datos === "object" ? datos : null;
      const nuevoNombre = typeof datos === "string" ? datos : null;
      const idCarpeta = carpeta ? carpeta.id : this.carpeta.id;
      if (carpeta) {
        console.log(
          "escrituraEquipos",
          JSON.stringify(carpeta.escrituraEquipos)
        );
        if (typeof carpeta.escrituraEquipos === "undefined")
          console.warn("escrituraEquipos undefined");
        if (!carpeta.escrituraEquipos) console.warn("escrituraEquipos NULL");
        const fields = [
          "administracionUsuarios",
          "lecturaUsuarios",
          "lecturaGrupos",
          "lecturaEquipos",
          "escrituraUsuarios",
          "escrituraGrupos",
          "escrituraEquipos",
        ];
        for (const field of fields) {
          console.log(field);
          if (
            field in carpeta &&
            carpeta[field] &&
            typeof carpeta[field] === "object"
          )
            carpeta[field] = carpeta[field].map((x) => x.id);
        }
        if ("padre" in carpeta && carpeta.padre)
          carpeta.padre = carpeta.padre.id;
      }
      return this.$strapi
        .update(
          "carpetas",
          idCarpeta,
          nuevoNombre ? { nombre: nuevoNombre } : carpeta,
          populateCarpeta
        )
        .then((response) => {
          if (response.error) {
            let msg = "No se pudo guardar";
            if (this.setErr) {
              this.setErr(response);
              if (this.errors.message) msg = this.errors.message;
            }
            this.$toast.error(msg);
          } else {
            const carpeta = response.data;
            if (carpeta.id === parseInt(this.carpeta.id))
              //this.$set(this, "carpetaActual", result);
              this.carpeta = carpeta;
            if (!nuevoNombre) this.$toast.success("Carpeta guardada");
          }
          this.guardando = false;
        })
        .catch((error) => {
          let msg = "No se pudo guardar";
          if (this.setErr) {
            this.setErr(error);
            if (this.errors.message) msg = this.errors.message;
          }
          this.$toast.error(msg);
          this.guardando = false;
        });
    },
    flexNavigateTo(carpeta) {
      console.warn("FLEXNAVIGATETO", carpeta, this.modoNavegacion);
      // if (!carpeta.publishedAt) return;
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
      const carpeta = this.carpeta;
      if (!carpeta.ruta) {
        console.log("no carpeta");
        return;
      }
      const breadcrumb = [];
      carpeta.ruta
        .split("/")
        .filter((x) => !!x)
        .reduce((pv, cv) => {
          breadcrumb.push({
            name: cv,
            href: pv + "/" + cv,
            click: this.flexNavigateTo,
            icon: "folder-open",
          });
          return pv + "/" + cv;
        }, "");
      this.$store.commit("updateBreadcrumb", breadcrumb);
    },
  },
};
</script>