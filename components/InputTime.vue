<template>
    <div class="flex items-center bg-white pr-1 space-x-2">
        <select v-model="hora">
            <option v-for="hora of horasList" :key="hora">{{ hora }}</option>
        </select>

        <select v-model="minutos">
            <option v-for="minuto of minutosList" :key="minuto">{{ minuto }}</option>
        </select>

        <icon icon="far fa-clock" class="text-black" />
    </div>
</template>

<script>
export default {
    props: {
        value: {}
    },
    data() {
        const r = {
            localValue: this.value,
            horasList: [],
            minutosList: ['00', '30']
        }
        for (var i = 0; i < 10; i++)
            r.horasList.push('0' + i)
        for (var i = 10; i < 24; i++)
            r.horasList.push(i)
        return r
    },
    computed: {
        hora: {
            get() {
                return this.localValue.substr(0, 2)
            },
            set(hora) {
                return this.localValue = hora + ':' + this.minutos
            }
        },
        minutos: {
            get() {
                var h = this.localValue.substr(3, 2)
                return h < "30" ? "00" : "30"
            },
            set(minuto) {
                return this.localValue = this.hora + ':' + minuto
            }
        }
    },
    watch: {
        localValue(value) {
            this.$emit('input', value)
        },
        value(value) {
            this.localValue = value
        }
    }
}
</script>