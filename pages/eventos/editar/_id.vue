<template>
    <Card class="form py-5 px-2 xs:px-4 max-w-sm mx-auto bg-blue-gray-50 dark:bg-blue-gray-900">

        <Config :focused="true" />

        <h1>{{ accion }} evento</h1>
        <form @submit.prevent="submit" class="space-y-4">
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
            <div v-if="!image">
                <label for="imagen">Imagen:</label>
                <input id="imagen" type="file" @change="onFileChange" :class="fieldValidate('imagen')" />
                <p class="error">{{ errors.imagen }}</p>
            </div>
            <div v-else>
                <img :src="image" class="max-w-sm max-h-xs" />
                <div
                    class="btn btn-gray text-xs mt-1"
                    @click.prevent="removeImage"
                >Remover imagen</div>
            </div>
            <div>
                <label for="texto">Descripción detallada:</label>
                <br />
                <textarea id="texto" v-model="contenido.texto" rows="7" :class="fieldValidate('texto')" />
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
                    class="btn btn-gray text-xs mt-1"
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
                    class="btn btn-gray text-xs mt-1"
                    @click.prevent="contenido.fechaFinal = null; tieneFinal = false"
                >Remover fecha final</div>
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
                    class="btn btn-gray text-xs mt-1"
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
                    class="btn btn-gray text-xs mt-1"
                    @click.prevent="contenido.sala = null; tieneSala = false"
                >Remover sala</div>
            </div>

            <div v-if="!tieneCentro">
                <div
                    class="btn btn-gray text-xs mt-1"
                    @click.prevent="tieneCentro = true"
                >Definir Centro organizador</div>
            </div>
            <div v-else>
                <label for="sala">Organiza:</label>
                <v-select
                    class="my-v"
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
                    class="btn btn-gray text-xs mt-1"
                    @click.prevent="contenido.centro = null; tieneCentro = false"
                >Remover centro</div>
            </div>
            <div class="flex justify-center">
                <button
                    class="btn w-full text-center"
                    :class="modificado || guardando || creando ? 'btn-warning' : 'btn-success'"
                    type="submit"
                    :disabled="!modificado"
                >
                    <div class="flex justify-center items-center">
                        <icon class="!w-6" :icon="guardando?'sync spin': creando?'plus-square' : modificado ? 'sync': 'check'" />
                        <span class="inline-block w-28">{{ verbo }}</span>
                    </div>
                </button>
            </div>
        </form>
    </Card>
</template>

<script>
const relaciones11 = ['sala', 'organiza', 'autor']
import vSelect from "vue-select";
import Fuse from "fuse.js";
export default {
    components: { vSelect },
    async asyncData({ $strapi, route }) {
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
            autor: null
        }
        if (id && id !== 'nuevo') {
            const resultado = await $strapi.find(
                'eventos',
                id.match(/\d+/) ? { id } : { slug: id }
            )
            contenido = resultado[0]
            for(const campo of relaciones11)
                contenido[campo] = contenido[campo] && contenido[campo].id?contenido[campo].id: null
        }
        const salas = await $strapi.find('salas')
        const centros = await $strapi.find('centros')
        return { contenido, evento: contenido, salas, centros }
    },
    data() {
        return {
            image: null,
            tieneFinal: this.contenido && this.contenido.fechaFinal,
            tieneSala: this.contenido && this.contenido.sala,
            tieneCentro: this.contenido && this.contenido.centro,
            guardando: false,
            modificado: false
        }
    },
    computed: {
        accion() {
            return this.contenido.id ? 'Editar' : 'Nuevo'
        },
        verbo() {
            return !this.contenido.id ? 'Crear' : this.guardando ? 'Guardando' : this.modificado ? 'Guardar' : 'Guardado'
        },
        contentJSON() {
            return JSON.stringify(this.contenido)
        },
        creando() {
            return !this.contenido||!this.contenido.id
        }
    },
    watch: {
        contentJSON(newValue) {
            this.modificado = true
        }
    },
    methods: {
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files
            if (!files.length) return
            this.createImage(files[0])
        },
        createImage(file) {
            var image = new Image()
            var reader = new FileReader()
            var vm = this

            reader.onload = e => {
                vm.image = e.target.result
            }
            reader.readAsDataURL(file)
        },
        removeImage: function (e) {
            this.image = ''
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
        async submit() {
            this.clearErrors()
            this.guardando = true
            if (this.contenido.id) {
                await this.$strapi
                    .update('eventos', this.contenido.id, this.contenido)
                    .then(() => {
                        this.modificado = false
                    })
                    .catch(err => {
                        this.setErr(err)
                    })
            }
            else
                await this.$strapi.create('eventos', this.contenido)
                    .then((contenido) => {
                        console.log('creado', contenido)
                        for(const field in contenido)
                        {
                            if(relaciones11.includes(field))
                                this.$set(this.contenido, field, contenido[field]?contenido[field].id:null)
                            else
                                this.$set(this.contenido, field, contenido[field])
                        }
                        this.$nextTick(() => {
                            this.modificado = false
                        })
                    })
                    .catch(err => {
                        this.setErr(err)
                    })
            this.guardando = false
        }
    }
}
</script>


<style scoped>
label {
    @apply font-bold text-lg mb-1;
}
.my-v {
    @apply relative;
}
.my-v >>> [role="combobox"] {
    @apply flex;
}
.my-v >>> .vs__selected-options {
    @apply flex-grow;
}
.my-v >>> .vs__actions {
    @apply flex items-center px-2 pb-0;
}
.my-v >>> .vs__actions > * {
    @apply cursor-pointer text-gray;
}
.my-v >>> .vs__clear {
    @apply mr-3;
}
.my-v >>> .vs__selected {
    @apply absolute top-0 left-2 bottom-0 flex items-center text-gray-700 px-1 py-1;
}
.my-v.vs--single.vs--searching >>> .vs__selected {
    display: none;
}
.my-v >>> .vs__dropdown-menu {
    @apply block absolute top-full mt-2 left-0 z-10 p-2 cursor-pointer text-gray-900 w-full max-h-40 overflow-y-auto shadow-md rounded text-left list-none bg-gray-100;
}

textarea {
    resize: vertical;
}

p.error {
    @apply text-red;
}
</style>