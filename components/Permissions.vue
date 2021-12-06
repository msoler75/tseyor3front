<template>
    <div class="space-y-9 select-none">
        <slot />

        <div class="space-y-2">
            <p class="font-bold">Permisos de lectura:</p>
            <p class="text-diminished text-xs">Usuarios que pueden ver y leer los contenidos de la carpeta</p>
            <div class="flex flex-wrap space-x-5">
                 <div class="flex items-center whitespace-nowrap space-x-1">
                    <input id="lectura-heredado" type="checkbox" v-model="localValue.lectura.heredado" class="scale-125" />
                    <label for="lectura-heredado">Heredar permisos <span class="text-xs text-diminished">(copia los permisos de carpeta padre)</span></label> 
                </div>
            </div>
            <div class="flex flex-wrap space-x-5">
                <div class="flex items-center whitespace-nowrap space-x-1">
                    <input id="lectura-publico" type="checkbox" v-model="localValue.lectura.publico" class="scale-125" :disabled="localValue.lectura.heredado" />
                    <label for="lectura-publico">Público</label>
                </div>
                <div class="flex items-center whitespace-nowrap space-x-1">
                <input id="lectura-autenticados" type="checkbox" v-model="localValue.lectura.autenticados" class="scale-125" :disabled="localValue.lectura.heredado"  />
                <label for="lectura-autenticados">Usuarios registrados</label>
                </div>
                <div class="flex items-center whitespace-nowrap space-x-1">
                <input id="lectura-delegados" type="checkbox" v-model="localValue.lectura.delegados" class="scale-125" :disabled="localValue.lectura.heredado" />
                <label for="lectura-delegados">Delegados</label>
                </div>
                <div class="flex items-center whitespace-nowrap space-x-1">
                <input id="lectura-muul" type="checkbox" v-model="localValue.lectura.muul"  class="scale-125" :disabled="localValue.lectura.heredado"/>
                <label for="lectura-muul">Muul</label>
                </div>
            </div>
            <div v-if="(localValue.lectura.grupos && localValue.lectura.grupos.length) ||
            (localValue.lectura.equipos && localValue.lectura.equipos.length) ||
            (localValue.lectura.usuarios && localValue.lectura.usuarios.length)" class="flex items-center flex-wrap space-x-5">
                <p class="text-sm">Permisos ya fijados para: <br/><span class="text-diminished text-xs">(no modificable)</span></p>
                <div>
                <div v-if="localValue.lectura.grupos && localValue.lectura.grupos.length">
                    <p><span class="text-diminished text-sm">Grupos: </span>
                        {{listar(localValue.lectura.grupos)}} 
                    </p>
                </div>
                <div v-if="localValue.lectura.equipos && localValue.lectura.equipos.length">
                    <p><span class="text-diminished text-sm">Equipos: </span>
                        {{listar(localValue.lectura.equipos)}} 
                    </p>
                </div>
                <div v-if="localValue.lectura.usuarios && localValue.lectura.usuarios.length">
                    <p><span class="text-diminished text-sm">Usuarios: </span>
                        {{listar(localValue.lectura.usuarios)}} 
                    </p>
                </div>
                </div>
            </div>
        </div>

        <div class="space-y-2">
            <p class="font-bold">Permisos de creación:</p>
            <p class="text-diminished text-xs">Usuarios que pueden subir nuevos contenidos a la carpeta y crear nuevas carpetas</p>
            <div class="flex flex-wrap space-x-5">
                 <div class="flex items-center whitespace-nowrap space-x-1">
                    <input id="creacion-heredado" type="checkbox" v-model="localValue.creacion.heredado" class="scale-125" />
                    <label for="creacion-heredado">Heredar permisos <span class="text-xs text-diminished">(copia los permisos de carpeta padre)</span></label> 
                </div>
            </div>
            <div class="flex flex-wrap space-x-5">
                <div class="flex items-center whitespace-nowrap space-x-1">
                <input id="creacion-publico" type="checkbox" v-model="localValue.creacion.publico" class="scale-125"  :disabled="localValue.creacion.heredado" />
                <label for="creacion-publico">Público</label>
                </div>
                <div class="flex items-center whitespace-nowrap space-x-1">
                <input id="creacion-autenticados" type="checkbox" v-model="localValue.creacion.autenticados" class="scale-125"  :disabled="localValue.creacion.heredado" />
                <label for="creacion-autenticados">Usuarios registrados</label>
                </div>
                <div class="flex items-center whitespace-nowrap space-x-1">
                <input id="creacion-delegados" type="checkbox" v-model="localValue.creacion.delegados" class="scale-125"  :disabled="localValue.creacion.heredado" />
                <label for="creacion-delegados">Delegados</label>
                </div>
                <div class="flex items-center whitespace-nowrap space-x-1">
                <input id="creacion-muul" type="checkbox" v-model="localValue.creacion.muul" class="scale-125"  :disabled="localValue.creacion.heredado" />
                <label for="creacion-muul">Muul</label>
                </div>
            </div>
            <div v-if="(localValue.creacion.grupos && localValue.creacion.grupos.length) ||
            (localValue.creacion.equipos && localValue.creacion.equipos.length) ||
            (localValue.creacion.usuarios && localValue.creacion.usuarios.length)" class="flex items-center flex-wrap space-x-5">
                <p class="text-sm">Permisos ya fijados para: <br/><span class="text-diminished text-xs">(no modificable)</span></p>
                <div>
                <div v-if="localValue.creacion.grupos && localValue.creacion.grupos.length">
                    <p><span class="text-diminished text-sm">Grupos: </span>
                        {{listar(localValue.creacion.grupos)}} 
                    </p>
                </div>
                <div v-if="localValue.creacion.equipos && localValue.creacion.equipos.length">
                    <p><span class="text-diminished text-sm">Equipos: </span>
                        {{listar(localValue.creacion.equipos)}} 
                    </p>
                </div>
                <div v-if="localValue.creacion.usuarios && localValue.creacion.usuarios.length">
                    <p><span class="text-diminished text-sm">Usuarios: </span>
                        {{listar(localValue.creacion.usuarios)}} 
                    </p>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const PERMISOS_POR_DEFECTO = {
    lectura: {
        heredado: true,
        publico: false,
        autenticados: false,
        delegados: true,
        muul: true
    },
    creacion: {
        heredado: true,
        publico: false,
        autenticados: false,
        delegados: false,
        muul: false
    }
}

export default {
    props: {
        value: {}
    },
    data() {
        return {
            localValue: {
                ...PERMISOS_POR_DEFECTO,
                ...this.value
            }
        }
    },
    /*
    computed: {
        localValueJSON() {
            return JSON.stringify(this.localValue)
        },
        valueJSON() {
            return JSON.stringify(this.value)
        }
    }, */    
    watch: {
        localValue(value) {
            this.$emit('input', this.localValue)
        },
        value(value) {
            this.localValue = value
        }
    },
    methods: {
        listar(arr) {
            const labels = arr.map(x=>x.titulo || x.nombre ||x.nombreSimbolico)
            return labels.join(', ')
        }
    }
}
</script>