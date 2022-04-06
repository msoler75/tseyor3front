<template>
  <!-- suscripción -->
  <Section class="w-full py-9 px-1 sm:px-6 md:px-10">
    <div class="max-w-3xl mx-auto flex justify-center items-center sm:justify-between flex-wrap">
      <div class="mx-auto flex flex-col justify-center items-center sm:w-1/2">
        <div class="flex justify-center mb-4">
          <nuxt-link
            :to="`/${collection}`"
            class="max-w-full w-44 h-32 rounded-3xl overflow-hidden"
          >
            <div :style="imageBg" class="w-full h-full block shadow" />
          </nuxt-link>
        </div>
        <h2 class="text-gray-100 text-2xl text-center">{{ title }}</h2>
        <div
          class="mt-2 text-center text-gray-300 xs:px-5 mb-7 text-diminished"
          v-html="description"
        />
      </div>
      <div class="sm:w-1/2">
        <Suscription
          :collection="collection"
          :content-id="contentId"
          :label="clabel"
          class="items-center text-gray-200 min-h-36"
        />
      </div>
    </div>
  </Section>
</template>

<script>
export default {
  props: {
    image: {},
    collection: {},
    contentId: {},
    title: {},
    description: {},
    label: {}
  },
  computed: {
    cimage() {
      if (!this.image) return ""
      if (typeof this.image === "string")
        return this.image
      return this.image.url
    },
    clabel() {
      return this.label || 'Suscribirme'
    },
    imageBg() {
      const imgUrl = this.$img(this.cimage, { width: 300, format: 'webp', quality: 70 })
      return {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
    },
  },

}
</script>