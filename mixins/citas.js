const dia_semana = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado'
]
const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

const ordinal = ['primer', 'segund', 'tercer', 'cuart', 'quint']

export default {
  computed: {
    tzLocal()
    {
      return this.$dayjs.tz.guess() // America/Chicago
    }
  },
  methods: {
    nuevaCita (fecha, zonahoraria, item, semi, reunion){

      let timezone = 'Europe/Madrid'
      switch(zonahoraria) {
        case 'Chile': timezone = 'America/Santiago'; break;
        case 'Mexico': timezone = 'America/Mexico_City'; break;
        case 'Colombia': timezone = 'America/Bogota'; break;
        case 'Argentina': timezone = 'America/Argentina/Buenos_Aires'; break;
      }

      const date = timezone ? this.$dayjs.tz(fecha, timezone).tz(this.tzLocal, false) : this.$dayjs(fecha)
      const dia = date.day()
      const mes = date.month()
      const año = date.year()
      const sdia = dia_semana[dia] // lunes, martes, miercoles
      const diadelmes = date.date()

      return {
        tipo: 'actividad',
        fechahora: fecha,
        fecha: {
          str: fecha.substr(0,10),
          diasemana: sdia.replace('erc', 'érc').replace('aba', 'ába'),
          dia: diadelmes,
          mes,
          mesnombre: meses[mes],
          año
        },
        hora: date.format('HH:mm'),
        detalles: item,
        reunion,
        semi
      }
    },
    generarCitas ({agenda, eventos, reuniones, dias}) {
      if (!dias) dias = 45
      
      // console.log('generarCitas', agenda, eventos)
      const now = this.$dayjs()
      const proximas = []
       // clonamos reuniones
       const reunionesOrdenadas = reuniones?JSON.parse(JSON.stringify(reuniones.sort((a,b)=>{a.fecha===b.fecha?0:this.$dayjs(a.fecha).isBefore(b.fecha)?-1:1}))):[]
       

      for (var i = -1; i < dias; i++) {
        const fecha = now.add(i, 'days')
        const dia = fecha.day()
        // const mes = fecha.month()
        // const año = fecha.year()
        const sdia = dia_semana[dia] // lunes, martes, miercoles
        const diadelmes = fecha.date()
        const semana = Math.floor(diadelmes / 7)
        const ssemana = ordinal[semana]
        // miramos los eventos
        if(eventos)
        for (const evento of eventos) {
          if (evento.insertado) continue
          if (!evento.fechaComienzo) continue
          const di = fecha.diff(evento.fechaComienzo, 'h')
          const df = fecha.diff(evento.fechaFinal, 'h')
          // console.log('i', i, fecha.format('DD-MM'), 'dif', fecha.diff(evento.fechaComienzo, 'h'))
          if (
            (di > -12 && di < 24) ||
            (evento.fechaFinal && df > -12 && df < 24)
          ) {
            evento.insertado = true
            const cita = nuevaCita(evento.fechaComienzo, evento.zonahoraria, {evento}, false, null)
            proximas.push(
              cita
              /*{
              tipo: 'evento',
              original: fecha.format('YYYY-MM-DD HH:mm'),
              fecha: {
                diasemana: sdia.replace('erc', 'érc').replace('aba', 'ába'),
                dia: diadelmes,
                mes,
                mesnombre: meses[mes],
                año
              },
              hora:
                fecha.diff(evento.fechaComienzo, 'day') < 1
                  ? this.$dayjs(evento.fechaComienzo).format('HH:mm')
                  : '00:00',
              detalles: { evento }
            }*/)
          }
        }
        // miramos las actividades
        if(agenda)
        for (const item of agenda) {
          let ok = false
          let semi = false
          if (item.horario.dia === sdia) {
            // todos los lunes
            ok = true
          } else if (item.horario.dia.startsWith(sdia)) {
            if (item.horario.dia.search('sin_definir') > -1) {
              // ok = true
              semi = true
            } else if (item.horario.dia.search(ssemana) > -1) {
              ok = true
            }
          }
          if (ok) {
            // buscamos si alguna reunión corresponde con algun horario programado segun agenda regular
            const idx = reunionesOrdenadas.findIndex(x=>fecha.isSame(x.fecha, 'minute'))
            const reunioncita = idx>-1?reunionesOrdenadas[idx]:null
            // calculamos la fecha en formato date string YYYY-MM-DD HH:mm
            const datestr = fecha.format('YYYY-MM-DD ') + item.horario.hora
            // generamos la cita
            const cita = this.nuevaCita(datestr, item.equipo.zonahoraria, item, semi, reunioncita)
            proximas.push(cita)
            
            if(reunioncita)
              reunionesOrdenadas.splice(idx, 1) // quitamos la reunión del listado

            /*const fecha2 = this.$dayjs.tz(fecha.format('YYYY-MM-DD ') + item.horario.hora, timezone).tz(this.tzLocal, false)
            const dia = fecha2.day()
            const mes = fecha2.month()
            const año = fecha2.year()
            const sdia = dia_semana[dia] // lunes, martes, miercoles
            const diadelmes = fecha2.date()

            proximas.push({
              tipo: 'actividad',
              original: fecha.format('YYYY-MM-DD HH:mm'),
              fecha: {
                diasemana: sdia.replace('erc', 'érc').replace('aba', 'ába'),
                dia: diadelmes,
                mes,
                mesnombre: meses[mes],
                año
              },
              hora: fecha2.format('HH:mm'),
              detalles: item,
              semi
            })*/
          }
        }
        
      }
      // agregamos reuniones que no correspondan con horario regular
      if(reunionesOrdenadas)
        for(const reunion of reunionesOrdenadas)
        {
          const idx = Math.max(0, proximas.findIndex(x=>this.$dayjs(x.fechahora).isAfter(reunion.fecha)))
          const cita = this.nuevaCita(reunion.fecha, reunion.zonahoraria, null, false, reunion)
          proximas.splice(idx, 0, cita)
      }

      return proximas
    }
  }
}
