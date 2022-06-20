<template>
  <Droppable
    class="select-none relative"
    v-model="dragging"
    :dropAllowed="permisoEscritura"
    :class="
      (dragging ? 'bg-green' : '') +
      (cargando || thereErrors ? ' max-h-[70vh] justify-center' : '')
    "
    @dragstart.prevent=""
    @drop.prevent.stop="drop"
    @contextmenu.native.prevent="mostrarMenu = $event"
    :title="
      carpeta && !carpeta.publishedAt ? 'Esta carpeta está en la papelera' : ''
    "
  >
    <div v-if="explorando" :class="vista == 'listado' ? '' : 'w-full'">
      <div
        v-if="thereErrors"
        class="flex h-full text-3xl justify-center items-center"
      >
        <span>{{ errors.message }}</span>
      </div>
      <LoaderFolders
        v-else-if="cargando"
        :vista="vista"
        class="w-full py-5 px-4 h-full text-2xl surface"
      />
      <div v-else-if="carpeta" class="flex w-full flex-col justify-between">
        <div class="px-2 mb-5 flex items-center justify-start relative z-10">
          <span
            v-if="getpadre && !seleccionando"
            class="cursor-pointer pr-5 flex items-center"
            title="Subir un nivel"
            @click="flexNavigateTo(getpadre)"
          >
            <icon icon="chevron-left" class="" />
          </span>
          <h1 v-if="mostrarTitulo && carpeta.nombre" class="flex-grow !mb-0">
            <span>{{ carpeta.nombre }}</span>
          </h1>

          <EllipBtnLoader
          v-if="!seleccionandoCarpeta"
            class="ml-auto"
            :loader="procesando"
            :controls="mostrarControles && !seleccionando"
            @click="mostrarMenu = $event"
          />
        </div>
          <div
          v-if="
            seleccionandoCarpeta &&
            (!carpetas || !carpetas.length)            
          "
          class="w-full min-h-[30vh] flex flex-col space-y-4 justify-center items-center text-diminished"
        >
          <icon icon="folder-open" class="text-6xl opacity-25"/>
        </div>
        <div
          v-else-if="
            !seleccionandoCarpeta &&
            (!carpetas || !carpetas.length) &&
            (!mostrarArchivos || !archivos || !archivos.length)
          "
          class="w-full min-h-[30vh] flex flex-col space-y-4 justify-center items-center text-diminished"
        >
          <icon icon="folder-open" class="text-6xl opacity-25"/>
          <span>{{ placeholder }}</span>
        </div>
        <list-transition group :duration="300"
          :isFlexGrid="vista != 'listado'"
          v-else
          class="w-full"
          :class="vista == 'listado' ? 'block' : 'mygrid'"
        >
          <Carpeta
            v-for="(subcarpeta, index) of carpetas"
            class="list-item"
            ref="carpetas"
            :key="'carpeta-'+subcarpeta.id"
            v-model="carpetas[index]"
            :boxClass="boxClass"
            :iconClass="iconClass"
            :textClass="textClass"
            :subtextClass="subtextClass"
            :mostrarFecha="mostrarFecha"
            :mostrarTamano="mostrarTamano"
            :mostrarControles="mostrarControles && !seleccionandoCarpeta && !subcarpeta.subirNivel"
            :seleccionando="seleccionando"
            :vista="vista"
            @click="$emit('click', $event)"
            @dragenter="dragging = false"
            @dragleave="dragging = true"
            @papelera="onPapelera"
            @copiado="$emit('copiado', {...$event, ruta: carpeta.ruta})"
            @cortado="$emit('cortado', {...$event, ruta: carpeta.ruta})"            
            @seleccionado="onCarpetaSeleccionada(subcarpeta.id)"
            @deseleccionado="onCarpetaDeseleccionada(subcarpeta.id)"
          />          
            <Archivo
              v-for="(archivo, index) of archivosFiltrados"
              class="list-item"
              ref="archivos"
              :key="'archivo-'+ (archivo.uploadId || archivo.id)"
              v-model="archivos[index]"
              :boxClass="boxClass"
              :iconClass="iconClass"
              :textClass="textClass"
              :subtextClass="subtextClass"
              :mostrarFecha="mostrarFecha"
              :mostrarTamano="mostrarTamano"
              :mostrarControles="mostrarControles && !seleccionandoCarpeta"
              :seleccionando="seleccionando"
              :vista="vista"
              :carpeta="carpeta"
              @abrir-carpeta="flexNavigateTo"
              @seleccionado="onArchivoSeleccionado(archivo.id)"
              @deseleccionado="onArchivoDeseleccionado(archivo.id)"
              @papelera="onPapelera"
              @copiado="$emit('copiado', {...$event, ruta: carpeta.ruta})"
              @cortado="$emit('cortado', {...$event, ruta: carpeta.ruta})"
            />          
        </list-transition>
      </div>
    </div>
    <ExploradorElemento
      ref="elm"
      v-else-if="carpeta"
      :vista="vista"
      :seleccionando="seleccionando"
      :iconClass="iconClass"
      :boxClass="boxClass"
      :textClass="textClass"
      :subtextClass="subtextClass"
      :mostrarTitulo="mostrarTitulo"
      :mostrarControles="mostrarControles && carpeta.subirNivel"
      :mostrarTamano="mostrarTamano"
      :mostrarFecha="mostrarFecha"
      :mostrarDescripcion="mostrarDescripcion"
      :publishedAt="carpeta.publishedAt"
      :nombre="carpeta.nombreMostrar || carpeta.nombre"
      :checkable="carpeta && carpeta.subirNivel"
      :procesando="procesando"
      @click="flexNavigateTo(carpeta)"
      @opciones="mostrarMenu = $event"
      @seleccionado="$emit('seleccionado', $event)"
      @deseleccionado="$emit('deseleccionado', $event)"
    >
      <template v-slot:icon>
        <div
          class="flex items-center justify-center"
          :class="
            (vista == 'listado' ? 'text-6xl ' : 'text-8xl ') +
            (!carpeta.publishedAt
              ? 'pointer-events-none'
              : seleccionando && carpeta.subirNivel
              ? 'opacity-50 pointer-events-none'
              : seleccionando
              ? 'pointer-events-none'
              : 'cursor-pointer')
          "
          @click="flexNavigateTo(carpeta)"
        >
          <icon
            icon="folder"
            class="absolute"
            :class="
              iconClass +
              (carpeta.subirNivel && !seleccionando && carpeta.publishedAt
                ? ' group-hover:hidden'
                : '') +
              (carpeta.publishedAt ? ' text-orange-200' : ' text-gray-500')
            "
          />
          <icon
            v-if="!carpeta.publishedAt"
            icon="far fa-trash-alt"
            class="absolute translate-y-1 scale-[30%] text-gray-100"
            :class="iconClass"
          />
          <icon
            v-if="!seleccionando && carpeta.subirNivel"
            icon="reply"
            class="group-hover:-translate-x-1 scale-[25%] text-black absolute"
          />
          <icon
            v-else-if="!seleccionando && carpeta.publishedAt"
            icon="folder-open"
            class="absolute hidden group-hover:block text-orange-200"
            :class="iconClass"
            style="transform: translate(2.5px, -1px)"
          />
        </div>
      </template>

      <template v-slot:description>
        <span
          v-if="mostrarTamano"
          class="capitalize"
          :title="`${numCarpetas} carpeta${
            numCarpetas == 1 ? '' : 's'
          }, ${numArchivos} archivo${numArchivos == 1 ? '' : 's'}`"
        >
          {{ numItems }} elem.&nbsp;
        </span>
        <span v-if="mostrarFecha" class="capitalize">{{
          $dayjs(carpeta.createdAt).format("DD MMM YYYY, HH:mm")
        }}</span>
      </template>
    </ExploradorElemento>

    <MenuContextual v-if="carpeta" v-model="mostrarMenu" :items="menuItems" />

    <PropiedadesCarpeta
      v-if="carpeta && mostrarTitulo && mostrarControles"
      textAccept="Guardar"
      :carpeta="carpeta"
      @guardar="guardar"
      v-model="mostrarPropiedades"
      :administracion="permisoAdministracion"
    />
  </Droppable>
</template>

<script>
import {
  populateCarpeta,
  soyPropietario,
  tengoPermiso,
  uploadFiles,
} from "@/assets/js/carpeta";
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
    vista: { type: String, required: false, default: "listado" },
    seleccionando: { type: Boolean, required: false, default: false },
    padre: {},
    borrarDefinitivo: { type: Boolean, required: false, default: false },
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
    iconClass: { type: String, required: false, default: "" },
    boxClass: { type: String, required: false, default: "" },
    mostrarTitulo: { default: true },
    mostrarControles: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarTamano: {
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
    mostrarDescripcion: { type: Boolean, required: false, default: true },
    // de carpeta
    mostrarArchivos: {
      type: Boolean,
      required: false,
      default: true,
    },
    seleccionandoCarpeta: {
      type: Boolean,
      required: false,
      default: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: "Carpeta vacía",
    },
  },
  data() {
    return {
      /* ESTA VARIABLE SE TIENE QUE ASIGNAR LOS DATOS DE LA CARPETA */
      carpeta: {},
      seleccionada: false,
      carpetasSeleccionadas: [],
      archivosSeleccionados: [],
      dragging: false,
      cargando: true,
      procesando: false,
      //carpetas: [],
      //archivos: [],
      mostrarMenu: false,
      mostrarPropiedades: false,
    };
  },
  // fetchOnServer: false,
  computed: {
    getpadre() {
      return this.padre ? this.padre : this.carpeta ? this.carpeta.padre : null;
    },
    carpetas() {
      return this.carpeta && typeof this.carpeta == 'object' && ('subcarpetas' in this.carpeta)?this.carpeta.subcarpetas:[]
    },
    archivos() {
      return this.carpeta && typeof this.carpeta == 'object' && ('archivos' in this.carpeta)?this.carpeta.archivos:[]
    },
    archivosFiltrados(){
      return this.mostrarArchivos/*&&!this.seleccionandoCarpeta*/?this.archivos:[]
    },
    menuItems() {
      const items = [];
      if (!this.carpeta) return items;

      if (this.carpeta.subirNivel) return items;

      if (
        this.carpeta.publishedAt &&
        this.permisoEscritura &&
        this.$route.path == this.carpeta.ruta
      )
        items.push({
          label: "Nueva carpeta",
          icon: "folder-plus",
          click: this.nueva,
        });
      if (this.permisoAdministracion) {
        if (!this.carpeta.publishedAt)
          items.push({
            label: "Restaurar",
            icon: "fas fa-trash-restore",
            click: this.restaurar,
          });
        else {
          items.push({
            label: "Renombrar",
            icon: "pen-alt",
            click: this.renombrar,
          });
          items.push({
            label: "Compartir",
            icon: "share-alt",
            click: this.compartir,
          });
        }
      }
      if (this.permisoEscritura) {
        if (this.carpeta.publishedAt) {
          items.push({
            label: "Copiar",
            icon: "copy",
            click: this.copiar,
          });
          if (this.permisoAdministracion)
            items.push({
              label: "Cortar",
              icon: "cut",
              click: this.cortar,
            });
          /*items.push({
            label: "Pegar",
            icon: "paste",
            click: this.pegar,
          });*/
        }
      }
      if (this.permisoAdministracion)
        if (this.carpeta.publishedAt || this.borrarDefinitivo)
          items.push({
            label:
              !this.carpeta.publishedAt && this.borrarDefinitivo
                ? "Eliminar Definitivamente"
                : "Eliminar",
            icon: "far fa-trash-alt",
            click: this.eliminar,
          });

      items.push({
        label: "Propiedades",
        icon: this.permisoAdministracion ? "cog" : "info-circle",
        click: () => {
          this.mostrarPropiedades = true;
        },
      });
      return items;
    },
    /*carpetaJSON() {
      console.warn("CARPETA ACTUAL", this.carpeta);
      return JSON.stringify(this.carpeta);
    },*/
    permisoEscritura() {
      return this.tengoPermiso("escritura");
    },
    permisoAdministracion() {
      return this.tengoPermiso("administracion");
    },
    numItems() {
      return this.numCarpetas + this.numArchivos;
    },
    numArchivos() {
      if (!this.carpeta) return 0;
      return this.carpeta.archivos ? this.carpeta.archivos.length : 0;
    },
    numCarpetas() {
      if (!this.carpeta) return 0;
      return this.carpeta.subcarpetas ? this.carpeta.subcarpetas.length : 0;
    },
  },
  watch: {
    localValue(newValue) {
      console.warn("LOCAL CHANGED");
      this.$fetch();
    },
    seleccionando(newValue) {
      this.carpetasSeleccionadas = [];
      this.archivosSeleccionados = [];
      console.warn("seleccionando", newValue, this.$refs.carpetas);
      if (this.$refs.carpetas)
        for (let idx = 0; idx < this.carpetas.length; idx++) {
          const c = this.$refs.carpetas[idx];
          c.reset();
        }
      if (this.$refs.archivos)
        for (let idx = 0; idx < this.archivos.length; idx++) {
          const a = this.$refs.archivos[idx];
          a.reset();
        }
    },
    seleccionada(newValue) {
      if (newValue) this.$emit("seleccionada");
      else this.$emit("deseleccionada");
    },
    cargando(newValue) {
      console.warn("CARGANDO", newValue);
    },
    /*carpetaJSON() {
      console.log("watch carpetaJSNO", this.padre);
      //this.actualizarListado()
    },*/
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
      toFetch = this.carpeta.id||this.carpeta.ruta
      this.cargando = false;
      //if ("lecturaUsuarios" in this.carpeta) return;
      
      if (this.updateBreadcrumb) this._updateBreadcrumb(this.carpeta.ruta);
      this.$emit("carpeta", this.carpeta);
      //this.actualizarListado()
      if(this.carpeta.actualizar) {        
        if(!('subcarpetas' in this.carpeta)||!('archivos' in this.carpeta))
          this.cargando = true;
        if(!('padre' in this.carpeta)) {
          const ruta = this.carpeta.ruta.substr(0, this.carpeta.ruta.lastIndexOf('/'))
          if(ruta)
          this.carpeta.padre = {ruta, publishedAt: 1}
        }
      }
      else
      return;
    }
    else this.cargando = true

    if (typeof this.localValue === "string") {
      if (this.updateBreadcrumb) this._updateBreadcrumb(this.localValue);
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
            //this.actualizarListado()
        } else {
          const carpeta = res.data[0];
          console.log("fetch result", carpeta);
          if (carpeta) {
            // this.$set(this, 'carpeta', carpeta)
            this.carpeta = carpeta;
            // la carpeta padre de las subcarpetas es la propia carpeta
            for(const sc of carpeta.subcarpetas)
              sc.padre = {...this.carpeta}
            //this.actualizarListado()
            // for(const k in carpeta)
            // this.$set(this.carpeta, k, carpeta[k])
            this.$emit("carpeta", this.carpeta);
          } else {
            this.setErr({ message: "Esta carpeta no existe" });
            this.carpeta = null;
          }
        }
        this.cargando = false;
      })
      .catch((e) => {
        console.error(e);
        this.setErr(e);
        this.cargando = false;
      });
  },
  mounted() {
    if (this.carpeta) 
      this.$emit("carpeta", this.carpeta);       
  },
  methods: {
    /*actualizarListado(){
      if (!this.carpeta || !("subcarpetas" in this.carpeta)) return;
      // if (this.padre) this.carpeta.padre = this.padre;      

      this.carpetas = [];
      this.archivos = [];
      //      if (this.updateBreadcrumb && this.carpeta.ruta) this.updateBreadcrumb();

      if (!Array.isArray(this.carpeta) && this.explorando)
        this.archivos = this.carpeta.archivos;

      console.warn("explorando", this.explorando);
      console.warn("carpeta", this.carpeta);      
       this.carpetas = this.carpeta.subcarpetas
    },*/
    onPapelera(elem) {
      console.warn("carpeta.onPapelera");
      const that = this;
      setTimeout(() => {
        if (!that.carpeta) return;
        if (elem.carpeta) {
          const idx = that.carpeta.subcarpetas.findIndex(
            (x) => x.id == elem.carpeta.id
          );
          if (idx >= 0) that.carpeta.subcarpetas.splice(idx, 1);
        } else {
          const idx = that.carpeta.archivos.findIndex(
            (x) => x.id == elem.archivo.id
          );
          if (idx >= 0) that.carpeta.archivos.splice(idx, 1);
        }
        //this.actualizarListado()
        this.$emit("papelera", elem);
      }, 1500);
    },
    onCarpetaSeleccionada(id) {
      this.carpetasSeleccionadas.push(id);
      this.emitSeleccion();
    },
    onCarpetaDeseleccionada(id) {
      const idx = this.carpetasSeleccionadas.indexOf(id);
      if (idx >= 0) {
        this.carpetasSeleccionadas.splice(idx, 1);
        this.emitSeleccion();
      }
    },
    onArchivoSeleccionado(id) {
      this.archivosSeleccionados.push(id);
      this.emitSeleccion();
    },
    onArchivoDeseleccionado(id) {
      const idx = this.archivosSeleccionados.indexOf(id);
      if (idx >= 0) {
        this.archivosSeleccionados.splice(idx, 1);
        this.emitSeleccion();
      }
    },
    emitSeleccion() {
      this.$emit("seleccion", {
        carpetas: [...this.carpetasSeleccionadas],
        archivos: [...this.archivosSeleccionados],
      });
    },
    seleccionar() {
      this.$refs.elm.seleccionar();
    },
    reset() {
      this.$refs.elm.reset();
    },
    nueva() {
      this.$prompt({
        response: "",
        message: "Nombre de la carpeta",
        accepted: (nombre) => {
          this.procesando = true;
          this.$strapi
            .create(
              "carpetas",
              {
                nombre,
                padre: this.carpeta.id,
              },
              { populate: populateCarpeta }
            )
            .then((response) => {
              console.log("response", response);
              if (response.error) throw new Error(response.error.message);
              this.carpeta.subcarpetas.push(response.data);
              //this.actualizarListado()
              this.procesando = false;
            })
            .catch((error) => {
              let msg =
                error && error.message ? error.message : "No se pudo crear";
              this.$toast.error(this.translateError(msg));
              this.procesando = false;
            });
        },
      });
    },
    renombrar() {
      const redireccionar = this.$route.path === this.carpeta.ruta;
      this.$prompt({
        message: "Nuevo nombre",
        response: this.carpeta.nombre,
        accepted: async (response) => {
          //const regex = new RegExp(this.carpeta.nombre + "$");
          //this.carpeta.ruta = this.carpeta.ruta.replace(regex, "");
          //this.carpeta.ruta += "/" + response;
          //this.carpeta.nombre = response;
          console.log("antes de guardar", this.carpeta);
          await this.guardar(response);
          console.log("despues de guardar", this.carpeta);
          if (redireccionar) this.$router.replace(this.carpeta.ruta);
        },
      });
    },
    copiar() {
      this.$emit('copiado', {tipo: 'carpeta', id: this.carpeta.id})
    },
    cortar() {
      this.$emit('cortado', {tipo: 'carpeta', id: this.carpeta.id})
    },
    compartir() {},
    eliminar() {
      if (this.carpeta.publishedAt || !this.borrarDefinitivo)
        return this.enviarAPapelera();
      this.$confirm({
        message: `Esto eliminará permanentemente la carpeta ${this.carpeta.nombre}`,
        yes: `Borrar carpeta`,
        no: "Cancelar",
        confirmed: async () => {
          this.eliminarDefinitivamente();
        },
      });
    },
    enviarAPapelera() {
      this.procesando = true;
      this.$strapi
        .update("carpetas", this.carpeta.id, {
          publishedAt: null,
          eliminadaPor: this.$strapi.user ? this.$strapi.user.id : null,
          eliminadaEn: new Date().toISOString(),
        })
        .then((response) => {
          console.log("enviarAPapelera response", response);
          if (response.error) throw new Error(response.error.message);
          this.carpeta.publishedAt = null;
          console.log("borrando", this.carpeta.ruta);
          this.$emit("papelera", { carpeta: { ...this.carpeta } });
          this.procesando = false;
        })
        .catch((error) => {
          let msg =
            error && error.message
              ? error.message
              : "No se pudo enviar a la papelera";
          this.$toast.error(this.translateError(msg));
          this.procesando = false;
        });
    },
    eliminarDefinitivamente() {
      console.log("ruta actual", this.carpeta.ruta);
      let proximaRuta =
        this.modoNavegacion == "Route" && this.carpeta.ruta == this.$route.path
          ? this.carpeta.ruta.substr(0, this.carpeta.ruta.lastIndexOf("/"))
          : null;
      console.log("proximaRuta", proximaRuta);
      this.procesando = true;
      this.$strapi
        .delete("carpetas", this.carpeta.id)
        .then((response) => {
          if (response.error)
            if (response.error) throw new Error(response.error.message);
          this.$set(this.carpeta, "borrada", true);
          if (proximaRuta) {
            this.$router.replace({ path: proximaRuta });
            if (this.updateBreadcrumb) this._updateBreadcrumb(proximaRuta);
          } else {
            // this.$emit("papelera", {carpeta: {...this.carpeta}});
            this.procesando = false;
          }
        })
        .catch((error) => {
          let msg =
            error && error.message ? error.message : "No se pudo eliminar";
          this.$toast.error(this.translateError(msg));
          this.procesando = false;
        });
    },
    restaurar() {
      const date = new Date().toISOString();
      this.procesando = true;
      this.$strapi
        .update(
          "carpetas",
          this.carpeta.id,
          {
            publishedAt: date,
            eliminadaPor: null,
            eliminadaEn: null,
          },
          { populate: populateCarpeta }
        )
        .then((response) => {
          console.log("restaurar response", response);
          if (response.error)
            if (response.error) throw new Error(response.error.message);
          this.carpeta.publishedAt = date;
          this.carpeta.eliminadaPor = null;
          this.carpeta.eliminadaEn = null;
          this.procesando = false;
        })
        .catch((error) => {
          let msg =
            error && error.message ? error.message : "No se pudo restaurar";
          this.$toast.error(this.translateError(msg));
          this.procesando = false;
        });
    },
    drop(e) {
      /*const items = e.detail
        ? e.detail.dataTransfer.items
        : e.dataTransfer.items;*/
      /*var someFile = false
      for (const item of items)
        if (item.kind == 'file') someFile = true*/
      const files = e.dataTransfer.files;

      uploadFiles(this.carpeta, files, this.$strapi, this.$toast);

      //this.$axios.post('/upload', formData
    },
    // comprueba si el usuario tiene acceso segun los permisos indicados
    tengoPermiso(modo) {
      return tengoPermiso(this.carpeta, this.$strapi.user, modo);
    },
    soyPropietario() {
      return soyPropietario(this.carpeta, this.$strapi.user);
    },

    // guarda datos de la carpeta, o solo el nombre
    guardar(datos) {
      this.procesando = true;
      console.log("guardar carpeta", JSON.stringify(datos));
      const carpeta = typeof datos === "object" ? datos : null;
      const nuevoNombre = typeof datos === "string" ? datos : null;
      const idCarpeta = carpeta ? carpeta.id : this.carpeta.id;
      if (carpeta) {
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
        delete carpeta.propietario;
        delete carpeta.archivos;
        delete carpeta.subcarpetas;
      }
      return this.$strapi
        .update(
          "carpetas",
          idCarpeta,
          nuevoNombre ? { nombre: nuevoNombre } : carpeta,
          { populate: populateCarpeta }
        )
        .then((response) => {
          console.log("response", response);
          if (response.error) throw new Error(response.error.message);
          const carpeta = response.data;
          for (const key in carpeta) this.$set(this.carpeta, key, carpeta[key]);
          if (!nuevoNombre) this.$toast.success("Carpeta guardada");
          this.procesando = false;
        })
        .catch((error) => {
          let msg =
            error && error.message ? error.message : "No se pudo guardar";
          this.$toast.error(this.translateError(msg));
          this.procesando = false;
        });
    },
    flexNavigateTo(carpeta) {
      console.warn("FLEXNAVIGATETO", carpeta, this.modoNavegacion);
      if (!carpeta.publishedAt) return;
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
    _updateBreadcrumb(ruta) {
      console.log("archivos.updateBreadcrumb()", ruta);
      const breadcrumb = [];
      ruta
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

<style scoped>
.mygrid {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-columns: minmax(150px, 200px);
  grid-auto-rows: minmax(200px, 210px);
  grid-auto-flow: dense;
  place-items: stretch stretch;
}

/*.archivo-move {
  transition: transform .5s cubic-bezier(.55,0,.1,1);
}
*/

.list-item {
  list-style-type: none
}
/*.list-item{
   display:inline-block;
   margin-right: 10px;
   background: green;  
   height: auto;
   overflow:unset;
   transition: height 1s;
}
.list-enter-from {
  height: 0;
  overflow:hidden;
}
.list-enter-to {
  height: 200px;
  overflow:hidden;
}
.list-enter-active {
  
}
*/
/*.list-enter-active, .list-leave-active{
   transition: all 1s;
   height: 0;
}
.list-enter, .list-leave-to{
   opacity: 0;
   height: 0;
}*/
</style>