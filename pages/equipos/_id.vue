<template>
  <section class="relative px-7 mb-7 container container-xl mx-auto space-y-6 lh:space-y-0 lg:flex lg:space-x-6"
    contained="no">

    <Equipo :equipo="equipo" class="lg:hidden" />

    <div class="w-full space-y-6">

      <Card class="p-5 bg-yellow-50 dark:bg-brown-700" v-if="anuncioHTML">
        <div class="anuncio" v-html="anuncioHTML" />
        <div class="w-full flex opacity-50 text-xs">
          <span @click="editarAnuncio" class="cursor-pointer">
            <icon icon="pen-alt" />
          </span>
          <span @click="eliminarAnuncio" class="ml-4 cursor-pointer">
            <icon icon="trash" />
          </span>
          <span class="ml-auto">{{ $dayjs(anuncio.updatedAt).fromNow() }}</span>
        </div>
      </Card>

      <div v-else-if="soyCoordinador">
        <span @click="editarAnuncio" class="space-x-2 text-xs bg-yellow-50 px-2 py-1 rounded-full cursor-pointer">
          <icon icon="pen-alt" /> Poner anuncio
        </span>
      </div>

      <div class="flex justify-between items-center">
        <h3>Publicaciones</h3>

        <TButton v-if="soyCoordinador" :to="`/publicaciones/nueva/editar?equipo=${equipo.id}`" class="text-center">
          <icon icon="pen-alt" class="mr-2" /> Nueva publicación
        </TButton>
      </div>

      <Card v-for="publi of publicacionesFiltro" :key="publi.id" class="py-2 space-y-2 px-4 flex flex-col shrink-0">
        <NLink :to="`/publicaciones/${publi.id}`"
          class="w-full flex justify-between items-center text-gray-dark-800 dark:text-gray-100"
          v-if="publi.publishedAt">
          <span :class="publi.publishedAt ? '' : 'opacity-50'">{{ $ucFirst(publi.titulo) }}</span>
        </NLink>
        <div class="w-full flex justify-between items-center text-gray-dark-800 dark:text-gray-100" v-else>
          <span :class="publi.publishedAt ? '' : 'opacity-50'">{{ $ucFirst(publi.titulo) }}</span>
          <span class="bg-error text-white text-xs rounded-full px-3 py-1">BORRADOR</span>
        </div>
        <div class="w-full text-xs text-diminished flex space-x-2 justify-between items-center">
          <div class="rounded-full bg-orange-700 text-white text-xs py-1 px-3 uppercase tracking-wider">{{ publi.tipo }}
          </div>
          <div v-if="publi.publishedAt" class="ml-auto">{{ $dayjs(publi.publishedAt).fromNow() }}</div>
          <TButton class="btn-mini w-20" v-if="soyCoordinador" :to="`/publicaciones/${publi.id}/editar`">
            <icon icon="pen-alt" class="mr-2" /> Editar
          </TButton>
        </div>
      </Card>
    </div>

    <Equipo :equipo="equipo" :vertical="true" class="hidden lg:block" />
  </section>
</template>

