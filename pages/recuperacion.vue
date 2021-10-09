<template>
  <div class="w-full mx-auto max-w-md mb-4">
    <h2 class="text-center">Recuperación de contraseña</h2>
    
    <Notification v-if="success" type="success" :message="success" :close="false" class="mb-5"/>
    
    <div class="max-w-xs mx-auto">

        <Notification v-if="error" type="danger" :message="error" class="mb-5" />

        <Card v-if="!success">
            <form method="post" @submit.prevent="forgotPassword" class="regular-form">
                <input
                    v-model="email"
                    type="email"
                    class="my-3"
                    name="email"
                    placeholder="Correo electrónico"
                    required
                />
                <button type="submit" class="btn w-full">
                Solicitar Cambio de Contraseña
                </button>
            </form>
        </Card>
    </div>
  </div>
</template>

<script>
import Notification from "~/components/Notification";

export default {
  middleware: "guest",
  components: {
    Notification
  },
  data() {
    return {
      email: "",
      success: null,
      error: null
    };
  },
  methods: {
    async forgotPassword() {
      try {
        this.error = null
        /* await this.$axios.post("auth/forgot-password", {
          email: this.email
        }); */
        await this.$strapi.forgotPassword({
          email: this.email
        }); 
        this.success = `Se te ha enviado un enlace a tu correo para que puedas crear una nueva contraseña.`;
      } catch (e) {
        this.error = e.response.data.message[0].messages[0].message;
      }
    }
  }
}
</script>
