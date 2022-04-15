<template>
  <div id="__main-container" class="surface-0 w-full font-sans"
    :class="(travelling ? 'travelling ' : 'in-page') + (pageConfig.background ? '' : 'no-background')">
    <!-- Navigation starts-->
    <NavTop v-model="currentTab" :rutasMenu="rutasMenu" ref="nav" @showSideMenu="showSideMenu" />

    <!-- User Menu -->
    <Card v-if="isAuthenticated" v-show="menuUsuario"
      class="py-3 px-5 w-52 fixed right-0 top-[48px] sm:top-[51px] md:top-[68px] lg:top-[72px] xl:top-[76px] z-40">
      <ul class="list-none">
        <li v-for="item of userMenuItems" :key="item.href">
          <NLink v-if="item.href" :to="item.href" class="block py-1">
            <icon v-if="item.icon" :icon="item.icon" class="!w-4 mr-3 text-gray" />
            {{ item.name }}
          </NLink>
          <div v-else-if="item.click" @click="item.click" class="cursor-pointer block py-1">
            <icon v-if="item.icon" :icon="item.icon" class="!w-4 mr-3 text-gray" />
            {{ item.name }}
          </div>
        </li>
        <li></li>
      </ul>
    </Card>
    <!-- Page title starts -->
    <!-- Navigation ends -->
    <div
      class="mt-5 mb-3 lg:mt-6 lg:mb-5 container xs:px-1 sm:px-3 md:px-6 mx-auto lg:flex-row items-start lg:items-center justify-between pb-4 border-gray-300 relative"
      @click="clickOff">
      <Breadcrumb :present="pageConfig.breadcrumb && !travelling" class="absolute text-xs xl:text-sm" />

      <h4 class="mt-2 text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
        <div v-if="false">{{ title }}</div>
      </h4>

      <!--
      <div class="mt-6 lg:mt-0">
        <button
          class="mx-2 my-2 bg-white transition duration-150 ease-in-out focus:outline-none hover:bg-gray-100 rounded text-indigo-700 px-6 py-2 text-sm "
        >
          Back
        </button>
        <button
          class="transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none border bg-indigo-700 rounded text-white px-8 py-2 text-sm "
        >
          Edit Profile
        </button>
      </div>
      -->
    </div>
    <!-- Page title ends -->
    <div @click="clickOff" :class="pageConfig.contained ? 'container xs:px-1 sm:px-3 md:px-6 mx-auto' : ''">
      <div class="w-full">
        <portal-target name="portal0"></portal-target>
        <!-- Place your content here -->
        <nuxt id="__content" class="mx-auto" :class="pageConfig.contained ? 'mb-5' : ''" ref="page" />
      </div>
    </div>
    <Sidebar v-show="!onlyContent" v-model="showSidebar" :items="rutasMenu" class="xl:hidden" />
    <Modal v-model="showBuscarPanel" class="sm:p-7 modal-busqueda">
      <Buscar @close="showBuscarPanel = false" />
    </Modal>
    <div class="spacer" />
    <Footer v-show="!onlyContent" class="mt-auto" :class="pageConfig.contained ? 'pt-9' : ''" />
    <Confirm />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import seo from '@/mixins/seo.js'
