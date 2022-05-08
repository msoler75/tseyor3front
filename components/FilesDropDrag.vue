<template>
    <div>
        <client-only>
            <!-- <Drop v-if="!images.length" @change="addFiles" :multiple="multiple && !crop" accept="image/*" /> -->
            <draggable tag="ul" v-model="items" id="draggable-items"
                class="relative flex flex-wrap justify-center items-start px-7 select-none" :animation="200">
                <div v-for="item, index of items" :key="index" class="group relative m-2 cursor-grab">
                    <div v-if="item.src || item.url && isImage(item.url)" class="relative max-w-full overflow-hidden"
                        :title="getFileName(item)">
                        <img :src="item.src || item.url">
                        <div class="absolute bottom-1 left-1 file-label">
                            <icon :icon="iconFromExt(getExtension(getFileName(item)))" />
                            <span>{{ getFileName(item) }}</span>
                        </div>
                    </div>
                    <div v-else class="file-label" :title="getFileName(item)">
                        <icon :icon="iconFromExt(getExtension(getFileName(item)))" />
                        <span>{{ getFileName(item) }}</span>
                    </div>
                    <div class="btn btn-error absolute right-1 top-1 text-xl p-0 w-7 h-7 flex justify-center items-center rounded-full transition duration-50 opacity-0 group-hover:opacity-100"
                        @click="deleteItem(index)" title="Eliminar">&times;</div>
                </div>
            </draggable>
            <InputFiles :onlyInput="true" type="file" :multiple="true" :accept="accept" @change="addFiles" class="mt-3"
                textButton="Añadir Archivos" />
        </client-only>
    </div>
</template>

<script>
import loadImage from 'blueimp-load-image'
import fileIcon from '~/mixins/fileIcon.js'
import draggable from "vuedraggable"
export default {
    mixins: [fileIcon],
    components: { draggable },
    props: {
        value: {
            // type: Array || Null,
            required: true,
        },
        accept: {
            type: String,
            required: false,
            default: '*/*'
        }
    },
    data() {
        return {
            items: this.value || [],
        }
    },
    computed: {
        itemsJSONEncoded() {
            return JSON.stringify(this.items)
        }
    },
    watch: {
        itemsJSONEncoded(value) {
            this.$emit('input', [...this.items])
        },
        value(value) {
            this.items = value || []
        }
    },
    methods: {
        isImage(url) {
            return url.match(/\.(png|webp|svg|jpe?g)$/i)
        },
        getFileName(item) {
            return 'file' in item ? item.file.name : item.name
        },
        async addFiles(e) {
            console.log('addFiles', e)
            const numItemsAtStart = this.items.length
            const regex = new RegExp(this.accept.replace(/\*/, '[^\/]*'))
            const payload = e.dataTransfer ? e.dataTransfer.files : e.target && e.target.files ? e.target.files : e
            console.log('payload', payload)
            for (var i = 0; i < payload.length; i++) {
                const file = payload[i]
                if (!regex.test(file.type)) continue
                console.warn('agregamos', i, file)
                let src = null
                console.log('FILE.name', file.name)
                if (this.isImage(file.name)) {
                    src = await new Promise((success) => {
                        loadImage(
                            file,
                            function (canvas) {
                                console.log('IMG', canvas)
                                success(canvas.toDataURL())
                            },
                            {
                                maxWidth: 600,
                                maxHeight: 300,
                                minWidth: 100,
                                minHeight: 50,
                                canvas: true
                            } // Options
                        )
                    })
                    /*src = await new Promise((success) => {
                        var reader = new FileReader();
                        reader.addEventListener("load", function () {
                            success(this.result);
                        }, false);
                        reader.readAsDataURL(file);
                    })*/
                }
                this.items.push({ file, src })
            }
            if (this.items.length != numItemsAtStart)
                this.$nextTick(() => {
                    var firstEl = document.querySelector(`#draggable-items > div:nth-child(${numItemsAtStart + 1})`)
                    this.$scrollTo(firstEl, 1000, {
                        offset: -250
                    })
                })
        },
        deleteItem(idx) {
            this.items.splice(idx, 1)
        }
    }
}
</script>

<style scoped>
.file-label {
    @apply px-2 py-1 text-sm rounded bg-gray-700 text-gray-300 flex items-baseline whitespace-nowrap space-x-2 overflow-hidden;
    max-width: 194px;
}

.file-label span {
    width: 94%;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
}

img {
    max-width: 200px;
    max-height: 200px;
}
</style>