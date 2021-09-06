<template>
  <div>
    <h1>Agenda de actividades</h1>
    <div class="lg:flex">
      <Card class="order-2 p-5 lg:ml-12">
        <h3>Agenda</h3>
        <div v-for="(a, index) of agenda" :key="index" class="my-3">
          <Horario :data="a.horario" />
          <NLink
            class="font-bold text-blue-600"
            :to="'/actividades/' + a.actividad.id"
            >{{ a.actividad.titulo }}</NLink
          >
          de
          <NLink
            class="font-bold px-3 py-1 rounded-lg shadow"
            :class="equipos.find(x => x.id === a.equipo.id).color"
            :to="'/equipos/' + a.equipo.id"
            >{{ a.equipo.nombre }}</NLink
          >
        </div>
      </Card>

      <div>
        <Card class="order-3 p-5 lg:order-1 mb-4">
          <h3>Próximamente</h3>
          <div class="flex my-4">
            <div
              v-for="equipo of equipos"
              :key="equipo.id"
              class="shadow rounded-lg px-3 py-1 cursor-pointer select-none mr-2 mb-2 font-bold"
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
        </Card>

        <Card
          v-for="(a, index) of proximas"
          :key="index"
          v-show="equipos.find(x => x.id === a.detalles.equipo.id).viendo"
          class="my-3 p-5"
        >
        <div>
          {{ a.fecha.diasemana }} <strong>{{ a.fecha.dia }}</strong> de
          {{ a.fecha.mesnombre }} a las
          <strong>{{ $dayjs("1970/1/1 " + a.hora).format("HH:mm") }}</strong> -
          <NLink
            class="font-bold text-blue-600"
            :to="'/actividades/' + a.detalles.actividad.id"
            >{{ a.detalles.actividad.titulo }}</NLink
          >
          de
          <NLink
            class="font-bold px-3 py-1 rounded-lg shadow"
            :class="equipos.find(x => x.id === a.detalles.equipo.id).color"
            :to="'/equipos/' + a.detalles.equipo.id"
            >{{ a.detalles.equipo.nombre }}</NLink
          >
        </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $strapi }) {
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
    return { equipos, agenda };
  },
  data() {
    return {
      proximas: []
    };
  },
  mounted() {
    const dia_semana = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo"
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
    for (var i = -1; i < 60; i++) {
      const fecha = now.add(i, "days");
      const dia = fecha.day();
      const mes = fecha.month();
      const año = fecha.year();
      const sdia = dia_semana[dia]; // lunes, martes, miercoles
      const diadelmes = fecha.date();
      const semana = Math.floor(diadelmes / 7);
      const ssemana = ordinal[semana];

      for (const item of this.agenda) {
        let ok = false;
        let semi = false;
        if (item.horario.dia === sdia) {
          // todos los lunes
          ok = true;
        } else if (item.horario.dia.search(sdia) > -1) {
          if (item.horario.dia.search("sin_definir")) {
            // ok = true
            semi = true;
          } else if (item.horario.dia.search(ssemana) > -1) {
            ok = true;
          }
        }
        if (ok)
          this.proximas.push({
            fecha: {
              diasemana: sdia.replace("erc", "érc").replace("abado", "ábado"),
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
};
</script>
