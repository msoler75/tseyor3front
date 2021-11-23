<template>
    <div>
        <div v-if="error" class="flex w-full h-full text-3xl justify-center items-center">
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
                <div class="flex w-full">
                    <div
                        class="flex w-16 mr-3 uppercase font-bold text-orange-200 justify-center items-center text-4xl"
                    >
                        <icon
                            icon="folder"
                            class="cursor-pointer"
                            @click.native="flexNavigateTo(carpeta)"
                        />
                    </div>
                    <div class="w-full">
                        <a
                            target="_blank"
                            class="cursor-pointer"
                            @click.prevent="flexNavigateTo(carpeta)"
                            :href="carpeta.ruta"
                        >{{ carpeta.nombreMostrar || carpeta.nombre }}</a>
                        <div class="flex w-full justify-between text-xs text-diminished">
                            <span>{{ $dayjs(carpeta.created_at).fromNow() }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-for="archivo of archivos"
                :key="archivo.id"
                class="w-full border-gray-200 border-b"
            >
                <div class="flex w-full">
                    <div
                        class="flex w-16 mr-3 uppercase font-bold text-gray justify-center items-center text-3xl"
                    >
                        <icon :icon="iconFile(archivo.media.ext)" />
                    </div>
                    <div class="w-full">
                        <a target="_blank" :href="archivo.media.url" download>{{ archivo.nombre }}</a>
                        <div class="flex w-full justify-between text-xs text-diminished">
                            <span class>{{ $dayjs(archivo.media.updated_at).fromNow() }}</span>
                            <span class="ml-auto">{{ archivo.media.size }} Kb</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import vmodel from '~/mixins/vmodel.js'
export default {
    props: {
        idRootFolder: { type: Number, required: false, default: 0 },
        navigationMode: {type: String, validator(value) {
            return ['Route', 'Main', 'Embed', 'Click'].includes(value)
        }, required: false,default: 'Route'}
    },
    mixins: [vmodel],
    fetchOnServer: false,
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
                this.$strapi.findOne(
                    "carpetas",
                    this.localValue
                ).then((carpeta) => {
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
            if (this.navigationMode==='Embed')
                this.localValue = carpeta.id
            else if (this.navigationMode==='Main') {
                this.localValue = carpeta.id
                history.pushState({}, null, carpeta.ruta)
                this.$emit('navigated', carpeta)
            }
            else if(this.navigationMode==='Click') {
                this.$emit('click', carpeta)
            }
            else this.$router.push(carpeta.ruta)
        },
        /* ext(n) {
            const idx = n.lastIndexOf('.')
            return idx>-1?n.substr(idx+1):n
        }, */
        iconFile(ext) {
            switch (ext.toLowerCase().substr(1)) {
                case 'pdf': return 'file-pdf'
                case 'doc':
                case 'docx': return 'file-word'
                case 'txt':
                case 'rtf': return 'file-alt'
                case 'mp3':
                case 'au':
                case 'wma':
                case 'm4a':
                case 'wav':
                case 'aac':
                case 'opus':
                case 'flac': return 'file-audio'
                case 'mp4':
                case 'avi':
                    return 'file-video'
                case 'ppt':
                case 'pps':
                case 'pptx':
                case 'ppsx':
                    return 'file-powerpoint'
                case 'zip':
                case 'rar': return 'file-archive'
                case 'jpeg':
                case 'jpg':
                case 'webp':
                case 'svg':
                case 'png':
                case 'gif': return 'file-image'
                default: return 'file'
            }
        }
    }
}
</script>