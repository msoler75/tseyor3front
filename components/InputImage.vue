<template>
    <div>
        <span :disabled="disabled" class="btn btn-gray text-sm" @click="verModal = !disabled">{{textButton}}</span>
        <Modal v-model="verModal" :title="title" class="min-w-sm max-w-screen">
            <div class="p-5 max-w-full md:max-w-md">
                <Drop v-if="!image" @change="onFileChange" accept="image/*"/>
                <template v-if="crop && image" class="flex flex-col justify-center">
                    <cropper                    
                        :src="image"
                        class="cropper"
                        :stencil-props="stencilProps"
                        :stencil-component="stencilComponent"
                        @change="cropChange"
                        
                    />
                    <div class="flex space-x-4 mt-5 justify-center">
                        <button class="btn" @click="cropit"><icon icon="crop" class="mr-2"/>{{textCrop}}</button>
                         <button class="btn btn-error" @click="discard"><icon icon="fas fa-trash" class="mr-2"/>{{textCancel}}</button>
                    </div>
                </template>
                <div v-else-if="image">
                    <img :src="image" class="max-w-full mx-auto" />
                    <div class="flex space-x-4 mt-5 justify-center">
                        <button class="btn" @click="accept"><icon icon="check" class="mr-2"/>{{textAccept}}</button>
                        <button class="btn btn-error" @click="discard"><icon icon="fas fa-trash" class="mr-2"/>{{textCancel}}</button>
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
        value: {} // to reset state
    },
    components: {
        Cropper,
    },
    data() {
        return {
            verModal: false,
            image: null,
            file: null,
            canvasCrop: null,
        }
    },
    methods: {
        async cropChange({ canvas }) {
            this.canvasCrop = canvas
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files
            this.file = null
            if (!files.length) return
            console.log('change', )
            if(files[0].name.match(/\.(jpe?g|png|webp|gif)/i))
                this.createImage(files[0])
        },
        createImage(file) {
            this.file = file
            var reader = new FileReader()
            var that = this
            reader.onload = async e => {
                that.image = e.target.result
            }
            reader.readAsDataURL(file)
        },
        async cropit() {
            const canvas = this.canvasCrop
            if(canvas) {
                const dataURL = canvas.toDataURL('image/jpeg', 0.9)
                this.image = dataURL
                const blob = await (await fetch(dataURL)).blob()
                const file = new File([blob], this.file.name, {type:"image/jpeg", lastModified: new Date()})
                this.verModal = false
                this.$emit('change', {file, src: this.image})
            }
        },
        accept() {
            this.verModal = false
            this.$emit('change', {file: this.file, src: this.image})
        },
        discard() {
            this.file = null
            this.image = null
            this.verModal = false
            this.$emit('change', {file: null, src: null})
        }
    },
    watch:
    {
        value(newValue) {
            this.file = null
            this.image = null
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