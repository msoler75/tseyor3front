<template>
  <section>
    <h1 class="text-center">Agenda de actividades</h1>
    <div v-if="!equipos.length">
      <p class="text-center text-lg my-12">No hay actividades o no estás inscrito a ningún equipo</p>
      <p class="flex justify-center">
        <NLink class="btn" to="/equipos" >
        Ver Equipos
      </NLink>
      </p>
    </div>
    <div v-else class="lg:flex lg:justify-center lg:items-start mx-auto">
      <div class="mt-3 order-2 lg:ml-12 mb-12">
      <Card class="p-5">
        <h3 class="text-center hidden sm:block">Horarios Regulares</h3>
        <div
          class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-3"
        >
          <div v-for="(a, index) of agenda" :key="index" class="my-3">
            <Horario :data="a.horario" />
            <NLink
              class="font-bold whitespace-nowrap text-blue-600"
              :to="'/actividades/' + a.actividad.id"
              >{{ a.actividad.titulo }}</NLink
            >
            de
            <NLink
              class="font-bold whitespace-nowrap px-3 py-1 rounded-lg shadow"
              :class="equipos.find(x => x.id === a.equipo.id).color"
              :to="'/equipos/' + a.equipo.id"
              >{{ a.equipo.nombre }}</NLink
            >
          </div>
        </div>
      </Card>
     
      <Card class="p-5 mt-7">
      <p class="flex justify-center">
        <NLink class="btn" to="/equipos" >
        Ver Equipos
      </NLink>
      </p>
      </Card>

      </div>

      <div>
        <div class="order-3 lg:order-1">
          <div class="flex flex-wrap my-4">
            <div
              v-for="equipo of equipos"
              :key="equipo.id"
              class="shadow rounded-lg px-3 py-1 cursor-pointer select-none mr-2 mb-2 font-bold whitespace-nowrap"
              :class="equipo.color"
              @click="equipo.viendo = !equipo.viendo"
            >
              <input
                type="checkbox"
                v-model="equipo.viendo"
                class="scale-150 mr-2"
              />
              {{ equipo.nombre }}
            </div>
          </div>
        </div>

        <div class="grid proximas gap-2">
          <template v-for="(a, index) of proximasFiltro">
            <Card
              v-if="a.seccion"
              :key="'a' + index"
              class="col-span-4 p-5 font-bold text-3xl text-center tracking-widest uppercase"
            >
              {{ a.seccion }}
            </Card>

            <Card
              :key="'b' + index"
              class="p-3 text-3xl flex font-bold justify-center items-center"
              >{{ a.fecha.dia }}</Card
            >

            <Card :key="'c' + index" class="p-3 text-center">
              <span>{{ a.fecha.diasemana }}</span>
              <span class="font-bold text-xl">{{
                $dayjs("1970/1/1 " + a.hora).format("HH:mm")
              }}</span>
            </Card>

            <NLink
                v-if="a.tipo==='actividad'"
              :key="'d' + index"
              class="card rounded font-bold text-center flex justify-center items-center"
              :class="a.detalles.reunion?'text-xl text-orange-800':'text-blue-600 '"
              :to="a.detalles.reunion?'/reuniones/'+a.detalles.reunion.id:'/actividades/' + a.detalles.actividad.id"
            >
              {{ a.detalles.reunion?'Detalles':a.detalles.actividad.titulo }}
            </NLink>

            <NLink v-else :to="'/eventos/'+a.detalles.evento.id" :key="'v' + index"
            class="col-span-2 bg-purple-800 text-purple-contrast font-bold text-center px-3 py-1 rounded shadow flex justify-center items-center"
            >
                {{a.detalles.evento.titulo}}
            </NLink>

            <NLink
            v-if="a.tipo==='actividad'"
              :key="'e' + index"
              class="font-bold text-center px-3 py-1 rounded shadow flex justify-center items-center"
              :class="equipos.find(x => x.id === a.detalles.equipo.id).color"
              :to="'/equipos/' + a.detalles.equipo.id"
            >
              {{ a.detalles.equipo.nombre }}
            </NLink>
          </template>
          <div class="col-span-4 my-5 text-3xl text-center">...</div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import qs from "qs";
