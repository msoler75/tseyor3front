<template>
    <div class="relative">
        <span :disabled="disabled" class="btn btn-gray text-sm" @click="verModal = !disabled">{{textButton}}</span>
        <input :required="required" v-model="images" class="absolute left-0 opacity-0 pointer-events-none"/>
        <Modal v-model="verModal" :title="title" class="min-w-sm max-w-screen">
            <div class="p-5 max-w-full" :class="images.length>1?'':'md:max-w-md'">
                <Drop v-if="!images.length" @change="onFileSelect" :multiple="multiple && !crop" accept="image/*"/>
                <template v-if="crop && images.length" class="flex flex-col justify-center">
                    <cropper                    
                        :src="images[0]"
                        class="cropper"
                        :stencil-props="stencilProps"
                        :stencil-component="stencilComponent"
                        @change="cropChange"
                        
                    />
                    <div class="flex space-x-4 mt-5 justify-center">
                        <div class="btn" @click="cropit"><icon icon="crop" class="mr-2"/>{{textCrop}}</div>
                         <div class="btn btn-error" @click="discard"><icon icon="fas fa-trash" class="mr-2"/>{{textCancel}}</div>
                    </div>
                </template>
                <div v-else-if="images.length">
                    <div class="bg-gray flex flex-wrap space-x-1 space-y-1 max-h-[60vh] overflow-scroll">
                    <img v-for="(image, index) of images" :key="index" :src="image" class="max-w-full mx-auto"
                        :class="images.length>3?'!h-[30vh]':images.length>1?'!h-[58vh]':''" />
                    </div>
                    <div class="flex space-x-4 mt-5 justify-center">
                        <div class="btn" @click="accept"><icon icon="check" class="mr-2"/>{{textAccept}}</div>
                        <div class="btn btn-error" @click="discard"><icon icon="fas fa-trash" class="mr-2"/>{{textCancel}}</div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
export default {
    props: {
        textButton: { type: String, required: false, default: 'Subir o cambiar imagen'},
        textCrop: { type: String, required: false, default: 'Recortar'},
        textAccept: { type: String, required: false, default: 'Aceptar'},
        textCancel: { type: String, required: false, default: 'Descartar'},
        crop: {type: Boolean, required: false, default: false},
        title: { type: String, required: false, default: 'Elegir imagen' },
        stencilProps: { type: Object, required: false, default: null },
        stencilComponent: { type: String, required: false, default: null },
        disabled: { type: Boolean, required: false, default: false },
        required: { type: Boolean, required: false, default: false },
        multiple: {type: Boolean, required: false, default: false},
        value: {}, // to reset state,
    },
    components: {
        Cropper,
    },
    data() {
        return {
            verModal: false,
            images: [],
            files: [],
            canvasCrop: null,
        }
    },
    methods: {
        async cropChange({ canvas }) {
            this.canvasCrop = canvas
        },
        onFileSelect(e) {
            var files = e.target.files || e.dataTransfer.files
            this.file = null
            if (!files.length) return
            this.createImages(files)
        },
        async createImages(files) {
            const promises = []
            this.images = []
            this.files = []
            const that = this
            for(const file of files)
            {
                if(file.name.match(/\.(jpe?g|png|webp|gif)/i))
                {
                    promises.push(new Promise((success, reject)=>{
                        var reader = new FileReader()
                        const s = success
                        reader.onload = e => {
                            that.files.push(file)
                            that.images.push(e.target.result)
                            s({file, image: e.target.result})
                        }
                        reader.readAsDataURL(file)
                    }))
                }
            }
           await Promise.all(promises)
        },
        async cropit() {
            const canvas = this.canvasCrop
            if(canvas) {
                const dataURL = canvas.toDataURL('image/webp', 0.85)
                const blob = await (await fetch(dataURL)).blob()
                const file = new File([blob], this.file.name, {type:"image/webp", lastModified: new Date()})
                this.files = [file]
                this.images = [dataURL]
                this.verModal = false
                this.$emit('change', {files: [...this.files], images: [...this.images]})
            }
        },
        accept() {
            console.log('accept')
            this.verModal = false
            this.$emit('change', {files: [...this.files], images: [...this.images]})
        },
        discard() {
            this.files = []
            this.images = []
            this.verModal = false
            this.$emit('change', {files: [...this.files], images: [...this.images]})
        }
    },
    watch:
    {
        value(newValue) {
            this.files = []
            this.images = []
        }
    }
}
</script>

<style scoped>

.cropper {
  min-height: 100px;
  max-height: calc(100vh - 240px); 
}
img {max-height: calc(100vh - 240px)}
</style>