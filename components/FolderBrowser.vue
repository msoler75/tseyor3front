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
                            @click.native="carpetaActualId = carpeta.id"
                        />
                    </div>
                    <div class="w-full">
                        <a
                            target="_blank"
                            class="cursor-pointer"
                            @click.prevent="carpetaActualId = carpeta.id"
                        >{{ carpeta.nombre }}</a>
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
export default {
    props: {
        idFolder: {},
        topFolder: { type: Boolean, required: false, default: true }
    },
    fetchOnServer: false,
    async fetch() {
        if (this.carpetaActualId) {
            this.cargando = true
            this.$strapi.findOne(
                "carpetas",
                this.carpetaActualId
            ).then((carpeta) => {
                if (carpeta) {
                    this.$set(this, 'carpetaActual', carpeta)
                    this.$emit('change', carpeta)
                    if (!this.carpetaBase)
                        this.$set(this, 'carpetaBase', carpeta)
                    this.carpetaActualId = carpeta ? carpeta.id : null
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
    data() {
        return {
            carpetaBase: null,
            carpetaActual: null,
            carpetaActualId: this.idFolder,
            cargando: true,
            error: false
        }
    },
    computed: {
        carpetas() {
            if (!this.carpetaActual) return []
            if (this.carpetaActual.id === this.carpetaBase.id) return this.carpetaActual.subcarpetas
            return [{ ...this.carpetaActual.padre, nombre: '..' }, ...this.carpetaActual.subcarpetas]
        },
        archivos() {
            return this.carpetaActual.archivos
        }
    },
    watch: {
        carpetaActualId(newValue) {
            this.$fetch()
        }
    },
    methods: {
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