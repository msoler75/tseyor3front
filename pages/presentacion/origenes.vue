<template>
  <client-only placeholder="..." class="">
    <section class="select-none h-carousel h-100 relative flex">
      <hooper
        ref="carousel"
        @slide="onSlide"
        class="w-full h-full mb-20"
        :settings="hooperSettings"
      >
        <slide
          v-for="(slide, idx) of slides"
          :key="idx"
          :index="idx"
          class="w-full h-full"
        >
          <div
            class="flex flex-col lg:flex-row w-full h-full justify-center items-center"
          >
            <Card
              v-html="formatHTML(slide.texto)"
              class="text-justify text-xs flex-shrink sm:text-sm md:text-base order-3 lg:order-1 lg:w-1/2 h-auto md:ml-2 p-2 lg:p-6 lg:mr-3 lg:ml-10 md:mr-7 xl:mr-10 lg:text-lg xl:text-xl"
            />
            <div class="w-full flex-grow lg:w-1/2 pb-7 max-h-1/2 lg:max-h-full lg:h-full order-2 pr-1 flex flex-col justify-center items-center lg:p-10">
                <img :src="'/images/presentaciones/historia/' + slide.imagen" alt="slide.imagen" class="max-w-full max-h-full mx-auto"/>
                <p class="text-xs md:text-sm lg:text-base text-center mt-3">{{slide.caption}}</p>
            </div>
          </div>
        </slide>
        <navigation slot="hooper-addons">
          <template #hooper-next>
            <div class="hover:bg-orange p-4 transition duration-200"
            :class="displayNext?'displayNext':''">
              <icon icon="chevron-right" title="Siguiente" />
            </div>
          </template>
          <template #hooper-prev>
            <div
              class="hover:bg-orange p-4 transition duration-200"
              v-show="currentSlide > 0"
            >
              <icon icon="chevron-left" title="Anterior" />
            </div>
          </template>
        </navigation>
      </hooper>
    </section>
  </client-only>
</template>

<script>
import { Hooper, Slide, Navigation } from "hooper";
import "hooper/dist/hooper.css";
export default {
  components: { Hooper, Slide, Navigation },
  async asyncData({ $content }) {
    // fetch our article here
    // const article = await $content('presentacion').fetch()
    const slides = [
      {
        imagen: 'sello.png',
        caption: 'El sello de Tseyor es un símbolo reconocido en toda la galaxia',
        texto: `
        Somos el grupo *TSEYOR*, un grupo de contacto extraterrestre con fines de divulgación y ayuda humanitaria a través de la *ONG Mundo Armónico Tseyor*.
        Hemos mantenido contacto por *más de 40* años con seres humanos vivos de diversos planetas de la galaxia.
        `
      },
      {
        imagen: 'melinus.jpg',
        caption: 'Melinus',
        texto: `
          El primer contacto fue hace más de 40 años, a través de una experiencia de hipnosis, con un ser llamado *Melinus*, de *Ganímedes*, quien tiene una apariencia humana.
          Melinus aprovechó durante unas sesiones de practicantes de hipnosis para *comunicarse telepáticamente* e invitó a los presentes a iniciar una ronda de conversaciones amistosas.
        `
      },
      {
        imagen: 'puente.jpg',
        caption: 'Nuestro amigo Josep - Puente',
        texto: `
          Nuestro amigo y hermano *Josep*, de Cataluña, España, estuvo presente en esas sesiones de conversación con *Melinus*.
          (Con el tiempo nuestro amigo recibiría la formación necesaria para ser hoy día el *canal de comunicación oficial* del grupo Tseyor)
        `
      },
      {
        imagen: 'confederacion.jpg',
        caption: 'La Confederación de Mundos Habitados de la Galaxia está formada por millones de seres humanos de la galaxia',
        texto: `
        *Melinus* se presentó como miembro de la *Confederación de Mundos Habitados de la Galaxia*, un conjunto de inteligencias del universo unidos con un propósito común de *ayuda humanitaria* en estos tiempos, que se anticipaban ya de un carácter trascendente.
        `
      },
      {
        imagen: 'avistamientos.png',
        caption: 'Fotografía tomada el 31 de Agosto de 1982',
        texto: `
          Nuestro hermano Josep, junto con otros hombres y mujeres, tuvieron en años sucesivos múltiples experiencias de *avistamientos de naves*, previa cita con los seres de las estrellas quienes determinaban un día, hora, y lugar, y aparecían con sus naves señalándoles que efectivamente *el contacto extraterrestre era auténtico*.
        `
      },
      {
        imagen: 'ostracita.jpg',
        caption: 'Ostracita, la viajera',
        texto: `
        Años más tarde, *Melinus* pasó el testigo a otra colega, de nombre *Ostracita*, psicóloga y también de Ganímedes, quien siguió las conversaciones con planteamientos muy enriquecedores para este pequeño grupo de hombres y mujeres.
        `
      },
       {
        imagen: 'silinur-olion.png',
        caption: 'Sili-Nur de Venus y Olión de Ganímedes',
        texto: `
        Ostracita daría paso a *Sili-Nur*, psicóloga transpersonal de *Venus*, quien siguió alimentando ese fuego de inquietudes, conversaciones e interés por otros mundos y otros pensamientos, que en el fondo era todo parte de un proceso regenerador espiritual de gran calado. 
        También se les presentaría a *Olión*, de Ganímedes, cuyos bisabuelos son de origen terrestre.
        `
      },
       {
        imagen: 'montserrat.jpg',
        caption: 'Vista estupenda de la montaña de Montserrat en Cataluña, España',
        texto: `
        Tras superar varias visicitudes, en el año 2001 la *Confederación* hizo una llamada a nuestro amigo *Josep*. Quien atravesaba por un momento de gran inquietud interior.
        Le citaron para que acudiera a la *mágica montaña de Montserrat*, en la noche a una hora y un lugar concretos. *Josep*, junto a su pareja *Marisa*, acudieron al encuentro.
        `
      },
       {
        imagen: 'nave.jpg',
        caption: 'Reconstrucción del momento del avistamiento en la explanada de Montserrat, en la medianoche del 8 junio de 2001',
        texto: `
        Dentro del coche, esperando el momento, *Marisa* recibió un mensaje telepático de *Olión*, para que reorientaran el vehículo.
        A la hora acordada, *una gran nave* apareció a pocos metros de distancia, flotando ligera como una pluma. Esto fue motivo de gran entusiasmo para ambos, especialmente para *Josep*.
        `
      },
       {
        imagen: 'puente-sala.jpg',
        caption: 'Sala y Puente en las presentes convivencias de Casa Tseyor de Barcelona 2020',
        texto: `
        A continuación la Confederación propuso a ambos seguir adelante y formar parte de un proyecto de cierta envergadura, que se reafirmaría en los años sucesivos. 
        Josep recibió más adelante su nombre espiritual *Puente*, y el reconocimiento como *Chac-Mool* de TSEYOR (mensajero entre los dos mundos).
        A su vez, Marisa recibió el nombre de *Sala* y ha sido y es un apoyo indispensable para todos.
        `
      },
       {
        imagen: 'entidades.png',
        caption: '',
        texto: `
        Junto a nuevos miembros del grupo crearon la *Asociación Tseyor Centro de Estudios Socioculturales*.
        Años más tarde se unieron muchas más personas y se creó la *Universidad Tseyor de Granada*, y posteriormente la *ONG Mundo Armónico Tseyor*.
        `
      },
       {
        imagen: 'convivencias.jpg',
        caption: 'Una de las muchas convivencias del grupo Tseyor, esta en concreto en Barcelona 2020',
        texto: `
        Y esa fue, a grandes rasgos, la creación del proyecto Tseyor desde sus comienzos.
        Hay muchas más historias que contar, pero que no cabrían en esta presentación, así que si te interesa las puedes conocer en nuestra web.
        `
      },
    ];
    return { slides };
  },
  data() {
    return {
      waitClick: null,
      displayNext: false,
      currentSlide: 0,
      hooperSettings: {
        wheelControl: true,
        centerMode: true,
        itemsToSlide: 1,
        itemsToShow: 1
      }
    };
  },
  mounted() {
    this.resetDisplayNext()
  },
  methods: {
    resetDisplayNext() {
      const that = this
      this.displayNext = false
      clearTimeout(this.waitClick)
      this.waitClick = setTimeout(function () {
        that.displayNext = true
      }, 5000)
    },
    onSlide(payload) {
      this.currentSlide = payload.currentSlide;
      this.resetDisplayNext()
    },
    formatHTML(str) {
      return str.split(/\n/g)
      .map(x=>x.replace(/^\s+|\s+$|\t/gm, ''))
      .filter(x=>x.length)
      .map(x=>'<p>'+x.replace(/\*(.*?)\*/g, '<strong>$1</strong>')+'</p>')
      .join('')
    }
  }
};
</script>

