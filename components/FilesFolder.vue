<template>
    <div>
        <div v-if="error" class="flex w-full  h-full text-3xl justify-center items-center">
            <span>Error al cargar la carpeta</span>
        </div>
        <div
            v-else-if="cargando"
            class="flex w-full h-full text-3xl justify-center items-center text-gray"
        >
            <icon icon="spinner spin" />
        </div>
        <div v-else-if="carpetaActual" class="flex flex-col">
            <div
                v-for="carpeta of carpetas"
                :key="carpeta.id"
                class="w-full border-gray-200 border-b"
            >
                <div class="flex w-full overflow-hidden">
                    <div
                        class="flex flex-shrink-0 text-orange-200 justify-center items-center group"
                        :class="boxClass"
                    >
                        <div
                            v-if="carpeta.nombreMostrar === '..'"
                            class="relative flex justify-center items-center cursor-pointer"
                            @click="flexNavigateTo(carpeta)"
                        >
                            <icon icon="fas fa-folder" class="absolute" :class="iconClass" />
                            <icon
                                icon="fas fa-arrow-left"
                                class="group-hover:-translate-x-1 text-xs text-black absolute"
                            />
                        </div>
                        <div v-else class="flex items-center justify-center">
                            <icon
                                icon="folder"
                                class="cursor-pointer group-hover:hidden"
                                :class="iconClass"
                                @click.native="flexNavigateTo(carpeta)"
                            />
                            <icon
                                icon="folder-open"
                                class="hidden group-hover:block cursor-pointer"
                                :class="iconClass"
                                style="transform: translate(2.5px, -1px)"
                                @click.native="flexNavigateTo(carpeta)"
                            />
                        </div>
                    </div>
                    <div class="w-full overflow-ellipsis">
                        <a
                            target="_blank"
                            class="cursor-pointer"
                            :class="textClass"
                            @click.prevent="flexNavigateTo(carpeta)"
                            :href="carpeta.ruta"
                        >{{ carpeta.nombreMostrar || carpeta.nombre }}</a>
                        <div
                            class="flex w-full justify-between text-xs text-diminished"
                            :class="subtextClass"
                        >
                            <span v-if="showDate" class="ml-auto">{{ $dayjs(carpeta.created_at).fromNow() }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-for="archivo of archivos"
                :key="archivo.id"
                class="w-full border-gray-200 border-b"
            >
                <div class="flex w-full overflow-hidden">
                    <div
                        class="flex flex-shrink-0 text-gray justify-center items-center"
                        :class="boxClass"
                    >
                        <icon :icon="iconFromExt(archivo.media.ext)" :class="iconClass" />
                    </div>
                    <div class="w-full flex justify-between items-center">
                        <div class="w-full overflow-ellipsis">
                            <a
                                target="_blank"
                                :href="archivo.media.url"
                                download
                                class="leading-4 inline-flex"
                                :class="textClass"
                                style="    display: inline-block;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;"
                            >{{ archivo.nombre }}</a>
                            <div
                                class="flex w-full justify-between text-xs text-diminished"
                                :class="subtextClass"
                            >
                                <span
                                    v-if="showSize"
                                    class="w-1/3 flex-grow-0 flex-shrink-0"
                                >{{ archivo.media.size }} Kb</span>
                                <span
                                    v-if="showDate"
                                    class="ml-auto w-1/3 text-right"
                                >{{ $dayjs(archivo.media.updated_at).fromNow() }}</span>
                            </div>
                        </div>
                        <span v-if="showControls" class="cursor-pointer text-gray pl-4">&vellip;</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

const query_carpeta =
    `query {
  carpetas(where: { id: %id }) {
    id
    nombre
    slug
    descripcion
    created_at
    updated_at
    ruta
    padre {
      id
      nombre
      slug
      descripcion
      ruta
    }
    subcarpetas {
      id
      nombre
      slug
      descripcion
      ruta
    }
    archivos {
      id
      nombre
      media {
        id
        name
        ext
        size
        hash
        url
        created_at
        updated_at
      }
      autor {
        id
        username
        nombreSimbolico
        imagen {
            url
            width
            height
        }
      }
    }
  }
}`

import vmodel from '~/mixins/vmodel.js'
import fileIcon from '~/mixins/fileIcon.js'
export default {
    props: {
        idRootFolder: { type: Number, required: false, default: 0 },
        navigationMode: {
            type: String, validator(value) {
                return ['Route', 'Main', 'Embed', 'Click'].includes(value)
            }, required: false, default: 'Route'
        },
        textClass: {},
        subtextClass: {},
        iconClass: {type: String, required: false, default: 'text-4xl'},
        boxClass: {type: String, required: false, default:'w-16 mr-3'},
        showControls: {},
        showUploader: {},
        showDate: {},
        showDescription: {},
        refresh: {}, // to reset state,
    },
    mixins: [vmodel, fileIcon],
    // fetchOnServer: false,
    computed: {
        carpetas() {
            if (!this.carpetaActual) return []
            if (!this.carpetaActual.padre || this.carpetaActual.id === this.idRootFolder) return this.carpetaActual.subcarpetas
            return [{ ...this.carpetaActual.padre, nombreMostrar: '..' }, ...this.carpetaActual.subcarpetas]
        },
        archivos() {
            return this.carpetaActual.archivos
        },
        myvalue() {
            return this.localValue
        }
    },
    watch: {
        myvalue(newValue) {
            console.log('localValue changed!!', newValue, this.localValue, this.$fetch)
            this.myfetch()
        },
        refresh(newValue) {
            this.myfetch()
        }
    },
    created() {
        this.myfetch()
    },
    data() {
        return {
            carpetaActual: null,
            cargando: true,
            error: false
        }
    },
    methods: {
        // no consigo que funcione si lo pongo como el normal fetch()
        myfetch() {
            console.log('fetch!', this.localValue)
            if (this.localValue) {
                console.log('go on')
                this.cargando = true
                //this.$strapi.findOne(
                //"carpetas",
                //this.localValue
                //)
                //.then((carpeta) => {

                this.$strapi.graphql({ query: query_carpeta.replace('%id', this.localValue) })
                    .then((results) => {
                        console.log('myfetch result', results)
                        const carpeta = results.carpetas[0]
                        console.log('fetch result', carpeta)
                        if (carpeta) {
                            // this.$set(this, 'carpetaActual', carpeta)
                            this.carpetaActual = carpeta
                            // for(const k in carpeta)
                            // this.$set(this.carpetaActual, k, carpeta[k])
                            this.$emit('loaded', carpeta)
                        }
                        else
                            this.error = true
                        this.cargando = false
                    })
                    .catch(e => {
                        console.error(e)
                        this.error = true
                    })
            }
        },
        flexNavigateTo(carpeta) {
            console.log('navigated to', carpeta.id, this.navigationMode)
            if (this.navigationMode === 'Embed')
                this.localValue = carpeta.id
            else if (this.navigationMode === 'Main') {
                this.localValue = carpeta.id
                history.pushState({}, null, carpeta.ruta)
                this.$emit('navigated', carpeta)
            }
            else if (this.navigationMode === 'Click') {
                this.$emit('click', carpeta)
            }
            else this.$router.push(carpeta.ruta)
        }
    }
}
</script>