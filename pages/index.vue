<template>
  <div class="max-w-xl mx-auto">

    <Config :breadcrumb="false" />

    <div v-if="$store.state.loggedIn" class="mx-auto max-w-sm mb-9">
      <div class="flex flex-col">
        <textarea rows="1" v-model="estado" ref="ta" class="mb-3 placeholder-gray resize-none" placeholder="Comparte tu pensamiento con el universo..."
        @focus="resizeTextarea" @keyup="resizeTextarea"
        />
        <button class="btn" @click="compartir">Compartir</button>
        </div>
    </div>

    <Grid class="grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5 xl:gap-7">
      <NLink v-for="item of items" :key="item.name" :to="item.url" :class="'flex w-full shadow rounded p-3 ' + (item.bg?item.bg:' card')">
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
export default {
  methods: {
    resizeTextarea() {
        const { ta } = this.$refs;
        ta.style.height = ta.scrollHeight + 1 + 'px';
    },
    compartir () {
      const { ta } = this.$refs;
      ta.value = ""
      this.$nextTick(() => {
        this.resizeTextarea()
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
          hero: true,
          bg: 'bg-amber-50',
          icon: 'fas fa-route',
          color: 'text-amber-800',
          name: 'Conocer Tseyor',
          description: 'Visita guiada para conocer Tseyor',
          url: '/presentacion/visita'
        },
        {
          icon: 'fas fa-bolt',
          color: 'text-red',
          name: 'Novedades',
          description: 'Noticias, blogs, eventos y otras publicaciones',
          url: '/novedades'
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
        {
          icon: 'far fa-comments',
          color: 'text-green-800 dark:text-green-50',
          name: 'Reuniones',
          description: 'Consulta tu agenda de reuniones',
          url: '/agenda?reuniones'
        }
      ]
    }
  }
}
</script>
