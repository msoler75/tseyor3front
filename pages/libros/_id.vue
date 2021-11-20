<template>
  <div class="flex flex-col items-center" contained="no" breadcrumb="true">

    <div
      class="px-3 sm:px-5 md:px-7 relative w-full shrink-0 flex-grow-1 max-w-3xl flex flex-col items-start"
    >
      <div class="hidden 4xl:block absolute right-0 translate-x-3 5xl:translate-x-10 h-full"></div>

      <Card
        class="shadow-none xs:shadow py-4 px-2 sm:p-5 md:p-8 lg:p-12 w-full max-w-2xl mx-auto mb-14"
      >
        <section class="block xs:flex items-start">
          <div class="book-container my-4 mr-5 xs:my-0 xs:mr-7 lg:mr-20 flex-shrink-0 flex-grow-0">
            <div class="book">
              <nuxt-img :src="cimage" sizes="xs:40px sm:80px md:150px lg:200px" />
            </div>
          </div>
          <section class="flex-grow flex-shrink md:max-w-sm group-animate animate-appearing">
            <h1 class="break-all sm:break-normal">{{ ctitle }}</h1>
            <div class="hidden lg:block mt-4 text-justify" v-html="ctext" />
            <section class="mt-3 text-diminished text-xs">
              <span>{{ libro.edicionNumero }}ª edición</span>
              <span v-if="libro.edicionFecha">, {{ libro.edicionFecha }}</span>
              &nbsp;—&nbsp;
              <span>{{ libro.paginas }} páginas</span>
            </section>
            <section class="flex mt-7 justify-end !animate-none !opacity-100">
              <a download :href="libro.documento.url" class="btn btn-error motion-safe:animate-fadeInPulse !delay-1000">
                <icon icon="download" class="mr-2" />Descargar
              </a>
            </section>
          </section>
        </section>
        <section class="mt-4 text-justify lg:hidden " v-html="libro.descripcion" />
      </Card>
    </div>

    <section class="py-4 w-full mb-8 bg-opacity-80 bg-white dark:bg-transparent">
      <!-- share modal -->
      <Comparte v-model="viendoCompartir" />

      <SocialButtons
        id="social"
        :data="contenido"
        @like="like(contenido.id)"
        @dislike="dislike(contenido.id)"
        @share="viendoCompartir = true"
        class="mx-auto max-w-xl my-5 lg:my-16"
      />
    </section>

    <section class="container xs:px-1 sm:px-3 md:px-6 mx-auto my-12" v-observe-visibility="cargarRelacionados">
      <h2 class="text-center">Otros títulos...</h2>
      <HCarousel center :items="relacionados" :noText="true" collection="libros" />
    </section>

    <SuscriptionSection
      id="suscription"
      title="Biblioteca Tseyor"
      description="Todos los libros emanados de las conversaciones interdimensionales mantenidas con nuestros Guías Estelares disponibles para descarga en formato PDF"
      to="/novedades"
      image="/imagenes/libros.jpg"
      class="bg-blue-gray-900 w-full"
    />

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9 max-w-3xl" v-observe-visibility="(isVisible)=>{mostrarComentarios=mostrarComentarios||isVisible}">
      <h3 v-if="contenido.comentarios" class="text-center">
        {{
          contenido.comentarios +
            ' Comentario' +
            (contenido.comentarios !== 1 ? 's' : '')
        }}
      </h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <LazyComments :uid="uid" :content-title="ctitle" @count="$set(contenido, 'comentarios', $event)" class="px-1 xs:px-2" />
    </div>

    <portal to="contenido">
    <p>This slot content will be rendered wherever the portal-target with name 'destination'
      is  located.</p>
    </portal>
  </div>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ $strapi, route, $error }) {
    try {
      const id = route.params.id
      const libros = await $strapi.find(
        'libros',
        id.match(/^\d+$/) ? { id } : { slug: id }
      )
      if (!libros.length)
        return $error(404, 'Libro no encontrado')
      const contenido = libros[0]
      contenido.likes = await $strapi.find('likes', {
        uid: `/libros/${contenido.id}`
      })
      const categoria = contenido.etiquetas.length
        ? contenido.etiquetas[0].nombre
        : null
      const filtro = categoria ? { 'etiquetas.nombre': categoria } : {}
      return { filtro, contenido, libro: contenido }
    } catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      relacionados: []
    }
  },
  methods: {
     async cargarRelacionados(isVisible) {
      if(!this.relacionados.length&&isVisible) {
        this.relacionados = await this.$strapi.find('libros', { ...this.filtro, _limit: 10, id_ne: this.contenido.id })
      }
    }
  },

  jsonld () {
    return {
      '@context': 'http://schema.org',
      '@type': 'Book',
      bookFormat: "https://schema.org/EBook",
      fileFormat: "application/pdf",
      author: {
        "@type": "Organization",
        name: "Universidad TSEYOR de Granada"
      },
      copyrightYear: this.$dayjs(this.libro.edicionFecha).format("YYYY"),
      numberOfPages: this.libro.paginas,
      name: this.libro.titulo,
      version: this.libro.edicionNumero,
      image: this.libro.imagen.url,
      url: this.$config.baseUrl + (this.url || this.$route.fullPath),
      description: this.seodescription,
      inLanguage: "es-ES",
      genre: "Educational Materials",
      publisher: {
        "@type": "Organization",
        name: "Universidad TSEYOR de Granada",
        url: this.$config.baseUrl,
        logo: this.$config.baseUrl + this.$config.imageLogoPath 
      },
    }
  },
}
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
    content: " ";
    background: #fff;
    height: calc(300px - 2 * 3px);
    width: 50px;
    top: 3px;
    position: absolute;
    transform: translateZ(-3px) translateX(calc(200px - 50px / 2 - 3px))
      rotateY(90deg) translateX(calc(50px / 2));
  }

  .book::after {
    content: " ";
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

