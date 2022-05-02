<template>
    <div class="w-sm max-w-full mx-auto">
        <h1>Lista de tus Tareas</h1>
        <Card v-for="tarea of tareas" :key="tarea.id" class="p-4 space-x-4 flex-row my-4">
            <div class="flex items-center" :title="tarea.descripcion">
                <icon :icon="tarea.completada ? 'check-square' : 'square'" class="text-5xl mr-6" 
                :class="tarea.completada?'text-success':'text-gray-700'"
                @click.native="tarea.completada=!tarea.completada"
                />
            </div>
            <div class="flex flex-col space-y-3">
                <h2 class="text-xl mb-1">{{ tarea.titulo }}</h2>
                <div class="uppercase tracking-wider text-xs ">
                <span v-if="tarea.completada" class=" text-success py-1">COMPLETADA</span>
                <span v-else class="bg-error text-white rounded-lg px-2 py-1">PENDIENTE</span>
                </div>
                <div class="flex justify-between space-x-2">
                    <span class="text-diminished text-sm">{{ tarea.descripcion }}</span>
                    <NuxtLink v-if="tarea.coleccion" :to="tarea.completada?`/${tarea.coleccion}/${tarea.idref}`:`/${tarea.coleccion}/${tarea.idref}/editar`" class="btn whitespace-nowrap"
                    :class="tarea.completada?'btn-success':'btn-error'">
                        <icon :icon="tarea.completada?'eye':'pen-alt'" class="mr-2"/> {{tarea.completada?'Ver':'Editar'}}
                    </NuxtLink>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    async asyncData({ route, $strapi, $error }) {
        try {
            const { data: tareas, error } = await $strapi.findList(route, {
                filters: {
                    autor: {
                        id: {
                            $eq: $strapi.user.id
                        }
                    }
                },
                sort: ['completada:asc', 'updatedAt:desc']
            })
            if (!tareas)
                return $error(error && error.status ? error.status : 503)
            return { tareas }
        }
        catch (e) {
            console.error(e)
            $error(503)
        }
    },
    computed: {
        tareasListado() {
            return this.tareas
        }
    }
}
</script>
