<template>
    <div class="input-datetime flex space-x-2">
        <input type="date" v-model="fecha" :required="required"/>
        <InputTime v-model="hora" :required="required"/>
    </div>
</template>

<script>
export default {
    props: {
        value:{},
        required: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            localValue: this.value,
            hora: this.value?this.value.substr(11,5):null,
            fecha: this.value?this.value.substr(0,10):null,
        }
    },
    watch: {
        fecha(fecha) {
            if(fecha)
                this.localValue =  fecha + 'T' + (this.hora || '00:00')
            else
                this.localValue = null
        },
        hora(hora) {
            if(this.fecha && hora)
                this.localValue = this.fecha + 'T' + hora
            else
                this.localValue = null
        },
        localValue(value) {
            this.$emit('input', value)
        },
        value(value) {
            this.localValue = value
        }
    }
}
</script>