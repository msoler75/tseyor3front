<template>
  <div
    class="tabs flex max-w-full select-none uppercase text-xs sm:text-sm md:tracking-wide lg:tracking-wider xl:tracking-widest font-sans"
    :class="(compact ? 'compact' : 'normal') + (center ? ' justify-center' : '')"
  >
    <div
      v-for="(item, index) of items"
      :key="JSON.stringify(item)"
      class="tab"
      @click="currentTab = index"
      :class="
        tabClass +
        (index === currentTab || getValue(item) === currentTab ? ' active' : '') +
        (group === true || group === 'auto' ? ' auto-group' : (group === 'fixed' ? ' fixed-group' : ''))
      "
      :title="getDescription(item)"
    >
      <Icon v-if="item.icon" :icon="item.icon" class="mr-1" />
      <span>{{ $ucFirst(getLabel(item)) }}</span>
      <span v-if="item.count" class="ml-2 text-xs bg-black bg-opacity-20 text-white dark:text-gray-500 px-1 rounded">{{item.count}}</span>
      <span v-if="item.closeable" class="px-2 transform translate-x-2 text-sm cursor-pointer opacity-75 hover:opacity-100" @click.stop="close(item)"
      :title="item.title">
        <icon icon="times"/>
      </span>
    </div>
  </div>
</template>

<script>
// custom.vmodel.mixin.js
export default {
  props: {
    value: {},
    items: {
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
    },
    center: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      currentTab: this.value
    };
  },
  watch: {
    currentTab(value) {
      console.log('WATCH currentTabl', value)
      let index = typeof value === 'number' ? value : this.findItemIndex(value)
      console.log('index', index)
      if (index > -1) {
        const item = this.items[index]
        console.log('item', item)
        const v = this.getValue(item)
        console.log('v', v)
        this.$emit("input", v)
        this.$emit("change", v)
      }
      else {
        this.$emit("input", value)
        this.$emit("change", value)
      }
    },
    value(value) {
      console.log('TABS.value', value)
      // const item = this.findItem(value)
      this.currentTab = value // this.getValue(value);
    }
  },
  methods: {
    next() {
      console.log('TABS.NEXT')
      const ct = this.currentTab
      const cur = this.labels.findIndex(x => x === ct);
      this.currentTab = (cur + 1) % this.labels.length;
    },
    prev() {
      console.log('TABS.PREV')
      const ct = this.currentTab
      const cur = this.labels.findIndex(x => x === ct);
      this.currentTab = (cur - 1 + this.labels.length) % this.labels.length;
    },
    getLabel(item) {
      // console.log('getLabel', item)
      if(!item) return ''
      if (typeof item === 'string') return item
      return (item.label || item.name || item.nombre || item.etiqueta || item.title || item.titulo)
    },
    getDescription(item) {
      if (typeof item === 'object')
        return item.description || item.descripcion
      return null
    },
    getValue(item) {
      if (typeof item === 'object')
        return item.value || this.getLabel(item)
      return this.getLabel(item)
    },
    findItem(value) {
      const idx = this.findItemIndex(value)
      if(idx>-1) return this.items[idx]
      return null
    },
    findItemIndex(value) {
      const idx = this.items.findIndex(item => this.getValue(item) === value)
      if (idx > -1) return idx
      return this.items.findIndex(item => this.getLabel(item) === value)
    },
    close(item) {
      if(item.onClose)
        item.close(item)
      this.$emit('close', item)
    }
  }
}
</script>

<style scoped>
.tab {
  @apply flex justify-center items-center transition duration-200 text-center cursor-pointer p-1 sm:py-2 sm:px-4 border-b-4 font-semibold border-gray bg-white dark:bg-gray-dark-800 overflow-hidden shadow;
  min-width: fit-content;
}
.tab.auto-group {
  @apply rounded-md mr-2 mb-2 xl:mr-0 xl:mb-0 xl:rounded-none first:rounded-l-md last:rounded-r-md;
}
.tab.fixed-group {
  @apply mr-0 mb-0 rounded-none first:rounded-l-md last:rounded-r-md;
}
.tab:not(.auto-group):not(.fixed-group) {
  @apply rounded-sm sm:rounded-md mr-2 mb-2;
}
.tab.active {
  @apply shadow-sm bg-orange-300 dark:bg-orange text-red-900;
}
.tab:not(.active):hover {
  @apply bg-orange-50 text-brown-900;
}
@screen xl {
  .tabs.normal .tab {
    min-width: 10rem;
  }
}
</style>