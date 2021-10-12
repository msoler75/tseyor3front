<template>
    <div>
        <h1>{{accion}} evento</h1>
        <form @submit.prevent="submit">
            <input type="text" v-model="contenido.titulo"/>
            <input type="submit" :value="accion.toLowerCase()"/>
        </form>
    </div>
</template>

<script>
export default {
    async asyncData ({ $strapi, route }) {
    let id = route.params.id
    let contenido = {
        titulo:'',
        texto:'',
        descripcion: '',
        zonahoraria: 'Espana',
        fechaComienzo: null,
        fechaFinal: null,
        imagen: null,
        tipoEvento: '',
        sala: null,
        organiza: null,
    }
    if(id&&id!=='nuevo')
    {
        const eventos = await $strapi.find(
            'eventos',
            id.match(/\d+/) ? { id } : { slug: id }
            )
        contenido = eventos[0]
    }
    return { contenido, evento: contenido }
  },
    computed: {
        accion () {
            return this.contenido.id?'Editar':'Nuevo'
        }
    },
    methods: {
        submit() {
            if(this.contenido.id)
            this.$strapi.update('eventos', this.contenido.id, this.contenido)
            .catch(err=>{
                console.log(err)
            })
            else
            this.$strapi.create('eventos', this.contenido)
            .catch(err=>{
                console.log(err)
            })
        }
    }
}
</script>
