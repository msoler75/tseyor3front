<template>
  <div class="max-w-xl mx-auto" breadcrumb="no">

    <div v-if="$store.state.loggedIn" class="mx-auto max-w-sm mb-9">
      <div class="flex flex-col">
        <textarea rows="1" v-model="estado" ref="statusMessage" class="transition-all duration-100 mb-3 placeholder-gray resize-none" placeholder="Comparte tu pensamiento con el universo..."
        @focus="resizeTextarea" @keydown="resizeTextarea"
        />
        <button class="btn" @click="compartir">Compartir</button>
        </div>
    </div>

    <Grid class="grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5 xl:gap-7">
      <NLink v-for="item of secciones" :key="item.name" :to="item.url" class="card flex w-full shadow rounded p-3" :class="item.class">
        <div class="text-4xl w-16 sm:text-3xl sm:w-12 flex-shrink-0 flex justify-center items-center pr-4"
        :class="item.color">
          <icon :icon="item.icon" />
        </div>
        <div>
          <h3 class="mb-2 sm:text-base" :class="item.color">
            {{ item.name }}
          </h3>
          <p class="text-gray text-xs">
            {{ item.description }}
          </p>
        </div>
        <div class="text-lg flex justify-center items-center ml-auto pl-4 text-gray-300">
          <icon icon="chevron-right" />
        </div>
      </NLink>
    </Grid>
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  methods: {
    resizeTextarea() {
        const { statusMessage } = this.$refs;
        statusMessage.style.height = statusMessage.scrollHeight + 1 + 'px';
    },
    compartir () {
      const { statusMessage } = this.$refs;
      statusMessage.value = ""
      const that = this
      this.$nextTick(() => {
        that.resizeTextarea()
      })
      this.$toast.success("¡Pensamiento enviado!", {
        position: "bottom-right",
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: "button",
        icon: true,
        rtl: false
      });
    }
  },
  data () {
    return {
      estado: "",
      items: [
        {
          icon: 'fas fa-bolt',
          color: 'text-yellow-800',
          name: 'Novedades',
          description: 'Noticias, blogs, eventos y otras publicaciones',
          url: '/novedades'
        },
        {
          icon: 'far fa-calendar-alt',
          color: 'text-green-800 dark:text-green-50',
          name: 'Agenda',
          description: 'Consulta tu agenda de actividades y eventos',
          url: '/agenda'
        },
        {
          icon: 'fas fa-headphones',
          color: 'text-light-blue',
          name: 'Audios para meditar',
          description: 'Escucha nuestros audios con meditaciones guiadas',
          url: '/audios'
        },
        {
          icon: 'fas fa-broadcast-tower',
          color: 'text-pink-800 dark:text-pink-50',
          name: 'Radio Tseyor',
          description: 'Escucha la Radio Tseyor',
          url: '/radio'
        },
        {
          icon: 'fas fa-book',
          color: 'text-gray-dark-600 dark:text-gray-50',
          name: 'Leer',
          description: 'Inspírate y aprende con los mensajes de las estrellas',
          url: '/leer'
        },
        /* {
          hero: true,
          class: this.$store.state.loggedIn?'hidden':'bg-green-50',
          icon: 'fas fa-route',
          color: 'text-green-800',
          name: 'Conocer Tseyor',
          description: 'Visita guiada para conocer Tseyor',
          url: '/presentacion/visita'
        }, */
      ],

      // SEO:
      title: '',
      description: 'Portada de Tseyor',
      image: '/imagenes/sello.png'
    }
  },
  computed: {
    secciones() {
      return this.items
    }
  }
}
</script>
