<template>
  <!-- must be placed inside DIV with relative or absolute position -->
  <Poppable
    v-model="localValue"
    ref="elem"
    class="
      surface
      bg-gray-100
      dark:gray-900
      rounded
      shadow
      text-base
      font-normal
      z-50
      opacity-100
      fixed
    "
    :style="cstyle"
  >
    <div
      v-for="(item, index) of items"
      :key="index"
      class="
        px-2
        py-2
        hover:opacity-100 hover:bg-white
        dark:hover:bg-black
        cursor-pointer
        opacity-90
      "
      @click.stop.prevent="onClick(item)"
    >
      <div class="flex items-center whitespace-nowrap" :class="item.class?item.class:''">
        <icon v-if="item.icon" :icon="item.icon" class="w-10" />
        <span>{{ item.label }}</span>
      </div>
    </div>
  </Poppable>
</template>

<script>
import vmodel from "~/mixins/vmodel.js";
export default {
  mixins: [vmodel],
  props: {
    items: {},
  },
  data() {
    return {
      left: 0,
      top: 0,
    };
  },
  methods: {
    onClick(item) {
      console.log(item);
      if (item.click) item.click(item);
      this.localValue = false;
    },
  },
  watch: {
    localValue(newValue) {
      if (newValue && typeof newValue == "object")
        this.$nextTick(() => {
          var wtop  = window.pageYOffset || document.documentElement.scrollTop
          console.log("contextMenu", this.localValue);
          console.log('wtop', wtop)
          const event = this.localValue;
          this.left = this.localValue.pageX;
          this.top = this.localValue.pageY;
          console.log('pageY', this.top)
          const menu = this.$el;
          // console.log("menu", menu);
          let menuHeight = menu.offsetHeight;
          let menuWidth = menu.offsetWidth;
          //console.log("mw", menu.offsetWidth);
          console.log("menuHeight", menuHeight);
          // compute menu position
          if (menuWidth + event.pageX >= window.innerWidth) {
            this.left = event.pageX - menuWidth;
          } else {
            this.left = event.pageX;
          }
          if (menuHeight + event.pageY - wtop >= window.innerHeight) {
            this.top = window.innerHeight +wtop- menuHeight - 5;
          } else {
            this.top = event.pageY;
          }
          this.top -= wtop
          console.log("=>top", this.top)
        });
    },
  },
  computed: {
    cstyle() {
      //const estimatedWidth = 200;
      //const estimatedHeight = this.items.length * 56;
      if (typeof this.localValue == "object") {
        return { left: `${this.left}px`, top: `${this.top}px` };
      }
      return {
        top: 0,
        right: 0,
      };
    },
  },
};
</script>