<template>
    <section contained="no" focused>

        <NLink v-if="contenido.autor && $strapi.user && $strapi.user.id === contenido.autor.id"
            class="btn absolute -top-12 right-4 w-12 h-12 flex justify-center items-center rounded-full sm:w-auto sm:h-auto sm:rounded-inherit"
            :to="`/publicaciones/${contenido.id}/editar`">
            <icon icon="edit" />
            <span class="ml-2 hidden sm:inline">Editar</span>
        </NLink>

        <v-clamp v-html="contenido.textoHTML"/>

    </section>
</template>

<script>
import vercontenido from "@/mixins/vercontenido.js"
import likes from "@/mixins/likes.js"
import seo from "@/mixins/seo.js"
export default {
    mixins: [vercontenido, likes, seo],
    async asyncData({ route, $strapi, $mdToHtml, $error }) {
        try {
            const contenido = await $strapi.getContent(route, { populate: '*' })
            console.warn('EVENTO', contenido)
            if (!contenido)
                return $error(404, 'Evento no disponible')
            contenido.textoHTML = $mdToHtml(contenido.texto, contenido.imagenes)
            // let quieroAsistir = $strapi.user && !!evento.asistentes.find(x => x.id === $strapi.user.id)
            let quieroAsistir = true
            return { contenido, evento: contenido, quieroAsistir };
        }
        catch (err) {
            console.warn(JSON.stringify(err))
            $error(503)
        }
    },
    mounted() {
        if (this.contenido.imagen)
            this.$store.commit('setBackgroundImageUrl', this.contenido.imagen.url)
    },
    data() {
        return {
            actualizando: false
        }
    },
    computed: {
        eventoPasado() {
            const now = this.$dayjs()
            return this.$dayjs(this.evento.fechaComienzo).isBefore(now)
        }
    },
    watch: {
        quieroAsistir(asistire) {
            if (!this.$strapi.user) return
            this.actualizando = true
            this.$strapi.$http.$put(`/eventos/${this.contenido.id}/${asistire ? 'join' : 'leave'}`)
                .then(evento => {
                    console.log('res as', evento)
                    this.actualizando = false
                    this.$set(this.contenido, 'asistentes', evento.asistentes)
                    const asiste = this.$strapi.user && !!this.contenido.asistentes.find(x => x.id === this.$strapi.user.id)
                    if (asiste)
                        this.$strapi.create('historials', {
                            accion: 'evento_asiste',
                            titulo: this.ctitle,
                            url: this.uid
                        })
                })
                .catch(err => {
                    this.actualizando = false
                })
        }
    }
};
</script>

<style scoped>
@screen md {
    .grid {
        grid-template-columns: 1fr 2fr;
    }
}

@screen lg {
    .grid {
        grid-template-columns: 1fr minmax(500px, 2fr);
    }
}

@screen xl {
    .grid {
        grid-template-columns: 3fr minmax(500px, 5fr) 2fr;
        grid-template-rows: 90px 1fr;
    }
}

.h-image {
    @apply h-24;
}

@screen sm {
    .h-image {
        height: 40vh;
        max-height: 280px;
        min-height: 80px;
    }
}

.evento-wrapper {
    background-size: 10px 10px;
    background-image: repeating-linear-gradient(45deg,
            transparent 0,
            #444cf7 1px,
            transparent 0,
            transparent 50%);
}

.imagenes {
    max-height: 80vh
}
</style>