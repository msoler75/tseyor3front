<template>
  <div class="mt-5">

    <Config :contained="false"/>

    <div class="container px-1 sm:px-0 mx-auto flex w-full flex-wrap">
        <!-- <div class="mx-auto my-10 justify-center items-center lg:my-0 w-60 lg:w-5/12 px-5 order-1 lg:order-3 flex mb-7" v-html="doorImage"/> -->

        <Grid class="first-container mx-auto grid-cols-1">
            <div class="w-full h-full">
                <Card class="p-5 py-9 h-full">
                    <h1 class="text-center">Curso Holístico TSEYOR</h1>
                    <p class="mx-auto text-lg text-center">Curso gratuito que resume todo el mensaje del grupo TSEYOR, y que sirve de entrada para ser miembro y poder participar en sus actividades.</p>
                    <section class="mt-9 flex justify-center items-center">
                        <scrollactive
                            bezier-easing-value=".5,0,.35,1"
                            :duration="800"
                        >
                        <a href="#cursos" class="flex justify-center items-center rounded-xl px-7 py-4 scrollactive-item btn"><span>Ver Agenda de Cursos</span><icon icon="fas fa-chevron-right" class="ml-3 text-deep-orange text-xl"/></a>
                        </scrollactive>
                    </section>
                </Card>
            </div>

            <div class="w-full mx-auto">
                <div class="youtube-embed">
                    <iframe src="https://www.youtube.com/embed/AkOZbfGdXbU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""
                    class="youtube-video bg-black  
                    "/>
                </div>
            </div>

        </Grid>
    </div>

    <section class="px-1 sm:px-0 my-16">
        <Grid class="max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2 text-base sm:text-lg">
                <Card class="p-3 sm:p-7">
                <h3 class="text-blue-gray-800 font-bold text-center mb-4 uppercase">De las estrellas...</h3>
                <ul class="list-none mx-auto max-w-[480px] sm:max-w-[640px]">
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>La Confederación de Mundos</li>
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>El Cosmos holográfico</li>
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>El Error Atlante</li>
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>El Próximo Salto Cuántico</li>
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>El Rayo sincronizador</li>
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>Las futuras Sociedades armónicas</li>
                </ul>
                </Card>
                <Card class="p-3 sm:p-7">
                <h3 class="text-blue-gray-800 font-bold text-center mb-4 uppercase">Trabajo interior</h3>
                <ul class="list-none mx-auto max-w-[480px] sm:max-w-[640px]">
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>La Nave interdimensional Tseyor</li>
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>Perfeccionamiento del pensamiento</li>
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>Equilibrio, fluir y humildad</li>
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>Los Mundos paralelos</li>
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>La Unidad de Pensamiento</li>
                    <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>La Extrapolacion mental</li>
                </ul>
                </Card>
            </Grid>
    </section>

    <section class="px-1 sm:px-0 my-16">
        <Card class="w-full px-1 xm:px-4 sm:px-9 max-w-3xl mx-auto py-4 sm:py-7 md:py-9">
            <div class="block sm:flex">
                <Book3D class="mx-auto book-md md:book-lg lg:book-xl" src="/images/portadas/imagen1.jpg" image-sizes="xs:100vw xm:360px"/>
                <div class="sm:w-7/12 flex justify-center items-center text-center px-1 sm:px-4 md:px-7 lg:px-10 lg:text-xl">
                    <div class="py-4">
                        <h3 class="text-2xl mb-4">Libro del Curso</h3>
                        <p class="">Libro de lectura amena para la comprensión de la filosofía de Tseyor que llegó desde las estrellas.</p>
                        <p class="text-center mt-7"><PLink compact class="btn rounded-xl px-7 py-4 flex justify-center items-center" to="/libros/2"><span>Ver Libro</span><icon icon="fas fa-chevron-right" class="ml-6 text-deep-orange text-xl"/></PLink></p>
                    </div>
                </div>
            </div>
        </Card>
    </section>


    <section id="cursos" class="scrollactive-item mt-16 px-1 sm:px-3 py-10 bg-dark-theme">
      <div class="max-w-xl mx-auto">
        <div class="w-full flex justify-center my-4 text-white"><icon :svg="calendarIcon" class="w-32 mr-5"/></div>
        <h2 class="text-center text-white text-glow-dense">Próximos Cursos</h2>
        <div v-if="!cursosProximos.length" class="flex justify-center">
            <Card class="w-full max-w-lg rounded-xl p-5 text-center text-xl">
                <div><icon icon="far fa-frown" class="mr-2"/>Lo sentimos. No hay cursos programados.</div>
            </Card>
        </div>
        <div v-else class="cursos flex flex-col space-y-3 items-center">
            <Card
                v-for="curso of cursosProximos"
                :key="curso.id"
                class="w-full p-5 rounded-xl"
            >
                <section class="curso-grid grid grid-cols-1 xm:grid-cols-2 sm:grid-cols-3 sm:grid-flow-col-dense md:auto-cols-min grid-gap-3 text-center">
                <div class="xm:row-span-2 sm:row-span-1 flex justify-center items-center flex-shrink sm:mr-auto">
                    <div class="text-2xl font-bold xm:hidden mb-3">
                    {{ $dayjs(curso.fechaInicio).format("D MMM YYYY") }}
                    </div>
                    <div class="hidden xm:block flex-shrink">
                    <CalendarDay :date="curso.fechaInicio" />
                    </div>
                </div>
                <div
                    v-if="curso.online"
                    class="flex-grow flex flex-col justify-center items-center">
                    <span class="text-sm bg-green text-green-contrast px-2 mb-3 rounded-xl">online</span
                    >
                    <PLink :to="curso.sala" class="hidden sm:block whitespace-wrap">{{
                    curso.sala.title
                    }}</PLink>
                </div>
                <div
                    v-else
                    class="flex-grow flex flex-col justify-center items-center"
                >
                    <span class="text-sm bg-light-blue text-light-blue-contrast px-2 mb-3 rounded-xl">presencial</span>
                    <PLink :to="curso.lugar" class="hidden sm:block whitespace-wrap">{{
                    curso.lugar.title
                    }}</PLink>
                </div>
                <div class="flex items-center justify-end">
                    <PLink compact class="btn rounded-lg" :to="curso" icon="fas fa-info-circle"
                    >Saber Más</PLink
                    >
                </div>
                </section>
            </Card>
        </div>
        <div class="flex justify-center my-4">
            <NLink to="/cursos/archivo" class="text-glow-dense">Ver cursos anteriores</NLink>
        </div>
    </div>

    <div class="py-9 max-w-lg mx-auto mt-5">
        <h2 v-if="cursosProximos.length" class="text-center text-white text-glow-dense">¿No encuentras curso para ti?</h2>
        <divider class="my-3"/>
        <div class="pt-3 flex justify-center items-center">
            <PForm class="w-full border-2 border-white p-4 sm:p-16 rounded-lg">
                <p class="text-center mb-5">Danos tus datos y te avisaremos cuando se realice un nuevo curso.</p>
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
                    <textarea v-model="mensaje" placeholder="Comentarios..."/>
                </div>
                <div class="mb-6 text-diminished"><small>* campos obligatorios</small></div>
                <div class="w-full flex items-center justify-between">
                    <button
                        class="text-lg transition duration-150 w-full text-center btn font-bold py-4 px-4 rounded-xl focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        <icon icon="check" class="mr-4 text-deep-orange md:text-xl xl:text-2xl"/><span class="sm:text-xl">Quiero Hacer el Curso</span>
                    </button>
                </div>
            </PForm>
        </div>
    </div>
    </section>

