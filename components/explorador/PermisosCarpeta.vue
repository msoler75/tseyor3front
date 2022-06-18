<template>
  <div class="space-y-4 select-none">
    <div class="space-y-2">
      <div class="flex space-x-4">
        <p class="font-bold">
          Permisos de lectura:
          <span
            title="Usuarios que pueden ver y leer los contenidos de la carpeta"
            ><icon icon="info-circle"
          /></span>
        </p>
        <div v-if="administracion" class="flex items-center space-x-1">
          <input
            id="lectura-heredado"
            type="checkbox"
            v-model="localValue.lecturaHereda"
            class="scale-125"
          />
          <label for="lectura-heredado"
            >Heredados
            <span title="Hereda los permisos de la carpeta padre"
              ><icon icon="info-circle" class="inline-block" /></span
          ></label>
        </div>
      </div>
      <div class="space-y-2">
        <div class="flex space-x-1 items-center">
          <span class="text-diminished text-sm">Por defecto: </span>
          <select
            class="text-sm"
            v-if="administracion && !localValue.lecturaHereda"
            v-model="localValue.lecturaAcceso"
          >
            <option value="Todos">Público</option>
            <option value="Autenticados">Usuarios registrados</option>
            <option value="Delegados">Delegados</option>
            <option value="Muul">Muul</option>
            <option value="Nadie">Sólo propietario</option>
          </select>
          <PermisosListado
            v-else
            :value="[
              { nombre: localValue.lecturaAcceso.replace('Todos', 'Público') },
            ]"
          />
        </div>
        <div class="text-sm space-y-1">
          <div
            v-if="localValue.lecturaGrupos && localValue.lecturaGrupos.length"
          >
            <div class="flex space-x-1 items-center">
              <span class="text-diminished">Grupos: </span>
              <PermisosListado
                v-model="localValue.lecturaGrupos"
                :administracion="administracion && !localValue.lecturaHereda"
              />
            </div>
          </div>
          <div
            v-if="localValue.lecturaEquipos && localValue.lecturaEquipos.length"
          >
            <div class="flex space-x-1 items-center">
              <span class="text-diminished">Equipos: </span>
              <PermisosListado
                v-model="localValue.lecturaEquipos"
                :administracion="administracion && !localValue.lecturaHereda"
              />
            </div>
          </div>
          <div
            v-if="
              localValue.lecturaUsuarios && localValue.lecturaUsuarios.length
            "
          >
            <div class="flex space-x-1 items-center">
              <span class="text-diminished">Usuarios: </span>
              <PermisosListado
                v-model="localValue.lecturaUsuarios"
                :administracion="administracion && !localValue.lecturaHereda"
              />
            </div>
          </div>
          <div v-if="mostrarModalLectura" class="flex space-x-2 items-center">
            <v-select
              class="my-v"
              :options="options"
              :placeholder="placeholder"
              autocomplete="on"
              :reduce="(item) => item.value"
              :filter="fuseSearch"
              @search="buscar"
              @input="seleccionado"
            >
              <div slot="no-options">
                <span v-if="options.length">Ningún resultado</span>
              </div>
            </v-select>
            <span @click="cancel" class="cursor-pointer"
              ><icon icon="times"
            /></span>
          </div>
          <div v-else class="flex space-x-2">
            <TButton
              class="whitespace-nowrap btn-mini text-xs"
              v-if="administracion && !localValue.lecturaHereda"
              @click="buscarGrupo('lectura')"
              >+ Grupo</TButton
            >
            <TButton
              class="whitespace-nowrap btn-mini text-xs"
              v-if="administracion && !localValue.lecturaHereda"
              @click="buscarEquipo('lectura')"
              >+ Equipo</TButton
            >
            <TButton
              class="whitespace-nowrap btn-mini text-xs"
              v-if="administracion && !localValue.lecturaHereda"
              @click="buscarUsuario('lectura')"
              >+ Usuario</TButton
            >
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex space-x-4">
        <p class="font-bold">
          Permisos de escritura:
          <span
            title="Usuarios que pueden ver y leer los contenidos de la carpeta"
            ><icon icon="info-circle"
          /></span>
        </p>
        <div v-if="administracion" class="flex items-center space-x-1">
          <input
            id="escritura-heredado"
            type="checkbox"
            v-model="localValue.escrituraHereda"
            class="scale-125"
          />
          <label for="escritura-heredado"
            >Heredados
            <span title="Hereda los permisos de la carpeta padre"
              ><icon icon="info-circle" class="inline-block" /></span
          ></label>
        </div>
      </div>
      <div class="space-y-2">
        <div class="flex space-x-1 items-center">
          <span class="text-diminished text-sm">Por defecto: </span>
          <select
            class="text-sm"
            v-if="administracion && !localValue.escrituraHereda"
            v-model="localValue.escrituraAcceso"
          >
            <option value="Todos">Público</option>
            <option value="Autenticados">Usuarios registrados</option>
            <option value="Delegados">Delegados</option>
            <option value="Muul">Muul</option>
            <option value="Nadie">Solo propietario</option>
          </select>
          <PermisosListado
            v-else
            :value="[
              {
                nombre: localValue.escrituraAcceso.replace('Todos', 'Público'),
              },
            ]"
          />
        </div>
        <div class="text-sm space-y-1">
          <div
            v-if="
              localValue.escrituraGrupos && localValue.escrituraGrupos.length
            "
          >
            <div class="flex space-x-1 items-center">
              <span class="text-diminished">Grupos: </span>
              <PermisosListado
                v-model="localValue.escrituraGrupos"
                :administracion="administracion && !localValue.escrituraHereda"
              />
            </div>
          </div>
          <div
            v-if="
              localValue.escrituraEquipos && localValue.escrituraEquipos.length
            "
          >
            <div class="flex space-x-1 items-center">
              <span class="text-diminished">Equipos: </span>
              <PermisosListado
                v-model="localValue.escrituraEquipos"
                :administracion="administracion && !localValue.escrituraHereda"
              />
            </div>
          </div>
          <div
            v-if="
              localValue.escrituraUsuarios &&
              localValue.escrituraUsuarios.length
            "
          >
            <div class="flex space-x-1 items-center">
              <span class="text-diminished">Usuarios: </span>
              <PermisosListado
                v-model="localValue.escrituraUsuarios"
                :administracion="administracion && !localValue.escrituraHereda"
              />
            </div>
          </div>
          <div v-if="mostrarModalEscritura" class="flex space-x-2 items-center">
            <v-select
              class="my-v"
              :options="options"
              :placeholder="placeholder"
              autocomplete="on"
              :reduce="(item) => item.value"
              :filter="fuseSearch"
              @search="buscar"
              @input="seleccionado"
            >
              <div slot="no-options">
                <span v-if="options.length">Ningún resultado</span>
              </div>
            </v-select>
            <span @click="cancel" class="cursor-pointer"
              ><icon icon="times"
            /></span>
          </div>
          <div v-else class="flex space-x-2">
            <TButton
              class="whitespace-nowrap btn-mini text-xs"
              v-if="administracion && !localValue.escrituraHereda"
              @click="buscarGrupo('escritura')"
              >+ Grupo</TButton
            >
            <TButton
              class="whitespace-nowrap btn-mini text-xs"
              v-if="administracion && !localValue.escrituraHereda"
              @click="buscarEquipo('escritura')"
              >+ Equipo</TButton
            >
            <TButton
              class="whitespace-nowrap btn-mini text-xs"
              v-if="administracion && !localValue.escrituraHereda"
              @click="buscarUsuario('escritura')"
              >+ Usuario</TButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const PERMISOS_POR_DEFECTO = {
  lecturaHereda: true,
  lecturaAcceso: "Autenticados",
  escrituraHereda: true,
  escrituraAcceso: "Nadie",
};

