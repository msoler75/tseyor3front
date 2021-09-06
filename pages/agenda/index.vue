<template>
  <div>
    <h1>Agenda de actividades</h1>
    <div class="lg:flex">
      <Card class="order-2 p-5">
        <h3>Agenda</h3>
        <div v-for="(a, index) of agenda" :key="index" class="my-3">
          <Horario :data="a.horario"/>  <NLink class="font-bold" :to="'/equipos/'+a.equipo.id">{{a.equipo.nombre}}</NLink>
        </div>
      </Card>
      <Card class="order-3 p-5 lg:order-1 lg:mr-12">
        <h3>Próximamente</h3>
        <div class="flex my-4">
            <div v-for="equipo of equipos" :key="equipo.id" class="bg-gray-100 dark:bg-gray-800 shadow rounded-lg px-3 py-1 cursor-pointer select-none mr-2 mb-2"
            @click="equipo.viendo=!equipo.viendo">
                <input type="checkbox" v-model="equipo.viendo"> {{equipo.nombre}}
            </div>
        </div>
        <div v-for="(a, index) of proximas" :key="index" class="flex" v-show="equipos.find(x=>x.id===a.detalles.equipo.id).viendo">
          <div :class="a.semi ? 'text-diminished' : ''">
            {{ a.fecha.diasemana }} <strong>{{a.fecha.dia}}</strong> de {{a.fecha.mesnombre}} a las <strong>{{ $dayjs('1970/1/1 '+a.hora).format("HH:mm") }}</strong>
            - <strong>{{ a.detalles.actividad.titulo }}</strong> de
            <strong>{{ a.detalles.equipo.nombre }}</strong>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>


<script>
export default {
  async asyncData({ $strapi }) {
    const agenda = await $strapi.find("agenda");
    const equipos = []
    for(const a of agenda) {
        if(!equipos.find(x=>x.id===a.equipo.id))
            equipos.push({...a.equipo, viendo: true})
    }
    return { equipos, agenda };
  },
  data() {
      return {
          proximas: []
      }
  },
  mounted() {

    const dia_semana = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
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
            fecha: { diasemana: sdia.replace('erc', 'érc').replace('abado', 'ábado'), dia: diadelmes, mes, mesnombre:meses[mes], año },
            hora: item.horario.hora,
            detalles: item,
            semi,
          });
      }
    }
  }
}
</script>