<template>
    <div class="max-w-full w-lg mx-auto pb-16" focused footer="no">

        <ContentEdit ref="ce" :content="contenido" :error="error" collection="eventos" @change="updateVariables"
            @submit="onSubmit">

            <template v-slot:default="{ inputClassError, errors }">
                <div>
                    <label for="titulo">Título:</label>
                    <br />
                    <input type="text" id="titulo" v-model="contenido.titulo" required
                        :class="inputClassError('titulo')" />
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
                        :maxlength="maxLengthDescription" :class="inputClassError('descripcion')" />
                    <p class="error">{{ errors.descripcion }}</p>
                </div>
                <div>
                    <label for="imagen">Imagen de fondo:</label>
                    <nuxt-img v-if="cimage" :src="cimage" fit="cover" width="494px" height="250" class="max-w-full" />
                    <div v-else class="h-[250px] bg-gray" />
                    <input class="opacity-0 h-0 p-0 transform -translate-y-4" type="text" id="imagen" name="imagen"
                        v-model="imagenSubir" required>
                    <div class="relative mt-2 select-none transform -translate-y-2">
                        <span v-show="!isInLeft" class="absolute shadow text-xs rounded-xs left-0 top-4 bg-white p-1"
                            @click="scrollToLeft">
                            <icon icon="chevron-left" />
                        </span>
                        <span class="absolute shadow text-xs rounded-xs right-0 top-4 bg-white p-1"
                            @click="scrollToRight">
                            <icon icon="chevron-right" />
                        </span>
                        <div class="flex space-x-2 overflow-x-auto scroll-smooth" ref="imagenesFondo">
                            <nuxt-img v-for="imagen of imagenesFondo" :key="imagen.url" fit="cover" width="70"
                                height="70" class="cursor-pointer border border-gray" :src="imagen.url"
                                @click.native="onImagen(imagen)" />
                        </div>
                    </div>
                    <p class="error">{{ errors.imagen }}</p>
                </div>
                <div>
                    <label for="imagenes">Imágenes adicionales (opcional):</label>
                    <FilesDropDrag v-model="contenido.imagenes" ref="imagenes" accept="image/*"
                        :class="inputClassError('imagenes')" />
                    <p class="error">{{ errors.imagenes }}</p>
                </div>
                <div>
                    <label for="texto">Explicación detallada (opcional):</label>
                    <br />
                    <textarea id="texto" v-model="contenido.texto" rows="5" :class="inputClassError('texto')" />
                    <p class="error">{{ errors.texto }}</p>
                </div>
                <div>
                    <label for="tipo">Tipo de Evento:</label>
                    <br />
                    <select id="tipo" v-model="contenido.tipo" :class="inputClassError('tipo')" required>
                        <option value="Encuentro">Encuentro</option>
                        <option value="Curso">Curso</option>
                        <option value="Presentación">Presentación</option>
                        <option value="Otros">Otros</option>
                    </select>
                    <p class="error">{{ errors.tipo }}</p>
                </div>
                <div>
                    <label>Fecha y hora de comienzo:</label>
                    <InputDateTime id="fechaComienzo" v-model="contenido.fechaComienzo" required
                        :class="inputClassError('fechaComienzo')" />
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
                        :class="inputClassError('fechaFinal')" />
                    <p class="error">{{ errors.fechaFinal }}</p>
                    <div class="btn btn-gray text-xs mt-1 w-48"
                        @click.prevent="contenido.fechaFinal = null; tieneFinal = false">
                        <span class="scale-150 mr-2">&times;</span> Remover fecha final
                    </div>
                </div>
                <div>
                    <label for="zonaHoraria">Zona Horaria:</label>
                    <br />
                    <select id="zonaHoraria" v-model="contenido.zonaHoraria" :class="inputClassError('zonaHoraria')"
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

            </template>
        </ContentEdit>
    </div>
</template>

