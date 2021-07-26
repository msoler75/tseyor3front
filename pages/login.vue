<template>
    <div class="w-full mx-auto max-w-xs">
  <Card class="mb-4">
      <PForm>
          <h1 class="text-xl text-center">Iniciar Sesión</h1>
    <div class="mb-4">
      <input id="username" v-model="useremail" type="text" placeholder="Nombre ó Correo electrónico" required>
    </div>
    <div class="mb-6">
      <input id="password" v-model="pwd" type="password" placeholder="Contraseña"
      :class="errorPwd?'border-red-500':''" required>
      <p class="text-red-500 text-xs italic"
      :class="someError?'visible':'invisible'">{{errorMessage}}</p>
    </div>
    <div class="flex items-center justify-between">
      <button @click="logIn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Entrar
      </button>
      <NLink to="/recuperacion" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
        He olvidado la contraseña
      </NLink>
    </div>
    <divider class="my-5" />
    <div class="flex justify-center">
        <p>¿No tienes cuenta?&nbsp;
         <NLink to="/registro" class="inline-block align-baseline font-bold text-blue-500 hover:text-blue-800" href="#">
        Registrarse
      </NLink>
        </p>
    </div>
    </PForm>
  </Card>
</div>
</template>

<script>
export default {
    data () {
        return {
            errorPwd: false,
            someError: false,
            errorMessage: 'algun error',
            useremail: '',
            pwd:''
        }
    },
    methods: {
      logIn() {
        this.$store.commit("setLoggedIn", true)
        this.$router.push("/")
      }
    }
}
</script>