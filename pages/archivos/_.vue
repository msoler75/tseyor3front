<template>
  <div class="flex flex-col sm:flex-row">
    <div v-if="$strapi.user" class="space-y-4 p-5">
      idCarpetaActual: {{ idCarpetaActual }}

      <section @click="raiz" class="flex space-x-2 items-center">
         <icon icon="svg" :svg="iconHome" class="w-5" />
        <span class="font-bold">Archivos Tseyor</span>
      </section>

      <section @click="misArchivos" class="flex space-x-2 items-center">
        <icon icon="far fa-user" class="w-5" />
        <span class="font-bold">Mis Archivos</span>
      </section>

      <section class="flex space-x-2 items-center">
        <icon icon="svg" :svg="iconUpload" class="w-5" />
        <span class="font-bold">Subidas recientes</span>
      </section>

      <section @click="verCompartidas" class="flex space-x-2 items-center">
        <icon icon="link" class="w-5" />
        <span class="font-bold">Carpetas compartidas</span>
      </section>

      <section @click="papelera" class="flex space-x-2 items-center">
        <icon icon="far fa-trash-alt" class="w-5" />
        <span class="font-bold">Papelera</span>
      </section>

      <div class="font-bold text-diminished mt-8">Colaboración</div>

      <section @click="vistaEquipos" class="flex space-x-2 items-center">
        <icon icon="people-carry" class="w-5" />
        <span class="font-bold">Equipos</span>
      </section>

      <section @click="vistaGrupos" class="flex space-x-2 items-center">
        <icon icon="users" class="w-5" />
        <span class="font-bold">Grupos</span>
      </section>

      <!--

      <section v-if="carpeta">
        <FilesFolder v-model="carpeta" navigationMode="Click" />
      </section>
      <section v-if="carpetasCreadas.length">
        <FilesFolder v-model="carpetasCreadas" navigationMode="Click" />
      </section>
      <section v-if="carpetasLectura.length">
        <FilesFolder v-model="carpetasLectura" navigationMode="Click" />
      </section>
      <section v-if="carpetasEscritura.length">
        <FilesFolder v-model="carpetasEscritura" navigationMode="Click" />
      </section>
      <section v-if="carpetasAdministracion.length">
        <FilesFolder v-model="carpetasAdministracion" navigationMode="Click" />
      </section>
      <section v-if="equipos">
        <div v-for="equipo of equipos" :key="equipo.id">
          <template
            v-if="
              equipo.carpetasLectura.length || equipo.carpetasEscritura.length
            "
          >
            <span>{{ equipo.nombre }}</span>
            <FilesFolder
              v-if="equipo.carpetasLectura.length"
              v-model="equipo.carpetasLectura"
              navigationMode="Click"
            />
            <FilesFolder
              v-if="equipo.carpetasEscritura.length"
              v-model="equipo.carpetasEscritura"
              navigationMode="Click"
            />
          </template>
        </div>
      </section>
      <section v-if="grupos">
        <div v-for="grupo of grupos" :key="grupo.id">
          
        </div>
      </section>
      -->
    </div>
    <div v-if="idCarpetaActual == urlCompartidas">
      <h3>Comparten contigo personalmente</h3>
      <FilesFolder
        v-model="carpetasCompartidasContigo"
        placeholder="Ninguna carpeta compartida"
      />

      <divider />

      <h3>Compartes con los demás</h3>
      <FilesFolder
        v-model="carpetasQueCompartes"
        placeholder="Ninguna carpeta compartida"
      />
    </div>
    <div v-else-if="idCarpetaActual == urlPapelera">
      <h3>Papelera</h3>
      <FilesFolder v-model="elementosBorrados" />
    </div>
    <div v-else-if="idCarpetaActual == urlEquipos">
      <h3>Equipos</h3>
      <div v-if="equiposFiltrados.length">
        <div v-for="equipo of equiposFiltrados" :key="equipo.id">
          <span class="font-bold">{{ equipo.nombre }}</span>
          <FilesFolder
            v-if="equipo.carpeta"
            v-model="equipo.carpeta"
            navigationMode="Click"
            @click="clickedOn"
          />
          <FilesFolder
            v-if="equipo.carpetasLectura.length"
            v-model="equipo.carpetasLectura"
            navigationMode="Click"
            @click="clickedOn"
          />
          <FilesFolder
            v-if="equipo.carpetasEscritura.length"
            v-model="equipo.carpetasEscritura"
            navigationMode="Click"
            @click="clickedOn"
          />
        </div>
      </div>
      <div v-else>No hay nada que mostrar</div>
    </div>
    <div v-else-if="idCarpetaActual == urlGrupos">
      <h3>Grupos</h3>
      <div v-if="gruposFiltrados.length">
        <div v-for="grupo of gruposFiltrados" :key="grupo.id">
          <span>{{ grupo.nombre }}</span>
          <FilesFolder
            v-if="grupo.carpetasLectura.length"
            v-model="grupo.carpetasLectura"
            navigationMode="Click"
            @click="clickedOn"
          />
          <FilesFolder
            v-if="grupo.carpetasEscritura.length"
            v-model="grupo.carpetasEscritura"
            navigationMode="Click"
            @click="clickedOn"
          />
        </div>
      </div>
      <div v-else>No hay nada que mostrar</div>
    </div>
    <FilesFolder
      v-else
      v-model="idCarpetaActual"
      navigationMode="Main"
      :inside="true"
      :idRootFolder="idRootActual"
    />
  </div>