<script>
import vercontenido from "@/mixins/vercontenido.js"
import seo from "@/mixins/seo.js"
export default {
  mixins: [vercontenido, seo],
  middleware: "logged",
  async asyncData({ route, $strapi, $borradoresEquipo, $error }) {
    try {
      // let contenido = { miembros: [], coordinadores: [] }
      const contenido = await $strapi.getContent(route, {
        populate: {
          miembros: {
            fields: ["id", "username", "nombreSimbolico"],
            populate: {
              imagen: {
                fields: ["url", "width", "height"]
              }
            }
          },
          coordinadores: {
            fields: ["id", "username", "nombreSimbolico"],
            populate: {
              imagen: {
                fields: ["url", "width", "height"]
              }
            }
          },
          actividades: {
            fields: ["id", "titulo", "descripcion"],
            populate: '*'
          }
        }
      });
      console.warn("EQUIPO", contenido);
      if (!contenido)
        return $error(404, "Equipo no encontrado");
      // contenido.pizarraHTML = $mdToHtml(contenido.pizarra /*, contenido.imagenes*/);
      /* contenido.numMiembros = await $strapi.count('usuarios', {
        filters: {
          equipos: {
            $eq: contenido.id
          }
        }
      }) */
      const { data: publicaciones, meta } = await $strapi.find("publicaciones", {
        filters: {
          equipo: {
            id: {
              $eq: contenido.id
            }
          }
        },
        publicationState: 'preview',
        sort: ['publishedAt:desc']
      });
      var borradoresEquipo = await $borradoresEquipo(contenido.id)
      return { contenido, publicaciones, meta, equipo: contenido, borradoresEquipo };
    }
    catch (e) {
      console.error(e);
      $error(503);
    }
  },
  data() {
    return {
      carpetaActual: null,
      carpetaActualId: null
    };
  },
  async mounted() {
    if (this.equipo.carpeta) {
      this.$set(this, "carpetaActual", this.equipo.carpeta);
      this.carpetaActualId = this.equipo.carpeta.id;
    }
  },
  computed: {
    soyMiembro() {
      return !!this.equipo.miembros.find(x => x.id === this.$strapi.user.id);
    },
    soyCoordinador() {
      return !!this.equipo.coordinadores.find(x => parseInt(x.id) === this.$strapi.user.id);
    },
    publicacionesFiltro() {
      return this.soyCoordinador ? this.publicaciones :
        this.publicaciones.filter(x => x.publishedAt)
    },
    anuncio() {
      return this.publicaciones.find(x => x.tipo == 'Anuncio')
    },
    anuncioHTML() {
      if (!this.anuncio) return ''
      return this.$mdToHtml(this.anuncio.texto)
    },
    carpetaActualNombre() {
      if (this.carpetaActual)
        return "Archivos";
      return this.carpetaActual.id === this.equipo.carpeta.id ? "Archivos" : this.carpetaActual.nombre;
    },
    bgImage() {
      const imgUrl = this.$img(this.equipo.imagen ? this.equipo.imagen.url : "/imagenes/equipo.jpg", { width: 400, format: "webp", quality: 70 });
      return {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      };
    }
  },
  methods: {
    async editarAnuncio() {
      this.$prompt({
        message: 'Editar anuncio',
        response: this.anuncio ? this.anuncio.texto : '',
        accepted: (response) => {
          if (this.anuncio) {
            this.$strapi.update('publicaciones', this.anuncio.id, {
              texto: response
            })
              .then(res => {
                if (res.error)
                  this.$alert('Hubo un error. Tal vez el texto es demasiado corto')
                else {
                  this.anuncio.texto = response
                  this.anuncio.updatedAt = new Date().toISOString()
                }
              })
          }
          else {
            this.$strapi.create('publicaciones', {
              equipo: this.equipo.id,
              tipo: 'Anuncio',
              texto: response
            })
              .then(res => {
                if (res.error) {
                  this.$alert('Hubo un error. Tal vez el texto es demasiado corto')
                }
                else {
                  console.log('ANUNCIO CREADO', res)
                  this.publicaciones.push(res.data)
                }
              })
          }
        }
      })
    },

    async eliminarAnuncio() {
      this.$confirm({
        message: 'Esto eliminará el anuncio. ¿Quieres continuar?',
        confirmed: () => {
          this.$strapi.delete('publicaciones', this.anuncio.id)
            .then(res => {
              if (res.error) {
                this.$alert('Hubo algún error')
              }
              else {
                const idx = this.publicaciones.findIndex(x => x.id === this.anuncio.id)
                this.publicaciones.splice(idx, 1)
              }
            }
            )
        }
      })
    },

    async actualizarMiembros() {
      // await this.$strapi.fetchUser() // actualizamos los datos del usuario actual y el equipo con sus miembros después de la operación
      const id = this.$route.params.id;
      const equipo = await this.$strapi.getContent(route);
      console.log("listado actualizado", equipo.miembros);
      this.contenido = equipo;
      this.equipo = equipo;
    }
    /*
    async getEquipos() {
      const response = await this.$axios.get('/api/users/'+this.$strapi.user.id)
      const user = response.data
      return user&&user.equipos?user.equipos.map(x=>x.id):[]
    },
    async updateEquipos(equipos) {
      console.log('update_equipos', equipos)
      const r = await this.$axios.put('/api/users/'+this.$strapi.user.id, {equipos})
      this.$router.app.refresh()
    },
    async entrar2() {
      const equipos = await this.getEquipos()
      console.log('equipos', equipos)
      const idx = equipos.findIndex(id=>id===this.equipo.id)
      if(idx!==-1)
      {
        this.$router.app.refresh()
        return
      }
      equipos.push(this.equipo.id)
      this.updateEquipos(equipos)
    },
    async salir2() {
      const equipos = await this.getEquipos()
      console.log('equipos', equipos)
      const idx = equipos.findIndex(id=>id===this.equipo.id)
      if(idx===-1)
      {
        this.$router.app.refresh()
        return
      }
      equipos.splice(idx, 1)
      this.updateEquipos(equipos)
    }
    */
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Dancing+Script&family=Fuzzy+Bubbles:wght@700&display=swap');

.anuncio {
  font-family: 'Fuzzy Bubbles', cursive;
}
</style>