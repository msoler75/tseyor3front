<template>
    <div class="relative">
        <Modal v-model="verModal" :title="title" class="sm:min-w-sm max-w-screen">
            <form class="p-5 max-w-full space-y-9 overflow-y-scroll" @submit="accept">
                {{localValue}}
                <div>
                    <label for="nombre">Nombre de la carpeta</label>
                    <input
                        id="nombre"
                        type="text"
                        v-model="localValue.nombre"
                        placeholder="Nombre..."
                        required
                    />
                </div>
                <Permissions v-model="localValue.permisos" >
                   <slot/>
                </Permissions>
                <div class="flex space-x-4 mt-9 justify-center">
                    <button type="submit" class="btn" >
                        <icon icon="check" class="mr-2" />
                        {{textAccept}}
                    </button>
                    <button class="btn btn-error" @click="discard">
                        <icon icon="fas fa-times" class="mr-2" />
                        {{ textCancel }}
                    </button>
                </div>
            </form>
        </Modal>
    </div>
</template>

<script>
export default {
    props: {
        icon: { type: String | Boolean, required: false, default: 'folder-plus' },
        title: { type: String, required: false, default: 'Propiedades de carpeta' },
        disabled: { type: Boolean, required: false, default: false },
        textAccept: { type: String, required: false, default: 'Aceptar' },
        textCancel: { type: String, required: false, default: 'Cancelar' },
        value: {},
        showIt: {}
    },
    data() {
        return {
            verModal: this.showIt,
            // datos de carpeta
            localValue: {nombre: '', permisos:{}, ...this.value}
        }
    },
    methods: {
        accept() {
            this.verModal = false
            this.$emit('change', this.localValue)
        },
        discard() {
            this.verModal = false
        }
    },
    /*computed: {
        localValueJSON() {
            return JSON.stringify(this.localValue)
        },
        valueJSON() {
            return JSON.stringify(this.value)
        }
    },*/
    watch: {
        localValue(value) {
            this.$emit('input', this.localValue)
        },
        value(value) {
            this.localValue = value
        },
        showIt(value) {
            this.verModal = value
        },
        verModal(value) {
            if(!value) this.$emit('close')
        }
    }
}
</script>