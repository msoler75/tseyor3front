<template>
     <!-- suscripción -->
    <Section class="w-full py-9 px-1 sm:px-6 md:px-10">
      <div class="max-w-3xl mx-auto flex justify-center items-center sm:justify-between flex-wrap">
        <div class="mx-auto flex flex-col justify-center items-center sm:w-1/2 lg:w-1/3">
          <div class="flex justify-center mb-4">
            <nuxt-link
              :to="to"
              class="max-w-full w-32 rounded-full overflow-hidden"
            >
              <nuxt-img
                :src="image"
                class="w-full block"
              />
            </nuxt-link>
          </div>
          <h2 class="text-gray-100 text-2xl text-center">
            {{title}}
          </h2>
        </div>
        <div
          class="text-gray-400 px-2 xs:px-5 sm:w-1/2 lg:w-1/3 text-center mt-6 mb-7 md:mt-0 text-diminished"
          v-html="description"
        />
        <div class="flex justify-center items-center sm:mx-auto lg:w-1/3">
          <button class="btn">Suscríbete</button>
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
      description: {}
    }
}
</script>