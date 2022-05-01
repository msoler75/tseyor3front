<template>
    <Modal v-model="opened" :title="title">
        <div class="p-5">
            <div class="font-bold text-center mb-7" v-html="message"/>
            <div class="flex justify-center">
                <TButton @click="close" class="w-1/2 text-center">{{ accept }}</TButton>
            </div>
        </div>
    </Modal>
</template>

<script>
// https://javascript.plainenglish.io/building-a-dialog-modal-with-nuxt-and-promises-f382aed6cb10
export default {
    data() {
        return {
            title: '',
            message: '',
            opened: false,
            accept: 'Entendido',
        }
    },
    mounted() {
        this.$nuxt.$on('alert', this.dialog)
    },
    methods: {
        close() {
            this.opened = false;
        },
        dialog({ title, yes, no, message, open, confirmed, cancelled }) {
            this.opened = open
            if(!this.opened) return
            this.title = title
            this.message = message
            this.yes = yes || 'Sí'
            this.no = no || 'No'
            this.confirmed = confirmed
            this.cancelled = cancelled
        }
    }
}
</script>
