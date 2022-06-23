<template>
  <Modal
    v-model="localValue"
    :title="titulo"
    class="sm:min-w-sm max-w-screen"
    :icon="icon"
  >
    <form
      class="p-5 max-w-full xm:max-w-[480px] space-y-4 overflow-y-auto"
      @submit.stop.prevent="accept"
    >
      <div v-if="administracion" class="space-y-2">
        <label for="nombre" class="font-bold">Nombre de la carpeta:</label>
        <input
          id="nombre"
          type="text"
          v-model="carpetaLocal.nombre"
          placeholder="Nombre..."
          required
        />
      </div>

      <div class="space-y-2 text-sm lg:text-base">
        <table
          class="block mx-auto overflow-x-auto whitespace-nowrap"
          :style="{
            'max-width': 'fit-content'
          }"
        >
          <tr v-if="!administracion">
            <td><label class="text-diminished mr-4">Nombre: </label></td>
            <td>
              <span>{{ carpetaLocal.nombre }}</span>
            </td>
          </tr>
          <tr>
            <td><label class="text-diminished mr-4">Ubicada en: </label></td>
            <td>
              <span class="inline-block overflow-x-auto">{{
                carpetaLocal.ruta
              }}</span>
            </td>
          </tr>
          <tr>
            <td><label class="text-diminished mr-4">Creada en: </label></td>
            <td>
              <span>{{
                $dayjs(carpetaLocal.createdAt)
                  .utc()
                  .format("DD-MMM-YYYY hh:mm:ss")
              }}</span>
            </td>
          </tr>
          <tr>
            <td><label class="text-diminished mr-4">Creada por: </label></td>
            <td>
              <span>{{
                carpetaLocal.propietario
                  ? carpetaLocal.propietario.nombreSimbolico ||
                    carpetaLocal.propietario.username
                  : "Administradores"
              }}</span>
            </td>
          </tr>
          <tr v-if="!carpetaLocal.publishedAt">
            <td><label class="text-diminished mr-4">Eliminada en: </label></td>
            <td>
              <span>{{
                carpetaLocal.eliminadaEn
                  ? $dayjs(carpetaLocal.eliminadaEn)
                      .utc()
                      .format("DD-MMM-YYYY hh:mm:ss")
                  : "No registrado"
              }}</span>
            </td>
          </tr>
          <tr v-if="!carpetaLocal.publishedAt">
            <td><label class="text-diminished mr-4">Eliminada por: </label></td>
            <td>
              <span>{{
                carpetaLocal.eliminadaPor
                  ? carpetaLocal.eliminadaPor.nombreSimbolico ||
                    carpetaLocal.eliminadaPor.username
                  : "Administradores"
              }}</span>
            </td>
          </tr>
        </table>
      </div>

      <divider class="my-1" />

      <PermisosCarpeta
        :administracion="administracion"
        v-model="carpetaLocal"
      />

      <div v-if="administracion" class="flex pt-4 justify-between">
        <button type="submit" class="btn">
          <icon icon="check" class="mr-2" />
          Guardar
        </button>
        <button class="btn btn-error" type="cancel" @click.prevent="cancel">
          <icon icon="fas fa-times" class="mr-2" />
          Cancelar
        </button>
      </div>
    </form>
  </Modal>
</template>

<script>
// v model para mostrar el modal
import vmodel from "@/mixins/vmodel";
export default {
  mixins: [vmodel],
  props: {
    carpeta: { type: Object, required: true },
    administracion: { type: Boolean, required: false, default: false },
    icon: { type: String | Boolean, required: false, default: "folder-plus" },
    titulo: {
      type: String,
      required: false,
      default: "Propiedades de carpeta",
    },
  },
  data() {    
    const r = {
      // datos de carpetaLocal
      carpetaLocal: {
        nombre: "",
        ruta: "",
        createdAt: null,
        createdBy: null,
        ...this.carpeta,
      },
    };
    // eliminamos campos innecesarios
    delete r.carpetaLocal.padre
    delete r.carpetaLocal.archivos
    delete r.carpetaLocal.subcarpetas
    // atención
    if (!r.carpetaLocal.lecturaUsuarios)
      console.warn("START: lecturaUsuarios = NULL");
    return r;
  },
  watch: {
    carpeta(newValue) {
      this.carpetaLocal = newValue;
      if (!this.carpetaLocal.lecturaUsuarios)
        console.warn("WATCH: lecturaUsuarios = NULL");
    },
  },
  methods: {
    accept() {
      // console.log("--------- ACCEPT", JSON.stringify(this.carpetaLocal));
      if (!this.carpetaLocal.lecturaUsuarios)
        console.warn("accept: carpetaLocal.lecturaUsuarios = NULL");
      this.localValue = false;
      const rvalue = { ...this.carpetaLocal };
      if (!rvalue.lecturaUsuarios)
        console.warn("accept: rvalue.lecturaUsuarios  = NULL");

      this.$emit("guardar", rvalue);
    },
    cancel() {
      this.localValue = false;
    },
  },
};
</script>