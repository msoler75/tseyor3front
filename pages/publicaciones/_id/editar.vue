<template>
    <div class="max-w-full w-lg mx-auto pb-16" focused footer="no">
        <div v-if="contenido.id" class="max-w-md mx-auto mb-3 flex flex-col space-y-4">
            <Card class="p-3 !outline-2"
                :class="publicado ? '!bg-green-50 !text-green-900 outline-green-400' : '!bg-blue-50 !text-blue-900 !outline-blue-400'">
                <div>
                    <icon icon="circle" class="mr-1 transform scale-50" />
                    Editando <span v-if="contenido.publishedAt" class="font-bold">versión
                        publicada</span><span class="font-bold" v-else>borrador</span>
                </div>
            </Card>
        </div>


        <form @submit.prevent="onSubmit" class="bg-transparent">

            <Card class="order-1 py-5 px-2 xs:px-4 max-w-md mx-auto bg-blue-gray-50 dark:bg-blue-gray-900">
                <h1>{{ accion }} {{ contenido.tipo || 'publicación' }}</h1>
                <div class="space-y-9">
                    <div>
                        <label for="titulo">Título:</label>
                        <br />
                        <input type="text" id="titulo" v-model="contenido.titulo" required
                            :class="fieldValidate('titulo')" />
                        <p class="error">{{ errors.titulo }}</p>
                    </div>
                    <div>
                        <div class="flex justify-between items-baseline">
                            <label for="descripcion">Descripción corta:</label>
                            <span class="text-xs">
                                <span v-if="descriptionLength > 20" class="text-right">quedan
                                    {{ maxLengthDescription - descriptionLength }}</span>
                                <span v-else>&nbsp;</span>
                            </span>
                        </div>
                        <textarea ref="descripcion" id="descripcion" rows="3" v-model="contenido.descripcion" required
                            :maxlength="maxLengthDescription" :class="fieldValidate('descripcion')" />
                        <p class="error">{{ errors.descripcion }}</p>
                    </div>
                    <div>
                        <label for="imagenes">Archivos adjuntos:</label>
                        <client-only>
                            <draggable tag="ul" :list="subirAdjuntos" group="main"
                                class="relative flex flex-wrap justify-center items-start px-7 select-none"
                                :animation="200" @change="dragged">
                                <div v-for="item of subirAdjuntos" :key="item.url"
                                    class="group relative m-2 cursor-grab">
                                    <img v-if="item.url.match(/\.(png|jpe?g|gif|bmp|svg|webp)$/i)" :src="item.url"
                                        style="max-width: 100%; max-height: 30vh" />
                                    <div v-else>
                                        {{ item.url.substr(item.url.lastIndexOf('/') + 1) }}
                                    </div>
                                    <div class="btn btn-error absolute right-2 top-2 text-xl p-0 w-7 h-7 flex justify-center items-center rounded-full transition duration-200 opacity-0 group-hover:opacity-100"
                                        @click="eliminarDeAdjuntos(item.url)" title="Eliminar imagen">&times;</div>
                                </div>
                            </draggable>
                        </client-only>
                        <InputImage id="imagenes" :value="imagenesSubir" :multiple="true" @change="onImagenes"
                            class="mt-3" :class="fieldValidate('imagenes')" textButton="Añadir" />
                        <p class="error">{{ errors.imagenes }}</p>
                    </div>
                    <div>
                        <label for="texto">Explicación detallada (opcional):</label>
                        <br />
                        <textarea id="texto" v-model="contenido.texto" rows="5" :class="fieldValidate('texto')" />
                        <p class="error">{{ errors.texto }}</p>
                    </div>
                    <div>
                        <label for="tipo">Tipo de Publicación:</label>
                        <br />
                        <select id="tipo" v-model="contenido.tipo" :class="fieldValidate('tipo')" required>
                            <option value="Personal">Personal</option>
                            <option value="Notificación">Notificación</option>
                            <option value="Orden del día">Orden del día</option>
                            <option value="Presentación">Orden del día</option>
                            <option value="Acta o Resumen">Acta o Resumen</option>
                            <option value="Anexo">Anexo</option>
                            <option value="Acuerdo">Acuerdo</option>
                        </select>
                        <p class="error">{{ errors.tipo }}</p>
                    </div>
                    <div>
                        <label>Fecha y hora de comienzo:</label>
                        <InputDateTime id="fechaComienzo" v-model="contenido.fechaComienzo" required
                            :class="fieldValidate('fechaComienzo')" />
                        <p class="error">{{ errors.fechaComienzo }}</p>
                    </div>

                    <div v-if="!tieneFinal">
                        <div class="btn btn-gray text-xs mt-1 w-48" @click.prevent="tieneFinal = true">Definir fecha
                            final
                        </div>
                    </div>
                    <div v-else>
                        <label>Fecha y hora de final:</label>
                        <InputDateTime id="fechaFinal" v-model="contenido.fechaFinal"
                            :class="fieldValidate('fechaFinal')" />
                        <p class="error">{{ errors.fechaFinal }}</p>
                        <div class="btn btn-gray text-xs mt-1 w-48"
                            @click.prevent="contenido.fechaFinal = null; tieneFinal = false">
                            <span class="scale-150 mr-2">&times;</span> Remover fecha final
                        </div>
                    </div>
                    <div>
                        <label for="zonaHoraria">Zona Horaria:</label>
                        <br />
                        <select id="zonaHoraria" v-model="contenido.zonaHoraria" :class="fieldValidate('zonaHoraria')"
                            required>
                            <option value="Argentina">Argentina</option>
                            <option value="Chile">Chile</option>
                            <option value="Colombia">Colombia</option>
                            <option value="España">España</option>
                            <option value="Mexico">México</option>
                            <option value="Venezuela">Venezuela</option>
                        </select>
                        <p class="error">{{ errors.zonaHoraria }}</p>
                    </div>

                    <div v-if="salas.length">
                        <div v-if="!tieneSala">
                            <div class="btn btn-gray text-xs mt-1 w-48" @click.prevent="tieneSala = true">Definir Sala
                                virtual
                            </div>
                        </div>
                        <div v-else>
                            <label for="sala">Sala virtual:</label>
                            <v-select id="sala" :options="salas" v-model="contenido.sala"
                                placeholder="Elige sala virtual..." :filter="fuseSalas" autocomplete="on"
                                :getOptionLabel="sala => sala.nombre" :reduce="sala => sala.id" label="Sala">
                                <div slot="no-options">Ningún resultado</div>
                            </v-select>
                            <div class="btn btn-gray text-xs mt-1 w-48"
                                @click.prevent="contenido.sala = null; tieneSala = false">
                                <span class="scale-150 mr-2">&times;</span> Remover sala
                            </div>
                        </div>
                    </div>

                    <div v-if="centros.length">
                        <div v-if="!tieneCentro">
                            <div class="btn btn-gray text-xs mt-1 w-48" @click.prevent="tieneCentro = true">Definir
                                Centro
                                organizador</div>
                        </div>
                        <div v-else>
                            <label for="sala">Organiza:</label>
                            <v-select :options="centros" v-model="contenido.centro" placeholder="Elige centro..."
                                :filter="fuseCentros" autocomplete="on" :getOptionLabel="centro => centro.nombre"
                                :reduce="centro => centro.id" label="Sala">
                                <div slot="no-options">Ningún resultado</div>
                            </v-select>
                            <div class="btn btn-gray text-xs mt-1 w-48"
                                @click.prevent="contenido.centro = null; tieneCentro = false">
                                <span class="scale-150 mr-2">&times;</span> Remover centro
                            </div>
                        </div>
                    </div>

                </div>
            </Card>

            <div
                class="surface surface-gray fixed bottom-0 left-0 right-0 overflow-x-autotext-sm !border-0 border-t z-30 shadow flex flex-col items-center py-3 space-y-3 px-2 text-xs xm:text-sm sm:text-base">

                <Card v-if="thereErrors" id="errors" class="p-3 bg-red-400 ">
                    <p class="error font-bold !text-white">
                        <icon icon="exclamation-triangle" class="mr-2 transform scale-75" />
                        <span>{{ errors.message }}</span>
                    </p>
                </Card>

                <div class="space-x-3 sm:space-x-6 flex justify-center ">

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

                    <div v-if="publicando || contenido.id && !publicado" @click="borrarContenido"
                        class="btn btn-error w-auto text-center" :disabled="eliminando || guardando || publicando"
                        title="Borrar Evento">
                        <div class="flex justify-center items-center">
                            <icon class="!w-3" icon="trash" />&nbsp;
                        </div>
                    </div>

                    <NLink v-if="contenido.id && publicado && !publicando" :to="`/eventos/${contenido.id}`"
                        class="btn btn-gray w-auto text-center" title="Ver Evento"
                        :disabled="eliminando || guardando || publicando">
                        <div class="flex justify-center items-center">
                            <icon class="!w-3" icon="eye" />&nbsp;
                        </div>
                    </NLink>

                </div>

            </div>
        </form>
    </div>
