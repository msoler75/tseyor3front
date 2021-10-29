<template>
    <Card class="py-5 px-2 xs:px-4 max-w-md mx-auto bg-blue-gray-50 dark:bg-blue-gray-900" focused>
        <h1>{{ accion }} Recopilación de Experiencias</h1>
        <form @submit.prevent="submit" class="regular-form bg-transparent space-y-9">
            <div>
                <label for="titulo">Título:</label>
                <br />
                <input
                    type="text"
                    id="titulo"
                    v-model="contenido.titulo"
                    required
                    :class="fieldValidate('titulo')"
                />
                <p class="error">{{ errors.titulo }}</p>
            </div>
            <div>
                <label for="descripcion">Descripción corta:</label>
                <br />
                <textarea
                    id="descripcion"
                    v-model="contenido.descripcion"
                    required
                    :class="fieldValidate('descripcion')"
                />
                <p class="italic">Aquí puedes poner el lugar de la experiencia, el nombre del evento (convivencias de...), etc</p>
                <p class="error">{{ errors.descripcion }}</p>
            </div>

            <div class="flex justify-center">
                <button
                    class="btn w-full text-center"
                    :class="modificado || guardando || creando ? 'btn-warning' : 'btn-success'"
                    type="submit"
                    :disabled="eliminando || guardando || !modificado"
                >
                    <div class="flex justify-center items-center">
                        <icon
                            class="!w-6"
                            :icon="guardando ? 'sync spin' : creando ? 'plus-square' : modificado ? 'sync' : 'check'"
                        />
                        <span class="inline-block w-28">{{ verbo }}</span>
                    </div>
                </button>
            </div>
            <div v-if="contenido.id" class="mt-7 flex flex-col justify-center space-y-6">
                <div
                    v-if="false"
                    @click="borrarRecopilacion"
                    class="btn btn-error w-full text-center"
                    :disabled="eliminando || guardando"
                >
                    <div class="flex justify-center items-center">
                        <icon class="!w-6" icon="trash" />
                        <span class="inline-block w-28">Borrar Recopilación</span>
                    </div>
                </div>


                <Comparte :url="enlace" v-model="viendoCompartir" />

                <section v-id="contenido.id" class="w-full">
                    <label class="w-full text-center font-bold uppercase">Enlace para compartir:</label>
                    <div class="flex border bg-gray-50 rounded w-full p-2">
                        <span>{{enlace}}</span>
                        <span class="ml-auto btn btn-mini btn-warning text-xs whitespace-nowrap"
                            @click="viendoCompartir=true">
                            <icon class="mr-2 xs:mr-2" icon="fas fa-share-alt" />Compartir
                        </span>
                    </div>
                </section>

                <NLink
                    :to="`/recopilaciones/${contenido.id}`"
                    class="btn w-full text-center"
                    :disabled="eliminando || guardando || modificado"
                >
                    <div class="flex justify-center items-center">
                        <icon class="!w-6" icon="eye" />
                        <span class="inline-block w-28">Ver Recopilación</span>
                    </div>
                </NLink>
            </div>
        </form>
    </Card>
</template>

<script>
import validation from "@/mixins/validation"
export default {
    mixins: [validation],
    middleware: 'logged',
    async asyncData({ $strapi, route, $error }) {
        try {
            let id = route.params.id
            let contenido = {
                titulo: '',
                descripcion: '',
            }
            if (id && id !== 'nueva') {
                contenido = await $strapi.findOne('recopilaciones', id)
                if (!contenido)
                    return $error(404, 'Recopilación no encontrada')
            }
            return { contenido, recopilacion: contenido }
        }
        catch (e) {
            console.log(JSON.stringify(e))
            $error(e.response&&e.response.status?e.response&&e.response.status:503)
        }
    },
    data() {
        return {
            guardando: false,
            eliminando: false,
            modificado: false,
            viendoCompartir: false
        }
    },
    computed: {
        accion() {
            return this.contenido.id ? 'Editar' : 'Nueva'
        },
        verbo() {
            return !this.contenido.id ? 'Publicar' : this.guardando ? 'Publicando' : this.modificado ? 'Guardar' : 'Publicado'
        },
        contentJSON() {
            return JSON.stringify(this.contenido)
        },
        creando() {
            return !this.contenido || !this.contenido.id
        },
        enlace() {
            if(!this.contenido) return this.$config.baseUrl + '/recopilaciones'
            return this.$config.baseUrl + `/recopilacion/${this.contenido.id}`
        },
    },
    watch: {
        contentJSON(newValue) {
            this.modificado = true
        }
    },
    methods: {
        async submit() {
            this.clearErrors()
            this.guardando = true
            // primero subimos la imagen
            const data = { ...this.contenido }
            if (this.contenido.id) {
                this.$strapi
                    .update('recopilaciones', this.contenido.id, data)
                    .then((contenido) => {
                        this.$nextTick(() => {
                            this.guardando = false
                            this.modificado = false
                        })
                    })
                    .catch(err => {
                        this.setErr(err)
                        this.guardando = false
                    })
            }
            else
                this.$strapi.create('recopilaciones', data)
                    .then((contenido) => {

                        // registro de actividad
                        this.$strapi.create('historials', {
                            accion: 'recopilacion_creada',
                            titulo: contenido.titulo,
                            url: `/recopilaciones/${contenido.id}`
                        })

                        // recargamos la página para que se muestra en modo edición con la ruta correcta
                        this.$router.push(`/recopilaciones/editar/${contenido.id}`)
                    })
                    .catch(err => {
                        this.setErr(err)
                        this.guardando = false
                    })
        },
    },
    borrarRecopilacion() {
        if (confirm("Esto eliminará permanentemente esta recopilación")) {
            this.eliminando = true
            this.$strapi.delete('recopilaciones', this.contenido.id)
                .then(response => {
                    this.$router.push('/recopilaciones')
                })
                .catch(err => {
                    console.error(err)
                    this.eliminando = false
                })
        }
    }
}
</script>