<template>
  <div class="main-wrapper relative surface-0 w-full h-full flex-grow font-sans"
  :class="pageBackground?'':'no-background'"
  >

    <!-- Navigation starts -->
    <nav id="main-menu" 
    v-show="!hideMenus"
    class="flex transition duration-200 font-serif z-30 w-full mx-auto bg-white dark:bg-gray-900 text-gray-blue-800 dark:text-gray-200 dark:hover:text-gray-50  shadow select-none sticky top-0" 
    :class="hideTopNavMenu?'-translate-y-20':''"
    style="min-height:48px"
    :submenu="currentTab !== ''">
 <div
        class="flex justify-between items-center xs:grid transition duration-200 uppercase w-full px-6 mx-auto border-gray-200 dark:border-gray-900"
        style="grid-template-columns: 1fr 110px 1fr"
      >
        <div class="flex items-center h-full justify-between">
          <div class="xl:hidden flex items-center text-2xl"
            @click="showSideMenu">
              <icon icon="bars" class="cursor-pointer" />
          </div>
          <ul class="h-full hidden xl:flex ml-auto">
            <li
              v-for="item of menuIzquierdo"
              :key="item.href"
              :current="inPath(item.href)"
              :active="currentTab === item.href"
              class="transition duration-200 menuitem hover:text-black dark:hover:text-white px-3 cursor-pointer h-full flex items-center text-sm tracking-normal border-b-4 border-blue-500"
              @click="menuClick(item)"
              @mouseover="menuHover(item)"
            >
              <icon v-if="!item.name" :icon="item.icon" :class="item.iconClass"/> 
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="z-10 hidden xs:block w-10 h-10 md:w-14 md:h-14 transition duration-300 hover:transform-gpu translate-y-1 scale-125 hover:scale-150 cursor-pointer mx-auto items-center p-0.5 bg-white border-white rounded-full mt-2 shadow"
          @click="menuClick({ href: '/' })"
          @mouseover="menuHover(null)"
         v-html="tseyorLogo">
        </div>
        <div class="flex items-center h-full">
          <ul class="h-full hidden xl:flex">
            <li
              v-for="item of menuDerecho"
              v-show="!item.left"
              :key="item.href"
              :current="inPath(item.href)"
              :active="currentTab === item.href"
              class="transition duration-200 menuitem hover:text-black dark:hover:text-white px-3 cursor-pointer h-full flex items-center text-sm tracking-normal border-b-4 border-blue-500"
              @click="menuClick(item)"
              @mouseover="menuHover(item)"
            >
              <icon v-if="!item.name" :icon="item.icon" /> 
              {{ item.name }}
            </li>
          </ul>
          <div class="flex items-center ml-auto whitespace-nowrap">
            <div
              :title="
                $colorMode.value === 'light'
                  ? 'Cambiar a modo oscuro'
                  : 'Cambiar a modo claro'
              "
              @click="changeColorMode"
              class="w-8 md:w-12 p-0 md:p-1 transition duration-200 flex justify-center items-center rounded-full mr-3 xs:mr-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <div alt="theme-icon" v-html="iconMode" class="w-full" />
            </div>
            <template v-if="isAuthenticated">
              <Avatar :data="loggedInUser" class="text-3xl w-8 h-8 cursor-pointer"
              :to="false"
              @click.native="mostrarMenuUsuario=!mostrarMenuUsuario"/>
            </template>
            <template v-else>
              <div class="hidden md:flex items-center text-sm font-sans">
                <PLink compact to="/login" class="btn bg-light-blue dark:bg-blue-dark py-0.5 md:py-1 xl:py-2" icon="fas fa-sign-in-alt">
                <span class="hidden md:inline">Miembros</span></PLink>
              </div> 
              <NLink compact to="/login" class="md:hidden btn bg-light-blue dark:bg-blue-dark w-8 h-8 flex justify-center items-center p-2 rounded-full">
                <icon icon="sign-in-alt"/></NLink>
            </template>
          </div>
        </div>
      </div>
      <!-- SUBMENU -->
      <nav
        id="submenu"
        class="absolute w-full hidden xl:block shadow text-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-sm overflow-y-auto"
        style="max-height: calc(100vh - 72px); top:76px"
        @mouseleave="clickOff"
      >
        <template v-for="item of rutasMenu">
          <div
            v-show="currentTab == item.href"
            v-if="item.items"
            :key="item.href"
            class="flex p-4 justify-center"
          >
            <div class="mx-auto grid grid-flow-row max-w-6xl grid-cols-3 auto-rows-min gap-2">
              <template v-for="elem of $store.getters.buildRoutes(item.items)">
                <NLink
                  :key="elem.href"
                  :to="elem.href"
                  class="menu-subitem transition duration-200 place-items-center flex w-full h-full p-2 hover:bg-white dark:hover:bg-black"
                  :class="elem.class"
                  @click.native="clickOff"
                >
                  <div
                    :class="
                      'icon w-auto text-4xl flex justify-center transition-all duration-200 opacity-60 ' +
                      elem.bgIcon
                    "
                    style="min-width: 6rem"
                  >
                    <icon :icon="elem.icon" :class="elem.iconClass" />
                  </div>
                  <div class="title-right transition-all duration-200">
                    <div class="title transition duration-200 text-md">
                      {{ elem.name }}
                    </div>
                    <p class="description">
                      {{ elem.description }}
                    </p>
                  </div>
                </NLink>
                <template v-if="elem.items">
                  <template v-for="leaf of $store.getters.buildRoutes(elem.items)">
                    <NLink
                      :key="leaf.href"
                      :to="leaf.href"
                      :class="
                        'menu-subitem transition duration-200 place-items-center flex w-full h-full p-2 hover:bg-white dark:hover:bg-black ' +
                        leaf.bg
                      "
                      @click.native="clickOff"
                    >
                      <div
                        :class="
                          'icon w-auto text-4xl flex justify-center transition-all duration-200 opacity-60 ' +
                          leaf.bgIcon
                        "
                        style="min-width: 6rem"
                      >
                        <icon :icon="leaf.icon" />
                      </div>
                      <div class="title-right transition-all duration-200">
                        <div class="title transition duration-200 text-xl">
                          {{ leaf.name }}
                        </div>
                        <p
                          class="description"
                        >
                          {{ leaf.description }}
                        </p>
                      </div>
                    </NLink>
                  </template>
                </template>
              </template>
            </div>
          </div>
        </template>
        <!-- submenu de búsqueda -->
        <div
          v-show="currentTab == '/buscar'"
          class="w-full flex p-4 justify-center"
        >
          <div>
            <div class="relative text-gray-600 focus-within:text-gray-400">
                <SearchInput class="w-full max-w-xl mx-auto" 
                v-model="buscarPor"
                :placeholder="fraseBuscar"
                autocomplete="off"
              />
            </div>

            <div
              class="w-full mt-12 grid grid-flow-row grid-cols-3 auto-rows-min gap-2"
            >
              <div
                v-for="item of searchitems"
                :key="item.value"
                class="flex items-center transition duration-200 hover:bg-white dark:hover:bg-black pl-5 rounded"
              >
                <input
                  :id="'s-' + item.value"
                  type="radio"
                  name="category"
                  :checked="item.value == 'general'"
                  :value="item.value"
                  class="mr-5"
                  style="font-size: 10rem; transform: scale(2)"
                  @click="fraseBuscar = item.placeholder"
                />
                <label :for="'s-' + item.value">
                  <p class="strong text-lg">{{ item.name }}</p>
                  <p class="description text-gray">
                    {{ item.description }}
                  </p></label
                >
              </div>
            </div>
          </div>
        </div>
      </nav>
    </nav>

    <Card v-if="isAuthenticated"
    v-show="menuUsuario"
    class="py-3 px-5 w-52 fixed right-0">
      <ul class="list-none">
        <li v-for="item of userMenuItems" :key="item.href">
          <NLink v-if="item.href" :to="item.href" class="block py-1"><icon v-if="item.icon" :icon="item.icon" class="!w-4 mr-3 text-gray"/>{{item.name}}</NLink>
          <div v-else-if="item.click" @click="item.click" class="cursor-pointer block py-1"><icon v-if="item.icon" :icon="item.icon" class="!w-4 mr-3 text-gray"/>{{item.name}}</div>
        </li>
        <li></li>
      </ul>
    </Card>
    <!-- Page title starts -->
    <!-- Navigation ends -->
    <div
      class="mt-5 mb-3 lg:mt-6 lg:mb-5 container xs:px-1 sm:px-3 md:px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between pb-4 border-gray-300"
      @click="clickOff"
    >
      <div>
        <Breadcrumb v-if="pageBreadcrumb" class="text-xs xl:text-sm" />

        <h4 class="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
          <div v-if="false">
            {{ title }}
          </div>
        </h4>
      </div>
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
    <div @click="clickOff"
    :class="pageContained?'container xs:px-1 sm:px-3 md:px-6 mx-auto':''">
      <div class="w-full">
        <!-- Place your content here -->
        <nuxt class="mx-auto" 
        :class="pageContained?'mb-5':''" />
      </div>
    </div>
    <Sidebar v-show="!hideMenus" v-model="showSidebar" :items="rutasMenu" class="xl:hidden"/>
    <Footer 
    v-show="!hideMenus"
    class="mt-auto"
    :class="pageContained?'pt-9':''" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tseyorLogo from "~/assets/svg/sello-tseyor.svg?raw";
