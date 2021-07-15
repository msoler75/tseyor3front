<template>
<section class="flex flex-col items-center">
    <h1>Listado de Miembros de Tseyor</h1>
    <p class="mt-3 text-center">A continuación un listado completo de miembros del grupo Tseyor. Muchos de ellos han creado una cuenta de usuario en este sitio puede y puedes verlos en este <nuxt-link class="underline whitespace-nowrap" to="/usuarios">listado de usuarios</nuxt-link>.</p>
    <divider/>
    <Tabs :labels='categorias' v-model="viendoCategoria" class="mb-6"/>
    <ul style="column-count: 3;">
        <li v-for="item of listaCategoria(viendoCategoria)" :key="item.id">
            {{item.nombre}}
        </li>
    </ul>
</section>
</template>

<script>
export default {
    asyncData({app}) {
        const miembros = []
        for(var i=0;i<14000;i++)
        {
            miembros.push({
                id: i,
                clase: 'usuarios',
                nombre: app.$ucFirst(app.$lorem(1, 1, 3).slice(0, -1)) + ' pm',
                etiquetas: i%5===1?['Muul']:[]
            })
        }
        return {miembros}
    },
    data() {
        return {
            viendoCategoria: 'Todos',
            categorias: ['Todos', 'Muul'],
        }
    },
    methods: {
        listaCategoria () {
            const vc = this.viendoCategoria
            return this.miembrosOrdenados.filter(x=>vc==='Todos'||x.etiquetas.includes(vc))
        }
    },
    computed : {
        miembrosOrdenados() {
            return this.miembros.sort((a,b)=>a<b?-1:1)
        }
    }
}
</script>