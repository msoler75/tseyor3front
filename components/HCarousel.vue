<template>
  <client-only placeholder="..." class="">
    <div class="select-none w-full h-carousel h-90 relative flex">
      <hooper
        ref="carousel"
        @slide="onSlide"
        class="w-full h-full"
        :settings="hooperSettings"
      >
        <slide
          v-for="(item, idx) of items"
          :key="item.id"
          :index="idx"
          class="w-56 p-2"
        >
          <CardDynamic :center="center" :data="item" class="h-full" :noText="noText" :collection="collection"/>
        </slide>
         <navigation slot="hooper-addons">
           <template #hooper-next>
             <div class="hover:bg-orange p-4 transition duration-200">
                <icon icon="chevron-right" title="Siguiente"/>
             </div>
             </template>
             <template #hooper-prev>
             <div class="hover:bg-orange p-4 transition duration-200" v-show="currentSlide>0">
                <icon icon="chevron-left" title="Anterior"/>
             </div>
             </template>
         </navigation>
      </hooper>
    </div>
  </client-only>
</template>

<script>
import { Hooper, Slide, Navigation } from 'hooper'
import 'hooper/dist/hooper.css'
export default {
  components: { Hooper, Slide, Navigation },
  props: {
    items: {
      type: Array,
      required: true
    },
    extended: {
      type: Boolean,
      required: false,
      default: false
    },
    center: {
      type: Boolean,
      required: false,
      default: false
    },
    infiniteScroll: {
      type: Boolean,
      required: false,
      default: false
    },
    noText: {
      type: Boolean,
      required: false,
      default: false
    },
    collection: {
      type: String,
      required: false,
      default: undefined
    }
  },
  computed: {
    preset () {
      return this.extended ? 'hcard' : 'vcard'
    }
  },
  data () {
    return {
      currentSlide: 0,
      hooperSettings: {
        infiniteScroll: this.infiniteScroll,
        wheelControl: false,
        itemsToSlide: 1,
        itemsToShow: 1,
        trimWhiteSpace: true,
        centerMode: true,
        breakpoints: {
          400: {
            centerMode: false,
            itemsToSlide: 2,
            itemsToShow: 2
          },
          800: {
            itemsToSlide: 3,
            itemsToShow: 3,
            pagination: 'fraction'
          },
          1200: {
            itemsToSlide: 4,
            itemsToShow: 4,
            pagination: 'fraction'
          },
          1600: {
            itemsToSlide: 5,
            itemsToShow: 5,
            pagination: 'fraction'
          }
        }
      }
    }
  },
  methods: {
    onSlide (payload) {
      this.currentSlide = payload.currentSlide
      console.warn('currentSlide=', this.currentSlide)
    },
    /* goPrev () {
      this.$refs.carousel.slidePrev()
    },
    goNext () {
      this.$refs.carousel.slideNext()
    } */
  }
}
</script>

<style scoped>
.slide-btn {
  @apply absolute w-8 cursor-pointer h-full flex transition duration-200 justify-center items-center bg-white hover:bg-orange-100 hover:text-orange-900 dark:bg-black text-gray-300 dark:text-gray-600;
}
.h-carousel  >>> .hooper {
  height: unset
}
.h-carousel >>> .hooper-list {
  @apply pb-8;
}
.card-img {
  width: 100%;
  height: 200px;
  overflow: hidden;
}
.h-carousel >>> .hooper-slide {
  min-height: 100%;
  height: auto;
}
.h-carousel >>> .hooper-next,
.h-carousel >>> .hooper-prev {
  padding: 0;
}
.h-carousel >>> .hooper-next.is-disabled,
.h-carousel >>> .hooper-prev.is-disabled {
  display: none
}
.h-carousel >>> .hooper.is-vertical .hooper-track {height: unset}
.h-carousel >>> .hooper-slide {margin:.5rem; margin-bottom: 1.1rem}
</style>
