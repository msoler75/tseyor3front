<template>
    <div class="max-w-full w-lg mx-auto pb-16" focused footer="no">

        <ContentEdit ref="ce" :content="contenido" :error="error" collection="publicaciones" @submit="onSubmit"
            :masculine="false">
            <template v-slot:default="{ inputClassError, errors }">

                <div>
                    <label for="titulo">Título:</label>
                    <br />
                    <input type="text" id="titulo" v-model="contenido.titulo" required
                        :class="inputClassError('titulo')" />
                    <p class="error">{{ errors.titulo }}</p>
                </div>

                <div>
                    <label for="tipo">Tipo de Publicación:</label>
                    <br />
                    <select id="tipo" v-model="contenido.tipo" :class="inputClassError('tipo')" required>
                        <option value="Notificación">Notificación</option>
                        <option value="Orden del día">Orden del día</option>
                        <option value="Acta o Resumen">Acta o Resumen</option>
                        <option value="Anexo">Anexo</option>
                        <option value="Acuerdo">Acuerdo</option>
                    </select>
                    <p class="error">{{ errors.tipo }}</p>
                </div>
                <div>
                    <label for="texto">Texto:</label>
                    <br />
                    <textarea id="texto" v-model="contenido.texto" rows="5" :class="inputClassError('texto')" />
                    <p class="error">{{ errors.texto }}</p>
                </div>

                <div>
                    <label for="adjuntos">Archivos adjuntos:</label>
                    <FilesDropDrag v-model="contenido.adjuntos" ref="adjuntos" />
                    <p class="error">{{ errors.adjuntos }}</p>
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

            </template>
        </ContentEdit>
    </div>
</template>

