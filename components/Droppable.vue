<template>
  <div
    ref="main"
    @dragover.prevent
    @drop.prevent="drop"
    @dragster-enter="dragenter"
    @dragster-leave="dragleave"
    @dragstart="dragstart"
  >
    <slot />
  </div>
</template>

<script>
import { Dragster } from "@/assets/js/dragster";
import vmodel from "~/mixins/vmodel.js";
export default {
  mixins: [vmodel],
  props: {
    dropAllowed: { type: Boolean, required: false, default: false },
    onlyFiles: { type: Boolean, required: false, default: false },
  },
  data: () => ({
    // drag & drop
    dragster: null,
    fromHere: false,
  }),
  async mounted() {
    if (process.client) {
      const el = this.checkId(this.$refs.main);
      if (el) this.dragster = new Dragster(el);
    }
    this.localValue = false;
  },
  destroy() {
    if (this.dragster) this.dragster._destroy();
  },
  methods: {
    checkId(elem) {
      if (!elem) return null;
      if (!elem.id) elem.id = ("drop-" + Math.random()).replace(".", "-");
      return elem;
    },
    dragstart() {
      this.fromHere = true;
    },
    dragenter(e) {
      if (this.fromHere) return;
      if (this.onlyFiles && !this.anyFile(e)) return;
      this.localValue = true;
    },
    anyFile(e) {
      const items = e.detail
        ? e.detail.dataTransfer.items
        : e.dataTransfer.items;
      var someFile = false;
      for (const item of items) if (item.kind == "file") someFile = true;
      return someFile;
    },
    dragleave() {
      this.localValue = false;
    },
    drop(e) {
      this.localValue = false
      this.dragster.reset();
      var g = e.target;
      console.warn('DROP')
      console.log('el', this.dragster.el)
      console.log('g', g)
      while (g && g.id != this.dragster.el.id) {
        g = g.parentNode;
        console.log('g', g)
      }
      console.log("drop", g);
      if (g) {
        this.localValue = false;
        if (this.fromHere) {
          this.fromHere = false;
          return;
        }
        if (this.onlyFiles && !this.anyFile(e)) return;
        this.$emit("drop", e);
      }
    },
    /*dragFile(e) {
      this.files = e.dataTransfer.files;
      this.$emit("change", e)
    }*/
  },
};
</script>