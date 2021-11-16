<template>
  <div>
    
    <section class="mb-5">
      <NLink class="btn btn-gray" :to="'/equipos/' + actividad.equipo.id">
        <Icon icon="chevron-left" class="mr-3" />
        {{ actividad.equipo.nombre }}
      </NLink>
    </section>

    <GridFluid class="gap-6 grid-flow-row">
      <div class="p-5 surface flex flex-col justify-center text-center">
        <h1>{{ actividad.equipo.nombre }}</h1>
        <h2>{{ actividad.titulo }}</h2>
        <p>{{ actividad.descripcion }}</p>
      </div>

      <div class="p-5 surface text-center flex flex-col justify-center">
        <h3>Horarios</h3>
        <Horario
          v-for="horario of actividad.horarios"
          :key="horario.id"
          class="my-1 text-center"
          :data="horario"
          :timezone="zonahoraria"
        />
      </div>

      <div class="p-5 surface text-center flex flex-col justify-center" v-if="actividad.sala">
        <h3>Sala virtual</h3>
        <strong class="my-5">{{ actividad.sala.nombre }}</strong>

        <NLink class="btn w-auto mx-auto" :to="'/salas/' + actividad.sala.id">Acceder</NLink>
      </div>

      <div
        class="p-5 surface text-center flex flex-col row-span-2 items-center md:overflow-y-auto h-full"
        v-if="actividad.tipo == 'reunion'"
      >
        <h3>Agenda</h3>
        <!--
        <div
          v-for="cita, index of citas"
          :key="index"
        >{{ cita.fecha.diasemana }} {{ cita.fecha.dia }} de {{ cita.fecha.mesnombre }} a las {{ cita.hora.substr(0, 5) }}</div>
        -->

        <div class="grid proximas gap-2">
          <template v-for="(cita, index) of citas">
            <Card
              v-if="cita.seccion"
              :key="'a' + index"
              class="col-span-3 p-5 font-bold text-3xl text-center tracking-widest uppercase"
            >{{ cita.seccion }}</Card>

            <Card
              :key="'z' + index"
              class="p-3 text-3xl flex font-bold justify-center items-center"
            >{{ cita.fecha.dia }}</Card>

            <Card
              :key="'c' + index"
              class="flex flex-row col-span-2 p-3 justify-between text-center"
            >
              <div class="w-1/2">
                <span>{{ cita.fecha.diasemana }}</span>
                <span class="font-bold text-xl">
                  {{
                    $dayjs("1970/1/1 " + cita.hora).format("HH:mm")
                  }}
                </span>
              </div>
              <div class="w-1/2 flex justify-center items-center">
                <div v-if="cita.detalles.reunion">
                  <NLink
                    class="btn btn-mini mt-2"
                    :to="`/reuniones/${cita.detalles.reunion.id}`"
                  >Ver</NLink>
                </div>
                <div v-else-if="soyCoordinador">
                  <NLink
                    class="btn btn-mini btn-gray mt-2"
                    :to="`/reuniones/editar/nueva?actividad=${contenido.id}&fechahora=${cita.fechahora}`"
                  >Crear</NLink>
                </div>
              </div>
            </Card>
          </template>
        </div>
      </div>

      <div
        class="p-5 surface text-center flex flex-col items-center"
        v-if="actividad.tipo == 'reunion'"
      >
        <div v-if="!actividad.reuniones.length">No hay reuniones</div>
        <section v-else class="w-full">
          <Tabs
            v-model="tabReuniones"
            :labels="reuniones"
            compact
            :group="false"
            center
            class="mb-3"
            tabClass="text-xs"
          />
          <div v-if="tabReuniones === 'Reuniones'" class="overflow-y-auto">
            <table
              v-if="actividad.reuniones.length"
              class="w-full"
              style="border-collapse:separate; border-spacing: .6em"
            >
              <tr v-for="reunion of actividad.reuniones" :key="reunion.id">
                <td>
                  <span class="text-sm">{{ $dayjs(reunion.fecha).fromNow() }}</span>
                </td>
                <td>
                  <span
                    class="font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                  >{{ $dayjs(reunion.fecha).format('DD-MMM') }}</span>
                </td>
                <td>
                  <NLink class="btn btn-mini text-sm" :to="'/reuniones/' + reunion.id">Ver</NLink>
                </td>
              </tr>
            </table>
            <section
              v-else
              class="flex w-full h-40 justify-center items-center text-diminished"
            >No hay reuniones</section>
          </div>
          <div v-else class="overflow-y-auto">
            <table
              v-if="actas.length"
              class="w-full"
              style="border-collapse:separate; border-spacing: .6em"
            >
              <tr v-for="acta of actas" :key="acta.id">
                <td>
                  <span class="text-sm">{{ $dayjs(acta.fecha).fromNow() }}</span>
                </td>
                <td>
                  <span
                    class="font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                  >{{ $dayjs(acta.fecha).format('DD-MMM') }}</span>
                </td>
                <td>
                  <NLink class="btn btn-mini text-sm" :to="'/actas/' + acta.id">Ver</NLink>
                </td>
              </tr>
            </table>
            <section
              v-else
              class="flex w-full h-40 justify-center items-center text-diminished"
            >No hay actas</section>
          </div>
        </section>
      </div>

      <div class="p-5 surface text-center flex flex-col items-center" v-if="anexos.length">
        <h4 class="mt-0">Anexos</h4>
        <div v-for="anexo of anexos" :key="anexo.id">{{ anexo }}</div>
      </div>

    <div v-if="soyCoordinador" class="p-5 surface text-center flex flex-col justify-center items-center h-full space-y-9">
      <div>
        <NLink class="btn" :to="`/actas/editar/nueva?actividad=${contenido.id}`">Nueva Acta</NLink>
      </div>
      <div>
        <NLink class="btn" :to="`/reuniones/editar/nueva?actividad=${contenido.id}`">Nueva Reunión</NLink>
      </div>
    </div>


    </GridFluid>
  </div>
