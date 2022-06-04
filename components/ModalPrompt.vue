<template>
    <Modal v-model="opened" :title="title">
        <form @submit.prevent="confirm" class="p-5 w-sm max-w-full">
            <div class="font-bold text-center mb-7" v-html="message"/>
            <div v-if="response.indexOf('\n')<0"><input type="text" v-model="response"></div>
            <div v-else><textarea rows="7" v-model="response"></textarea></div>
            <div class="mt-2 flex space-between space-x-4">
                <TButton variant="success" @click="confirm" class="w-1/2 text-center">{{ yes }}</TButton>
                <TButton variant="error" @click="cancel" class="w-1/2 text-center">{{ no }}</TButton>
            </div>
        </form>
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
            yes: 'Aceptar',
            no: 'Cancelar',
            accepted: null,
            cancelled: null,
            response: ''
        }
    },
    mounted() {
        this.$nuxt.$on('prompt', this.dialog)
    },
    methods: {
        confirm() {
            this.close()
            if(this.accepted)
                this.accepted(this.response)
        },
        cancel() {
            this.close()
             if(this.cancelled)
                this.cancelled()
        },
        close() {
            this.opened = false;
        },
        dialog({ title, yes, no, message, open, accepted, cancelled, response }) {
            this.opened = open
            if(!this.opened) return
            this.title = title
            this.message = message
            this.yes = yes || this.yes
            this.no = no || this.no
            this.accepted = accepted
            this.cancelled = cancelled
            this.response = response || (""+this.response)
        }
    }
}
</script>