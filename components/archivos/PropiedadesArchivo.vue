<template>
  <Modal
    v-model="localValue"
    :title="titulo"
    class="sm:min-w-sm max-w-screen"
    :icon="icon"
  >
      <div class="p-5 max-w-full space-y-4 overflow-y-auto text-sm lg:text-base">
        <table>
          <tr>
            <td><label class="text-diminished mr-4">Nombre: </label></td>
            <td>
              <span>{{ archivo.nombre }}</span>
            </td>
          </tr>
          <tr>
            <td><label class="text-diminished mr-4">Ubicado en: </label></td>
            <td>
              <span>{{ carpeta.ruta }}</span>
            </td>
          </tr>
          <tr>
            <td><label class="text-diminished mr-4">Subido en: </label></td>
            <td>
              <span>{{
                $dayjs(archivo.createdAt)
                  .utc()
                  .format("DD-MMM-YYYY hh:mm:ss")
              }}</span>
            </td>
          </tr>
          <tr>
            <td><label class="text-diminished mr-4">Subido por: </label></td>
            <td>
              <span>{{
                archivo.propietario
                  ? archivo.propietario.nombreSimbolico ||
                    archivo.propietario.username
                  : "Administradores"
              }}</span>
            </td>
          </tr>
        </table>
      </div>
  </Modal>
</template>

<script>
import vmodel from "@/mixins/vmodel";
export default {
  mixins: [vmodel],
  props: {
    icon: { type: String | Boolean, required: false, default: "file" },
    archivo: {},
    carpeta: {},
    titulo: {
      type: String,
      required: false,
      default: "Propiedades de archivo",
    },
  }
};
</script>