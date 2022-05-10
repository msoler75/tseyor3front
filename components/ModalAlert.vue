<template>
    <Modal v-model="opened" :title="title">
        <div class="p-5 xm:min-w-[300px]">
            <div class="font-bold text-center mb-7" v-html="message" />
            <div class="flex justify-center">
                <TButton @click="close" class="text-center">{{ accept }}</TButton>
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
            closed: null
        }
    },
    mounted() {
        this.$nuxt.$on('alert', this.dialog)
    },
    methods: {
        close() {
            this.opened = false
            if(this.closed) 
                this.closed()
        },
        dialog({ title, accept, message, open, closed }) {
            this.opened = open
            if (!this.opened) return
            this.title = title
            this.message = message
            this.accept = accept || this.accept
            this.closed = closed
        }
    }
}
</script>
