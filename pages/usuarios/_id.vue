<template>
  <section class="flex justify-center">
    <Card class="max-w-lg p-2 sm:py-5 sm:px-7 text-center">
      <div class="my-4 mx-auto w-36 h-36 overflow-hidden rounded-full">
        <nuxt-img :src="cimage" class="w-full h-full" fit="cover" />
      </div>
      <h1>{{ ctitle }}</h1>
      <blockquote v-if="usuario.texto" class="mt-4 mb-7">
        <p>{{ ctext }}</p>
      </blockquote>
      <section>
        <a class="btn inline-block mx-auto" icon="fas fa-mail">Contactar</a>
      </section>
      <divider />
      <section>
        <h2>Roles</h2>
        <div class="px-6 pt-4 pb-2 mt-auto">
          <span
            v-for="rol of usuario.roles"
            :key="rol"
            class="inline-block bg-gray-200 dark:bg-gray-dark-700 text-gray-700 dark:text-gray-400 rounded-full px-3 py-1 text-sm mr-2 mb-2">
            {{ rol }}
          </span>
        </div>
      </section>
      <divider />
      <section>
        <h2>Equipos</h2>
        <div class="px-6 pt-4 pb-2 mt-auto">
          <span
            v-for="equipo of usuario.equipos"
            :key="equipo"
            class="inline-block bg-gray-200 dark:bg-gray-dark-700 text-gray-700 dark:text-gray-400 rounded-full px-3 py-1 text-sm mr-2 mb-2">
            {{ equipo }}
          </span>
        </div>
      </section>
      <divider />
      <section>
        <h2>Comentarios</h2>
        <li
          v-for="comentario of usuario.comentarios"
          :key="comentario"
          v-html="$teaser(comentario, 196)"
        />
      </section>
    </Card>
  </section>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
export default {
  mixins: [vercontenidomixin],
  asyncData({ app, route }) {
    const id = parseInt(route.params.id);
    const contenido = {
      id,
      nombre: app.$lorem(1, 1, 4),
      imagen: "usuario" + ((id % 7) + 1) + ".jpg",
      texto: app.$lorem(1),
      equipos: ["equipo 1", "equipo 2", "equipo 3"],
      roles: ['Muul Águila GTI', 'Delegado', 'Comisionado', 'Consejero'],
      comentarios: [app.$lorem(-3), app.$lorem(-5), app.$lorem(-1)],
    };
    return { contenido, usuario: contenido };
  },
  computed: {
    cimage() {
      return "/assets/images/usuarios/" + this.contenido.imagen;
    },
  },
};
</script>

<style scoped>
divider {
  @apply my-3;
}
.card >>> h2 {
  @apply text-lg text-center tracking-wide uppercase;
}
</style>