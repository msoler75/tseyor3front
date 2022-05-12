<template>
    <div>{{accion}} <NLink :to="data.url">{{data.titulo}}</NLink> <span class="text-diminished text-xs">— {{tiempo}}</span></div>
</template>

<script>
export default {
    props: {
        data: {},
        self: {type: Boolean, required: false, default: false}
    },
    computed: 
    {
        accion() {
            switch(this.data.accion) {
                case 'like_contenido':      return this.self?'Te gustó':'Le gustó'
                case 'like_comentario':     return this.self?'Te gustó un comentario en':'Le gustó un comentario en'
                case 'comentario':          return this.self?'Comentaste':'Comentó'
                case 'comentario_respuesta':return this.self?'Respondiste un comentario en':'Respondió un comentario en'
                case 'evento_creado':       return this.self?'Creaste el evento':'Creó el evento'
                case 'evento_asiste':       return this.self?'Asistes al evento':'Asiste al evento'
                case 'reunion_creada':      return this.self?'Creaste la reunión':'Creó la reunión'
                case 'acta_creada':         return this.self?'Creaste el acta':'Creó el acta'
                case 'recopilacion_creada': return this.self?'Creaste una recopilación':'Creó una recopilación'
                case 'experiencia_compartida':return this.self?'Compartiste una experiencia':'Compartió una experiencia'
                case 'equipo_entrada':      return this.self?'Te uniste al equipo':'Se unió al equipo'
                case 'equipo_salida':       return this.self?'Saliste del equipo':'Salió del equipo'
            }
        },
        tiempo () {
            return this.$dayjs(this.data['createdAt']).fromNow()
        }
    }
}
</script>