<template>
  <div class="w-full mx-auto max-w-md mb-4">
          <h2 class="text-center">Cambiar Contraseña</h2>

          <Notification v-if="success" type="success" :message="success" :close="false" class="mb-5"/>

          <div class="w-full flex justify-center my-5" v-if="success">
              <NLink to="/login" class="btn">Proceder a Iniciar Sesión</NLink>
          </div>
          
          <div class="mx-auto max-w-xs">

          <Notification v-if="error" type="danger" :message="error" class="mb-5"/>

            <Card v-if="!success">
          <form  method="post" @submit.prevent="resetPassword" class="regular-form">
              <label class="label">Nueva Contraseña</label>
              <div class="control">
                <input
                  v-model="password1"
                  type="password"
                  class="input"
                  name="password"
                />
              </div>
            <div class="mt-4">
              <label class="label">Confirmar nueva contraseña</label>
              <div class="control">
                <input
                  v-model="password2"
                  type="password"
                  class="input"
                  name="password"
                />
              </div>
            </div>
              <button type="submit" class="btn w-full mt-3">
                Cambiar
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
  asyncData(context) {
    if (!context.route.query.code) 
        context.redirect("/recuperacion");
    else
      return {
        code: context.route.query.code
      };
  },
  data() {
    return {
      password1: "",
      password2: "",
      success: null,
      error: null
    };
  },
  methods: {
    async resetPassword() {
      this.error = null;
      if (this.password1 !== this.password2) {
        this.error = "Las contraseñas no coinciden.";
        return;
      }
      try {
        /* await this.$axios.post("auth/reset-password", {
          code: this.code,
          password: this.password1,
          passwordConfirmation: this.password2
        });*/
        await this.$strapì.resetPassword({
          code: this.code,
          password: this.password1,
          passwordConfirmation: this.password2
        })
        this.success =
          "Tu contraseña se ha actualizado. Ahora puedes iniciar sesión.";
      } catch (e) {
        this.error = e.response.data.message[0].messages[0].message;
      }
    }
  }
};
</script>
