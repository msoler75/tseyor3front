<template>
<div class="flex flex-col items-center">

  <!-- Sin padding -->
  <!-- No tiene imagen de fondo -->
  <Config :contained="false" :background="false"/>

  <!-- article container -->
  <div class="px-3 sm:px-5 md:px-7 relative w-full shrink-0 flex-grow-1 max-w-3xl flex flex-col items-start">

    <scrollactive
        bezier-easing-value=".5,0,.35,1"
        :duration="800"
        :offset="90"
    >

    <div class="hidden 4xl:block absolute right-0 translate-x-3 5xl:translate-x-10 h-full">
      <aside class="sticky top-32 mb-6 text-xs 5xl:text-sm flex flex-col">
          <div class="my-3"><icon class="5xl:w-4" icon="far fa-heart" /> {{entrada.likes}}</div>
          <a class="scrollactive-item my-3" href="#comentarios"><icon class="5xl:w-4" icon="far fa-comment" /> {{entrada.comentarios}}</a>
          <div><icon class="my-3 5xl:w-4" icon="fas fa-share-alt" /></div>
      </aside>
    </div>

    <!-- article wrapper -->
    <section>

      <!-- article heading -->
      <h1 class="">{{ ctitle }}</h1>
      
      <div class="w-full flex mb-5 items-center justify-start text-xs sm:text-sm">
        <span><icon icon="far fa-calendar-alt"/> 17-may</span>
        <div class="ml-8 hidden sm:block">
          <span class="capitalize"><icon icon="far fa-user"/> {{entrada.blog.nombre}}</span>
          <a href="#blog-info" class="ml-2 scrollactive-item rounded-full py-.5 px-2 text-xs bg-blue-400 text-blue-contrast">Seguir</a>
        </div>

        <div class="4xl:hidden flex ml-auto">
          <div><icon class="ml-3" icon="far fa-heart" />  {{entrada.likes}}</div>
          <a class="scrollactive-item ml-3" href="#comentarios"><icon icon="far fa-comment" /> {{entrada.comentarios}}</a>
          <div><icon class="ml-3" icon="fas fa-share-alt" /></div>
        </div>

      </div>
      

      <!-- <nuxt-img :src="'./images/' + entrada.imagen" /> -->
      <nuxt-img :src="cimage" />

      <!-- article content -->
      <Article class="my-9 text-justify" v-html="$md.render(ctext)" />
    </section>

    </scrollactive>

  </div>

  <!-- blog info -->
  <section id="blog-info" class="bg-blue-gray-900 w-full mt-6 py-9 lg:mt-0 px-1 sm:px-6 md:px-10">
    <div class="max-w-3xl mx-auto flex justify-center items-center sm:justify-between flex-wrap">
      <div class="mx-auto flex flex-col justify-center items-center sm:w-1/2 lg:w-1/3">
        <div class="flex justify-center mb-4">
          <nuxt-link
            :to="'/blogs/' + entrada.blog.id"
            class="max-w-full w-32 rounded-full overflow-hidden"
          >
            <nuxt-img
              :src="'./images/' + entrada.blog.imagen"
              class="w-full block"
            />
          </nuxt-link>
        </div>
        <h2 class="text-gray-100 text-2xl text-center">{{ entrada.blog.nombre }}</h2>
      </div>
      <div
        class="text-gray-400 px-2 xs:px-5 sm:w-1/2 lg:w-1/3 text-center mt-6 mb-7 md:mt-0 text-diminished"
        v-html="entrada.blog.descripcion"
      />
      <div class="flex justify-center items-center sm:mx-auto lg:w-1/3">
        <button class="btn">Suscríbete</button>
      </div>
    </div>
  </section>


<section class="my-7">
  <ShareNetwork
      network="twitter"
      :url="$config.baseUrl+$route.fullPath"
      title="Os comparto esta información..."
      description="desc"
      hashtags="tseyor,blogs"
      twitterUser="alondra"
      class="bg-light-blue"
    >
       <i class="fab fah fa-lg fa-facebook"></i>
    <span>Compartir on Twitter</span>
  </ShareNetwork>

</section>


  <!-- contenido relacionado -->
  <div class="container mx-auto my-9">
    <h3 class="text-center">Y también...</h3>
    <HCarousel center
    :items="entrada.relacionados"
    />
  </div>


  <!-- comentarios -->
  <div id="comentarios" class="container mx-auto my-9">
    <h3 v-if="entrada.comentarios" class="text-center">{{entrada.comentarios}} Comentarios</h3>
    <h3 v-else class="text-center">Coméntalo</h3>
    <Comentarios :uid="'entrada-'+id" class="px-1 xs:px-2"/>
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
  
  for(var i=0;i<9;i++)
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
    texto: '# titulo\n\n' + app.$lorem(-15).replace(/<p>/g, '\n').replace(/<\/p>/g, ''),
    comentarios: Math.round(Math.random()*33),
    likes: Math.round(Math.random()*77),
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