<script>
const relaciones11 = ['sala', 'centro']
import vSelect from "vue-select";
import Fuse from "fuse.js";
export default {
    components: { vSelect },
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
                fechaComienzo: $dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
                fechaFinal: null,
                imagen: null,
                tipo: 'encuentro',
                sala: null,
                centro: null,
                autor: null,
                imagenes: []
            }
            if (id && id !== 'nuevo') {
                const evento = await $strapi.getContent(route, {
                    populate: { centro: '*', imagenes: '*', sala: '*' },
                    publicationState: 'preview'
                })
                if (!evento)
                    return $error(404, 'Evento no encontrado')
                contenido = evento
                for (const campo of relaciones11)
                    contenido[campo] = contenido[campo] && contenido[campo].id ? contenido[campo].id : null
            }
            const { data: salas } = await $strapi.find('salas')
            const { data: centros } = await $strapi.find('centros')
            console.warn('CENTROS', centros)
            console.warn('SALAS', salas)
            console.log('ASYNC LOADED EVENT', contenido)
            return { contenido, salas, centros }
        }
        catch (e) {
            console.error(e)
            $error(503)
        }
    },
    data() {
        return {
            isInLeft: true,
            scrollingTo: 0,
            descriptionLength: 0,
            maxLengthDescription: 120,
            imagenSubir: null,
            imagenesSubir: [],
            dragData: {},
            imagenesAdicionales: [],
            tieneSala: false,
            tieneFinal: false,
            tieneCentro: false,
            error: {}
        }
    },
    computed: {
        imagenesFondo() {
            return this.$store.getters.getImageFor('eventos')
        },
        cimage() {
            const img = this.imagenSubir ? this.imagenSubir : this.contenido ? this.contenido.imagen : null
            return !img ? null : img.url ? img.url : img
        }
    },
    mounted() {
        console.warn('REFS', this.$refs)
        this.$refs.imagenesFondo.addEventListener('scroll', this.handleScroll)
        this.$refs.descripcion.addEventListener('change', this.handleDescription)
        this.$refs.descripcion.addEventListener('keydown', this.handleDescription)
        this.updateVariables()
        this.$store.commit('setDropHandler', this.addFiles)
        this.$store.commit('setDropAccept', 'image/*')
    },
    destroy() {
        this.$refs.imagenesFondo.removeEventListener('scroll', this.handleScroll)
        this.$refs.descripcion.removeEventListener('change', this.handleDescription)
        this.$refs.descripcion.removeEventListener('keydown', this.handleDescription)
    },
    methods: {
        addFiles(e) {
            console.warn('DROPPED.ADDFILES', e)
            this.$refs.imagenes.addFiles(e)
        },
        updateVariables() {
            console.log('updateVariables', this.contenido)
            if (!this.imagenSubir)
                this.imagenSubir = this.contenido.imagen
            this.tieneFinal = !!this.contenido.fechaFinal
            this.tieneSala = !!this.contenido.sala
            this.tieneCentro = !!this.contenido.centro
        },
        handleScroll() {
            this.isInLeft = this.$refs.imagenesFondo && this.$refs.imagenesFondo.scrollLeft == 0
        },
        handleDescription() {
            this.descriptionLength = this.$refs.descripcion.value.length
        },
        scrollToLeft() {
            this.$refs.imagenesFondo.scrollLeft -= 80
        },
        scrollToRight() {
            this.$refs.imagenesFondo.scrollLeft += 80
        },


        /*onImagen(payload) {
            this.imagenSubir = {
                src: payload.images[0],
                file: payload.files[0]
            }
            this.modificado++
        },*/
        onImagen(imagen) {
            this.imagenSubir = imagen;
            this.$refs.ce.modified++
        },
        onImagenes(payload) {
            for (const i in payload.images)
                this.imagenesSubir.push({ src: payload.images[i], file: payload.files[i] })
            this.$refs.ce.modified++
            // this.recalcularImagenes()
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


        resetState() {
            if(this.$refs.ce)
            this.$refs.ce.clearState()
        },

        async onSubmit(data) {
            let imagenes = []
            this.error = null

            // primero subimos las imagenes

            if (data.imagenes.length) {
                const form = new FormData()
                var uploadSome = false
                for (const item of data.imagenes)
                    if (item.file) {
                        console.log('append file', item.file)
                        form.append("files", item.file)
                        uploadSome = true
                        imagenes.push({ name: item.file.name })
                    }
                    else
                        imagenes.push(item)
                if (uploadSome) {
                    await this.$strapi.upload(form)
                        .then((response) => {
                            if (response.error) {
                                this.error = response.error
                            }
                            else {
                                for (const item of response) {
                                    let idx = imagenes.findIndex(x => x.name == item.name)
                                    if (idx > -1)
                                        imagenes[idx] = item
                                }
                            }
                        })
                        .catch(err => {
                            this.error = err
                        })
                }
            }

            if (this.error) {
                this.resetState()
                return
            }

            data.imagenes = this.$idy(imagenes)
            data.imagen = this.$idy(data.imagen)
            data.sala = this.$idy(data.sala)
            data.centro = this.$idy(data.centro)

            if (this.contenido.id) {
                return this.$strapi.update('eventos', this.contenido.id, data, {
                    populate: { imagen: '*', imagenes: '*', centro: '*', sala: '*' }
                })
                    .then(async (response) => {
                        if (response.error) {
                            this.error = response.error
                        }
                        else {
                            const { data: contenido } = response
                            this.imagenSubir = contenido.imagen
                            for (const campo of relaciones11)
                                contenido[campo] = contenido[campo] && typeof contenido[campo] === 'object' ? contenido[campo].id : null
                            for (const field in contenido)
                                this.$set(this.contenido, field, contenido[field])
                            this.$strapi.updateBorradoresNum()
                        }
                        this.$nextTick(() => {
                            this.resetState()
                        })
                    })
                    .catch(err => {
                        console.log('SAVE.CATCH', err, JSON.stringify(err))
                        this.error = err
                        this.resetState()
                    })
            }
            else
                return this.$strapi.create('eventos', data)
                    .then((response) => {
                        console.log('CREATED response', response)
                        if (response.error)
                            this.error = response.error
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
                        this.resetState()
                    })
                    .catch(err => {
                        console.log('CREATE.CATCH', err, JSON.stringify(err))
                        this.error = err
                        this.resetState()
                    })
        }
    }
}
</script>


<style scoped>
@import "@/assets/css/form.css";
@import "@/assets/css/vselect.css";
</style>