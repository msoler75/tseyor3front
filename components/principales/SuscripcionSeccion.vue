<template>
  <!-- suscripción -->
  <Section class="w-full py-9 px-1 sm:px-6 md:px-10">
    <div class="max-w-3xl mx-auto flex justify-center items-center sm:justify-between flex-wrap">
      <div class="mx-auto flex flex-col justify-center items-center sm:w-1/2">
        <div class="flex justify-center mb-4">
          <nuxt-link :to="`/${collection}` + (contentId ? `/${contentId}` : '')"
            class="max-w-full w-44 h-32 rounded-3xl overflow-hidden">
            <div :style="imageBg" class="w-full h-full block shadow" />
          </nuxt-link>
        </div>
        <h2 class="text-2xl text-center mb-3">{{ title }}</h2>
        <div class="mt-2 text-center text-gray-300 xs:px-5 mb-7 text-diminished" v-html="description" />
      </div>
      <div class="sm:w-1/2">
        <Suscribete :collection="collection" :content-id="contentId" :label="clabel"
          class="items-center text-gray-200 min-h-36" />
      </div>
    </div>
  </Section>
</template>

<script>
export default {
  props: {
    image: {
      type: String | Object,
      required: true
    },
    collection: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    contentId: {
      type: String | Number,
      required: false,
      default: null
    },
    label: {
      type: String,
      required: false,
      default: 'Suscribirme'
    }
  },
  computed: {
    cimage() {
      let src = this.image
      if (!src) return ""
      if (typeof src === "string")
        return src
      if (Array.isArray(src)) src = src[0]
      if (typeof src == 'object')
        return src.url
      return src
    },
    clabel() {
      return this.label
    },
    imageBg() {
      console.log('cimage', this.cimage, typeof this.cimage)
      if(!this.cimage) return {}
      const imgUrl = this.$img(this.cimage, { width: 300, format: 'webp', quality: 70 })
      console.log('imgUrl', imgUrl)
      return {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
    },
  },

}
</script>