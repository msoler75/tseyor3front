<template>
  <div class="z-40"
  @touchstart="touchStart"
  @touchend="touchEnd"
  @touchmove="touchEnd">

    <!-- layout -->
    <fade-transition>
      <div
        v-if="showSidebar"
        class="ease-in-out transition duration-300 fixed top-0 left-0 z-40 w-screen h-screen backdrop-brightness-50 backdrop-filter backdrop-blur-sm"
        @click="showSidebar = false"
      ></div>
    </fade-transition>

    <aside
      ref="aside"
      class="md:text-xl select-none transform surface-0 bg-white dark:bg-gray-dark-800 shadow top-0 left-0 max-w-full fixed h-full overflow-y-auto ease-in-out transition-all duration-300 z-50 py-4"
      :class="showSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col w-full m-0 p-0 xm:w-40 md:w-52">
        <div
          v-for="item of menuitems"
          v-show="!item.hideInSidebar"
          :key="item.href"
          class="transition duration-200 hover:text-black hover:bg-orange-200 dark:hover:text-white dark:hover:bg-orange-900 text-gray-dark-700 dark:text-gray-300 cursor-pointer items-center tracking-normal"
          :class="item.sidebarClass || ''"
        >
          <span
            class="relative items-center leading-8 md:leading-10 inline-block py-1 px-4 shadow-sm w-full"
            @click="clickSideBar(item)"
          >
            <icon :icon="item.icon" :class="item.iconClass"/>
            {{ item.name || item.sidebarName }}
          </span>
          <div
            v-if="item.items"
            v-show="currentTab === item.href"
            class="xm:py-4 bg-gray-200 dark:bg-black xm:fixed xm:top-0 xm:bottom-0 xm:z-50 xm:flex xm:flex-col xm:justify-start xm:w-[28rem] lg:w-[50rem] xm:left-40 md:left-52 lg:p-7 lg:grid grid-gap-3 lg:grid-cols-2 lg:justify-start lg:items-center"
            style="grid-template-rows: repeat(auto-fill, minmax(70px, 1fr))"
          >
            <div
              v-for="elem of $store.getters.buildRoutes(item.items)"
              v-show="!elem.hideInSidebar"
              :key="elem.name"
              class="transition duration-200 hover:text-black hover:bg-orange-200 dark:hover:text-white dark:hover:bg-orange-900 text-gray-dark-700 dark:text-gray-300 cursor-pointer items-center tracking-normal"
            >
              <span class="relative items-center block">
                <NLink
                  @click.native="clickElem(elem)"
                  :to="elem.href"
                  class="inline-block py-1 px-4"
                >
                  <icon :icon="elem.icon" />
                  {{ elem.name }}
                </NLink>
              </span>
              <div
                v-if="elem.items"
                class="bg-gray-400 dark:bg-gray-dark-600"
              >
                <div
                  v-for="leaf of $store.getters.buildRoutes(elem.items)"
                  v-show="!leaf.hideInSidebar"
                  :key="leaf.name"
                  class="transition duration-200 hover:text-black dark:hover:text-white text-gray-dark-700 dark:text-gray-300 cursor-pointer items-center tracking-normal"
                >
                  <span class="relative items-center block py-1">
                    <NLink
                      @click.stop="clickElem(leaf)"
                      :to="leaf.href"
                      class="inline-block py-1 px-4"
                    >
                      <icon :icon="leaf.icon" />
                      {{ leaf.name }}
                    </NLink>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    items: {}
  },
  data() {
    return {
      showSidebar: this.value,
      currentTab: "",
      touchstartX: 0,
    };
  },
  computed: {
  menuitems() {
    const r = [...this.items]
    if(!this.$strapi.user)
      r.unshift(this.$store.getters.getRouteData("/ingresar"))
    return r
  }
  },
  watch: {
    showSidebar(value) {
      this.$emit("input", value);
      if (!value) this.currentTab = "";
    },
    value(value) {
      this.showSidebar = value;
    }
  },
  methods: {
    touchStart(event) {
      this.touchstartX = event.changedTouches[0].screenX
      console.log(this.touchstartX)
    },
    touchEnd(event) {
      const touchendX = event.changedTouches[0].screenX;
      if(touchendX + 50 < this.touchstartX)
        this.showSidebar = false
    },
    clickSideBar(item) {
      console.log('clickSideBar', item)
      this.currentTab = item.href;
      if(item.callback)
      {
        item.callback()
        this.showSidebar = false;
        // Event.stopPropagation()
      }
      else if (!item.items && item.href) {
        this.$router.push(item.href);
        this.showSidebar = false;
      }
    },
    clickElem(item) {
      console.warn('sidebar.clickElem', item)
      // this.currentTab = ""
      // this.$router.push(item.href);
      this.showSidebar = false;
      if(item.callback)
      {
        item.callback()
        // Event.stopPropagation()
      }
      else 
      this.$router.push(item.href)
    }
  }
};
</script>

<style scoped>
aside {
  @apply w-[24rem] xm:w-[28rem] md:w-[36rem] lg:w-[64rem];
}

aside >>> .svg-container,
aside >>> svg,
aside i {
  @apply inline-block !w-4 !h-4 mr-2 text-center text-light-blue-600 dark:text-blue-700;
}
</style>
