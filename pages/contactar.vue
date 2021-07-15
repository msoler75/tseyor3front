<template>
  <div class="max-w-full w-md mx-auto">
    <Card class="mb-4 sm:flex-row bg-transparent">
      <PForm class="flex-grow p-8 bg-white">
        <h1 class="text-xl text-center dark:text-gray-800">Contactar</h1>
        <div class="mb-4">
          <input v-model="nombre" type="text" placeholder="*Nombre" required />
        </div>
        <div class="mb-4">
          <input
            v-model="email"
            type="email"
            placeholder="*Correo electrónico"
            required
          />
        </div>
        <div class="mb-4">
          <InputCountry v-model="pais" placeholder="*País" required/>
        </div>
        <div class="mb-4">
          <input
            v-model="telefono"
            type="tel"
            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
            placeholder="Teléfono"
          />
        </div>
        <div class="mb-2">
          <textarea v-model="mensaje" placeholder="*Mensaje..." required/>
        </div>
        <div class="mb-6"><small>* campos obligatorios</small></div>
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Enviar
          </button>
        </div>
      </PForm>
      <div
        class="flex-grow p-8 bg-opacity-50 backdrop-blur-sm backdrop-filter bg-blue-900 text-blue-contrast flex justify-center items-center"
      >
        <div class="flex flex-col justify-evenly items-center">
          <div class="w-28 h-28 mb-6" v-html="mapSvg" />
          <p class="text-center text-lg mb-5">
            ¿Quieres encontrar Tseyor en tu zona?
          </p>
          <PLink to="/mapa" icon="fas fa-search" class="transition-all btn btn-error border-b-4 border-r-4">
            Buscar en mi Zona
          </PLink>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
// https://www.flaticon.com/free-icon/map_855003?term=map&page=1&position=18&page=1&position=18&related_id=855003&origin=search
import mapSvg from "~/assets/svg/map.svg?raw";
export default {
  data() {
    return {
      errorPwd: false,
      someError: false,
      errorMessage: "algun error",
      nombre: "",
      email: "",
      telefono: "",
      pais: "",
      mensaje: "",
      mapSvg,
    };
  }
};
</script>

<style scoped>
div >>> svg {
    stroke: white;
  }
</style>