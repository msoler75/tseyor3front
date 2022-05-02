<template>
  <div class="w-full mx-auto max-w-xs mb-4" breadcrumb="no">
    <Notification v-if="errors.message" type="danger" :message="errors.message" class="mb-5" />

    <Card>
      <form class="regular-form" method="post" @submit.prevent="login">
        <h1 class="text-xl text-center">Iniciar Sesión</h1>
        <div class="mb-4">
          <input id="username" v-model="email" type="email" placeholder="Correo electrónico" required />
        </div>
        <div class="mb-6">
          <InputPassword v-model="password" />
        </div>
        <div class="flex items-center justify-between">
          <Submit v-model="entrando">Ingresar</Submit>
          <NLink to="/recuperacion"
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">He olvidado
            la contraseña</NLink>
        </div>
        <divider class="my-5" />
        <div class="flex justify-center">
          <p>
            ¿No tienes cuenta?&nbsp;
            <NLink to="/registro" class="inline-block align-baseline font-bold text-blue-500 hover:text-blue-800"
              href="#">Registrarse</NLink>
          </p>
        </div>
      </form>
    </Card>
  </div>
</template>

<script>
import validation from "@/mixins/validation"
export default {
  mixins: [validation],
  middleware: "guest",
  data() {
    return {
      email: "",
      password: "",
      entrando: false,
    };
  },
  methods: {
    async login() {
      console.log('Logging...')
      this.error = null;
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
      // console.log('login', this.email, this.password)
      this.entrando = true
      this.$strapi.login({ identifier: this.email, password: this.password })
        .then(res => {
          console.warn('INGRESAR. RES', res)
          if (res.error)
          {
            this.setErr(res.error)
            this.entrando = false
          }
          else {
            localStorage.setItem('jwt', this.$strapi.token)
            // this.$strapi.setCookie("jwt", this.$strapi.token, 7)
            this.$router.push(this.$route.query.desde || "/")
          }
        })
        .catch(err => {
          this.entrando = false
          this.setErr(err)
          this.$alert(this.errors.message)
        })
    }
  }
};
</script>
