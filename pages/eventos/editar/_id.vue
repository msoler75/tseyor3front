<template>
    <div class="max-w-full w-lg mx-auto" focused>
        <Card class="py-5 px-2 xs:px-4 max-w-md mx-auto bg-blue-gray-50 dark:bg-blue-gray-900">
            <h1>{{ accion }} evento</h1>
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
                    <p class="error">{{ errors.descripcion }}</p>
                </div>
                <div>
                    <label for="imagen">Imagen de fondo:</label>
                    <p>
                        <i>Importante: Esta imagen no debe tener texto</i>
                        <!-- https://blog.logrocket.com/how-to-extract-text-from-an-image-using-javascript-8fe282fb0e71/ -->
                    </p>
                    <img v-if="cimage" :src="cimage" class="mb-3" />
                    <InputImage
                        id="imagen"
                        :value="imagenSubir"
                        @change="onImagen"
                        class="mt-3"
                        :class="fieldValidate('imagen')"
                        :required="!cimage"
                    />
                    <p class="error">{{ errors.imagen }}</p>
                </div>
                <div>
                    <label for="imagenes">Imágenes adicionales (opcional):</label>
                    <p>
                        <i>Estas imágenes pueden tener texto</i>
                    </p>
                    <client-only>
                        <draggable
                            tag="ul"
                            :list="imagenesAdicionales"
                            group="main"
                            class="relative"
                            :animation="200"
                            @change="dragged"
                        >
                            <div
                                v-for="item of imagenesAdicionales"
                                :key="item.url"
                                class="group relative mb-3"
                            >
                                <img :src="item.url" class="w-full" />
                                <div
                                    class="btn btn-error absolute right-2 top-2 text-xl p-0 w-7 h-7 flex justify-center items-center rounded-full transition duration-200 opacity-0 group-hover:opacity-100"
                                    @click="eliminarDeImagenes(item.url)"
                                    title="Eliminar imagen"
                                >&times;</div>
                            </div>
                        </draggable>
                    </client-only>
                    <InputImage
                        id="imagenes"
                        :value="imagenesSubir"
                        :multiple="true"
                        @change="onImagenes"
                        class="mt-3"
                        :class="fieldValidate('imagenes')"
                        textButton="Añadir"
                    />
                    <p class="error">{{ errors.imagenes }}</p>
                </div>
                <div>
                    <label for="texto">Descripción detallada:</label>
                    <br />
                    <textarea
                        id="texto"
                        v-model="contenido.texto"
                        rows="7"
                        :class="fieldValidate('texto')"
                    />
                    <p class="error">{{ errors.texto }}</p>
                </div>
                <div>
                    <label for="tipoEvento">Tipo de Evento:</label>
                    <br />
                    <select
                        id="tipoEvento"
                        v-model="contenido.tipoEvento"
                        :class="fieldValidate('tipoEvento')"
                    >
                        <option value="encuentro">Encuentro</option>
                        <option value="curso">Curso</option>
                        <option value="otros">Otros</option>
                    </select>
                    <p class="error">{{ errors.tipoEvento }}</p>
                </div>
                <div>
                    <label>Fecha y hora de comienzo:</label>
                    <InputDateTime
                        id="fechaComienzo"
                        v-model="contenido.fechaComienzo"
                        required
                        :class="fieldValidate('fechaComienzo')"
                    />
                    <p class="error">{{ errors.fechaComienzo }}</p>
                </div>

                <div v-if="!tieneFinal">
                    <div
                        class="btn btn-gray text-xs mt-1 w-48"
                        @click.prevent="tieneFinal = true"
                    >Definir fecha final</div>
                </div>
                <div v-else>
                    <label>Fecha y hora de final:</label>
                    <InputDateTime
                        id="fechaFinal"
                        v-model="contenido.fechaFinal"
                        :class="fieldValidate('fechaFinal')"
                    />
                    <p class="error">{{ errors.fechaFinal }}</p>
                    <div
                        class="btn btn-gray text-xs mt-1 w-48"
                        @click.prevent="contenido.fechaFinal = null; tieneFinal = false"
                    >
                        <span class="scale-150 mr-2">&times;</span> Remover fecha final
                    </div>
                </div>
                <div>
                    <label for="zonahoraria">Zona Horaria:</label>
                    <br />
                    <select
                        id="zonahoraria"
                        v-model="contenido.zonahoraria"
                        :class="fieldValidate('zonahoraria')"
                    >
                        <option value="Espana">España</option>
                        <option value="Chile">Chile</option>
                        <option value="Mexico">México</option>
                    </select>
                    <p class="error">{{ errors.zonahoraria }}</p>
                </div>

                <div v-if="!tieneSala">
                    <div
                        class="btn btn-gray text-xs mt-1 w-48"
                        @click.prevent="tieneSala = true"
                    >Definir Sala virtual</div>
                </div>
                <div v-else>
                    <label for="sala">Sala virtual:</label>
                    <v-select
                        id="sala"
                        :options="salas"
                        v-model="contenido.sala"
                        placeholder="Elige sala virtual..."
                        :filter="fuseSalas"
                        autocomplete="on"
                        :getOptionLabel="sala => sala.nombre"
                        :reduce="sala => sala.id"
                        label="Sala"
                    >
                        <div slot="no-options">Ningún resultado</div>
                    </v-select>
                    <div
                        class="btn btn-gray text-xs mt-1 w-48"
                        @click.prevent="contenido.sala = null; tieneSala = false"
                    >
                        <span class="scale-150 mr-2">&times;</span> Remover sala
                    </div>
                </div>

                <div v-if="!tieneCentro">
                    <div
                        class="btn btn-gray text-xs mt-1 w-48"
                        @click.prevent="tieneCentro = true"
                    >Definir Centro organizador</div>
                </div>
                <div v-else>
                    <label for="sala">Organiza:</label>
                    <v-select
                        :options="centros"
                        v-model="contenido.centro"
                        placeholder="Elige centro..."
                        :filter="fuseCentros"
                        autocomplete="on"
                        :getOptionLabel="centro => centro.nombre"
                        :reduce="centro => centro.id"
                        label="Sala"
                    >
                        <div slot="no-options">Ningún resultado</div>
                    </v-select>
                    <div
                        class="btn btn-gray text-xs mt-1 w-48"
                        @click.prevent="contenido.centro = null; tieneCentro = false"
                    >
                        <span class="scale-150 mr-2">&times;</span> Remover centro
                    </div>
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
                                :icon="guardando ? 'sync spin' : creando ? 'plus-square' : modificado ? 'cloud-upload-alt' : 'check'"
                            />
                            <span class="inline-block w-28">{{ verbo }}</span>
                        </div>
                    </button>
                </div>
            </form>
        </Card>

        <div
            v-if="contenido.id"
            class="w-[400px] max-w-full mx-auto mt-7 flex justify-center space-x-6"
        >
            <div
                @click="borrarEvento"
                class="btn btn-error w-full text-center"
                :disabled="eliminando || guardando"
            >
                <div class="flex justify-center items-center">
                    <icon class="!w-6" icon="trash" />
                    <span class="inline-block w-28">Borrar Evento</span>
                </div>
            </div>

            <NLink
                :to="`/eventos/${contenido.id}`"
                class="btn w-full text-center"
                :disabled="eliminando || guardando"
            >
                <div class="flex justify-center items-center">
                    <icon class="!w-6" icon="eye" />
                    <span class="inline-block w-28">Ver Evento</span>
                </div>
            </NLink>
        </div>
    </div>
