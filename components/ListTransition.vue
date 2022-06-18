<template>
  <component
    :is="type"
    :tag="tag"    
    enter-active-class="fadeIn"
    :leave-active-class="
      destinationX && destinationY ? 'moveTarget' : 'fadeOut'
    "
    move-class="fade-move"
    v-bind="$attrs"
    v-on="hooks"
    :style="cssVars"
  >
    <slot></slot>
  </component>
</template>


<script>
// https://codesandbox.io/s/pk9r5j2257?from-embed=&file=/src/App.vue:676-682
export default {
  props: {
    duration: {
      type: Number,
      default: 300,
    },
    group: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: "div",
    },
    isFlexGrid: {
        type: Boolean,
        default: false
    },
    destinationX: {
      type: Number,
    },
    destinationY: {
      type: Number,
    },
  },
  computed: {
    type() {
      return this.group ? "transition-group" : "transition";
    },
    hooks() {
      return {
        beforeEnter: this.setDuration,
        afterEnter: this.cleanUpDuration,
        beforeLeave: this.setDuration,
        afterLeave: this.cleanUpDuration,
        leave: this.setAbsolutePosition,
        ...this.$listeners,
      };
    },    
    cssVars() {
      return {
        "--offsetX": this.destinationX + "px",
        "--offsetY": this.destinationY + "px",
      };
    },
  },
  methods: {
    setDuration(el) {
      el.style.animationDuration = `${this.duration}ms`;
    },
    cleanUpDuration(el) {
      el.style.animationDuration = "";
    },
    setAbsolutePosition(el) {
      if (this.group) { // &&this.destinationX&&this.destinationY) {
        //if(this.$el.style.display)
        if(this.isFlexGrid) {
            const r0 = this.$el.getBoundingClientRect();
            const rect = el.getBoundingClientRect();
            el.style.left = (rect.left - r0.left) + "px";
            el.style.top = (rect.top - r0.top) + "px";
            el.style.width = (rect.width) + "px";
            el.style.height = (rect.height) + "px";
        }
        el.style.position = "absolute";
      }
    },
  },
};
</script>
<style>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.fadeIn {
  animation-name: fadeIn;
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes moveTarget {
  from {
    opacity: 1;
    transform: scale(1) translate3D(0, 0, 0);
  }
  95% {
    opacity: 1;
    transform: scale(0.25) translate(var(--offsetX), var(--offsetY), 0);
  }
  100% {
    opacity: 0;
    transform: scale(0.25) translate(var(--offsetX), var(--offsetY), 0);
  }
}
.fadeOut {
  animation-name: fadeOut;
}
.moveTarget {
  animation-name: moveTarget;
}
.fade-move {
  transition: transform 0.3s ease-out;
}
</style>
