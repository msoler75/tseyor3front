<template>
  <div class="tabs mb-4 flex flex-wrap select-none uppercase text-sm md:tracking-wide lg:tracking-wider xl:tracking-widest font-sans"
  :class="compact?'compact':'normal'">
    <div
      v-for="(label, index) of labels"
      :key="label"
      class="tab"
      @click="currentTab = typeof index === 'string' ? index : getLabel(label)"
      :class="
        tabClass +
          (index === currentTab || getLabel(label) === currentTab ? ' active' : '') +
          (group === true || group==='auto'? ' auto-group' : (group==='fixed'?' fixed-group':''))
      "
    >
      <Icon v-if="label.icon" :icon="label.icon" class="mr-1"/> 
      {{ $ucFirst(getLabel(label)) }}
    </div>
  </div>
</template>

<script>
// custom.vmodel.mixin.js
export default {
  props: {
    value: {},
    labels: {
      type: Array | Object,
      required: true
    },
    tabClass: {
      type: String,
      required: false,
      default: ""
    },
    compact: {
      type: Boolean,
      required: false,
      default: false
    },
    group: {
      type: Boolean | String,
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      currentTab: this.value
    };
  },
  watch: {
    currentTab(value) {
      this.$emit("input", value);
    },
    value(value) {
      this.currentTab = value;
    }
  },
  methods: {
    next() {
      const ct = this.currentTab;
      const cur = this.labels.findIndex(x => x === ct);
      this.currentTab = (cur + 1) % this.labels.length;
    },
    prev() {
      const ct = this.currentTab;
      const cur = this.labels.findIndex(x => x === ct);
      this.currentTab = (cur - 1 + this.labels.length) % this.labels.length;
    },
    getLabel (label) 
    {
      if(typeof label === 'string') return label
      return (label.label||label.name||label.nombre||label.etiqueta||label.title||label.titulo)
    }
  }
};
</script>

<style scoped>

  .tab {
    @apply transition duration-200 text-center cursor-pointer py-2 px-4 border-b-4 font-semibold border-gray bg-gray-100 dark:bg-gray-dark-800 overflow-hidden shadow;
  }
  .tab.auto-group {
    @apply rounded-md mr-2 mb-2 xl:mr-0 xl:mb-0 xl:rounded-none first:rounded-l-md last:rounded-r-md
  } 
  .tab.fixed-group {
    @apply mr-0 mb-0 rounded-none first:rounded-l-md last:rounded-r-md
  }
  .tab:not(.auto-group):not(.fixed-group) {
    @apply rounded-md mr-2 mb-2
  }
  .tab.active {
    @apply shadow-sm border border-opacity-50 border-red-900 bg-orange-300 dark:bg-orange text-red-900 
  }
  .tabs.normal .tab {
    min-width: 10rem
  }
</style>