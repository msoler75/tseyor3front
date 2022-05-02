<template>
    <div class="w-sm max-w-full mx-auto">
        <h1 class="text-center">Tus borradores</h1>
        <div v-if="borradores.length" class="w-full">
            <Card v-for="contenido of borradores" :key="contenido.id" class="p-4 w-full space-y-4 my-4">
                <h2 class="text-xl mb-1">{{ contenido.titulo }}</h2>
                <div class="uppercase tracking-wider text-xs flex space-x-4">
                    <span class="bg-error text-white rounded-lg px-2 py-1">{{ contenido.coleccion }}</span>
                    <span class="bg-gray text-gray-50 rounded-lg px-2 py-1">sin publicar</span>
                </div>
                <div class="flex w-full justify-between space-x-2">
                    <span class="text-diminished text-sm">{{ contenido.descripcion }}</span>
                    <NuxtLink v-if="contenido.coleccion" :to="`/${contenido.coleccion}/${contenido.idref}/editar`"
                        class="btn whitespace-nowrap btn-error">
                        <icon icon="pen-alt" class="mr-2" /> Editar
                    </NuxtLink>
                </div>
            </Card>
        </div>
        <div v-else class="flex justify-center items-center">
            <Card class="p-10 text-xl my-10">
                <div class="flex items-center">
                    <icon icon="check-square" class="mr-3 text-success" />No tienes ningún borrador
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
    middleware: ['logged'],
    mixins: [seo],
    async asyncData({ $strapi, $error }) {
        try {
            const { data: borradores, error } = await $strapi.find('contenidos', $strapi.filterByList({
                filters: {
                    autorref: {
                        $eq: $strapi.user.id
                    },
                    publishedAt: {
                        $null: true
                    },
                },
                publicationState: 'preview',
                sort: ['updatedAt:desc']
            }))
            if (!borradores)
                return $error(error && error.status ? error.status : 503)
            return { borradores }
        }
        catch (e) {
            console.error(e)
            $error(503)
        }
    },
    data() {
        return {
            // SEO:
            title: 'Tus Borradores',
            description: 'Tus borradores de Noticias, Comunicados, Libros, Eventos, Artículos, Cursos... ',
            image: this.$imagenUrlColeccion('comunicados')
        };
    }
}
</script>
