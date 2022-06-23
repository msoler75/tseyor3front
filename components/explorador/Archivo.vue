<template>
<div>
  <ExploradorElemento
    ref="archivo"
    v-if="localValue"
    :tag="seleccionando ? 'div' : 'a'"
    target="_blank"
    :href="localValue.media?localValue.media.url:'#'"
    :download="localValue.nombre"    
    :vista="vista"
    :seleccionando="seleccionando"
    :iconClass="iconClass"
    :boxClass="boxClass"
    :textClass="textClass"
    :subtextClass="subtextClass"
    :mostrarTitulo="mostrarTitulo"
    :mostrarControles="mostrarControles"
    :mostrarTamano="mostrarTamano"
    :mostrarFecha="mostrarFecha"
    :mostrarDescripcion="mostrarDescripcion"
    :publishedAt="localValue.publishedAt"
    :nombre="localValue.nombre"
    :procesando="procesando || localValue.uploading"
    @opciones="mostrarMenu = $event"
    @seleccionado="$emit('seleccionado', $event)"
    @deseleccionado="$emit('deseleccionado', $event)"
    class="select-none relative"
  >  
    <template v-slot:icon>
      <div
        v-if="!localValue.uploading && !localValue.publishedAt"
        class="relative flex justify-center items-center"
        :class="vista == 'listado' ? 'text-5xl w-12 h-12' : 'text-7xl w-16 h-16'"
      >
        <icon
          icon="file"
          class="absolute text-gray"
          :class="iconClass"
        />
        <icon
          icon="far fa-trash-alt"
          class="absolute scale-[30%] text-gray-100"
          :class="iconClass"
        />
      </div>
      <nuxt-img
        v-else-if="
          localValue.media &&
          localValue.media.url &&
          localValue.media.url.match(/^data:image\/|\.(png|jpe?g|webp|svg|)$/i)
        "
        :src="localValue.media.url"
        fit="cover"
        :width="vista == 'listado' ? 71 : 120"
        :height="vista == 'listado' ? 51 : 95"
        class="rounded-lg"
      />
      <icon
        v-else
        class="text-blue-500"
        :icon="
          localValue.media && localValue.media.ext
            ? iconFromExt(localValue.media.ext)
            : 'file'
        "
        :class="
          (vista == 'listado' ? 'text-5xl' : 'text-7xl py-1') + ' ' + iconClass
        "
      />
    </template>

    <template v-slot:description>
      <span v-if="mostrarTamano" class="capitalize">
        {{ localValue.media ? Math.round(localValue.media.size) : 0 }}
        Kb.&nbsp;
      </span>
      <span v-if="mostrarFecha" class="capitalize">{{
        localValue.media
          ? $dayjs(localValue.media.createdAt).format("DD MMM YYYY, HH:mm")
          : ""
      }}</span>
    </template>

    <MenuContextual
      v-if="localValue"
      v-model="mostrarMenu"
      :items="menuItems"
      class="pointer-events-auto"
    />

    <PropiedadesArchivo v-model="mostrarPropiedades" :archivo="localValue" :carpeta="getCarpeta" />
  </ExploradorElemento>
  </div>
</template>