</template>

<script>
const query_actividad = `
query {
  actividades(where: { id: %id }) {
    id
    slug
    titulo
    descripcion
    tipo
    publica
    horarios {
      id
      dia
      hora
    }
    equipo {
      id
      slug
      nombre
      descripcion
      imagen {
        url
        width
        height
      }
      coordinadores {
        id
      }
    }
    sala {
      id
      tipo
      enlace
    }
    reuniones {
      id
      fecha
      cancelada
      actividad {
        id
      }
      equipo {
        id
      }
      acta {
        id
      }
      anexos {
        id
        slug
        titulo
      }
    }
  }
  actas(where: { actividad: %id }) {
    id
    fecha
    reunion {
      id
      fecha
    }
  }
}

`


import vercontenidomixin from '@/mixins/vercontenido.js'
import seo from '@/mixins/seo.js'
import citas from '@/mixins/citas.js'
export default {
  mixins: [vercontenidomixin, seo, citas],
  async asyncData({ $strapi, route, $error }) {
    try {
      const id = route.params.id
      const { actividades, actas } = await $strapi.graphql({ query: query_actividad.replace(/%id/g, id) })
      if (!actividades.length)
        return $error(404, 'Esta actividad no existe')
      const contenido = actividades[0]
      const agenda = await $strapi.find('agenda', 'actividad=' + contenido.id)
      return { contenido, actividad: contenido, actas, agenda }
    }
    catch (e) {
      console.warn(e.original)
      $error(503)
    }
  },
  data() {
    return {
      proximas: [],
      tabReuniones: 'Actas',
      reuniones: ['Actas', 'Reuniones']
    }
  },
  async mounted() {
    // await this.$strapi.$http.$get("/api/agenda?actividad="+this.contenido.id)
    const now = this.$dayjs().add(-1, 'days')
    this.proximas = this.generarCitas(
      {
        proximosDias: 7,
        agenda: this.agenda,
        // solo las reuniones futuras
        reuniones: this.actividad.reuniones
          .filter(x => this.$dayjs(x.fecha).isAfter(now))
      })
  },
  computed: {
    zonahoraria() {
      switch (this.actividad.equipo.zonahoraria) {
        case 'Espana': return 'Europe/Madrid'
        default: return this.actividad.equipo.zonahoraria
      }
    },
    soyCoordinador() {
      return !!this.actividad.equipo.coordinadores.find(x=>parseInt(x.id)===this.$store.getters.loggedInUser.id)
    },
    citas() {
      let seccion = null;
      return this.proximas.slice(0, 7)
        .map(a => {
          a.seccion = null;
          if (a.fecha.mesnombre !== seccion) {
            a.seccion = a.fecha.mesnombre;
            seccion = a.fecha.mesnombre;
          }
          return a;
        }); // ponemos la propiedad de seccion (mes actual) en los elementos
    },
    anexos() {
      let r = []
      for (const reunion of this.reuniones)
        r = r.concat(reunion.anexos ? reunion.anexos : [])
      return r
    }
  }
}
</script>


<style scoped>
@media screen and (max-width: 768px) {
  .grid {
    @apply flex flex-col;
  }
}

.proximas {
  grid-template-columns: 60px 2fr 4fr;
}
</style>
