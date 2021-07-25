<template>
<section class="relative">
  <Config :contained="false"/>

  <div class="fixed top-[48px] sm:top-[51px] md:top-[68px] lg:top-[72px] xl:top-[76px] left-0 w-screen h-screen" style="z-index:-1">
    <nuxt-img :src="cimage" width="100%" height="100%" fit="cover"/>
  </div> 

  <section class="h-32"/>
  <Card class="absolute right-1 mt-1 font-bold text-xs p-1 sm:p-4 sm:text-base bg-orange text-orange-contrast">Evento Pasado</Card>
  <div class="grid w-full">
    <div class="order-1 bg-red text-center flex justify-center items-center h-20 md:col-span-2 xl:col-span-1">
      <div
            class="p-5 font-bold text-white text-3xl lg:text-4xl"
          > 
            {{ $dayjs(evento.fechaInicio).format('D MMM YYYY') }}
          </div>
    </div>
    <div class="order-2 bg-red h-20 hidden xl:block xl:order-3"/>
    <Card class="rounded-none order-4 p-7 xl:order-2 xl:row-span-2">
      <h1>{{ctitle}}</h1>
      <Article class="text-justify" v-html="evento.texto"/>
    </Card>
    <div class="order-5 md:order-3 xl:order-4 flex justify-center items-start">
      <Card class="p-5 m-5 whitespace-nowrap text-gray-700 flex flex-wrap lg:flex-col">
        <p><icon icon="calendar-alt" class="mr-2 text-gray"/> 26 de enero</p>
        <p><icon icon="globe" class="mr-2 text-gray"/> evento online</p>
        <p><icon icon="hourglass" class="mr-2 text-gray"/> 3 días</p>
      </Card>
    </div>
  </div>
</section>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
export default {
  mixins: [vercontenidomixin],
  asyncData({ app, route }) {
    // const noticiasGuays = await $strapi.$noticias.find({ id: 1 })
    const id = parseInt(route.params.id);
    const contenido = {
      id,
      titulo: app.$lorem(1),
      imagen: "imagen" + ((id % 6) + 1) + ".jpg",
      texto: app.$lorem(-7),
      fechaInicio: (2021+Math.floor(Math.random()*2))+'/'+Math.ceil(Math.random()*12)+'/'+Math.ceil(Math.random()*28)
    };
    return { contenido, evento: contenido };
  },
};
</script>

<style scoped>
@screen md {
.grid {
    grid-template-columns: 1fr 2fr
  }
}
@screen lg {
  .grid {
    grid-template-columns: 1fr minmax(500px, 2fr)
  }
}
@screen xl {
  .grid {
    grid-template-columns: 3fr minmax(500px, 5fr) 2fr;
    grid-template-rows: 90px 1fr
  }
}
</style>