export default {
  // mixins: [seo],
  /* watch: {
    showSidebar: {
      immediate: true,
      handler(isOpen) {
        if (process.client) {
          if (isOpen) document.body.style.setProperty("overflow", "hidden");
          else document.body.style.removeProperty("overflow");
        }
      }
    }
  }, */
  watch: {
    loggedInUser(newValue) {
      this.actualizarUrlPerfil()
    },
  },
  // created()
  mounted() {
    this.actualizarUrlPerfil()
    // emulamos comportamiento de beforeEnter de transición de página
    this.$store.commit('travelling', false)
    this.$store.dispatch('beforeEnter', this.$refs['page'].$el)
    this.$store.commit('updateBreadcrumb')
    if (process.client) {
      window.addEventListener('scroll', this.handleScroll, { passive: true });
      window.addEventListener('keydown', this.handleKey);
    }
  },
  /* destroyed() {
    if (process.client)
      window.removeEventListener('scroll', this.handleScroll);
  }, */
  data() {
    return {
      showBuscarPanel: false,
      userMenuItems: [
        {
          icon: "fas fa-user",
          name: "Mi Perfil",
          href: null
        },
        {
          icon: "fas fa-envelope",
          name: "Suscripciones",
          href: '/suscripciones'
        },
        {
          icon: "fas fa-sign-out-alt",
          name: "Cerrar Sesión",
          click: () => {
            this.logout()
          }
        },
      ],
      lastY: 0,
      lastDy: 0,
      lastChangeY: 0,
      buscarPor: '',
      showSidebar: false,
      currentTab: "",
      menuitems: [
        /* { 
          left: true, 
          name: '',
          href: '/' 
        }, */
        {
          left: true,
          href: '/novedades',
          name: '',
          narrowName: 'Nuevo',
          navClass: 'ray',
          iconClass: '!text-yellow-800',
          sidebarName: 'Novedades',
          sidebarClass: 'order-2',
        },
        {
          left: true,
          href: "/publicaciones",
          sidebarClass: 'order-3',
          items: [
            {
              href: "/novedades",
              iconClass: '!text-yellow-800',
              noCurrent: true,
              hideInSidebar: true
            },
            "/noticias",
            "/comunicados",
            {
              noCurrent: true,
              href: "/libros",
            },
            "/blogs",
            "/boletines"
          ],
        },
        {
          left: true,
          href: "/recursos",
          navClass: 'xhidden xmd:flex',
          sidebarClass: 'order-3',
          items: [
            "/biblioteca",
            "/audios",
            "/libros",
            "/biblioteca/comunicados",
            {
              href: "/videos",
              iconClass: "text-red-400",
            },
            "/cuadernos",
            "/radio",
            "/muul",
            "/redes",
            {
              href: "/archivos",
              iconClass: "text-orange-300"
            },
            "/recopilaciones",
            "/reuniones",
            "/recursos/listados",
            "/usuarios",
            "/normativas",
            "/legal",
          ],
        },
        {
          left: true,
          // name:  'Participa',
          // description: 'Ahora puedes participar en las actividades del grupo',
          href: "/actividades",
          navClass: 'xhidden xlg:flex',
          sidebarClass: 'order-3',
          items: [
            "/agenda",
            "/eventos",
            "/equipos",
            "/meditar",
            {
              href: "/actividades/guia",
              class: "text-blue-800 shadow ring-2 ring-blue-500 bg-light-blue-50 dark:bg-blue-dark-900 dark:hover:bg-blue-dark-800 hover:bg-white dark:text-blue-100 dark:hover:text-blue-900",
            },
            "/leer",
            "/telegram-whatsapp",
            "/formularios/experiencias",
            "/muular",
          ],
        },
        {
          name: 'Quienes Somos',
          narrowName: 'Nosotros',
          href: "/presentacion",
          navClass: 'xhidden xlg:flex flex-shrink-0',
          sidebarClass: 'order-3',
          items: [
            "/presentacion/visita",
            "/guias-estelares",
            "/preguntas_frecuentes",
            "/mapa",
            {
              href: "/cursos",
              class: "text-yellow-900 shadow ring-2 ring-yellow-500 bg-yellow-200 hover:text-yellow-900 hover:bg-yellow-100 dark:text-orange-800 dark:hover:text-yellow-900",
            },
            {
              href: "/contactar",
              noCurrent: true,
            },
            "/ong",
            "/asociacion",
            "/universidad",
            "/comision",
            "/agora",
            "/organizacion",
          ]
        },
        {
          name: 'Ayuda',
          href: "/ayuda",
          sidebarClass: 'order-3',
          items: [
            "/contactar",
            "/pulsar",
            "/paltalk",
            "/donar",
          ],
        },
        {
          name: 'Buscar',
          href: "/buscar",
          showIcon: true,
          navClass: 'lg:ml-2 hover:text-black dark:hover:text-white',
          htmlAfter: "<div class='hidden 2xl:flex space-x-1 items-stretch'><div class='border border-gray flex justify-center items-center w-5 h-5 rounded-sm' style='font-size: 8px'>CTRL</div><div class='border border-gray mr-1 text-base flex items-center justify-center w-5 h-5 rounded-sm'>K</div></div>",
          sidebarName: 'Buscar',
          sidebarClass: 'order-1',
          callback: this.onBuscar
        }
      ],
      fraseBuscar: "Buscar...",
      // selección de tipo de búsqueda:
      xmlns: "http://www.w3.org/2000/svg",
      xlink: "http://www.w3.org/1999/xlink",
    };
  },
  head() {
    return {
      htmlAttrs: {
        lang: 'es-ES'
      },
      meta: [
        {
          hid: "utf8",
          charset: "utf-8",
        },
        {
          hid: 'viewport',
          name: 'viewport',
          content:
            "width=device-width, initial-scale=1, user-scalable=1, maximum-scale=2",
        },
      ]
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser", "travelling", "pageConfig", "menuUsuario", "navHidden", "onlyContent"]),
    rutasMenu() {
      return this.$store.getters.buildRoutes(this.menuitems)
    },
    title() {
      return (this.$ucFirst(this.$route.name) + " | TSEYOR").replace(
        /^Index.*/,
        "TSEYOR"
      );
    }
  },
  methods: {
    clickOff() {
      this.$refs.nav.closeAllMenus()
    },
    actualizarUrlPerfil() {
      let url
      if (!this.isAuthenticated) url = '/'
      else url = `/usuarios/${this.loggedInUser.id}`
      const menu = this.userMenuItems.find(x => x.icon === "fas fa-user")
      if (menu)
        menu.href = url
    },
    handleScroll(event) {
      const threshold = 120
      var y = window.scrollY
      const dy = y - this.lastY > 0 ? 1 : -1
      if (dy !== this.lastDy) {
        // direction changed
        this.lastChangeY = y
      }
      const distance = Math.abs(y - this.lastChangeY)
      if (this.pageConfig.focused) {
        if (dy > 0) {
          if (y > 400) {
            this.$store.commit('setNavHidden', true)
          }
        } else if (distance > threshold) {
          this.$store.commit('setNavHidden', false)
        }
      }
      this.lastDy = dy
      this.lastY = y
    },
    handleKey(e) {
      console.warn(e)
      if (e.key === 'k' && e.ctrlKey || e.metaKey) {
        e.preventDefault(); //prevent the default action (save page in this case)
        this.onBuscar()
      }
    },
    async logout() {
      // await this.$auth.logout()
      await this.$strapi.logout()
      this.$store.commit(
        "SET_USER",
        null
      );
      this.$router.push("/")
    },
    /* getIcon(path) {
      return this.$store.getters.getIcon(path);
    },
    getTitle() {
      console.log("layout.getTitle");
      const title = this.$store.getters.title;
      console.log("layout.getTitle title=", title);
      if (title) return title;
      console.log("layout.getTitle returning", this.$ucFirst(this.$route.name));
      return this.$ucFirst(this.$route.name);
    }, */
    showSideMenu() {
      this.showSidebar = true;
      this.currentTab = ""
      // this.mostrarMenuUsuario = false
      this.$store.commit('setMenuUsuario', false)
    },
    onBuscar() {
      this.showBuscarPanel = true
    }
  },
};
</script>


<style scoped>
.modal-busqueda {
  @apply items-start;
}
</style>


<style>
/* BASIC TEMPLATE LAYOUT */

html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
}

