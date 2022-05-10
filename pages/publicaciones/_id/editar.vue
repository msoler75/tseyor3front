<template>
    <div class="max-w-full w-lg mx-auto pb-16" focused footer="no">
        <ContentEdit ref="ce" :content="contenido" :error="error" collection="publicaciones" @submit="onSubmit"
            :masculine="false">
            <template v-slot:default="{ inputClassError, errors, modified }">

                <div v-if="contenido.equipo">
                    <label for="titulo">Equipo:</label>
                    <br />
                    <input type="text" disabled :value="contenido.equipo.nombre">
                    <div class="w-full flex justify-end">
                        <TButton variant="gray" :to="`/equipos/${contenido.equipo.id}`" :disabled="modified" class="mt-1">
                            <icon icon="arrow-right" class="mr-2"/> Ir al Equipo
                        </TButton>
                    </div>
                </div>

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
                        <option v-for="tipo of tipos" :key="tipo" :value="tipo">{{ tipo }}</option>
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
    async asyncData({ query, route, $strapi, $error }) {
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
                adjuntos: [],
                equipo: query.equipo || null
            }
            if (id && id !== 'nueva') {
                const publicacion = await $strapi.getContent(route, {
                    populate: { adjuntos: '*', sala: '*', equipo: '*' },
                    publicationState: 'preview'
                })
                if (!publicacion)
                    return $error(404, 'Publicación no encontrada')
                contenido = publicacion
                for (const campo of relaciones11)
                    contenido[campo] = contenido[campo] && contenido[campo].id ? contenido[campo].id : null
            }
            else if (query.equipo && query.equipo) {
                contenido.equipo = await $strapi.findOne('equipos', query.equipo)
            }
            const { data: salas } = await $strapi.find('salas')
            return { contenido, salas }
        }
        catch (e) {
            console.error(e)
            $error(503)
        }
    },
    data() {
        return {
            tieneSala: false,
            error: {}
        }
    },
    computed: {
        tipos() {
            if (this.contenido.equipo) return ['Notificación', 'Orden del día', 'Acta o Resumen', 'Anexo', 'Acuerdo']
            return ['Personal', 'Notificación']
        },
        adjuntosFondo() {
            return this.$store.getters.getImageFor('publicaciones')
        },
        cimage() {
            const img = this.contenido ? this.contenido.imagen : null
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
        fuseSalas(options, search) {
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
            // primero subimos la imagen
            let adjuntos = []
            this.error = null

            if (!data.adjuntos) data.adjuntos = []

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
            data.equipo = this.$idy(data.equipo)

            if (this.contenido.id) {
                return this.$strapi.update('publicaciones', this.contenido.id, data, {
                    populate: { imagen: '*', adjuntos: '*', equipo: '*', sala: '*' }
                })
                    .then(async (response) => {
                        if (response.error) {
                            this.error = response.error
                        }
                        else {
                            const { data: contenido } = response
                            for (const campo of relaciones11)
                                contenido[campo] = contenido[campo] && typeof contenido[campo] === 'object' ? contenido[campo].id : null
                            for (const field in contenido)
                                this.$set(this.contenido, field, contenido[field])
                            this.$updateBorradoresNum()
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
                            this.$updateBorradoresNum()
                        }
                        console.log('REFS CE', this.$refs.ce)
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