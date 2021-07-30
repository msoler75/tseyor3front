<template>
  <section class="flex justify-center">
    <Card class="max-w-lg p-2 sm:py-5 sm:px-7 text-center">
      <div class="my-4 mx-auto w-36 h-36 overflow-hidden rounded-full">
        <nuxt-img :src="cimage" class="w-full h-full" fit="cover" />
      </div>
      <h1>{{ ctitle }}</h1>
      <section v-if="centro.texto" class="mt-4 mb-7">
        <p>{{ ctext }}</p>
      </section>
      <section>
        <a class="btn inline-block mx-auto" icon="fas fa-mail">Contactar</a>
      </section>
      <divider />
      <section>
        <h2>Redes Sociales</h2>
      </section>
      <divider />
    </Card>
  </section>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
export default {
  mixins: [vercontenidomixin],
  asyncData({ app, route }) {
    const id = parseInt(route.params.id);
    const str = id % 4 === 0 ? "Muulasterio " : "Casa ";
    const contenido = {
      id,
      nombre: str + "Tseyor " + app.$lorem(1, 1, 3),
      imagen: "imagen" + ((id % 7) + 1) + ".jpg",
      texto: app.$lorem(1)
    };
    return { contenido, centro: contenido };
  },
  computed: {
    cimage() {
      return "/images/" + this.contenido.imagen;
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