import vSelect from "vue-select";
import Fuse from "fuse.js";
export default {
  components: { vSelect },
  props: {
    value: {},
    administracion: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      localValue: {
        ...PERMISOS_POR_DEFECTO,
        ...this.value,
      },
      options: [],
      mostrarModalLectura: false,
      mostrarModalEscritura: false,
      placeholder: "Elige...",
      coleccion: "",
      camposBusqueda: [],
      modo: "lectura",
    };
  },
  computed: {
    lecturaHereda() {
      return this.localValue.lecturaHereda;
    },
    escrituraHereda() {
      return this.localValue.escrituraHereda;
    },
    localValueJSON() {
      return JSON.stringify(this.localValue);
    },
  },
  watch: {
    localValueJSON(value) {
      this.$emit("input", { ...this.localValue });
    },
    value(value) {
      this.localValue = value;
    },
    lecturaHereda(newValue) {
      if (newValue) {
        const carpeta = this.localValue;
        const padre = carpeta.padre;
        if (padre) {
          carpeta.lecturaAcceso = padre.lecturaAcceso;
          carpeta.lecturaUsuarios = padre.lecturaUsuarios;
          carpeta.lecturaEquipos = padre.lecturaEquipos;
          carpeta.lecturaGrupos = padre.lecturaGrupos;
        }
      }
    },
    escrituraHereda(newValue) {
      if (newValue) {
        const carpeta = this.localValue;
        const padre = carpeta.padre;
        if (padre) {
          carpeta.escrituraAcceso = padre.escrituraAcceso;
          carpeta.escrituraUsuarios = padre.escrituraUsuarios;
          carpeta.escriturEquipos = padre.escrituraEquipos;
          carpeta.escrituraGrupos = padre.escrituraGrupos;
        }
      }
    },
  },
  methods: {
    buscar(search, loading) {
      console.log("buscar", search);
      if (!search || search.length < 2 || search.length > 3) return;
      loading(true);
      this.search(loading, search);
    },
    fuseSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: ["label"],
        shouldSort: true,
      });
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list;
    },
    // https://codepen.io/sagalbot/pen/POMeOX
    search(loading, search) {
      console.log("search", search, this.coleccion, this.camposBusqueda);
      const filters = { $or: [] };
      for (const c of this.camposBusqueda) {
        const opt = {};
        opt[c] = {
          $containsi: search,
        };
        filters.$or.push(opt);
      }
      console.log("filters", filters);
      const fields = ["id"].concat(this.camposBusqueda);
      this.$strapi
        .find(this.coleccion, {
          fields,
          filters,
        })
        .then((res) => {
          const data = "data" in res ? res.data : res;
          this.options = data
            ? data.map((x) => ({
                value: x.id,
                label: x.titulo || x.nombre || x.nombreSimbolico || x.username,
              }))
            : [];
          loading(false);
        });
    },
    buscarGrupo(modo) {
      this.options = [];
      this.placeholder = "Escribe grupo";
      this.coleccion = "grupos";
      this.camposBusqueda = ["nombre", "slug", "descripcion"];
      this.modo = modo;
      this["mostrarModal" + this.$ucFirst(modo)] = true;
      this.focusSelect();
    },
    buscarEquipo(modo) {
      this.selected = null;
      this.options = [];
      this.placeholder = "Escribe equipo";
      this.coleccion = "equipos";
      this.camposBusqueda = ["nombre", "slug", "descripcion"];
      this.modo = modo;
      this["mostrarModal" + this.$ucFirst(modo)] = true;
      this.focusSelect();
    },
    buscarUsuario(modo) {
      this.options = [];
      this.placeholder = "Escribe usuario";
      this.coleccion = "users";
      this.camposBusqueda = ["nombreSimbolico", "username"];
      this.modo = modo;
      this["mostrarModal" + this.$ucFirst(modo)] = true;
      this.focusSelect();
    },
    focusSelect() {
      this.$nextTick(() => {
        var inp = document.querySelector(".vs__dropdown-toggle input");
        if (inp) inp.focus();
      });
    },
    cancel() {
      this.options = [];
      this.mostrarModalEscritura = false;
      this.mostrarModalLectura = false;
    },
    seleccionado(value) {
      console.warn("INPUT", value);
      console.log("coleccion", this.coleccion);
      console.log("modo", this.modo);
      const item = this.options.find((x) => x.value === value);
      const toInsert = { id: item.value, nombre: item.label };
      const key =
        this.modo + this.$ucFirst(this.coleccion.replace("users", "usuarios"));
      if (!(key in this.localValue)) this.localValue[key] = [];
      if (!this.localValue[key].find((x) => x.id === toInsert.id))
        this.localValue[key].push(toInsert);
      this.options = [];
      this.mostrarModalEscritura = false;
      this.mostrarModalLectura = false;
    },
  },
};
</script>

<style scoped>
.elem {
  @apply px-2 rounded bg-gray-200 text-sm text-gray-dark-900;
}

.my-v {
  @apply relative w-48;
}
.my-v >>> [role="combobox"] {
  @apply flex;
}
.my-v >>> .vs__selected-options {
  @apply flex-grow;
}
.my-v >>> .vs__actions {
  @apply flex items-center px-2 pb-0;
}
.my-v >>> .vs__actions > * {
  @apply cursor-pointer text-gray;
}
.my-v >>> .vs__clear {
  @apply mr-3;
}
.my-v >>> .vs__selected {
  @apply absolute top-0 left-2 bottom-0 flex items-center text-gray-700 px-1 py-1;
}
.my-v.vs--single.vs--searching >>> .vs__selected {
  display: none;
}
.my-v >>> .vs__dropdown-menu {
  @apply block absolute top-full mt-2 left-0 z-10 p-2 cursor-pointer text-gray-900 w-full max-h-40 overflow-y-auto shadow-md rounded text-left list-none bg-gray-100;
}
</style>