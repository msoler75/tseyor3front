<template>
    <div class="max-w-sm mx-auto" breadcrumb="no">
        <div class="mx-auto max-w-sm mb-9">
            <div class="flex flex-col">
                <textarea rows="1" v-model="estado" ref="statusMessage"
                    class="transition-all duration-100 mb-3 placeholder-gray resize-none"
                    placeholder="Comparte tu pensamiento con el universo..." @focus="resizeTextarea"
                    @keydown="resizeTextarea" />
                <button class="btn" @click="compartir">Compartir a la comunidad Tseyor</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    middleware: ['logged'],
    methods: {
        resizeTextarea() {
            const { statusMessage } = this.$refs;
            statusMessage.style.height = statusMessage.scrollHeight + 1 + 'px';
        },
        compartir() {
            const { statusMessage } = this.$refs;
            const that = this
            this.$nextTick(() => {
                that.resizeTextarea()
            })
            this.$strapi.create('publicaciones', {
                titulo: '.',
                texto: statusMessage.value,
                tipo: 'Personal'
            }).then(response => {
                if (!response.error) {
                    statusMessage.value = ""
                    this.$toast.success("¡Mensaje enviado!", {
                        position: "bottom-right",
                        timeout: 5000,
                        closeOnClick: true,
                        pauseOnFocusLoss: true,
                        pauseOnHover: true,
                        draggable: true,
                        draggablePercent: 0.6,
                        showCloseButtonOnHover: false,
                        hideProgressBar: true,
                        closeButton: "button",
                        icon: true,
                        rtl: false
                    });
                }
            })

        }
    },
}
</script>