</template>

<script>
const relaciones11 = ['equipo']
import vSelect from "vue-select";
import Fuse from "fuse.js";
import validation from "@/mixins/validation"
import draggable from "vuedraggable";
export default {
    components: { vSelect, draggable },
    mixins: [validation],
    // middleware: 'logged',
    async asyncData({ route, $strapi, $dayjs, $error }) {
        try {
            let id = route.params.id
            let contenido = {
                publishedAt: null,
                titulo: '',
                texto: '',
                descripcion: '',
                zonaHoraria: 'España',
                imagen: null,
                tipo: null,
                adjuntos: [],
                equipo: null
            }
            if (id && id !== 'nueva') {
                const publicacion = await $strapi.getContent(route, {
                    populate: { centro: '*', imagenes: '*', sala: '*' },
                    publicationState: 'preview'
                })
                if (!publicacion)
                    return $error(404, 'Publicación no encontrada')
                contenido = publicacion
                for (const campo of relaciones11)
                    contenido[campo] = contenido[campo] && contenido[campo].id ? contenido[campo].id : null
            }
            const { data: equipos } = await $strapi.find('equipos')
            console.log('ASYNC LOADED EVENT', contenido)
            return { contenido, equipos }
        }
        catch (e) {
            console.error(e)
            $error(503)
        }
    },
    data() {
        return {
            scrollingTo: 0,
            descriptionLength: 0,
            maxLengthDescription: 120,
            imagenSubir: null,
            imagenesSubir: [],
            dragData: {},
            subirAdjuntos: [],
            ordenQueQuiero: [],
            tieneSala: false,
            tieneFinal: false,
            tieneCentro: false,
            // estados
            guardando: false,
            publicando: false,
            eliminando: false,
            modificado: 0
        }
    },
    computed: {
        imagenesFondo() {
            return this.$store.getters.getImageFor('eventos')
        },
        publicado() {
            return this.contenido.publishedAt
        },
        cimage() {
            // la imagen que queremos subir o la del contenido 
            return this.imagenSubir ? this.imagenSubir.url : this.contenido.imagen ? this.contenido.imagen.url : null
        },
        accion() {
            return this.contenido.id ? 'Editar' : 'Nuevo'
        },
        verboPublicar() {
            return this.publicando ? 'Publicando' : !this.publicado ? 'Publicar' : 'Publicado'
        },
        verboGuardar() {
            return this.publicando ? 'Guardado' : this.guardando ? 'Guardando' : this.modificado ? 'Guardar' : 'Guardado'
        },
        contentJSON() {
            return JSON.stringify(this.contenido)
        },
        creando() {
            return !this.contenido || !this.contenido.id
        },
    },
    watch: {
        contentJSON(newValue) {
            this.modificado++;
            this.updateVariables()
        },
        modificado(newValue) {
            this.recalcularsubirAdjuntos()
        }
    },
    mounted() {
        this.recalcularsubirAdjuntos()
        this.$refs.imagenesFondo.addEventListener('scroll', this.handleScroll)
        this.$refs.descripcion.addEventListener('change', this.handleDescription)
        this.$refs.descripcion.addEventListener('keydown', this.handleDescription)
        this.updateVariables()
    },
    destroy() {
        this.$refs.imagenesFondo.removeEventListener('scroll', this.handleScroll)
        this.$refs.descripcion.removeEventListener('change', this.handleDescription)
        this.$refs.descripcion.removeEventListener('keydown', this.handleDescription)
        this.$strapi.updateBorradoresNum()
    },
    methods: {
        updateVariables() {
            console.log('updateVariables', this.contenido)
            if (!this.imagenSubir)
                this.imagenSubir = this.contenido.imagen
            this.tieneFinal = !!this.contenido.fechaFinal
            this.tieneSala = !!this.contenido.sala
            this.tieneCentro = !!this.contenido.centro
        },
        dragged() {
            this.ordenQueQuiero = [...this.subirAdjuntos]
            this.modificado++
        },
        recalcularsubirAdjuntos() {
            const o = this.ordenQueQuiero
            const list = (this.contenido && this.contenido.adjuntos ? this.contenido.adjuntos : []).concat(this.imagenesSubir.map(x => ({ url: x.src })))
            this.$set(this, 'subirAdjuntos', list.sort(function (a, b) {
                const ia = o.findIndex(x => x.url === a.url)
                const ib = o.findIndex(x => x.url === b.url)
                return (ia === -1 ? 998 : ia) - (ib === -1 ? 997 : ib)
            }))
        },
        eliminarDeAdjuntos(url) {
            let idx = this.contenido.adjuntos.findIndex(x => x.url === url)
            if (idx > -1)
                this.contenido.adjuntos.splice(idx, 1)
            idx = this.imagenesSubir.findIndex(x => x.src === url)
            if (idx > -1)
                this.imagenesSubir.splice(idx, 1)
            this.modificado++
        },
        /*onImagen(payload) {
            this.imagenSubir = {
                src: payload.images[0],
                file: payload.files[0]
            }
            this.modificado++
        },*/
        onImagenes(payload) {
            for (const i in payload.images)
                this.imagenesSubir.push({ src: payload.images[i], file: payload.files[i] })
            this.modificado++
        },
        fuseSalas(options, search) {
            const fuse = new Fuse(options, {
                keys: ["nombre", "descripcion"],
                shouldSort: true
            });
            return search.length
                ? fuse.search(search).map(({ item }) => item)
                : fuse.list;
        },
        fuseCentros(options, search) {
            const fuse = new Fuse(options, {
                keys: ["nombre", "descripcion"],
                shouldSort: true
            });
            return search.length
                ? fuse.search(search).map(({ item }) => item)
                : fuse.list;
        },
        borrarContenido() {
            this.$confirm({
                message: 'Esto eliminará permanentemente este evento',
                yes: 'Borrar Evento',
                no: 'Cancelar',
                confirmed: async () => {
                    this.eliminando = true
                    this.$strapi.delete('eventos', this.contenido.id)
                        .then(response => {
                            this.$router.push('/eventos')
                        })
                        .catch(err => {
                            console.error(err)
                            this.eliminando = false
                        })
                }
            })
        },
        onPublicar() {
            if (this.publicado) {
                this.$confirm({
                    message: '¿Quieres anular la publicación? El evento dejará de estar disponible para el público',
                    yes: 'Despublicar',
                    no: 'Cancelar',
                    confirmed: () => {
                        this.despublicar()
                    }
                })
            } else
                this.publicar()
        },
        publicar() {
            this.contenido.publishedAt = new Date().toISOString()
            this.publicando = true
            this.guardarContenido().then(() => {
                if (this.thereErrors)
                    this.contenido.publishedAt = null
            })
        },
        despublicar() {
            let fechaPublicacion = this.contenido.publishedAt
            this.contenido.publishedAt = null
            this.publicando = true
            this.guardarContenido().then(() => {
                console.warn('hayERrores?', this.thereErrors)
                if (this.thereErrors)
                    this.contenido.publishedAt = fechaPublicacion
            })
        },
        async onSubmit() {
            this.clearErrors()
            this.guardando = true
            // primero subimos la imagen
            let imagenId = null
            let imagenes = []
            let noErrors = true

            if (this.imagenSubir && this.imagenSubir.id)
                imagenId = this.imagenSubir.id

            /* if (this.imagenSubir && this.imagenSubir.file) {
                console.warn('VAMOS A SUBIR IMAGEN', this.imagenSubir)
                promises.push(
                    new Promise((success, reject) => {
                        const form = new FormData()
                        console.log('file', this.imagenSubir.file)
                        form.append("files", this.imagenSubir.file)
                        this.$strapi.upload(form)
                            .then(async (data) => {
                                imagenId = data[0].id
                                success()
                            })
                            .catch(err => {
                                console.warn(err)
                                reject(err)
                            })
                    })
                )
            } */


            if (this.imagenesSubir.length) {

                const form = new FormData()
                for (const img of this.imagenesSubir)
                    form.append("files", img.file)
                const imgs = this.imagenesSubir
                await this.$strapi.upload(form)
                    .then(async (response) => {
                        console.warn('RESPONSE DE SUBIR IMAGENES', response)
                        imagenes = response
                        for (const i in imagenes)
                            imagenes[i].src = imgs[i].src  // para tener el src que corresponde a this.ordenQueQuiero
                    })
                    .catch(err => {
                        console.warn(err)
                        noErrors = false
                    })
            }

            if (noErrors)
                this.guardarContenido(imagenId, imagenes)
        },
        async guardarContenido(idImage, imagenes) {
            console.log('guardarContenido', idImage, imagenes)
            console.log('strapi1?', this.$strapi)
            const data = { ...this.contenido }
            console.log('data', data)
            data.imagen = idImage ? idImage : !data.imagen ? null : data.imagen.id ? data.imagen.id : data.imagen
            const o = this.ordenQueQuiero
            if (!imagenes) imagenes = []
            if (!data.imagenes) data.imagenes = []
            data.imagenes = data.imagenes.concat(imagenes)
                // importante guardar en el orden deseado por el usuario, o el que ya estaba antes
                .sort(function (a, b) {
                    const ia = o.findIndex(x => x.url === a.url || x.url === a.src)
                    const ib = o.findIndex(x => x.url === b.url || x.url === b.src)
                    return (ia === -1 ? 998 : ia) - (ib === -1 ? 997 : ib)
                })
                .map(x => x.id)
            console.log('strapi2?', this.$strapi)
            if (this.contenido.id) {
                console.log('saving content data', data)

                /*fetch(this.$config.strapiUrl + `/eventos/${this.contenido.id}`, {
                    method: 'PUT', // or 'PUT'
                    body: JSON.stringify({ data }), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.$strapi.token}`
                    }
                }).
                    then(res => {
                        console.log('1st res', res)
                        return res.json()
                    })*/

                //.catch(error => console.error('Error:', error))

                return this.$strapi.update('eventos', this.contenido.id, data, {
                    populate: { imagen: '*', imagenes: '*', centro: '*', sala: '*' }
                })
                    //  $axios.put(`/eventos/${this.contenido.id}`, {data})
                    .then(async (response) => {
                        console.log('2nd response', response)
                        if (response.error) {
                            this.setErr(response.error)
                        }
                        else {
                            const { data: contenido } = response
                            console.log('CONTENIDO:', contenido)
                            this.imagenSubir = contenido.imagen
                            for (const campo of relaciones11)
                                contenido[campo] = contenido[campo] && typeof contenido[campo] === 'object' ? contenido[campo].id : null

                            this.imagenSubir = null
                            this.imagenesSubir = []
                            this.ordenQueQuiero = []
                            for (const field in contenido)
                                this.$set(this.contenido, field, contenido[field])
                            this.$nextTick(() => {
                                this.modificado = 0
                            })
                            this.$strapi.updateBorradoresNum()
                        }
                        this.guardando = false
                        this.publicando = false
                    })
                    .catch(err => {
                        console.log('SAVE.CATCH', err, JSON.stringify(err))
                        this.setErr(err)
                        this.guardando = false
                        this.publicando = false
                    })
            }
            else
                return this.$strapi.create('eventos', data)
                    .then((response) => {
                        console.log('CREATED response', response)
                        if (response.error)
                            this.setErr(response)
                        else {
                            const contenido = response.data ? response.data : response
                            // registro de actividad
                            /*this.$strapi.create('historials', {
                                accion: 'evento_creado',
                                titulo: contenido.titulo,
                                url: `/eventos/${contenido.id}`
                            })*/
                            // recargamos la página para que se muestra en modo edición con la ruta correcta
                            this.$router.push(`/eventos/${contenido.id}/editar`)
                            this.$strapi.updateBorradoresNum()
                        }
                        this.guardando = false
                    })
                    .catch(err => {
                        console.log('CREATE.CATCH', err, JSON.stringify(err))
                        this.setErr(err)
                        this.guardando = false
                    })
        }
    }
}
</script>


<style scoped>
@import "@/assets/css/form.css";
@import "@/assets/css/vselect.css";
</style>