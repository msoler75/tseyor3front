<template>
    <Card center v-show="borradoresNum" class="w-full p-8 space-y-6">
        <span class="text-lg">Tienes <span class="bg-error text-white rounded-full px-2 mx-1">{{ borradoresNum
        }}</span> borrador{{ borradoresNum > 1 ? 'es' : '' }} pendiente{{ borradoresNum > 1 ? 's' : '' }}</span>
        <div class="flex justify-center">
            <NLink class="btn btn-error w-auto" to="/borradores">Ver Borradores</NLink>
        </div>

    </Card>
</template>

<script>
export default {
    props: {
        num: {}
    },
    computed: {
        borradoresNum() {
            return this.num !== null ? this.num : this.$store.getters.borradoresNum
        },
    }
}
</script>