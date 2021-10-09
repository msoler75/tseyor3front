<template>
  <div class="w-full mx-auto max-w-xs mb-4">
    <Notification v-if="error" type="danger" :message="error" class="mb-5" />

    <Card>
      <form class="regular-form" method="post" @submit.prevent="login">
        <h1 class="text-xl text-center">Iniciar Sesión</h1>
        <div class="mb-4">
          <input
            id="username"
            v-model="email"
            type="email"
            placeholder="Correo electrónico"
            required
          />
        </div>
        <div class="mb-6">
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Contraseña"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Entrar
          </button>
          <NLink
            to="/recuperacion"
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            He olvidado la contraseña
          </NLink>
        </div>
        <divider class="my-5" />
        <div class="flex justify-center">
          <p>
            ¿No tienes cuenta?&nbsp;
            <NLink
              to="/registro"
              class="inline-block align-baseline font-bold text-blue-500 hover:text-blue-800"
              href="#"
            >
              Registrarse
            </NLink>
          </p>
        </div>
      </form>
    </Card>
  </div>
</template>

<script>
export default {
  middleware: "guest",
  data() {
    return {
      email: "",
      password: "",
      error: null
    };
  },
  methods: {
    async login() {
      this.error = null;
      try {
       /*await this.$auth.loginWith("local", {
          data: {
            identifier: this.email,
            password: this.password
          }
        })*/
        /*
         .then( async (response)=> {
          // this.$auth.setUser(response.data.user) // this data is ok
          console.log('response.data', response.data)
          const users = await this.$strapi.find("users", {id: response.data.user.id})
          this.$auth.setUser(users[0])
          this.$strapi.setUser(users[0])
          // console.log('desde', this.$route.query)
        })*/

         // https://github.com/Stun3R/nuxt-strapi-sdk/blob/master/examples/client/pages/auth/index.vue
         console.log('login', this.email, this.password)
         await this.$strapi.login({identifier: this.email, password: this.password})
        
        this.$router.push(this.$route.query.desde || "/")
        } catch (e) {
        console.error('login error:', e)
        this.error = e.response.data.message[0].messages[0].message;
      }
    }
  }
};
</script>
