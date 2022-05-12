<template>
    <div class="relative">
        <Modal v-model="verModal" :title="title" class="sm:min-w-sm max-w-screen">
            <form v-if="tengoPermiso(localValue, 'administracion')" class="p-5 max-w-full space-y-9 overflow-y-auto" @submit="accept">
                <div class="space-y-2">
                    <label for="nombre" class="font-bold">Nombre de la carpeta:</label>
                    <input
                        id="nombre"
                        type="text"
                        v-model="localValue.nombre"
                        placeholder="Nombre..."
                        required
                    />
                    <p class="text-diminished text-xs">Ubicada en {{localValue.ruta}}</p>
                </div>
                <Permissions v-model="localValue.permisos" >
                   <slot/>
                </Permissions>

                <div class="space-y-2">
                    <label class="font-bold">Información de carpeta:</label>
                    <table>
                        <tr><td><label class="text-diminished mr-4">Ubicada en:  </label> </td><td><span>{{localValue.ruta}}</span></td></tr>
                        <tr><td><label class="text-diminished mr-4">Creada en:  </label></td><td><span>{{$dayjs(localValue.createdAt)}}</span></td></tr>
                        <tr><td><label class="text-diminished mr-4">Creada por:  </label></td><td><span>{{localValue.autor?localValue.autor.nombreSimbolico:'Administradores'}}</span></td></tr>
                    </table>
                </div>
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
            <div v-else class="space-y-9 p-5 sm:p-9">                
                <table>
                    <tr><td><label class="text-diminished mr-4">Nombre: </label> </td><td><span>{{localValue.nombre}}</span></td></tr>
                    <tr><td><label class="text-diminished mr-4">Ubicada en:  </label> </td><td><span>{{localValue.ruta}}</span></td></tr>
                    <tr><td><label class="text-diminished mr-4">Creada en:  </label></td><td><span>{{$dayjs(localValue.createdAt)}}</span></td></tr>
                    <tr><td><label class="text-diminished mr-4">Creada por:  </label></td><td><span>{{localValue.autor?localValue.autor.nombreSimbolico:'Administradores'}}</span></td></tr>
                </table>
                <div class="flex justify-center">
                    <button type="submit" class="btn" @click="verModal=false">
                        <icon icon="times" class="mr-2" />
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import permisos from '@/mixins/permisos'
export default {
    mixins: [permisos],
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
            this.$emit('accept', this.localValue)
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
            //this.$emit('input', this.localValue)
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