import seo from '@/mixins/seo.js'
import citas from '@/mixins/citas.js'
export default {
  mixins: [seo, citas],
  async asyncData({ $dayjs, $strapi }) {
    const query_eventos = qs.stringify({
      _where: {
        _or: [
          {
            fechaComienzo_gt: $dayjs()
              .add(-1, "days")
              .format("YYYY-MM-DDT00:00")
          },
          {
            fechaFinal_gt: $dayjs()
              .add(-1, "days")
              .format("YYYY-MM-DDT00:00")
          }
        ]
      }
    })

    const eventos = await $strapi.find("eventos", query_eventos)
    const agenda = await $strapi.find('agenda')
    const salas = await $strapi.find('salas')
    const equipos = []
    const actividades = []
    const colores = [
      "bg-green-400 text-green-contrast",
      "bg-red-900 text-red-contrast",
      "bg-blue-200 text-blue-900",
      "bg-yellow-200 text-yellow-contrast",
      "bg-cyan-200 text-blue-contrast",
      "bg-orange-800 text-orange-contrast",
      "bg-gray-200 text-gray-900",
      "bg-pink-200 text-pink-contrast"
    ];
    for (const a of agenda) {
      if (!equipos.find(x => x.id === a.equipo.id))
        equipos.push({
          ...a.equipo,
          color: colores[equipos.length % colores.length],
          viendo: true
        })
      
      if (!actividades.find(x => x.id === a.actividad.id))
        actividades.push({
          ...a.actividad
        })
    }

    /*const query_reuniones = qs.stringify({
      _where: {
        _and: [
          {
            fecha_gt: $dayjs()
              .add(-1, "days")
              .milliseconds() * 1000
              //.format("YYYY-MM-DDT00:00")
          },
          {
            _or: 
            actividades.map(x=>({'actividad.id_eq': x.id}))
          }
        ]
      }
    })*/

   const fechaInicio = $dayjs()
                    .add(-1, "days")
                    .unix() * 1000
    const query_reuniones = 
      `query {
        reuniones(
          where: {
            fecha_gt: ${fechaInicio},
            equipo: { id_in: [${equipos.map(x=>x.id).join(",")}] }
          }
        ) {
          id
          fecha
          equipo {
            id
          }
          actividad {
            id
          }
        }
      }`

    const resultado = await $strapi.graphql({query: query_reuniones})
    const reuniones = resultado.reuniones.map(x=>{
      // graphql devuelve los id como string
      if(x.actividad&&x.actividad.id)x.actividad.id=parseInt(x.actividad.id)
      if(x.equipo&&x.equipo.id)x.equipo.id=parseInt(x.equipo.id)
      if(x.sala&&x.sala.id)x.sala.id=parseInt(x.sala.id)
      return x
      })

    return { equipos, salas, actividades, reuniones, agenda, eventos };
  },
  data() {
    return {
      proximas: [],
      // SEO:
      title: 'Agenda',
      description: 'Agenda personalizada de tus actividades',
      image: 'imagen_a_definir'
    };
  },
  computed: {
    proximasFiltro() {
      let seccion = null;
      console.log(this.proximas)
      return this.proximas
        .filter(
          a => a.tipo==='evento' || this.equipos.find(x => x.id===this.dameEquipo(a)).viendo
        )
        .map(a => {
          a.seccion = null;
          if (a.fecha.mesnombre !== seccion) {
            a.seccion = a.fecha.mesnombre;
            seccion = a.fecha.mesnombre;
          }
          return a;
        }); // ponemos la propiedad de seccion (mes actual) en los elementos
    }
  },
  methods: {
    dameEquipo(a) {
      if(a.detalles && a.detalles.equipo) return a.detalles.equipo.id||a.detalles.equipo
      if(a.reunion && a.reunion.equipo) return a.reunion.equipo.id||a.reunion.equipo
      console.log('not found', a)
      return -1
    }
  },
   mounted() {
     console.log('salas', this.salas)
    this.proximas = this.generarCitas({agenda: this.agenda, reuniones: this.reuniones, eventos: this.eventos, dias: 45, salas: this.salas})
  }
}
</script>

<style scoped>
.proximas {
  grid-template-columns: 60px 2fr 2fr 2fr;
}
</style>