</template>

<script>
import iconUpload from "~/assets/svg/icons/cloud-upload.svg?raw";
import iconHome from "~/assets/svg/icons/home.svg?raw";
const URL_COMPARTIDAS = "/archivos/___compartidas";
const URL_PAPELERA = "/archivos/___papelera";
const URL_EQUIPOS = "/archivos/___equipos";
const URL_GRUPOS = "/archivos/___grupos";
export default {
  async asyncData({ route, $strapi, $error }) {
    try {
      const parts = route.fullPath
        .replace(/\?.*$/, "")
        .split("/")
        .filter((x) => !!x);
      const ruta = parts.length > 0 ? "/" + parts.join("/") : "/";
      /*const {
        data: [contenido],
      } = await $strapi.find("carpetas", {
        filters: {
          ruta: {
            $eq: ruta,
          },
        },
        // populate: '*'
      });*/
      // if (!contenido) return $error(404, "Carpeta no encontrada");
      console.log("USER?", $strapi.user);
      const data = $strapi.user.id
        ? await $strapi.find("users/me", {
            fields: ["id"],
            populate: {
              carpeta: "*",
              carpetasCreadas: { publicationState: "preview" },
              carpetasLectura: "*",
              carpetasEscritura: "*",
              carpetasAdministracion: "*",
              equipos: {
                populate: ["carpeta", "carpetasLectura", "carpetasEscritura"],
              },
              grupos: {
                populate: ["carpetasLectura", "carpetasEscritura"],
              },
            },
          })
        : {
            carpeta: null,
            carpetasCreadas: [],
            carpetasLectura: [],
            carpetasEscritura: [],
            carpetasAdministracion: [],
            equipos: [],
            grupos: [],
          };

      const root = $strapi.findOne("carpetas", {
        filters: {
          ruta: {
            $eq: "/archivos",
          },
        },
      });

      return {
        ...data,
        idCarpetaActual: ruta,
        idRoot: root.id,
        idRootActual: root.id,
      };
    } catch (e) {
      console.log(e);
      $error(503);
    }
  },
  data() {
    return {
      iconUpload,
      iconHome,
      urlCompartidas: URL_COMPARTIDAS,
      urlPapelera: URL_PAPELERA,
      urlEquipos: URL_EQUIPOS,
      urlGrupos: URL_GRUPOS,
    };
  },
  computed: {
    equiposFiltrados() {
      return this.equipos.filter(
        (x) =>
          x.carpeta || x.carpetasLectura.length || x.carpetasEscritura.length
      );
    },
    gruposFiltrados() {
      return this.grupos.filter(
        (x) => x.carpetasLectura.length || x.carpetasEscritura.length
      );
    },
    carpetasCompartidasContigo: {
      get() {
        return this.carpetasLectura
          .concat(this.carpetasEscritura)
          .filter((x) => x.publishedAt);
      },
      set(newValue) {},
    },
    carpetasQueCompartes: {
      get() {
        return this.carpetasCreadas
          .filter((x) => x.publishedAt)
          .filter(
            (x) =>
              x.lecturaAcceso != "Nadie" ||
              x.escrituraAcceso != "Nadie" ||
              x.lecturaUsuarios.length ||
              x.escrituraUsuarios.length ||
              x.lecturaGrupos.length ||
              x.escrituraGrupos.length ||
              x.lecturaEquipos.length ||
              x.escrituraEquipos.length ||
              x.administracionUsuarios.length
          );
      },
      set(newValue) {},
    },
    elementosBorrados: {
      get() {
        return this.carpetasCreadas.filter((x) => !x.publishedAt);
      },
      set(newValue) {},
    },
  },
  methods: {
    raiz() {
      this.idCarpetaActual = this.idRoot;
      this.idRootActual = this.idRoot;
      // this.idRootActual = this.carpeta.id
      history.pushState({}, null, "/archivos");
    },
    misArchivos() {
      this.idCarpetaActual = this.carpeta.id;
      this.idRootActual = this.carpeta.id;
      // this.idRootActual = this.carpeta.id
      history.pushState({}, null, this.carpeta.ruta);
    },
    verCompartidas() {
      this.idCarpetaActual = URL_COMPARTIDAS;
      history.pushState({}, null, URL_COMPARTIDAS);
    },
    papelera() {
      this.idCarpetaActual = URL_PAPELERA;
      history.pushState({}, null, URL_PAPELERA);
    },
    vistaEquipos() {
      this.idCarpetaActual = URL_EQUIPOS;
      history.pushState({}, null, URL_EQUIPOS);
    },
    vistaGrupos() {
      this.idCarpetaActual = URL_GRUPOS;
      history.pushState({}, null, URL_GRUPOS);
    },
    clickedOn(carpeta) {
      this.idCarpetaActual = carpeta.id;
      // this.idRootActual = this.idRoot;
      // this.idRootActual = this.carpeta.id
      history.pushState({}, null, carpeta.ruta);
    }
  },
};
</script>