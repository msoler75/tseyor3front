<template>
  <div v-show="localValue">
    <slot />
  </div>
</template>

<script>
let mc_counter = 1;
let last_click_id = null;
import vmodel from "~/mixins/vmodel.js";
export default {
  mixins: [vmodel],
  props: {
    items: {},
  },
  watch: {
    localValue(newValue) {
      console.log("poppable localValue changed", newValue);
      if (newValue) {
        last_click_id = this.$el.id;
      } else if (this.$el.id != last_click_id) {
        last_click_id = 0;
      }
    },
  },
  mounted() {
    console.log('poppable mounted begin', this.$el)
    if (!this.$el.id) this.$el.id = "poppable---" + mc_counter++;
    document.body.addEventListener("click", this.handleOutclick);
    document.body.addEventListener("contextmenu", this.handleOutclick);
    console.log('poppable mounted end')
  },
  destroy() {
    document.body.removeEventListener("click", this.handleOutclick);
    document.body.removeEventListener("contextmenu", this.handleOutclick);
  },
  methods: {
    // comprueba si se ha pulsado fuera de este menú
    handleOutclick(ev) {
      console.log("handleOutclick");
      if (this.$el.id == last_click_id) last_click_id = 0;
      else this.localValue = false;
    },
  },
};
</script>