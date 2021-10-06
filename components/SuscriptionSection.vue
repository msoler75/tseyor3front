<template>
     <!-- suscripción -->
    <Section class="w-full py-9 px-1 sm:px-6 md:px-10">
      <div class="max-w-3xl mx-auto flex justify-center items-center sm:justify-between flex-wrap">
        <div class="mx-auto flex flex-col justify-center items-center sm:w-1/2 lg:w-1/3">
          <div class="flex justify-center mb-4">
            <nuxt-link
              :to="to"
              class="max-w-full w-44 h-32 rounded-3xl overflow-hidden"
            >
            <div :style="imageBg" class="w-full h-full block shadow"/>
            </nuxt-link>
          </div>
          <h2 class="text-gray-100 text-2xl text-center">
            {{title}}
          </h2>
        </div>
        <div class="sm:w-1/2 lg:w-2/3">
          <div class="flex flex-col space-y-4 justify-center items-center sm:mx-auto">
            <p class="text-gray-200">Recibe en tu correo las novedades.</p>
            <button class="btn btn-warning" :to="to">{{clabel}}</button>
          </div>
          <div
            class="mt-4 text-center text-gray-400 px-2 xs:px-5 mb-7 sm:mx-6 lg:mx-12 text-diminished"
            v-html="description"
          />
        </div>
      </div>
    </Section>
</template>

<script>
export default {
    props: {
      image: {},
      to: {},
      title: {},
      description: {},
      label: {}
    },
    computed: {
      cimage() {
        if(!this.image)return ""
        if(typeof this.image === "string")
          return this.image
        return this.image.url
      },
      clabel() {
        return this.label || 'Suscríbete'
      },
      imageBg () {
        const imgUrl = this.$img(this.cimage, {width: 300, format: 'webp', quality: 70})
        return {
          backgroundImage: `url('${imgUrl}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }
      }
    }
}
</script>