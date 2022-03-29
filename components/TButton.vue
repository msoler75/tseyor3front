<template>
  <a
    v-if="!to"
    :class="getClass"
    :href="href"
    :title="title"
    :alt="alt"
    @click="$emit('click')"
  >
    <slot />
  </a>
  <button
    v-else
    :class="getClass"
    :to="to"
    :title="title"
    :alt="alt"
    @click="$emit('click'); if(to) $router.push(to)"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    to: {
      validator (v) {
        return (
          v === null ||
          typeof v === 'string'
        )
      },
      required: false,
      default: ''
    },
    noPrefetch: { type: Boolean, required: false, default: false }, // TO-DO
    href: { type: String, required: false, default: null },
    size: {
      required: false,
      validator (v) {
        return (
          typeof v === 'string' &&
          ['sm', 'md', 'lg'].includes(v)
        )
      },
      default: 'md'
    },
    title: { type: String, required: false, default: '' },
    alt: { type: String, required: false, default: '' },
    variant: { type: String, required: false, default: 'primary' },
    variantDark: { type: String, required: false, default: 'warning' },
    disabled: {type: Boolean, required: false, default: false}
  },
  computed: {
    /*
    bg-red-500 text-white rounded-md focus:outline-none focus:ring-2 ring-red-300 ring-offset-2">Danger</button>
    bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 ring-blue-300 ring-offset-2">Primary</button>
    bg-gray-500 text-white rounded-md focus:outline-none focus:ring-2 ring-gray-300 ring-offset-2">Secondary</button>
    bg-yellow-500 text-white rounded-md focus:outline-none focus:ring-2 ring-yellow-300 ring-offset-2">Warning</button>
    bg-blue-400 text-white rounded-md focus:outline-none focus:ring-2 ring-blue-200 ring-offset-2">Info</button>
    */
    getClass () {
      let color = 'bg-blue-500 hover:bg-blue-400 text-blue-500-contrast'
      switch (this.$colorMode.value === 'light' ? this.variant : this.variantDark) {
        case 'error':
        case 'danger' : color = 'btn-error'; break
        case 'success' : color = 'btn-success'; break
        case 'warning' : color = 'btn-warning'; break
        case 'gray' : color = 'btn-gray'; break
        case 'info' : color = 'bg-blue-400 hover:bg-blue-300  text-blue-400-contrast'; break
      }
      if(this.disabled) color = 'btn-gray opacity-60 pointer-events-none'
      const size = ''
      return 'btn transition duration-200 p-2 cursor-pointer rounded-md focus:outline-none focus:shadow-outline ' + color + ' ' + size
    }
    /* myclasstext () {
      return 'text-' + this.variant
    } */
  }
}
</script>