<script>
const relaciones11 = ['sala']
import vSelect from "vue-select";
import Fuse from "fuse.js";
//import validation from "@/mixins/validation"
import draggable from "vuedraggable";
export default {
    components: { vSelect, draggable },
    //  mixins: [validation],
    // middleware: 'logged',
    async asyncData({ route, $strapi, $dayjs, $error }) {
        try {
            let id = route.params.id
            let contenido = {
                publishedAt: null,
                titulo: '',
                texto: '',
                descripcion: '',
                tipo: 'Notificación',
                sala: null,
                autor: null,
                adjuntos: []
            }
            if (id && id !== 'nueva') {
                const publicacion = await $strapi.getContent(route, {
                    populate: { adjuntos: '*', sala: '*' },
                    publicationState: 'preview'
                })
                if (!publicacion)
                    return $error(404, 'Publicación no encontrada')
                contenido = publicacion
                for (const campo of relaciones11)
                    contenido[campo] = contenido[campo] && contenido[campo].id ? contenido[campo].id : null
                console.warn('publicacion2', publicacion)
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
            // adjuntosSubir: [],
            // dragData: {},
            // adjuntosAdicionales: [],
            // ordenQueQuiero: [],
            tieneSala: false,
            error: {}
        }
    },
    computed: {
        adjuntosFondo() {
            return this.$store.getters.getImageFor('publicaciones')
        },
        cimage() {
            const img = this.imagenSubir ? this.imagenSubir : this.contenido ? this.contenido.imagen : null
            return !img ? null : img.url ? img.url : img
        }
    },
    mounted() {
        // this.recalcularAdjuntos()
        console.warn('REFS', this.$refs)
        this.updateVariables()
        this.$store.commit('setDropHandler', this.addFiles)
    },
    /* ya lo hace el middleware route 
        destroy() {
        this.$store.commit('setDropHandler', null)
    },*/
    methods: {
        addFiles(e) {
            console.warn('DROPPED.ADDFILES', e)
            this.$refs.adjuntos.addFiles(e)
        },
        updateVariables() {
            console.log('updateVariables', this.contenido)
            this.tieneSala = !!this.contenido.sala
        },
        /* dragged() {
            this.ordenQueQuiero = [...this.adjuntosAdicionales]
            this.$refs.ce.modified++
        },*/
        /*recalcularAdjuntos() {
            const o = this.ordenQueQuiero
            const list = (this.contenido && this.contenido.adjuntos ? this.contenido.adjuntos : []).concat(this.adjuntosSubir.map(x => ({ url: x.src })))
            this.$set(this, 'adjuntosAdicionales', list.sort(function (a, b) {
                const ia = o.findIndex(x => x.url === a.url)
                const ib = o.findIndex(x => x.url === b.url)
                return (ia === -1 ? 998 : ia) - (ib === -1 ? 997 : ib)
            }))
        },
        eliminarDeAdjuntos(url) {
            let idx = this.contenido.adjuntos.findIndex(x => x.url === url)
            if (idx > -1)
                this.contenido.adjuntos.splice(idx, 1)
            idx = this.adjuntosSubir.findIndex(x => x.src === url)
            if (idx > -1)
                this.adjuntosSubir.splice(idx, 1)
            this.$refs.ce.modified++
        },
        */
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
        /*onAdjuntar(items) {
            console.warn('onadjuntar', payload)
            //for (const i in payload)
            //  this.adjuntosSubir.push({ file: payload[i] })
            for (const item of items)
            {
                console.warn('agregamos', item)
                this.contenido.adjuntos.push({ file: item })
            }
            this.$refs.ce.modified++
            //this.recalcularAdjuntos()
        },*/
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
            this.$refs.ce.clearState()
        },

        async onSubmit(data) {
            // primero subimos la imagen
            let adjuntos = []
            this.error = null

            if (data.adjuntos.length) {
                const form = new FormData()
                var uploadSome = false
                for (const item of data.adjuntos)
                    if (item.file) {
                        console.log('append file', item.file)
                        form.append("files", item.file)
                        uploadSome = true
                        adjuntos.push({ name: item.file.name })
                    }
                    else
                        adjuntos.push(item)
                if (uploadSome) {
                    await this.$strapi.upload(form)
                        .then((response) => {
                            if (response.error) {
                                this.error = response.error
                            }
                            else {
                                for (const item of response) {
                                    let idx = adjuntos.findIndex(x => x.name == item.name)
                                    if (idx > -1)
                                        adjuntos[idx] = item
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

            data.adjuntos = this.$idy(adjuntos)

            if (this.contenido.id) {
                return this.$strapi.update('publicaciones', this.contenido.id, data, {
                    populate: { imagen: '*', adjuntos: '*', centro: '*', sala: '*' }
                })
                    //  $axios.put(`/eventos/${this.contenido.id}`, {data})
                    .then(async (response) => {
                        console.log('2nd response', response)
                        if (response.error) {
                            this.error = response.error
                        }
                        else {
                            const { data: contenido } = response
                            console.log('CONTENIDO:', contenido)
                            for (const campo of relaciones11)
                                contenido[campo] = contenido[campo] && typeof contenido[campo] === 'object' ? contenido[campo].id : null
                            for (const field in contenido)
                                this.$set(this.contenido, field, contenido[field])
                            this.$nextTick(() => {
                                this.resetState()
                                // this.$refs.ce.modified = 0
                            })
                            this.$strapi.updateBorradoresNum()
                        }
                        this.resetState()
                    })
                    .catch(err => {
                        console.log('SAVE.CATCH', err, JSON.stringify(err))
                        this.error = err
                        // this.$refs.ce.saving = false
                        // this.$refs.ce.publishing = false
                        this.resetState()
                    })
            }
            else
                return this.$strapi.create('publicaciones', data)
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
                            this.$router.push(`/publicaciones/${contenido.id}/editar`)
                            this.$strapi.updateBorradoresNum()
                        }
                        console.log('REFS CE', this.$refs.ce)
                        //this.$refs.ce.saving = false
                        this.resetState()
                    })
                    .catch(err => {
                        console.log('CREATE.CATCH', err, JSON.stringify(err))
                        this.error = err
                        // this.$refs.ce.saving = false
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