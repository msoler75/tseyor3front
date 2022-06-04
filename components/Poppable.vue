<template>
    <div v-show="localValue">
        <slot />
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
      console.log("poppable localValue changed", newValue);
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
  mounted() {
    // if(!this.$el.id)
    // this.$el.id = ("mc-"+Math.random()).replace(".", "-")
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
  }
}
</script>