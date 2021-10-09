<template>
    <div>
        {{diafinal}} a las {{hora}}
    </div>
</template>

<script>
export default {
    props: {
        data: {},
        timezone: {
            type: String,
            required: false,
            default: 'Europe/Madrid'
        }
    },
    computed: {
        tzLocal () {
            return this.$dayjs.tz.guess() // America/Chicago
        },
        // días offset
        offset(){
            if(this.data.dia.match(/martes/)) return 1
            if(this.data.dia.match(/miercoles/)) return 2
            if(this.data.dia.match(/jueves/)) return 3
            if(this.data.dia.match(/viernes/)) return 4
            if(this.data.dia.match(/sabado/)) return 5
            if(this.data.dia.match(/domingo/)) return 6
            return 0
        },
        datetime () {
            var today = this.$dayjs()
            while(today.format('dddd')!=='lunes')
                today = today.add(1, 'day')
            return this.$dayjs.tz(today.format('YYYY-MM-DD') + ' ' + this.data.hora, this.timezone).tz(this.tzLocal, false).add(this.offset, 'day')
        },
        hora (){
            return this.datetime.format("HH:mm")
        },
        dia1 () {
            return this.datetime.format('dddd')        
        },
        dia2() {
          switch(this.data.dia) {
            case "no_definido": return 'No definido';
            case "lunes":       return 'Todos los lunes';
            case "martes":      return 'Todos los martes';
            case "miercoles":   return 'Todos los miércoles';
            case "jueves":      return 'Todos los jueves';
            case "viernes":     return 'Todos los viernes';
            case "sabado":      return 'Todos los sábados';
            case "domingo":     return 'Todos los domingos';
            case "lunes_primer_lunes_del_mes":                      return 'El primer lunes de cada mes';
            case "lunes_segundo_lunes_del_mes":                     return 'El segundo lunes de cada mes';
            case "lunes_tercer_primer_lunes_del_mes":               return 'El tercer lunes de cada mes';
            case "lunes_cuarto_lunes_del_mes":                      return 'El cuarto lunes de cada mes';
            case "lunes_sin_definir":                               return 'En lunes (a definir)';
            case "martes_primer_martes_del_mes":                    return 'El primer martes de cada mes';
            case "martes_segundo_martes_del_mes":                   return 'El segundo martes de cada mes';
            case "martes_tercer_primer_martes_del_mes":             return 'El tercer martes de cada mes';
            case "martes_cuarto_martes_del_mes":                    return 'El cuarto martes de cada mes';
            case "martes_sin_definir":                              return 'En martes (a definir)';
            case "miercoles_primer_miercoles_del_mes":              return 'El primer miércoles de cada mes';
            case "miercoles_segundo_miercoles_del_mes":             return 'El segundo miércoles de cada mes';
            case "miercoles_tercer_primer_miercoles_del_mes":       return 'El tercer miércoles de cada mes';
            case "miercoles_cuarto_miercoles_del_mes":              return 'El cuarto miércoles de cada mes';
            case "miercoles_sin_definir":                           return 'En miércoles (a definir)';
            case "jueves_primer_jueves_del_mes":                    return 'El primer jueves de cada mes';
            case "jueves_segundo_jueves_del_mes":                   return 'El segundo jueves de cada mes';
            case "jueves_tercer_primer_jueves_del_mes":             return 'El tercer jueves de cada mes';
            case "jueves_cuarto_jueves_del_mes":                    return 'El cuarto jueves de cada mes';
            case "jueves_sin_definir":                              return 'En jueves (a definir)';
            case "viernes_primer_viernes_del_mes":                  return 'El primer viernes de cada mes';
            case "viernes_segundo_viernes_del_mes":                 return 'El segundo viernes de cada mes';
            case "viernes_tercer_primer_viernes_del_mes":           return 'El tercer viernes de cada mes';
            case "viernes_cuarto_viernes_del_mes":                  return 'El cuarto viernes de cada mes';
            case "viernes_sin_definir":                             return 'En viernes (a definir)';
            case "sabado_primer_sabado_del_mes":                    return 'El primer sábado de cada mes';
            case "sabado_segundo_sabado_del_mes":                   return 'El segundo sábado de cada mes';
            case "sabado_tercer_primer_sabado_del_mes":             return 'El tercer sábado de cada mes';
            case "sabado_cuarto_sabado_del_mes":                    return 'El cuarto sábado de cada mes';
            case "sabado_sin_definir":                              return 'En sábado (a definir)';
            case "domingo_primer_domingo_del_mes":                  return 'El primer domingo de cada mes';
            case "domingo_segundo_domingo_del_mes":                 return 'El segundo domingo de cada mes';
            case "domingo_tercer_primer_domingo_del_mes":           return 'El tercer domingo de cada mes';
            case "domingo_cuarto_domingo_del_mes":                  return 'El cuarto domingo de cada mes';
            case "domingo_sin_definir":                             return 'En domingo (a definir)';
          }
        },
        diafinal() {
            const regex = /lunes|martes|mi.rcoles|jueves|viernes|s.bado|domingo/
            if(!this.dia2.match(regex))
                return this.dia2
            if(!this.dia2.match(this.dia1))
                return this.dia2.replace(regex, this.dia1)
            return this.dia2
        }
    }
}
</script>