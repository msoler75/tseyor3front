<template>
  <v-select
  class="my-v"
    :options="countries"
    v-model="selected"
    :placeholder="placeholder"
    :filter="fuseSearch"
    autocomplete="on"
    :getOptionLabel="country => country.label"
    :reduce="country => country.code"
    label="País..."
  >
    <template v-if="required" #search="{attributes, events}">
      <input :required="!selected" v-bind="attributes" v-on="events" />
    </template>
    <div slot="no-options">Ningún resultado</div>
  </v-select>
</template>

<script>
import vSelect from "vue-select";
// import "vue-select/dist/vue-select.css";
import Fuse from "fuse.js";
import countries from "@/assets/js/countries.js"
export default {
  components: { vSelect },
  props: {
    value: {},
    'required': {
        type: Boolean,
        required: false,
        default: false
    },
    placeholder: {
        type: String,
        required: false,
        default: 'País'
    }
  },
  data() {
    return {
      selected: this.value,
      countries
    };
  },
  watch: {
    selected (value) {
      this.$emit('input', value)
    },
    value (value) {
      this.selected = value
    }
  },
  methods: {
    fuseSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: ["label", "code"],
        shouldSort: true
      });
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list;
    }
  }
};
</script>

<style scoped>
.my-v {
    @apply relative;
}
.my-v >>> [role="combobox"] {
    @apply flex;
}
.my-v >>> .vs__selected-options  {
    @apply flex-grow;
}
.my-v >>> .vs__actions  {
    @apply flex items-center px-2 pb-0;
}
.my-v >>> .vs__actions > *  {
    @apply cursor-pointer text-gray;
}
.my-v >>> .vs__clear {
    @apply mr-3;
}
.my-v >>> .vs__selected {
  @apply absolute top-0 left-2 bottom-0 flex items-center text-gray-700 px-1 py-1;
}
.my-v.vs--single.vs--searching >>> .vs__selected {
    display: none
}
.my-v >>> .vs__dropdown-menu {
  @apply block absolute top-full mt-2 left-0 z-10 p-2 cursor-pointer text-gray-900 w-full max-h-40 overflow-y-auto shadow-md rounded text-left list-none bg-gray-100;
}

</style>