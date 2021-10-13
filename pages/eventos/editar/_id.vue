<template>
    <div class='form'>
        <h1>{{ accion }} evento</h1>
        <form @submit.prevent="submit" class="space-y-3">
            <div>
                <label for="titulo">Título:</label>
                <br />
                <input type="text" id="titulo" v-model="contenido.titulo" />
            </div>
            <div>
                <label for="descripcion">Descripción corta:</label>
                <br />
                <textarea id="descripcion" v-model="contenido.descripcion" />
            </div>
            <div v-if="!image">
                <label for="imagen">Imagen:</label>
                <input id="imagen" type="file" @change="onFileChange" />
            </div>
            <div v-else>
                <img :src="image" class="max-w-sm max-h-xs" />
                <button class="btn btn-gray text-xs mt-1" @click="removeImage">Remover imagen</button>
            </div>
            <div>
                <label for="texto">Descripción detallada:</label>
                <br />
                <textarea id="texto" v-model="contenido.texto" />
            </div>
            <div>
                <label for="tipo">Tipo de Evento:</label>
                <br />
                <select id="tipo" v-model="contenido.tipoEvento">
                    <option value="encuentro">Encuentro</option>
                    <option value="curso">Curso</option>
                    <option value="otros">Otros</option>
                </select>
            </div>
            <div>
                {{contenido.fechaComienzo}}
                <label for="fechaComienzo">Fecha y hora de comienzo:</label>
                <div class="flex space-x-2">
                    <input type="date" id="fechaComienzo" v-model="fechaComienzo" />
                    <InputTime id="horaComienzo" v-model="horaComienzo" />
                </div>
            </div>
            <div>
                {{contenido.fechaFinal}}
                <label for="fechaFinal">Fecha y hora de final:</label>
                <div class="flex space-x-2">
                    <input type="date" id="fechaFinal" v-model="fechaFinal" />
                    <InputTime id="horaFinal" v-model="horaFinal" />
                </div>
            </div>
            <div>
                <label for="zonahoraria">Zona Horaria:</label>
                <select id="zonahoraria" v-model="contenido.zonahoraria">
                    <option value="Espana">España</option>
                    <option value="Chile">Chile</option>
                    <option value="Mexico">México</option>
                </select>
            </div>
            <div>
                <label for="sala">Sala virtual:</label>
                <v-select
                    class="my-v"
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
            </div>
            <div>
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
            </div>
            <div>
                <input class="btn" type="submit" :value="verbo" />
            </div>
        </form>
    </div>
</template>

<script>
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
            organiza: null
        }
        if (id && id !== 'nuevo') {
            const eventos = await $strapi.find(
                'eventos',
                id.match(/\d+/) ? { id } : { slug: id }
            )
            contenido = eventos[0]
            contenido.sala = contenido.sala && contenido.sala.id ? contenido.sala.id : null
            contenido.centro = contenido.centro && contenido.centro.id ? contenido.centro.id : null
        }
        const salas = await $strapi.find('salas')
        const centros = await $strapi.find('centros')
        return { contenido, evento: contenido, salas, centros }
    },
    data() {
        return {
            image: null,
        }
    },
    computed: {
        accion() {
            return this.contenido.id ? 'Editar' : 'Nuevo'
        },
        verbo() {
            return this.contenido.id ? 'Guardar' : 'Crear'
        },
        fechaComienzo: {
            get() {
                if(!this.contenido.fechaComienzo)
                    this.contenido.fechaComienzo = this.$dayjs().format("YYYY-MM-DDTHH:mm")
                return this.contenido.fechaComienzo.substr(0,10)
            },
            set(fecha) {
                this.contenido.fechaComienzo =  fecha + 'T' + this.horaComienzo
            }
        },
        horaComienzo: {
            get() {
                if(!this.contenido.fechaComienzo)
                    this.contenido.fechaComienzo = this.$dayjs().format("YYYY-MM-DDTHH:mm")
                return this.contenido.fechaComienzo.substr(11,5)
            },
            set(hora) {
                this.contenido.fechaComienzo = this.fechaComienzo + 'T' + hora
            }
        },
        fechaFinal: {
            get() {
                if(!this.contenido.fechaFinal)
                    this.contenido.fechaFinal = this.$dayjs().format("YYYY-MM-DDTHH:mm")
                return this.contenido.fechaFinal.substr(0,10)
            },
            set(fecha) {
                this.contenido.fechaFinal =  fecha + 'T' + this.horaFinal
            }
        },
        horaFinal: {
            get() {
                if(!this.contenido.fechaFinal)
                    this.contenido.fechaFinal = this.$dayjs().format("YYYY-MM-DDTHH:mm")
                return this.contenido.fechaFinal.substr(11,5)
            },
            set(hora) {
                this.contenido.fechaFinal = this.fechaFinal + 'T' + hora
            }
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
        submit() {
            if (this.contenido.id)
                this.$strapi
                    .update('eventos', this.contenido.id, this.contenido)
                    .catch(err => {
                        console.log(err)
                    })
            else
                this.$strapi.create('eventos', this.contenido).catch(err => {
                    if (err.response.data.message === 'ValidationError') {
                        const errors = err.response.data.data.errors
                        for (const field in errors) {
                            console.log('field: ', field)
                            console.log(errors[field][0])
                        }
                    }
                    console.log(err)
                    console.log('message', err.message)
                    console.log('response', err.response)
                    console.log(JSON.stringify(err.response))
                })
        }
    }
}
</script>


<style scoped>
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

</style>