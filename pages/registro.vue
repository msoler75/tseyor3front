<template>
    <div class="w-full mx-auto max-w-xs">
  <Card class="mb-4">
      <PForm>
          <h1 class="text-xl text-center">Registro</h1>
    <div class="mb-4">
      <label for="nombre">Nombre simbólico completo</label>
      <input id="nombre" type="text" v-model="nombre" placeholder="Mi Nombre La Pm" required>
    </div>
    <div class="mb-4">
      <label for="correo">Correo electrónico</label>
      <input id="correo" type="email" v-model="correo" placeholder="mi@correo.com" required>
    </div>
    <div class="mb-6">
      <label for="pwd">Contraseña</label>
      <input id="pwd" type="password" v-model="pwd" placeholder="Contraseña"
      :class="errorPwd?'border-red-500':''" required>
      <div class="text-sm">Debe tener al menos 6 caracteres y un número</div>
      <p class="text-red-500 text-xs italic"
      :class="someError?'visible':'invisible'">{{errorMessage}}</p>
    </div>
    <div class="">
      <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline btn text-lg">
      <i class="fas fa-sign-in-alt mr-3"/> Registrarse
      </button>
    </div>
    </PForm>
  </Card>
</div>
</template>

<script>
export default {
    data () {
        return {
            errorNombre: false,
            errorPwd: false,
            someError: false,
            errorMessage: 'algun error',
            nombre: '',
            correo: '',
            pwd: ''
        }
    }
}
</script>

<style scoped>
label {
  @apply block my-1;
}
</style>