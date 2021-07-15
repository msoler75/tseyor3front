<template>
<section class="relative">
  <section class="h-32"/>
  <Card class="absolute right-0 font-bold text-xs p-1 sm:p-4 sm:text-base bg-orange text-orange-contrast">Evento Pasado</Card>
  <div class="grid w-full">
    <div class="order-1 bg-red text-center flex justify-center items-center h-20 md:col-span-2 xl:col-span-1">
      <div
            class="p-5 font-bold text-white text-3xl lg:text-4xl"
          > 
            {{ $dayjs(evento.fechaInicio).format('D MMM YYYY') }}
          </div>
    </div>
    <div class="order-2 bg-red h-20 hidden xl:block xl:order-3"/>
    <Card class="order-4 p-7 xl:order-2 xl:row-span-2">
      <h1>{{ctitle}}</h1>
      <div v-html="evento.texto"></div>
    </Card>
    <div class="order-5 md:order-3 xl:order-4 flex justify-center items-start">
      <Card class="p-5 m-5 whitespace-nowrap text-gray-700 flex flex-wrap lg:flex-col">
        <p><i class="fas fa-calendar-alt mr-2 text-gray"/> 26 de enero</p>
        <p><i class="fas fa-globe mr-2 text-gray"/> evento online</p>
        <p><i class="fas fa-hourglass mr-2 text-gray"/> 3 días</p>
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