<script>
import {
  populateArchivo,
  soyPropietario,
  tengoPermiso,
} from "@/assets/js/carpeta";
import vmodel from "@/mixins/vmodel";
import validation from "@/mixins/validation";
import fileIcon from "~/mixins/fileIcon.js";
export default {
  mixins: [vmodel, validation, fileIcon],
  props: {
    carpeta: {},
    vista: { type: String, required: false, default: "listado" },
    seleccionando: { type: Boolean, required: false, default: false },
    borrarDefinitivo: { type: Boolean, required: false, default: false },
    textClass: {},
    subtextClass: {},
    iconClass: { type: String, required: false, default: "" },
    boxClass: { type: String, required: false, default: "" },
    mostrarTitulo: { default: true },
    mostrarControles: {
      type: Boolean,
      required: false,
      default: false,
    },
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
    mostrarDescripcion: { type: Boolean, required: false, default: true },
  },
  data() {
    return {
      mostrarMenu: false,
      mostrarPropiedades: false,
      procesando: false,
    };
  },
  computed: {
    getCarpeta(){
      return this.carpeta?this.carpeta:this.localValue?this.localValue.carpeta:null
    },
    puedoCambiarlo() {
      return this.tengoPermiso("administracion");
    },
    puedoBorrarlo() {
      return this.tengoPermiso("administracion");
    },
    menuItems() {
      const items = [];
      if (!this.localValue) return items;

      if (this.puedoBorrarlo) {
        if (!this.localValue.publishedAt)
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

        if(this.getCarpeta&&this.$route.path!=this.getCarpeta.ruta)
       items.push({
          label: "Ir a carpeta",
          icon: "folder",
          click: ()=>this.$emit('abrir-carpeta', this.getCarpeta),
        });
       

      if (this.localValue.publishedAt) {
        items.push({
          label: "Copiar",
          icon: "copy",
          click: this.copiar,
        });
        if (this.puedoBorrarlo)
          items.push({
            label: "Cortar",
            icon: "cut",
            click: this.cortar,
          });
      }

      if (this.puedoBorrarlo)
        if (this.localValue.publishedAt || this.borrarDefinitivo)
          items.push({
            label: this.borrarDefinitivo
              ? "Eliminar Definitivamente"
              : "Eliminar",
            icon: "far fa-trash-alt",
            click: this.eliminar,
          });

      items.push({
        label: "Propiedades",
        icon: "info-circle",
        click: () => {
          this.mostrarPropiedades = true;
        },
      });
      return items;
    },
  },
  methods: {
    seleccionar() {
      this.$refs.archivo.seleccionar();
    },
    reset() {
      this.$refs.archivo.reset();
    },
    tengoPermiso(modo) {
      if (!this.localValue) return false;
      if (this.soyPropietario()) return true;
      if (!this.carpeta) return false;
      if (tengoPermiso(this.carpeta, this.$strapi.user, "administracion"))
        return true;
      return modo == "lectura";
    },
    soyPropietario() {
      if (!this.localValue) return false;
      return soyPropietario(this.localValue, this.$strapi.user);
    },
    copiar() {
      this.$emit('copiado', {tipo: 'archivo', id: this.localValue.id})
    },
    cortar() {
      this.$emit('cortado', {tipo: 'archivo', id: this.localValue.id})
    },
    renombrar() {
      this.$prompt({
        message: "Nuevo nombre",
        response: this.localValue.nombre,
        accepted: async (response) => {
          //const regex = new RegExp(this.carpeta.nombre + "$");
          //this.carpeta.ruta = this.carpeta.ruta.replace(regex, "");
          //this.carpeta.ruta += "/" + response;
          //this.carpeta.nombre = response;
          console.log("antes de guardar", this.localValue);
          await this.guardar(response);
          console.log("despues de guardar", this.localValue);
        },
      });
    },
    eliminar() {
      if (this.localValue.publishedAt || !this.borrarDefinitivo)
        return this.enviarAPapelera();
      this.$confirm({
        message: `Esto eliminará permanentemente el archivo <br> ${this.localValue.nombre} <br>¿Deseas continuar?`,
        yes: `Borrar archivo`,
        no: "Cancelar",
        confirmed: async () => {
          this.eliminarDefinitivamente();
        },
      });
    },
    enviarAPapelera() {
      this.procesando = true;
      this.$strapi
        .update("archivos", this.localValue.id, {
          publishedAt: null,
          eliminadoPor: this.$strapi.user ? this.$strapi.user.id : null,
          eliminadoEn: new Date().toISOString(),
        })
        .then((response) => {
          console.log("enviarAPapelera response", response);
          if (response.error) throw new Error(response.error.message);
          this.localValue.publishedAt = null;
          this.$emit("papelera", { archivo: { ...this.localValue } });
          this.procesando = false;
        })
        .catch((error) => {
          console.warn("err", error);
          let msg =
            error && error.message
              ? error.message
              : "No se pudo enviar a la papelera";
          this.$toast.error(this.translateError(msg));
          this.procesando = false;
        });
    },
    eliminarDefinitivamente() {
      this.procesando = true;
      this.$strapi
        .delete("archivos", this.localValue.id)
        .then((response) => {
          if (response.error)
            if (response.error) throw new Error(response.error.message);
          this.$emit("borrado", {archivo: this.localValue});
          this.$set(this.localValue, "borrado", true);
          this.procesando = false;
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
          "archivos",
          this.localValue.id,
          {
            publishedAt: date,
            eliminadoPor: null,
            eliminadoEn: null,
          },
          { populate: populateArchivo }
        )
        .then((response) => {
          console.log("restaurar response", response);
          if (response.error)
            if (response.error) throw new Error(response.error.message);
          this.localValue.publishedAt = date;
          this.localValue.eliminadoPor = null;
          this.localValue.eliminadoEn = null;
          this.procesando = false;
        })
        .catch((error) => {
          let msg =
            error && error.message ? error.message : "No se pudo restaurar";
          this.$toast.error(this.translateError(msg));
          this.procesando = false;
        });
    },
    async guardar(nuevoNombre) {
      this.procesando = true;
      console.log("guardar archivo");
      return this.$strapi
        .update(
          "archivos",
          this.localValue.id,
          { nombre: nuevoNombre },
          { populate: populateArchivo }
        )
        .then((response) => {
          console.log("response", response);
          if (response.error) throw new Error(response.error.message);
          const archivo = response.data;
          this.localValue.nombre = archivo.nombre;
          this.procesando = false;
        })
        .catch((error) => {
          let msg =
            error && error.message ? error.message : "No se pudo guardar";
          this.$toast.error(this.translateError(msg));
          this.procesando = false;
        });
    },
  },
};
</script>