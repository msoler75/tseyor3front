<template>
    <nav
        id="main-menu"
        v-show="!onlyContent"
        class="flex transition duration-200 font-serif z-30 w-full mx-auto bg-white dark:bg-gray-900 text-gray-blue-800 dark:text-gray-200 dark:hover:text-gray-50 shadow select-none sticky top-0"
        :class="navHidden ? '-translate-y-20' : ''"
        :submenu="localValue !== ''"
    >
        <icon
            v-show="localValue"
            icon="times"
            class="text-3xl absolute right-4 top-16 mt-2 z-50 p-1"
            @click="localValue = ''"
        />
        <div
            class="flex justify-between items-center xs:grid transition duration-200 w-full px-6 mx-auto border-gray-200 dark:border-gray-900"
            style="grid-template-columns: 1fr 110px 1fr"
        >
            <div class="flex items-center h-full justify-between">
                <div
                    class="md:hidden flex items-center text-2xl mr-8"
                    @click="$emit('showSideMenu')"
                >
                    <icon icon="bars" class="cursor-pointer" />
                </div>
                <ul class="h-full hidden sm:flex ml-auto list-none">
                    <li
                        v-for="item of menuIzquierdo"
                        :key="item.href"
                        :current="inPath(item.href)"
                        :active="localValue === item.href"
                        class="transition duration-200 menuitem hover:text-black dark:hover:text-white px-1 md:px-2 lg:px-3 cursor-pointer h-full border-b-4 border-blue-500"
                        :class="item.navClass"
                        @click="menuClick(item)"
                        @mouseover="menuHover(item)"
                        :href="item.href"
                    >
                        <div class="hidden lg:flex items-center text-sm tracking-normal h-full space-x-2">
                            <icon
                                v-if="!item.name || item.showIcon"
                                :icon="item.icon"
                                :class="item.iconClass"
                            />
                            <span>{{ item.name }}</span>
                            <div v-if="item.htmlAfter" v-html="item.htmlAfter" />
                        </div>
                        <div class="flex min-w-10 lg:hidden flex-col justify-center items-center text-sm tracking-normal h-full">
                            <icon
                                :icon="item.icon"
                                class="text-2xl h-7"
                                :class="item.iconClass"
                            />
                            <span class="hidden md:inline font-narrow font-thin text-xs tracking-tight uppercase">{{ item.narrowName || item.name }}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div
                class="z-10 hidden xs:block w-10 h-10 md:w-14 md:h-14 transition duration-300 hover:transform-gpu translate-y-1 scale-125 hover:scale-150 cursor-pointer mx-auto items-center p-0.5 bg-white border-white rounded-full mt-2 shadow"
                @click="menuClick({ href: '/' })"
                @mouseover="menuHover(null)"
                v-html="tseyorLogo"
            ></div>
            <div class="flex items-center h-full">
                <ul class="h-full hidden sm:flex list-none">
                    <li
                        v-for="item of menuDerecho"
                        :key="item.href"
                        :current="inPath(item.href)"
                        :active="localValue === item.href"
                        class="transition duration-200 menuitem hover:text-black dark:hover:text-white px-1 md:px-2 lg:px-3 cursor-pointer h-full border-b-4 border-blue-500"
                        :class="item.navClass"
                        @click="menuClick(item)"
                        @mouseover="menuHover(item)"
                        :href="item.href"
                    >
                        <div class="hidden lg:flex items-center text-sm tracking-normal h-full space-x-2">
                            <icon v-if="!item.name || item.showIcon" :icon="item.icon" />
                        <span>{{ item.name }}</span>
                        <div v-if="item.htmlAfter" v-html="item.htmlAfter" />
                        </div>
                        <div class="flex min-w-10 lg:hidden flex-col justify-center items-center text-sm tracking-normal h-full">
                            <icon
                                :icon="item.icon"
                                class="text-2xl h-7"
                                :class="item.iconClass"
                            />
                            <span class="hidden md:inline font-narrow font-thin text-xs tracking-tight uppercase">{{ item.narrowName || item.name }}</span>
                        </div>
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
                        <Avatar
                            :data="loggedInUser"
                            class="text-3xl w-8 h-8 cursor-pointer"
                            :to="false"
                            @click.native="mostrarMenuUsuario = !mostrarMenuUsuario"
                        />
                    </template>
                    <template v-else>
                        <div class="hidden xl:flex items-center text-sm font-sans">
                            <PLink
                                compact
                                to="/ingresar"
                                class="btn bg-light-blue dark:bg-blue-dark py-0.5 md:py-1 xl:py-2"
                                icon="fas fa-sign-in-alt"
                            >
                                <span>Ingresar</span>
                            </PLink>
                        </div>
                        <NLink
                            compact
                            to="/ingresar"
                            class="xl:hidden btn bg-light-blue dark:bg-blue-dark w-8 h-8 flex justify-center items-center p-2 rounded-full"
                        >
                            <icon icon="sign-in-alt" />
                        </NLink>
                    </template>
                </div>
            </div>
        </div>
        <!-- SUBMENU -->
        <nav
            id="submenu"
            class="absolute w-full hidden sm:block shadow text-gray-800 bg-gray-50 dark:bg-black dark:text-gray-100 text-sm overflow-y-auto lg:overflow-visible"
            style="max-height: calc(100vh - 72px); top:76px"
            @mouseleave="closeAllMenus"
        >
            <svg id="soft-svg">
                <path id="soft-active" :d="softPath" />
            </svg>
            <template v-for="item of rutasMenu">
                <div
                    v-show="localValue == item.href"
                    v-if="item.items"
                    :key="item.href"
                    class="flex p-4 justify-center"
                >
                    <div
                        class="mx-auto grid grid-flow-row max-w-6xl grid-cols-3 auto-rows-min gap-2"
                    >
                        <template
                            v-for="elem of $store.getters.buildRoutes(getAllDescendants(item.items))"
                        >
                            <NLink
                                :key="elem.href"
                                :to="elem.href"
                                class="group place-items-start flex w-full h-full p-2"
                                :class="elem.class"
                                @click.native="closeAllMenus"
                            >
                                <div
                                    class="icon w-11 flex-shrink-0 text-xl flex items-start justify-center transition duration-200 lg:opacity-60 group-hover:opacity-100 text-blue-600 dark:text-blue-300"
                                >
                                    <icon :icon="elem.icon" :class="elem.iconClass" />
                                </div>
                                <div>
                                    <div
                                        class="transition duration-200 text-md text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 font-medium mb-2"
                                    >{{ elem.name }}</div>
                                    <p
                                        class="hidden md:block transition duration-200 text-gray group-hover:text-gray-800 dark:group-hover:text-gray-100"
                                    >{{ elem.description }}</p>
                                </div>
                            </NLink>
                        </template>
                    </div>
                </div>
            </template>
        </nav>
    </nav>
