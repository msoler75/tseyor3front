<template>
  <!-- must be placed inside DIV with relative or absolute position -->
  <div
    v-if="localValue"
    class="surface absolute right-0 rounded shadow text-base font-normal"
  >
    <div v-for="(item, index) of items" :key="index" class="px-2 py-2">
      <div class="cursor-pointer" @click="onClick(item)">
      {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import vmodel from "~/mixins/vmodel.js";
export default {
  mixins: [vmodel],
  props: {
    items: {},
  },
  watch: {
    localValue(newValue) {
      console.log("menucontextual localValue changed", newValue);
      if (newValue) {
        setTimeout(() => {
          document.body.addEventListener("click", this.handleOutclick);
          document.body.addEventListener("touch", this.handleOutclick);
        }, 200);
      } else {
          document.body.removeEventListener("click", this.handleOutclick)
          document.body.removeEventListener("touch", this.handleOutclick);
      }
    },
  },
  methods: {
    // comprueba si se ha pulsado fuera de este menú
    handleOutclick(ev) {
      console.log("handleOutclick");
      let elem = ev.target;
      for (; elem && elem != this.$el; elem = elem.parentNode);
      if (!elem) {
        console.log("clicked outside");
        this.localValue = false;
      }
    },
    onClick(item) {
      console.log(item)
      if(item.click)
        item.click(item)
      this.localValue = false
    }
  },
};
</script>