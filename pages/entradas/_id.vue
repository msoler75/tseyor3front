<template>
  <div>
    <div class="block lg:flex justify-center xl:justify-end">
      <div
        class="w-full shrink-0 flex-grow-1 max-w-3xl flex flex-col items-end"
      >
        <Card class="p-4 md:p-6 xl:p-8">
          <h1 class="">{{ ctitle }}</h1>
          <!-- <nuxt-img :src="'./assets/images/' + entrada.imagen" /> -->
          <nuxt-img :src="cimage" />
          <article class="mt-4 text-justify" v-html="ctext" />
        </Card>
      </div>
      <!-- aside -->
      <Glass
        class="self-start py-9 mt-16 lg:mt-0 w-full lg:w-60 xl:w-96 shrink-0 lg:ml-6 xl:ml-10 px-1 xs:px-4 md:px-6 xl:px-8 flex-shrink-0"
      >
        <div class="flex justify-center mb-4">
          <nuxt-link
            :to="'/blogs/' + entrada.blog.id"
            class="max-w-full w-32 rounded-full overflow-hidden"
          >
            <nuxt-img
              :src="'./assets/images/' + entrada.blog.imagen"
              class="w-full block"
            />
          </nuxt-link>
        </div>
        <h2 class="text-center">{{ entrada.blog.nombre }}</h2>
        <div
          class="text-center mt-6 mb-7 text-diminished"
          v-html="entrada.blog.descripcion"
        />
        <divider />
        <!-- suscripción -->
        <h3>Suscríbete</h3>
        <Card class="my-2">
          <form class="p-4">
            <input type="email" placeholder="mi.direccion@correo..." /><br />
            <input type="submit" value="Suscribirme" />
          </form>
        </Card>
      </Glass>
    </div>

    <divider />
    <!-- contenido relacionado -->
    <h3>Y también...</h3>
    <div class="flex flex-wrap">
      <div
        v-for="item of entrada.relacionados"
        class="p-2 my-4 w-full md:w-2/4 lg:w-1/3 2xl:w-1/4"
        :key="item.id"
      >
        <Card :data="item" />
      </div>
    </div>
  </div>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
export default {
  mixins: [vercontenidomixin],
  asyncData ({ app, route }) {
    // const noticiasGuays = await $strapi.$noticias.find({ id: 1 })
    const id = parseInt(route.params.id)
    const relacionados = []
    
    for(var i=0;i<4;i++)
    {
      relacionados.push(
            {
              id: i + 1,
              clase: 'entradas',
              titulo: app.$lorem(1),
              imagen: 'imagen' + (((i + 1) % 6) + 1) + '.jpg'
            },
      )
    }

    const contenido = {
      id,
      clase: 'entradas',
      titulo: app.$lorem(1),
      imagen: 'imagen' + ((id % 6) + 1) + '.jpg',
      texto: app.$lorem(30),
      blog: {
        id: ((id * 3 + 5) % 3) + 1,
        nombre: 'blog ' + (((id * 3 + 5) % 3) + 1),
        imagen: 'imagen' + (((id * 3 + 5) % 3) + 1) + '.jpg',
        descripcion: app.$lorem(3),
        clase: 'blogs'
      },
      relacionados
    }
    return { contenido, entrada: contenido }
  }
}
</script>
