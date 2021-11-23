<template>
    <div class="relative">
        <span :disabled="disabled" class="btn btn-gray text-sm" @click="verModal = !disabled">
            <icon v-if="icon" icon="plus-square" :class="textButton ? 'mr-2' : ''" />
            {{ textButton }}
        </span>
        <input
            :required="required"
            v-model="files"
            class="absolute left-0 opacity-0 pointer-events-none"
        />
        <Modal v-model="verModal" :title="title" class="min-w-sm max-w-screen">
            <div class="p-5 max-w-full">
                <Drop
                    v-if="!files.length"
                    @change="onFileSelect"
                    :multiple="multiple"
                    accept="*/*"
                />
                <div v-if="files.length">
                    <div class="space-y-2 max-h-[60vh] overflow-y-auto">
                        <div v-for="(file, index) of files" :key="index" class="flex w-full pr-2">
                            <div
                                class="flex w-16 mr-1 text-gray justify-center items-start text-2xl"
                            >
                                <icon :icon="iconFromExt(getExtension(file.name))" />
                            </div>
                            <div class="w-full text-sm text-left">
                                <a target="_blank" :href="file.path" download>{{ file.name }}</a>
                                <div
                                    class="flex w-full justify-between text-xs text-diminished"
                                >
                                    <span class="ml-auto">{{ Math.round(file.size / 1024) }} Kb</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex space-x-4 mt-9 justify-center">
                        <div class="btn" @click="accept">
                            <icon icon="check" class="mr-2" />
                            {{ textAccept }}
                        </div>
                        <div class="btn btn-error" @click="discard">
                            <icon icon="fas fa-times" class="mr-2" />
                            {{ textCancel }}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import fileIcon from '~/mixins/fileIcon.js'
export default {
    props: {
        icon: { type: Boolean, required: false, default: true },
        textButton: { type: String, required: false, default: 'Subir o cambiar archivo' },
        textAccept: { type: String, required: false, default: 'Aceptar' },
        textCancel: { type: String, required: false, default: 'Descartar' },
        crop: { type: Boolean, required: false, default: false },
        title: { type: String, required: false, default: 'Elegir archivo/s' },
        stencilProps: { type: Object, required: false, default: null },
        stencilComponent: { type: String, required: false, default: null },
        disabled: { type: Boolean, required: false, default: false },
        required: { type: Boolean, required: false, default: false },
        multiple: { type: Boolean, required: false, default: false },
        value: {}, // to reset state,
    },
    data() {
        return {
            verModal: false,
            files: [],
        }
    },
    mixins: [fileIcon],
    methods: {
        onFileSelect(e) {
            this.files = e.target.files || e.dataTransfer.files
        },
        accept() {
            this.verModal = false
            this.$emit('change', this.files)
        },
        discard() {
            this.files = []
            this.verModal = false
        }
    },
    watch:
    {
        value(newValue) {
            this.files = []
        }
    }
}
</script>
