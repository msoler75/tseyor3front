<template>
    <Card class="py-5 px-2 xs:px-4 max-w-md mx-auto bg-blue-gray-50 dark:bg-blue-gray-900" focused>
        <h1>{{ accion }} Recopilación de Experiencias</h1>
        <form @submit.prevent="submit" class="regular-form bg-transparent space-y-9">
            <div>
                <label for="titulo">Título:</label>
                <br />
                <input type="text" id="titulo" v-model="contenido.titulo" required :class="fieldValidate('titulo')" />
                <p class="error">{{ errors.titulo }}</p>
            </div>
            <div>
                <label for="descripcion">Descripción corta:</label>
                <br />
                <textarea id="descripcion" v-model="contenido.descripcion" required
                    :class="fieldValidate('descripcion')" />
                <p class="italic">Aquí puedes poner el lugar de la experiencia, el nombre del evento (convivencias
                    de...), etc</p>
                <p class="error">{{ errors.descripcion }}</p>
            </div>

           

           <div
                class="surface surface-gray fixed bottom-0 left-0 right-0 overflow-x-autotext-sm !border-0 border-t z-30 shadow flex flex-col items-center py-3 space-y-3 px-2 text-xs xm:text-sm sm:text-base">

                <Card v-if="thereErrors" id="errors" class="p-3 bg-red-400 ">
                    <p class="error font-bold !text-white">
                        <icon icon="exclamation-triangle" class="mr-2 transform scale-75" />
                        <span>{{ errors.message }}</span>
                    </p>
                </Card>

                <div class="space-x-3 sm:space-x-6 flex justify-center ">

                    <NLink v-if="contenido.id && publicado && !publicando" :to="`/eventos/${contenido.id}`"
                        class="btn btn-gray w-auto text-center" title="Ver Evento"
                        :disabled="eliminando || guardando || publicando">
                        <div class="flex justify-center items-center">
                            <icon class="!w-3" icon="arrow-left" />&nbsp;
                        </div>
                    </NLink>


                    <button class="btn w-auto text-center whitespace-nowrap" @click.prevent="onPublicar"
                        :class="publicado ? 'btn-success' : 'btn-gray'"
                        :disabled="!contenido.id || eliminando || guardando || publicando || !!modificado">
                        <div class="flex justify-center items-center w-20">
                            &nbsp;
                            <icon v-if="publicando" icon='sync spin' />
                            <span v-else class="inline-block w-28">
                                <icon v-if="publicado" icon='check' class="mr-2" />
                                <span>{{ verboPublicar }}</span>
                            </span>
                        </div>
                    </button>

                    <button class="btn w-auto text-center" :class="modificado && !publicando ? '' : 'btn-gray'"
                        type="submit" :disabled="eliminando || guardando || publicando || (!publicando && !modificado)">
                        <div class="flex justify-center items-center w-14">
                            &nbsp;
                            <icon v-if="guardando" icon='sync spin' />
                            <span v-else class="inline-block">{{ verboGuardar }}</span>
                        </div>
                    </button>

                    <div v-if="contenido.id && !publicado" @click="borrarEvento"
                        class="btn btn-error w-auto text-center" :disabled="eliminando || guardando || publicando"
                        title="Borrar Evento">
                        <div class="flex justify-center items-center">
                            <icon class="!w-3" icon="trash" />&nbsp;
                        </div>
                    </div>
                </div>

            </div>



        </form>
    </Card>
</template>

<script>
import validation from "@/mixins/validation"
export default {
    mixins: [validation],
    middleware: 'logged',
    async asyncData({ route, $strapi, $error }) {
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
            $error(e.response && e.response.status ? e.response && e.response.status : 503)
        }
    },
    data() {
        return {
            viendoCompartir: false,
            // estados
            guardando: false,
            publicando: false,
            eliminando: false,
            modificado: 0
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
            if (!this.contenido) return this.$config.baseUrl + '/recopilaciones'
            return this.$config.baseUrl + `/recopilacion/${this.contenido.id}`
        },
    },
    watch: {
        contentJSON(newValue) {
            this.modificado++
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
                    .update('recopilaciones', this.contenido.id, data, { populate: '*' })
                    .then((response) => {
                        if (response.error) {
                            this.setErr(response.error)
                        }
                        else {
                            const { data: contenido } = response
                            this.contenido = contenido
                            this.$nextTick(() => {
                                this.modificado = 0
                            })
                        }
                        this.guardando = false
                    })
                    .catch(err => {
                        this.setErr(err)
                        this.guardando = false
                    })
            }
            else
                this.$strapi.create('recopilaciones', data)
                    .then((response) => {
                        if(response.error)
                        {
                            this.setErr(response.error)
                        }
                        else{
                            this.$router.push(`/recopilaciones/${response.data.id}`)
                        }
                        //console.log('RESPUESTA', respuesta)
                        // registro de actividad
                        /* this.$strapi.create('historials', {
                            accion: 'recopilacion_creada',
                            titulo: contenido.titulo,
                            url: `/recopilaciones/${contenido.id}`
                        }) */

                        // recargamos la página para que se muestra en modo edición con la ruta correcta
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