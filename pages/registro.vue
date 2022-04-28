<template>
  <div class="w-full mx-auto max-w-xs mb-4">
    
    <Notification type="success" :message="success" :close="false"/>
    <Notification type="danger" :message="error" :close="false"/>
    
    <Card v-if="!success">
      <form 
      class="regular-form"
      method="post" @submit.prevent="register">
        <h1 class="text-xl text-center">Registro</h1>
        <div class="mb-4">
          <label for="nombre">Nombre simbólico completo</label>
          <input
            id="nombre"
            type="text"
            v-model="nombreSimbolico"
            placeholder="Mi Nombre La Pm"
            required
          />
        </div>
        <div class="mb-4">
          <label for="correo">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            v-model="email"
            placeholder="mi@correo.com"
            required
          />
        </div>
        <div class="mb-6">
          <label for="pwd">Contraseña</label>
          <input
            id="pwd"
            type="password"
            v-model="password"
            placeholder="Contraseña"
            required
          />
          <div class="text-sm">
            Debe tener al menos 6 caracteres y un número
          </div>
          
        </div>
        <div class="">
          <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline btn text-lg"
          >
            <icon icon="sign-in-alt" class="mr-3" /> Registrarse
          </button>
        </div>

        <div class="text-center text-sm mt-9">
          <div>¿Ya dispones de cuenta? </div>
          <NLink class="block mt-1 font-bold text-blue-500 hover:text-blue-800" to="/ingresar">Entrar con mi cuenta</NLink>
        </div>

      </form>
    </Card>
  </div>
</template>

<script>
export default {
  middleware: "guest",
  // auth: 'guest',
  data() {
    return {
      nombreSimbolico: "",
      email: "",
      password: "",
      success: "",
      error: "",
    };
  },
  computed:{  
    username() {
      return this.nombreSimbolico.toLowerCase()
      .replace(/[ÀÁÂÃÄÅàáâãäå]/g,"a")
      .replace(/[ÈÉÊËèéëê]/g,"e")
      .replace(/[ÌÍÏÎìíïî]/g,"i")
      .replace(/[ÓÒÖÔóòöô]/g,"o")
      .replace(/[ÚÙÜÛúùüû]/g,"u")
      .replace(/\s+/g, ' ').replace(/^\s|\s$/g, '')
    }
  },
  methods: {
    async register() {
      // console.warn('register!!')
      this.error = null;
      try {
        await this.$strapi.register({
          username: this.username,
          email: this.email,
          password: this.password,
        })
        this.success = `Un correo de confirmación se ha mandado a tu correo. \
                        Por favor verifícalo para completar el proceso de registro.`;
      } catch (e) {
        this.error = e.response.data.message[0].messages[0].message;
      }

      return false
    },
  },
};
</script>

<style scoped>
label {
  @apply block my-1;
}
</style>