<template>
  <div v-if="mostrarModalEscritura">
    <v-select
      class="my-v2"
      :options="options"
      v-model="selected"
      :placeholder="placeholder"
      autocomplete="on"
      :reduce="(item) => item.id"
      :label="campo"
      @search="myajax"
    >
      <div slot="no-options">Ningún resultado</div>
    </v-select>
  </div>
</template>



<script>
import vSelect from "vue-select";
export default {
  components: { vSelect },
  data() {
    return {
      options: [{id:1, nombre:'pepito'}],
      tituloModal: "Sin título",
      mostrarModalLectura: false,
      mostrarModalEscritura: false,
      selected: null,
      placeholder: "Elige...",
      coleccion: "",
      campo: "",
    };
  },
  mounted() {
      this.buscarGrupo('lectura')
  },
  methods: {
    myajax(search, loading) {
      console.log("buscar", search);
      if (!search) return;
      loading(true);
      this.search(loading, search);
    },
    // https://codepen.io/sagalbot/pen/POMeOX
    search(loading, search) {
      console.log("search", search, this.coleccion, this.campo);
      const filters = {};
      filters[this.campo] = {
        $containsi: search,
      };
      console.log("filters", filters);
      const fields = ["id"];
      fields.push(this.campo);
      this.$strapi
        .find(this.coleccion, {
          fields,
          filters,
        })
        .then((res) => {
          this.options = res.data;
          loading(false);
        });
    },
    buscarGrupo(modo) {
      this.placeholder = "Elige grupo";
      this.tituloModal = "Agregar grupo para " + modo;
      this.coleccion = "grupos";
      this.campo = "nombre";
      this.buscar = "";
      this.mostrarModalEscritura = true;
    },
  },
};
</script>