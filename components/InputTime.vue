<template>
    <div class="flex items-center bg-white pr-1 space-x-2">
        <select v-model="hora" v-on:keyup.esc="hora=labelHours">
            <option v-for="hora of horasList" :key="hora">{{ hora }}</option>
        </select>

        <select v-model="minutos" v-on:keyup.esc="minutos=labelMinutes">
            <option v-for="minuto of minutosList" :key="minuto">{{ minuto }}</option>
        </select>

        <icon icon="far fa-clock" class="text-black" />
    </div>
</template>

<script>
export default {
    props: {
        value: {required: true},
        labelHours: {default: 'hh'},
        labelMinutes: {default: 'mm'},
    },
    data() {
        var h = this.value?this.value.substr(3, 2):this.labelMinutes
        const r = {
            localValue: this.value && this.value.match(/^\d\d:\d\d$/)?this.value: null,
            horasList: [this.labelHours],
            minutosList: [this.labelMinutes, '00', '30'],
            hora: this.value?this.value.substr(0, 2):this.labelHours,
            minutos: h===this.labelMinutes?h:h < "30" ? "00" : "30"
        }
        for (var i = 0; i < 10; i++)
            r.horasList.push('0' + i)
        for (var i = 10; i < 24; i++)
            r.horasList.push(i)
        return r
    },
    watch: {
        hora(hora) {
            if(hora&&hora!==this.labelHours&&this.minutos&&this.minutos!==this.labelMinutes)
                this.localValue = hora + ':' + this.minutos
            else
                this.localValue = null
        },
        minutos(minuto){
            if(this.hora&&this.hora!==this.labelHours&&minuto&&minuto!==this.labelMinutes)
                this.localValue = this.hora + ':' + minuto
            else
                this.localValue = null
        },
        localValue(value) {
            this.$emit('input', value)
        },
        value(value) {
            this.localValue = value
            if(!this.hora||this.hora===this.labelHours) this.hora = this.localValue?this.localValue.substr(0, 2):this.labelHours
            var h = this.localValue?this.localValue.substr(3, 2):this.labelMinutes
            if(!this.minutos||this.minutos===this.labelMinutes) this.minutos = h===this.labelMinutes?h:h < "30" ? "00" : "30"
        }   
    }
}
</script>