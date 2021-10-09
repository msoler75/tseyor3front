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
  methods: {
    generarCitas (agenda, eventos, maxDias) {
      if (!maxDias) maxDias = 45

      const now = this.$dayjs()
      const proximas = []

      for (var i = -1; i < maxDias; i++) {
        const fecha = now.add(i, 'days')
        const dia = fecha.day()
        const mes = fecha.month()
        const año = fecha.year()
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
            proximas.push({
              tipo: 'evento',
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
            })
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
            proximas.push({
              tipo: 'actividad',
              fecha: {
                diasemana: sdia.replace('erc', 'érc').replace('aba', 'ába'),
                dia: diadelmes,
                mes,
                mesnombre: meses[mes],
                año
              },
              hora: item.horario.hora,
              detalles: item,
              semi
            })
          }
        }

        return proximas
      }
    }
  }
}