</template>

<script>
const relaciones11 = ['sala', 'organiza', 'autor']
import vSelect from "vue-select";
import Fuse from "fuse.js";
import validation from "@/mixins/validation"
import draggable from "vuedraggable";
export default {
    components: { vSelect, draggable },
    mixins: [validation],
    middleware: 'logged',
    async asyncData({ $strapi, route, $error }) {
        try {
            let id = route.params.id
            let contenido = {
                titulo: '',
                texto: '',
                descripcion: '',
                zonahoraria: 'Espana',
                fechaComienzo: null,
                fechaFinal: null,
                imagen: null,
                tipoEvento: 'encuentro',
                sala: null,
                organiza: null,
                autor: null,
                imagenes:[]
            }
            if (id && id !== 'nuevo') {
                const resultado = await $strapi.find(
                    'eventos',
                    id.match(/^\d+$/) ? { id } : { slug: id }
                )
                if (!resultado.length)
                    return $error(404, 'Evento no encontrado')
                contenido = resultado[0]
                for (const campo of relaciones11)
                    contenido[campo] = contenido[campo] && contenido[campo].id ? contenido[campo].id : null
            }
            const salas = await $strapi.find('salas')
            const centros = await $strapi.find('centros')
            return { contenido, evento: contenido, salas, centros }
        }
        catch (e) {
            $error(503)
        }
    },
    data() {
        return {
            imagenSubir: null,
            imagenesSubir: [],
            dragData: {},
            imagenesAdicionales: [],
            ordenQueQuiero: [],
            tieneFinal: this.contenido && this.contenido.fechaFinal,
            tieneSala: this.contenido && this.contenido.sala,
            tieneCentro: this.contenido && this.contenido.centro,
            guardando: false,
            eliminando: false,
            modificado: 0
        }
    },
    computed: {
        cimage() {
            // la imagen que queremos subir o la del contenido 
            return this.imagenSubir ? this.imagenSubir.src : this.contenido.imagen ? this.contenido.imagen.url : null
        },
        accion() {
            return this.contenido.id ? 'Editar' : 'Nuevo'
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
    },
    watch: {
        contentJSON(newValue) {
            this.modificado++
        },
        modificado(newValue) {
            this.recalcularImagenesAdicionales()
        }
    },
    mounted() {
        this.recalcularImagenesAdicionales()
    },
    methods: {
        dragged() {
            this.ordenQueQuiero = [...this.imagenesAdicionales]
            this.modificado++
        },
        recalcularImagenesAdicionales() {
            const o = this.ordenQueQuiero
            const list = (this.contenido ? this.contenido.imagenes : []).concat(this.imagenesSubir.map(x => ({ url: x.src })))
            this.$set(this, 'imagenesAdicionales', list.sort(function (a, b) {
                const ia = o.findIndex(x => x.url === a.url)
                const ib = o.findIndex(x => x.url === b.url)
                return (ia === -1 ? 998 : ia) - (ib === -1 ? 997 : ib)
            }))
        },
        eliminarDeImagenes(url) {
            let idx = this.contenido.imagenes.findIndex(x => x.url === url)
            if (idx > -1)
                this.contenido.imagenes.splice(idx, 1)
            idx = this.imagenesSubir.findIndex(x => x.src === url)
            if (idx > -1)
                this.imagenesSubir.splice(idx, 1)
            this.modificado++
        },
        onImagen(payload) {
            this.imagenSubir = {
                src: payload.images[0],
                file: payload.files[0]
            }
            this.modificado++
        },
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
        borrarEvento() {
            if (confirm("Esto eliminará permanentemente este evento")) {
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
        },
        async submit() {
            this.clearErrors()
            this.guardando = true
            // primero subimos la imagen
            let imagenId = null
            let imagenes = []
            const promises = []

            if (this.imagenSubir && this.imagenSubir.file) {
                promises.push(
                    new Promise((success, reject) => {
                        const form = new FormData()
                        form.append("files", this.imagenSubir.file)
                        this.$strapi.create("upload", form)
                            .then(async (response) => {
                                imagenId = response[0].id
                                success()
                            })
                            .catch(err => {
                                console.warn(err)
                                reject(err)
                            })
                    })
                )
            }

            if (this.imagenesSubir.length) {
                promises.push(
                    new Promise((success, reject) => {
                        const form = new FormData()
                        for (const img of this.imagenesSubir)
                            form.append("files", img.file)
                        const imgs = this.imagenesSubir
                        this.$strapi.create("upload", form)
                            .then(async (response) => {
                                imagenes = response
                                for (const i in imagenes)
                                    imagenes[i].src = imgs[i].src  // para tener el src que corresponde a this.ordenQueQuiero
                                success()
                            })
                            .catch(err => {
                                console.warn(err)
                                reject(err)
                            })
                    })
                )
            }

            await Promise.all(promises)

            this.guardarEvento(imagenId, imagenes)
        },
        async guardarEvento(idImage, imagenes) {
            const data = { ...this.contenido }
            data.imagen = idImage ? idImage : data.imagen.id
            const o = this.ordenQueQuiero
            data.imagenes = data.imagenes.concat(imagenes)
                // importante guardar en el orden deseado por el usuario, o el que ya estaba antes
                .sort(function (a, b) {
                    const ia = o.findIndex(x => x.url === a.url || x.url === a.src)
                    const ib = o.findIndex(x => x.url === b.url || x.url === b.src)
                    return (ia === -1 ? 998 : ia) - (ib === -1 ? 997 : ib)
                })
                .map(x => x.id)
            if (this.contenido.id) {
                this.$strapi
                    .update('eventos', this.contenido.id, data)
                    .then((contenido) => {
                        this.imagenSubir = null
                        this.imagenesSubir = []
                        this.ordenQueQuiero = []
                        for (const field in contenido) {
                            if (relaciones11.includes(field))
                                this.$set(this.contenido, field, contenido[field] ? contenido[field].id : null)
                            else
                                this.$set(this.contenido, field, contenido[field])
                        }
                        this.$nextTick(() => {
                            this.guardando = false
                            this.modificado = 0
                        })
                    })
                    .catch(err => {
                        this.setErr(err)
                        this.guardando = false
                    })
            }
            else
                this.$strapi.create('eventos', data)
                    .then((contenido) => {

                        // registro de actividad
                        this.$strapi.create('historials', {
                            accion: 'evento_creado',
                            titulo: contenido.titulo,
                            url: `/eventos/${contenido.id}`
                        })

                        // recargamos la página para que se muestra en modo edición con la ruta correcta
                        this.$router.push(`/eventos/editar/${contenido.id}`)
                    })
                    .catch(err => {
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