import iconMoon from "~/assets/svg/icons/moon.svg?raw";
import iconSun from "~/assets/svg/icons/sun.svg?raw";
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
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
    userLoggedIn(newValue){
      this.actualizarUrlPerfil()
    },
    mostrarMenuUsuario (newValue) {
      this.$store.commit('setMenuUsuario', newValue)
    }
  },
  mounted() {
    this.actualizarUrlPerfil()
  },
  data() {
    return {
      mostrarMenuUsuario: false,
      userMenuItems: [
        {
          icon: "fas fa-user",
          name: "Ver Perfil",
          href: null
        },
        {
          icon: "fas fa-sign-out-alt",
          name: "Cerrar Sesión",
          click: () => {
            this.logout()
          }
        },
      ],
      lastY : 0,
      lastDy: 0,
      lastChangeY: 0,
      hideTopNavMenu: false,
      buscarPor: '',
      showSidebar: false,
      currentTab: "",
      tseyorLogo,
      menuitems: [
        /* { 
          left: true, 
          name: '',
          href: '/' 
        }, */
        {left: true, 
          href:'/novedades',
          name:'',
          iconClass: '!text-yellow-800',
          sidebarName: 'Novedades',
          sidebarClass: 'order-2',
        },
        {
          left: true,
          // name:  'Novedades',
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
          sidebarClass: 'order-3',
          items: [
            "/biblioteca",
            "/audios",
            "/libros",
            "/biblioteca/comunicados",
            {
              href: "/videos",
              bgIcon: "red-on-hover",
            },
            "/cuadernos",
            "/radio",
            "/muul",
            "/redes",
            "/archivos",
            "/reuniones",
            "/recursos/listados",
            "/usuarios",
            "/normativas",
            "/legal",
          ],
        },
        {
          name:'Quienes Somos',
          href: "/presentacion",
          sidebarClass: 'order-3',
          items: [
            "/presentacion/visita",
             "/guias-estelares",
             "/preguntas_frecuentes",
             "/mapa",
            {
              href: "/cursos",
              class: "text-yellow-900 shadow ring-2 ring-yellow-500 bg-yellow-200 hover:text-yellow-900 hover:bg-yellow-100 dark:text-yellow-800 dark:hover:text-yellow-900",
            },
            {
              href: "/contactar",
              noCurrent: true,
            }
            ]
          },
        {
          left: true,
          // name:  'Participa',
          // description: 'Ahora puedes participar en las actividades del grupo',
          href: "/actividades",
          sidebarClass: 'order-3',
          items: [
            "/agenda",
            "/eventos",
            "/equipos",
            "/meditar",
            {
              href: "/actividades/guia",
              class: "text-blue-800 shadow ring-2 ring-blue-500 bg-light-blue-50 hover:bg-white dark:text-blue-100 dark:hover:text-blue-900",
            },
            "/leer",
            "/telegram-whatsapp",
            "/formularios/experiencias",
            "/muular",
          ],
        },
        {
          href: "/organizacion",
          sidebarClass: 'order-3',
          items: [
            "/ong",
            "/asociacion",
            "/universidad",
            "/comision",
             "/agora",
             "/organizacion",
          ],
        },
        {
          name:  'Ayuda',
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
          name: '',
          href: "/buscar",
          sidebarName: 'Buscar',
          sidebarClass: 'order-1',
          items: [], // para que se active el submenu
        },
      ],
      fraseBuscar: "Buscar...",
      // selección de tipo de búsqueda:
      searchitems: [
        {
          // icon: 'fas fa-search',
          // name:  'General',
          description: 'Buscar en toda la web',
          href: "/buscar",
          value: "general",
          placeholder: "Buscar...",
        },
        {
          // icon: 'fas fa-file-alt',
          // name:  'Comunicados',
          description:
            "Buscar un comunicado por número, título o palabras clave",
          value: "comunicados",
          placeholder: "Buscar por número o palabras clave...",
        },
        {
          // icon: 'fas fa-book',
          // name:  'Libros',
          description: 'Buscar libros por número, título o palabras clave',
          value: "libros",
          placeholder: "Buscar por título o palabras clave...",
        },
        {
          // icon: 'fas fa-comments',
          // name:  'Reuniones',
          description: 'Buscar en actas, órdenes del día, anexos',
          value: "reuniones",
          placeholder:
            "Buscar por fecha (ejemplo: 21-enero) o palabras clave...",
        },
        {
          // icon: 'fas fa-music',
          // name:  'Audios',
          description: 'Buscar audios de meditaciones, talleres, cuentos',
          value: "audios",
          placeholder: "Buscar por título o descripción del audio...",
        },
        {
          // icon: 'fas fa-sitemap',
          // name:  'Web',
          description: 'Buscar en páginas o secciones del sitio web',
          value: "web",
          placeholder: "Buscar por título o palabras clave...",
        },
      ],
      xmlns: "http://www.w3.org/2000/svg",
      xlink: "http://www.w3.org/1999/xlink",
    };
  },
  head() {
    return {
      meta: [
        {
          hid: "utf8",
          charset: "utf-8",
        },
        {
          hid: 'viewport',
          name:  'viewport',
          content:
            "width=device-width, initial-scale=1, user-scalable=1, maximum-scale=2",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["description", "image", "type", "isAuthenticated", "loggedInUser", "pageContained", "pageBackground", "pageBreadcrumb", "pageFocused", "menuUsuario", "hideMenus"]),
    iconMode() {
      return this.$colorMode.value === "light" ? iconSun : iconMoon;
    },
    title() {
      return ( this.$ucFirst(this.$route.name) + " | TSEYOR").replace(
        /^Index.*/,
        "TSEYOR"
      );
    },
    rutasMenu () {
      return this.$store.getters.buildRoutes(this.menuitems)
    },
    menuIzquierdo() {
      return this.rutasMenu.filter(x=>x.left)
    },
    menuDerecho() {
      return this.rutasMenu.filter(x=>!x.left)
    }
  },
  created () {
    if (process.client) 
    window.addEventListener('scroll', this.handleScroll, {passive: true});
  },
  destroyed () {
    if (process.client) 
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    actualizarUrlPerfil() {
      let url
      if(!this.isAuthenticated) url = '/'
      else url=`/usuarios/${this.loggedInUser.id}`
      const menu = this.userMenuItems.find(x=>x.icon==="fas fa-user")
      if(menu)
      menu.href=url
      },
    handleScroll (event) {
      const threshold = 120
      var y = window.scrollY
      const dy = y - this.lastY>0?1:-1
      if(dy!==this.lastDy) {
        // direction changed
        this.lastChangeY = y
      }
      const distance = Math.abs(y-this.lastChangeY)
      if(!this.pageFocused) 
        this.hideTopNavMenu = false
      else
      if(dy>0) {
        if(y>400)
        {
          this.hideTopNavMenu = true
        }
      } else if(distance>threshold) {
        this.hideTopNavMenu = false
      } 
      this.lastDy = dy
      this.lastY = y
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
    clickOff() {
       this.menuClick(null)
      // this.currentTab = ''
      // this.mostrarMenuUsuario = false
    },
    changeColorMode() {
      this.$colorMode.preference =
      this.$colorMode.value === "light" ? "dark" : "light";
    },
    getIcon(path) {
      return this.$store.getters.getIcon(path);
    },
    getTitle() {
      console.log("layout.getTitle");
      const title = this.$store.getters.title;
      console.log("layout.getTitle title=", title);
      if (title) return title;
      console.log("layout.getTitle returning", this.$ucFirst(this.$route.name));
      return this.$ucFirst(this.$route.name);
    },
    menuHover(item) {
      if(item && item.href!=='/novedades')
        this.menuClick(item)
      else {
        this.currentTab = "";
      }
    },
    menuClick(item) {
      this.mostrarMenuUsuario = false
      this.currentTab = "";
      if(!item) return
      if (!item.items) {
        this.$router.push(item.href);
      } else {
        this.currentTab = this.currentTab === item.href ? "" : item.href;
      }
    },
    inPath(url) {
      const path = this.$route.path;
      // console.log('inPath de', url, 'estando en path=', path)
      if (url === "/") return path === "/";
      if (url === path) return true
      for (const item of this.rutasMenu) {
        if (item.href !== url) {
          continue;
        }
        if (path.startsWith(item.href)) {
          return true;
        }
        if (item.items) {
          for (const elem of this.$store.getters.buildRoutes(item.items)) {
            if(elem.noCurrent) continue
            if (path.startsWith(elem.href)) {
              // console.log('path startsWith elem.href=', elem.href)
              return true;
            }
            if (elem.items) {
              for (const leaf of this.$store.getters.buildRoutes(elem.items)) {
                if(leaf.noCurrent) continue
                // console.log('path startsWith leaf.href=', leaf.href)
                if (path.startsWith(leaf.href)) {
                  return true;
                }
              }
            }
          }
        }
      }
      return false;
    },
    showSideMenu() {
      this.showSidebar = true;
      this.currentTab = ""
      this.mostrarMenuUsuario = false
    },
  },
};
</script>

<style scoped>

nav#main-menu li[current="true"].menuitem {
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}
nav#main-menu[submenu="true"] li[current="true"][active="true"],
nav#main-menu li:not([current="true"]).menuitem {
  border-color: transparent;
  position: relative;
}

