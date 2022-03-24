<template>
    <Modal v-model="opened" :title="title">
        <div class="p-5">
            <div class="font-bold text-center mb-7" v-html="message"/>
            <div class="flex space-between space-x-4">
                <TButton variant="success" @click="confirm" class="w-1/2 text-center">{{ yes }}</TButton>
                <TButton variant="error" @click="cancel" class="w-1/2 text-center">{{ no }}</TButton>
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
            yes: 'Sí',
            no: 'No',
            confirmed: null,
            cancelled: null
        }
    },
    mounted() {
        this.$nuxt.$on('confirm', this.dialog)
    },
    methods: {
        confirm() {
            this.close()
            if(this.confirmed)
                this.confirmed()
        },
        cancel() {
            this.close()
             if(this.cancelled)
                this.cancelled()
        },
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