#__nuxt {
  min-height: 100%;
}

#__layout {
  height: 100%;
}

#__main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

#__content {
  height: auto;
}

.spacer {
  flex: 1;
}

.footer {
  height: 150px;
}



/*
html {
  background: blue;
}

body {
  background: cyan;
}

#__nuxt {
  background-image: linear-gradient(to bottom, #eff6ff 0%, #e883072a 100%);
}

#__layout {
  background: rgb(137, 10, 187);
}

#__main-container {
  background: red;
}

#__content {
  background: greenyellow;
}

.spacer {
  background: pink;
}

.footer {
  background-color: green;
}

.container {
  background: rgba(255, 0, 0, 0.33);
}
*/



#__layout {
  max-width: 100vw;
  /*display: flex;
  flex-direction: column;*/
  /*position: relative;
  z-index: 0;*/

  /* fondo */
  /* @apply bg-center bg-no-repeat bg-cover bg-fixed; */
  /* background-image: linear-gradient(to top, #dff0ff 0%, white 100%); */
  /* background-image: radial-gradient( circle farthest-corner at 50% 20%,  #e0f0ff 0%, #d9eaff 65%, #c7e0ff 80.5%, #fff0ef 100%); */
  background-image: linear-gradient(to bottom,
      #eff6ff 0%,
      #e8f0fa 65%,
      #c7e0ff 80.5%,
      #fff0ef 100%);
  background-attachment: fixed;
  background-size: cover;
}

html:not(.page-background) #__layout {
  background-image: linear-gradient(to bottom, #fff 0%, #fff 90%, #fff0ef 100%);
}

.dark #__layout {
  background-image: url(/imagenes/bg-dark.jpg);
}

html.dark:not(.page-background) #__layout {
  background-image: linear-gradient(to bottom, #11151d 0%, #000 100%);
}

.breadcrumb {
  transition: 0.6s opacity linear;
}

.breadcrumb:not([present]) {
  /* filter: blur(10px); */
  opacity: 0;
  pointer-events: none;
}

/* Transitions using the page hook */
.page-enter-active,
.page-leave-active {
  transition: all 0.5s ease-out;
}

.page-leave {
  opacity: 0;
}

.page-enter,
.page-leave-active {
  opacity: 0;
  transform-origin: 50% 50%;
}

/*
.flash {
  position: fixed;
  animation: flash 0.5s forwards;
  content: "";
  z-index: -1;
}

@keyframes flash {
  0% {
    transform: none;
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
*/
</style>