<template>
  <div>
    <section class="mb-5">
      <NLink class="btn btn-gray" :to="'/equipos/' + actividad.equipo.id">
        <Icon icon="chevron-left" class="mr-3" />
        {{
          actividad.equipo.nombre
        }}
      </NLink>
    </section>

    <GridFluid class="gap-6">
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
        class="p-5 surface text-center flex flex-col rows-2 justify-center items-center"
        v-if="actividad.tipo == 'reunion'"
      >
        <h3>Agenda</h3>
        <div
          v-for="cita, index of citas"
          :key="index"
        >{{ cita.fecha.diasemana }} {{ cita.fecha.dia }} de {{ cita.fecha.mesnombre }} a las {{ cita.hora.substr(0, 5) }}</div>

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

            <Card :key="'c' + index" class="p-3 text-center">
              <span>{{ cita.fecha.diasemana }}</span>
              <span class="font-bold text-xl">
                {{
                  $dayjs("1970/1/1 " + cita.hora).format("HH:mm")
                }}
              </span>
            </Card>

            <Card :key="'d' + index" class="p-3 text-center flex items-center">
              <div v-if="cita.reunion">
                <NLink class="btn gray" :to="`/reuniones/${cita.reunion.id}`">Reunion</NLink>
              </div>
            </Card>
          </template>
        </div>
      </div>

      <div
        class="p-5 surface text-center flex flex-col justify-center items-center"
        v-if="actividad.tipo == 'reunion'"
      >
        <div v-if="!actividad.reuniones.length">No hay reuniones</div>
        <section v-else class="w-full">
          <h3>Reuniones</h3>
          <table class="w-full">
            <tr v-for="reunion of actividad.reuniones" :key="reunion.id">
              <td>
                <span>{{ $dayjs(reunion.fecha).fromNow() }}</span>
                <br />
                <strong class="bg-gray-100">{{ $dayjs(reunion.fecha).format("DD-MMM") }}</strong>
                <br />a las
                <strong>{{ $dayjs(reunion.fecha).format("HH:mm") }}</strong>
              </td>
              <td>
                <NLink class="btn" :to="'/reuniones/' + reunion.id">Ver</NLink>
              </td>
            </tr>
          </table>
        </section>
      </div>
    </GridFluid>
  </div>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
import seo from '@/mixins/seo.js'
import citas from '@/mixins/citas.js'
export default {
  mixins: [vercontenidomixin, seo, citas],
  async asyncData({ $strapi, route, $error }) {
    try {
      const id = route.params.id
      const actividades = await $strapi.find(
        'actividades',
        id.match(/\d+/) ? { id } : { slug: id }
      )

      if (!actividades.length)
        return $error(404, 'Esta actividad no existe')

      const contenido = actividades[0]
      const agenda = await $strapi.find('agenda', 'actividad=' + contenido.id)

      return { contenido, actividad: contenido, agenda }
    }
    catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      proximas: []
    }
  },
  async mounted() {
    // await this.$strapi.$http.$get("/api/agenda?actividad="+this.contenido.id)
    const now = this.$dayjs().add(-1, 'days')
    this.proximas = this.generarCitas(
      {
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
    }
  }
}
</script>


<style scoped>
.proximas {
  grid-template-columns: 60px 2fr 4fr;
}
</style>