</template>

<script>
import iconMoon from "~/assets/svg/icons/moon.svg?raw";
import iconSun from "~/assets/svg/icons/sun.svg?raw";
import tseyorLogo from "~/assets/svg/sello-tseyor.svg?raw";
import { mapGetters } from "vuex";
import vmodel from '~/mixins/vmodel.js'
export default {
    mixins: [vmodel],
    props: {
        rutasMenu: {}
    },
    data() {
        return {
            tseyorLogo,
            softPath: '',
        }
    },
    computed: {
        ...mapGetters(["isAuthenticated", "loggedInUser", "travelling", "pageConfig", "menuUsuario", "navHidden", "onlyContent"]),
        menuIzquierdo() {
            return this.rutasMenu.filter(x => x.left && !x.hideInNav)
        },
        menuDerecho() {
            return this.rutasMenu.filter(x => !x.left && !x.hideInNav)
        },
        iconMode() {
            return this.$colorMode.value === "light" ? iconSun : iconMoon;
        }
    },
    watch: {
        localValue(newValue) {
            this.updateSoftPath()
        },
    },
    methods: {
        getAllDescendants(items) {
            if (!items) return []
            let r = [...items]
            for (const item of items)
                r = r.concat(this.getAllDescendants(item.items))
            return r
        },
        menuHover(item) {
            if (item && item.items)
                this.menuClick(item)
            else {
                this.localValue = "";
            }
        },
        menuClick(item) {
            this.mostrarMenuUsuario = false
            this.localValue = "";
            if (!item) return
            if (item.callback)
                item.callback()
            else if (!item.items) {
                this.$router.push(item.href);
            } else {
                this.localValue = this.localValue === item.href ? "" : item.href;
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
                    for (const elem of this.$store.getters.buildRoutes(this.getAllDescendants(item.items))) {
                        if (elem.noCurrent) continue
                        if (path.startsWith(elem.href)) {
                            // console.log('path startsWith elem.href=', elem.href)
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        closeAllMenus() {
            this.menuClick(null)
            // this.localValue = ''
            // this.mostrarMenuUsuario = false
        },
        changeColorMode() {
            this.$colorMode.preference =
                this.$colorMode.value === "light" ? "dark" : "light";
        },
        updateSoftPath() {
            this.softPath = ''
            const cur = this.localValue
            if (!process.client || !cur)
                return
            const tab = document.querySelector(`#main-menu ul li[href='${cur}']`)
            if (tab) {
                const r = tab.getBoundingClientRect()
                const y = r.top + r.height - 38
                const x0 = r.left
                const x1 = r.left + r.width
                const w = 380 // ancho de apertura
                const h1 = 30  // alto de apertura
                const h2 = 20  // alto hacia abajo
                this.softPath = `M ${x0 - w} ${y + h2} L ${x0} ${y - h1} L ${x1} ${y - h1} L ${x1 + w} ${y + h2} Z`
            }
        },
    }
}
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
.dark nav#main-menu[submenu="true"] li[active="true"]:after {
  @apply bg-black;
}
.dark nav#main-menu:not([submenu="true"]) {
  border-bottom: 1px solid #111;
}

nav#submenu {
  box-shadow: 0 0.35em 0.3em rgba(0, 0, 0, 0.3);
}

/* menu bordes suaves */
#soft-svg {
  position: absolute;
  top: -38px;
  pointer-events: none;
  width: 100%;
  z-index: 900;
}
#soft-active {
  pointer-events: all;
  @apply text-gray-50 dark:text-black;
  /* color: red; */
  fill: currentColor;
}


@keyframes ray {
  from {
    transform: skew(-26deg, -35deg) translateY(-50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: skew(0, 0) translateY(-50%) scale(2);
    opacity: 1;
  }

  100% {
    opacity: 1;
    transform: skew(0, 0) scale(1);
  }
}

.ray:hover svg {
  animation: 1s ray;
  transform-origin: top right;
}
</style>