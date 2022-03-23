<template>
    <Modal v-model="open">
        Confirmacion
        <p>{{ message }}</p>

        <div class="modal-footer">
            <button class="button button--confirm" @click.stop="confirm">Confirm</button>
            <button class="button button--cancel" @click.stop="cancel">Cancel</button>
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
            open: false,
            resolver: () => null
        }
    },
    mounted() {
        this.$nuxt.$on('confirm', this.dialog)
    },
    methods: {
        confirm() {
            this.resolver(new Promise((resolve) => resolve('confirmed')))
            this.close()
        },
        cancel() {
            this.resolver(new Promise((resolve, reject) => reject(new Error('cancelled'))))
            this.close()
        },
        close() {
            this.open = false;
        },
        dialog({ title, message, open, resolver }) {
            console.log(title, message, open)
            this.title = title;
            this.message = message;
            this.open = open;
            this.resolver = resolver;
        }
    }
}
</script>
