<template>
    <div>
        <Btn @click="toast1" label="toast!"/>
        <Btn @click="update" label="update"/>
    </div>
</template>

<script>
export default {
    data() {
        return {toastId:null}
    },
    methods: {
        toast1(){ 
            this.toastId = this.$toast(`En progreso... 0%`, {
          icon: 'spinner',
          timeout: 99999999,
          pauseOnHover: false,
          closeOnClick: false,
          draggable: false,
          showCloseButtonOnHover: false,
          closeButton: false
        });

        },
        update() {
            this.$toast.update(this.toastId, {
              content: "¡Completado!",
            options: {
              type: 'success',
              icon: true,
              timeout: 2500,
            },
          });
        }
    }
}
</script>