<style scoped>
.slide-btn {
  @apply absolute w-8 cursor-pointer h-full flex transition duration-200 justify-center items-center bg-white hover:bg-orange-100 hover:text-orange-900 dark:bg-black text-gray-300 dark:text-gray-600;
}
.h-carousel >>> svg {
  width: 100%;
  height: auto;
}
.card-img {
  width: 100%;
  height: 200px;
  overflow: hidden;
}
.h-carousel >>> .hooper-slide {
  min-height: 100%;
  height: auto;
}
.h-carousel >>> .hooper-next,
.h-carousel >>> .hooper-prev {
  padding: 0;
  margin-top: -2rem;
}
@screen lg {
  .h-carousel >>> .hooper-next {transform: translateX( 1.65rem)}
  .h-carousel >>> .hooper-prev {transform: translateX(-1.65rem)}
}
.h-carousel >>> .hooper-next.is-disabled,
.h-carousel >>> .hooper-prev.is-disabled {
  display: none;
}
.h-carousel >>> .hooper.is-vertical .hooper-track {
  height: unset;
}
.h-carousel >>> .hooper-slide {
  margin: 0rem;
}

.h-carousel >>> .hooper-next > div.displayNext {
  animation-duration: 1.2s;
  animation-name: bounce-4;
  animation-delay: 2s;
  animation-timing-function: ease;
  animation-iteration-count: infinite;
}

  @keyframes bounce-4 {
        0%   { transform: scale(1,1)    translateX(0); }
        30%  { transform: scale(1.3) translateX(-1rem); }
        100% { transform: scale(1,1)    translateX(0); }
    }

.h-carousel >>> .hooper {
  height: calc(100vh - 170px);
}

@media screen and (max-width: 1024px) {
  .h-carousel >>> .hooper {
  height: calc(100vh - 157px);
  }
}
@media screen and (max-width: 768px) {
  .h-carousel >>> .hooper-next,
  .h-carousel >>> .hooper-prev {
    top: 0;
    margin-top: 0;
  }
  .h-carousel >>> .hooper {
  height: calc(100vh - 137px);
}

}

@media screen and (max-width: 320px) {
.h-carousel >>> .hooper {
  height: calc(100vh - 113px);
  }
}

@media screen and (min-height: 300px) {
  .h-carousel {
    min-height: calc(100vh - 72px - 120px);
  }
}

</style>
