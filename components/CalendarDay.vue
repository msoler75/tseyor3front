<template>
    <div class="w-20 self-start flex-shrink-0 flex flex-col text-center rounded-md shadow overflow-hidden capitalize">
        <div class="text-lg bg-red text-white">{{d.format("MMM")}}</div>
        <div class="text-3xl font-bold bg-white text-black">{{d.format("D")}}</div>
        <div v-if="year===true || (year==='auto' && !$dayjs().format('YYYY')!== d.format('YYYY'))" 
        class="bg-gray-100 text-gray-700 dark:text-gray dark:bg-gray-800 border-t border-gray-200 text-sm">{{d.format("YYYY")}}</div>
    </div>
</template>

<script>
export default {
    props: {
        date: {
            type: String,
            required: true
        },
        year: {
            type: Boolean | String,
            required: false,
            default: 'auto'
        }
    },
    computed:{
        d() {
            return this.$dayjs(this.date)
        }
    }
}
</script>