<!--
    <section class="my-16">
        <div class="flex justify-center w-full"> 
            <iframe width="560" height="315" src="https://www.youtube.com/embed/AkOZbfGdXbU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="">
            </iframe>
        </div>
    </section>
-->

  </div>
</template>

<script>
//import doorImage from "~/assets/svg/door-space.svg?raw";
import calendarIcon from "~/assets/svg/icons/calendar.svg?raw";
export default {
  asyncData({ app }) {
    const cursos = [];
    for (let i = 1; i < 14; i++) {
      cursos.push({
        id: i,
        clase: "cursos",
        // imagen: "imagen" + ((i % 8) + 1) + ".jpg",
        // titulo: app.$lorem(1, 7, 14),
        descripcion: app.$lorem(3),
        online: i % 4 != 1,
        sala: {
          id: i,
          clase: "salas",
          title: "Sala Paltalk " + app.$lorem(1, 1, 3),
        },
        lugar: {
          id: i,
          clase: "centros",
          title: "Casa Tseyor " + app.$lorem(1, 1, 2),
        },
        fechaInicio:
          2017 +
          Math.floor(Math.random() * 5) +
          "/" +
          Math.ceil(Math.random() * 12) +
          "/" +
          Math.ceil(Math.random() * 28),
      });
    }
    // eventos.sort((a,b)=>app.$dayjs(b.fechaInicio).diff(app.$dayjs(a.fechaInicio)))
    return { cursos };
  },
  data() {
      return {
        // doorImage,
        calendarIcon,
        // form
        errorPwd: false,
        someError: false,
        errorMessage: "algun error",
        nombre: "",
        email: "",
        telefono: "",
        pais: "",
        mensaje: "",
      }
  },
  computed: {
    cursosProximos() {
        // return []
      const now = this.$dayjs();
      return this.cursos
        .filter((x) => this.$dayjs(x.fechaInicio).isAfter(now))
        .sort((a, b) =>
          this.$dayjs(a.fechaInicio).diff(this.$dayjs(b.fechaInicio))
        );
    },
    cursosPasados() {
      const now = this.$dayjs();
      return this.cursos
        .filter((x) => !this.$dayjs(x.fechaInicio).isAfter(now))
        .sort((a, b) =>
          this.$dayjs(b.fechaInicio).diff(this.$dayjs(a.fechaInicio))
        );
    },
  },
};
</script>

<style scoped>
@screen sm {
  .curso-grid {
    grid-template-columns: 1fr 2fr 2fr;
  }
}
.youtube-embed {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
}
.youtube-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
@screen xl {
    .first-container {
        grid-template-columns: .9fr 1fr;
    }
}
</style>