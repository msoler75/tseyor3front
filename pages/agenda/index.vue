<template>
  <section>
    <h1 class="text-center">Agenda de actividades</h1>
    <div class="lg:flex lg:justify-center lg:items-start mx-auto">
      <Card class="order-2 p-5 lg:ml-12 mb-12">
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
              class="card rounded font-bold text-center text-blue-600 flex justify-center items-center"
              :to="'/actividades/' + a.detalles.actividad.id"
            >
              {{ a.detalles.actividad.titulo }}
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

1, 2, 3, 4, 5, 6 evento empieza 3, termina 5

<script>
import qs from "qs";
export default {
  async asyncData({ $dayjs, $strapi }) {
    const query = qs.stringify({
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
    });

    const eventos = await $strapi.find("eventos", query);
    const agenda = await $strapi.find("agenda");
    const equipos = [];
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
        });
    }
    return { equipos, agenda, eventos };
  },
  data() {
    return {
      proximas: []
    };
  },
  computed: {
    proximasFiltro() {
      let seccion = null;
      return this.proximas
        .filter(
          a => a.tipo==='evento' || this.equipos.find(x => x.id === a.detalles.equipo.id).viendo
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
  mounted() {
    const dia_semana = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado"
    ];
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ];
    const now = this.$dayjs();

    const ordinal = ["primer", "segund", "tercer", "cuart", "quint"];
    
    for (var i = -1; i < 30 + 15; i++) {
      const fecha = now.add(i, "days");
      const dia = fecha.day();
      const mes = fecha.month();
      const año = fecha.year();
      const sdia = dia_semana[dia]; // lunes, martes, miercoles
      const diadelmes = fecha.date();
      const semana = Math.floor(diadelmes / 7);
      const ssemana = ordinal[semana];
      // miramos los eventos
      for (const evento of this.eventos) {
          if(evento.insertado) continue
          if(!evento.fechaComienzo) continue
          const di = fecha.diff(evento.fechaComienzo, 'h')
          const df = fecha.diff(evento.fechaFinal, 'h')
          // console.log('i', i, fecha.format('DD-MM'), 'dif', fecha.diff(evento.fechaComienzo, 'h'))
          if(di>-12&&di<24||(evento.fechaFinal&&df>-12&&df<24))
          {
              evento.insertado = true
              this.proximas.push({
                tipo: 'evento',
                fecha: {
                    diasemana: sdia.replace("erc", "érc").replace("aba", "ába"),
                    dia: diadelmes,
                    mes,
                    mesnombre: meses[mes],
                    año
                },
                hora: fecha.diff(evento.fechaComienzo, 'day')<1?this.$dayjs(evento.fechaComienzo).format("HH:mm"):"00:00",
                detalles: {evento}
            });
          }
      }
      // miramos las actividades
      for (const item of this.agenda) {
        let ok = false;
        let semi = false;
        if (item.horario.dia === sdia) {
          // todos los lunes
          ok = true;
        } else if (item.horario.dia.startsWith(sdia)) {
          if (item.horario.dia.search("sin_definir") > -1) {
            // ok = true
            semi = true;
          } else if (item.horario.dia.search(ssemana) > -1) {
            ok = true;
          }
        }
        if (ok) {
          this.proximas.push({
            tipo: 'actividad', 
            fecha: {
              diasemana: sdia.replace("erc", "érc").replace("aba", "ába"),
              dia: diadelmes,
              mes,
              mesnombre: meses[mes],
              año
            },
            hora: item.horario.hora,
            detalles: item,
            semi
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.proximas {
  grid-template-columns: 60px 2fr 2fr 2fr;
}
</style>
