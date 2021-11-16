<template>
 <div class="max-w-full w-lg mx-auto" focused>
      
     <section class="mb-12 px-3 sm:px-5 md:px-7 flex flex-col space-y-3 xm:flex-row xm:space-y-0 xm:space-x-3">
      <NLink class="btn btn-gray" :to="'/equipos/' + equipo.id">
        <Icon icon="chevron-left" class="mr-3" />
        {{ equipo.nombre }}
      </NLink>

       <NLink class="btn btn-gray" :to="'/actividades/' + actividad.id">
        <Icon icon="chevron-left" class="mr-3" />
        {{ actividad.titulo }}
      </NLink>
    </section>

    <Card class="py-5 px-2 xs:px-4 max-w-md mx-auto bg-blue-gray-50 dark:bg-blue-gray-900">
            
        <h1>{{ accion }} Reunión</h1>
        <form @submit.prevent="submit" class="regular-form bg-transparent space-y-4">
            <div>
                <label for="equipo">Equipo:</label>
                <br />
                <input type="text" disabled v-model="equipo.nombre" />
            </div>
            <div>
                <label for="equipo">Actividad:</label>
                <br />
                <input type="text" disabled v-model="actividad.titulo" />
            </div>
            <div>
                <label for="texto">Orden del día:</label>
                <br />
                <textarea
                    id="texto"
                    v-model="contenido.texto"
                    rows="7"
                    :class="fieldValidate('texto')"
                    required
                />
                <p class="error">{{ errors.texto }}</p>
            </div>

            <div>
                <label>Fecha y hora de comienzo:</label>
                <InputDateTime
                    id="fecha"
                    v-model="contenido.fecha"
                    required
                    :class="fieldValidate('fecha')"
                />
                <p class="error">{{ errors.fecha }}</p>
                <p class="my-3">
                    <span class="font-bold">Zona horaria:</span>
                    {{ equipo.zonahoraria }}
                </p>
            </div>

            <div v-if="!tieneAnexos">
                <div
                    class="btn btn-gray text-xs mt-1"
                    @click.prevent="tieneAnexos = true"
                >Añadir anexos</div>
            </div>
            <div v-else>
                <label>Anexos:</label>
                <p>...</p>
            </div>

            <template v-if="contenido.id">
            <div v-if="!tieneActa">
                <div
                    class="btn btn-gray text-xs mt-1"
                    @click.prevent="tieneActa = true"
                >Redactar Acta</div>
            </div>
            <div v-else>
                <label for="acta">Generar acta:</label>
                <p>...</p>
                <div
                    class="btn btn-gray text-xs mt-1"
                    @click.prevent="contenido.acta = null; tieneActa = false"
                >Cancelar acta</div>
            </div>
            </template>

            <div v-if="reunion.id&&!reunion.acta">
                <input
                    type="checkbox"
                    id="cancelada"
                    v-model="contenido.cancelada"
                    :class="fieldValidate('cancelada')"
                />
                <label for="cancelada">Reunión Cancelada</label>
            </div>

            <div class="flex justify-center">
                <button
                    class="btn w-full text-center"
                    :class="modificado || guardando || creando ? 'btn-warning' : 'btn-success'"
                    type="submit"
                    :disabled="!modificado"
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
                @click="borrarReunion"
                class="btn btn-error w-full text-center"
                :disabled="eliminando || guardando"
            >
                <div class="flex justify-center items-center">
                    <icon class="!w-6" icon="trash" />
                    <span class="inline-block w-28">Borrar Reunión</span>
                </div>
            </div>

            <NLink
                :to="`/reuniones/${contenido.id}`"
                class="btn w-full text-center"
                :disabled="eliminando || guardando"
            >
                <div class="flex justify-center items-center">
                    <icon class="!w-6" icon="eye" />
                    <span class="inline-block w-28">Ver Reunión</span>
                </div>
            </NLink>
        </div>

    </div>
</template>

<script>
const relaciones11 = ['equipo', 'actividad', 'acta']
import vSelect from "vue-select";
import Fuse from "fuse.js";
import validation from "@/mixins/validation"
export default {
    components: { vSelect },
    mixins: [validation],
    async asyncData({ $strapi, query, route, $error }) {
        try {
            let id = route.params.id
            let contenido = {
                equipo: null,
                fecha: query.fechahora,
                texto: '',
                adjuntos: [],
                cancelada: false,
                actividad: query.actividad,
                acta: null,
                anexos: []
            }
            console.log('contenido', contenido, query)
            let resultado = null
            if (id && id !== 'nueva') {
                console.log('strapi fetch reunion', id)
                resultado = await $strapi.find('reuniones', { id })
                if(!resultado.length)
                    return $error(404, 'Reunión no encontrada')
                contenido = resultado[0]
                for (const campo of relaciones11)
                    contenido[campo] = contenido[campo] && contenido[campo].id ? contenido[campo].id : null
                contenido.anexos = contenido.anexos.map(x => x.id)
            }
            resultado = await $strapi.find('actividades', { id: contenido.actividad })
            const actividad = resultado[0]
            resultado = await $strapi.find('equipos', { id: actividad.equipo.id })
            const equipo = resultado[0]
            resultado = await $strapi.graphql({
                query: 
                `query  {
                            anexos {
                                titulo
                            }
                        }`})
            const anexos = resultado.anexos
            contenido.equipo = equipo.id
            return { query, contenido, reunion: contenido, actividad, equipo, anexos, tieneAnexos: !!contenido.anexos.length }
        }
        catch (e) {
            $error(503)
        }
    },
    data() {
        return {
            tieneActa: false,
            guardando: false,
            modificado: false,
            eliminando: false,
        }
    },
    computed: {
        accion() {
            return this.contenido.id ? 'Editar' : 'Nueva'
        },
        verbo() {
            return !this.contenido.id ? 'Crear' : this.guardando ? 'Guardando' : this.modificado ? 'Guardar' : 'Guardado'
        },
        contentJSON() {
            return JSON.stringify(this.contenido)
        },
        creando() {
            return !this.contenido || !this.contenido.id
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
        fuseAnexos(options, search) {
            const fuse = new Fuse(options, {
                keys: ["titulo"],
                shouldSort: true
            });
            return search.length
                ? fuse.search(search).map(({ item }) => item)
                : fuse.list;
        },
        borrarReunion() {
            if (confirm("Esto eliminará permanentemente esta reunión")) {
                this.eliminando = true
                this.$strapi.delete('reuniones', this.contenido.id)
                    .then(response => {
                        this.$router.push('/actividades/'+this.actividad.id)
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
            if (this.contenido.id) {
                await this.$strapi
                    .update('reuniones', this.contenido.id, this.contenido)
                    .then(() => {
                        this.modificado = false
                    })
                    .catch(err => {
                        this.setErr(err)
                    })
            }
            else
                await this.$strapi.create('reuniones', this.contenido)
                    .then((contenido) => {
                        console.log('creado', contenido)
                        for (const field in contenido) {
                            if (relaciones11.includes(field))
                                this.$set(this.contenido, field, contenido[field] ? contenido[field].id : null)
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
@import "@/assets/css/form.css";
@import "@/assets/css/vselect.css";
</style>