nav#main-menu li:before,
nav#main-menu li:after {
  content: "";
  position: absolute;
  top: 8px;
  display: block;
  @apply bg-gray-50 transition-all duration-200;
  width: 200px;
  height: 100%;
  margin-bottom: -8px;
  z-index:1;
  pointer-events: none;
}

nav#main-menu li:before {
  left: -199px;
  clip-path: path('M0,70 C111,70 190,70 200,70 L200,70 Z');
}
nav#main-menu li:after {
  right: -199px;
  clip-path: path('M200,70 C89,70 10,70 0,70 L0,70 Z');
}

nav#main-menu[submenu="true"] li[active="true"]:before {
  clip-path: path('M0,70 C111,68 190,60 200,25 L200,70 Z');
  pointer-events: auto;
}
nav#main-menu[submenu="true"] li[active="true"]:after {
  clip-path: path('M200,70 C89,68 10,60 0,25 L0,70 Z');
  pointer-events: auto;
}



nav#main-menu:not([submenu="true"]) {
  border-bottom: 1px solid #aaa;
}
nav#main-menu[submenu="true"] {
  @apply bg-gray-300;
}
nav#main-menu[submenu="true"] li[active="true"].menuitem {
  @apply bg-gray-50;
}
.dark nav#main-menu[submenu="true"] {
  background: #333;
}
.dark nav#main-menu[submenu="true"] li[active="true"].menuitem,
.dark nav#main-menu[submenu="true"] li[active="true"]:before,
.dark nav#main-menu[submenu="true"] li[active="true"]:after
{
  @apply bg-gray-900;
}
.menu-subitem:hover {
  box-shadow: 0 0 10px 5px white;
}
.menu-subitem:hover .title-right {
  transform: translateX(0.2em);
}
.menu-subitem .icon {
  @apply text-blue-gray dark:text-blue-300;
}
.menu-subitem:hover .icon {
  @apply text-blue-500 dark:text-blue-600;
  transform: translateY(0em) scale(1.17);
}
.menu-subitem:hover .title {
  @apply text-blue-900;
}
.menu-subitem .description {
   @apply text-sm transition duration-200 text-gray
}
.menu-subitem:hover .description {
  @apply text-gray-dark-600;
}
.dark nav#main-menu:not([submenu="true"]) {
  border-bottom: 1px solid #111;
}
.dark .menu-subitem:hover {
  box-shadow: 0 0 10px 5px black;
}
.dark .menu-subitem:hover .icon {
  @apply text-blue-600;
}
.dark .menu-subitem:hover .title {
  @apply text-blue-300;
}
.dark .menu-subitem:hover .description {
  @apply text-gray-dark-300;
}
.menu-subitem:hover .red-on-hover {
  @apply text-red-900 opacity-100;
}
nav#submenu {
  box-shadow: 0 0.35em 0.3em rgba(0, 0, 0, 0.3);
}
/* nav#submenu >>> svg {
  width: 4rem;
  fill: currentColor;
  stroke: currentColor;
} */
</style>

<style>
#__layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-wrapper:before {
  content: "";
  @apply fixed left-0 top-0 w-screen h-screen bg-center bg-no-repeat bg-cover bg-fixed;
  z-index:-1;
  background-color:#f9fcff;
}
.dark .main-wrapper:before {
  background-color: black;
}

@screen sm {
  .main-wrapper:before {
    background-image: url(/imagenes/bg-light.jpg);
  }
  .dark .main-wrapper:before {
    background-image: url(/imagenes/bg-dark.jpg);
  }
}

.bg-dark-theme {
  @apply relative;
}
.bg-dark-theme:before {
  content: "";
  @apply absolute left-0 top-0 w-full h-full bg-black bg-top bg-no-repeat bg-cover bg-fixed;
  background-image: url(/imagenes/bg-dark.jpg);
  z-index:-1;
}

.main-wrapper.no-background:before {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=) !important;
}
/* .main-wrapper[obscure='true'] {
  opacity: 0.2;
}*/

</style>
