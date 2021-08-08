<template>
<div>
  <Card class="p-2 sm:p-5 md:p-8 lg:p-12 w-full max-w-2xl mx-auto">
      <section class="block xs:flex items-start">
          <div class="book-container my-4 mx-auto xs:my-0 xs:mr-4 lg:mr-20 flex-shrink-0 flex-grow-0">
            <div class="book">
        <nuxt-img
          :src="cimage"
          sizes="xs:40px sm:80px md:150px lg:200px"
        />
        </div>
        </div>
        <section class="flex-shrink md:max-w-sm">
          <h1 class="break-all sm:break-normal">{{ ctitle }}</h1>
          <div class="hidden lg:block mt-4 text-justify" v-html="ctext"/>
          <section class="mt-3 text-diminished text-xs">
            <span> {{libro.edicionNumero}}ª edición</span><span v-if="libro.edicionFecha">, {{libro.edicionFecha}}</span>
            &nbsp;—&nbsp;
            <span>{{libro.paginas}} páginas</span> 
          </section>
          <section class="flex mt-7 justify-end">
              <a download :href="libro.documento.url"
              class="btn btn-error"><icon icon="download" class="mr-2"/>Descargar</a>
          </section>
        </section>
      </section>
      <section class="lg:hidden mt-4 text-justify" v-html="libro.descripcion"/>
  </Card>
  <divider/>
  <section>
    <h2>Y además...</h2>
    <HCarousel center
    :items="relacionados"
    :noText="true"
   />
  </section>
  <section>
    ...
  </section>
</div>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
export default {
  mixins: [vercontenidomixin],
  async asyncData({ app, $strapi, route, redirect }) {
    const id = route.params.id
    const libros = await $strapi.find('libros', id.match(/\d+/)?{id}:{slug:id})
    // const noticiasGuays = await $strapi.$noticias.find({ id: 1 })
    const contenido = libros[0]
    const categoria = contenido.etiquetas.length?contenido.etiquetas[0].nombre:null
    const filtro = categoria?{'etiquetas.nombre':categoria}:{}
    const relacionados = await $strapi.find('libros', {...filtro, _limit: 8})
    return { contenido, libro: contenido, relacionados: relacionados.map(x=>{return{...x,clase:'libros'}}) };
  },
};
</script>

<style scoped>
@media screen and (min-width: 1024px) {

.book-container {
  width: 200px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 400px;
}

.book {
  transform: rotateY(-30deg);
  position: relative;
  transform-style: preserve-3d;
  width: 200px;
  height: 300px;
  transition: transform 1s ease;
  animation: 1s ease 0s 1 initAnimation;
}

.book:hover {
  transform: rotate(0deg);
}

@keyframes initAnimation {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(-30deg);
  }
}

.book > :first-child {
  position: absolute;
  background: #0d47a1aa;
  width: 200px;
  height: 300px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 5px 5px 20px #666;
}

.book::before {
  content: ' ';
  background: #fff;
  height: calc(300px - 2 * 3px);
  width: 50px;
  top: 3px;
  position: absolute;
  transform: translateZ(-3px) translateX(calc(200px - 50px / 2 - 3px)) rotateY(90deg) translateX(calc(50px / 2))
}

.book::after {
  content: ' ';
  position: absolute;
  left: 0;
  width: 200px;
  height: 300px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  background: #01060f;
  transform: translateZ(-50px);
  box-shadow: -10px 0 50px 10px #666;
}
}
</style>