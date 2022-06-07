<template>
    <div>
        <Card id="publicacion" class="p-5 space-y-4">
            <div class="flex justify-between items-center flex-wrap xs:flex-nowrap">
                <h3>{{ ctitle }}</h3>
                <TButton class="btn-mini text-xs whitespace-nowrap flex-shrink-0" v-if="soyCoordinador"
                    :to="`/publicaciones/${contenido.id}/editar`">
                    <icon icon="pen-alt" class="xm:mr-2" /><span class="hidden xm:inline">Editar</span>
                </TButton>
            </div>

            <div class="flex justify-between items-start text-xs">
                <div class="rounded-full bg-gray-200 text-gray-600 text-xs py-1 px-3 uppercase tracking-wider">
                    {{ contenido.tipo }}
                </div>
                <div class="py-1">
                    <icon icon="far fa-calendar-alt" class="mr-1" />
                    <span>{{ $dayjs(cdate).format("DD-MMM-YYYY") }}</span>
                </div>
            </div>
            <div v-html="ctext"></div>
        </Card>
        <!-- comentarios -->
        <div id="comentarios" class="mx-auto my-9"
            v-observe-visibility="(isVisible) => { mostrarComentarios = mostrarComentarios || isVisible }">
            <h4 v-if="contenido.comentarios" class="text-center">{{
                    contenido.comentarios + ' Comentario' +
                    (contenido.comentarios !== 1 ? 's' : '')
            }}</h4>
            <h4 v-else class="text-center">Coméntalo</h4>
            <Comentarios v-if="mostrarComentarios" :uid="uid" :contenido="contenido"
                @count="$set(contenido, 'comentarios', $event)" />
        </div>


        <TButton @click="back">
            <icon icon="arrow-left" class="mr-2" />Publicaciones
        </TButton>
    </div>
</template>

<script>
import vercontenido from "@/mixins/vercontenido.js"
import seo from "@/mixins/seo.js"
export default {
    mixins: [vercontenido, seo],
    async asyncData({ route, $strapi, $error }) {
        try {
            // console.log('ROUTE ID', route.params)
            const response = await $strapi.find('publicaciones', {
                filters: {
                    id: { $eq: route.params.idp }
                },
                populate: {
                    equipo: {
                        populate: ['coordinadores']
                    }
                }
            })
            const { data: [contenido] } = response
            // console.warn('PUBLI', contenido.equipo)
            if (!contenido)
                return $error(404, 'Publicación no disponible')
            return { contenido, publicacion: contenido };
        }
        catch (err) {
            console.warn('ERR.CATCH', JSON.stringify(err))
            $error(503)
        }
    },
    data() {
        return {

        }
    },
    mounted() {
        console.warn('P MOUNTED!')
        this.$scrollTo("#tabs", 500)
        this.$emit('publi', this.contenido)
    },
    computed: {
        equipo() {
            return this.contenido.equipo
        },
        soyCoordinador() {
            if (!this.$strapi.user) return false
            return !!this.equipo.coordinadores.find(x => x.id === this.$strapi.user.id);
        },
    },
    methods: {
        back() {
            this.$emit("close")
        }
    }
}
</script>