<template>
  <Card class="card-book h-full" :clicked="clicked"
  :class="landscape ? 'landscape' : ''">
    <section class="h-full flex flex-col justify-start" :class="landscape ? 'xm:flex' : ''">
      <section class="sm:pt-2">
        <Book3D class="mx-auto"
          :class="sizeBook"
          :src="cimage"
         />
        <!-- <nuxt-img class="block xs:hidden max-w-8" :src="'/imagenes/portadas/' + data.imagen"/> -->
      </section>
      <section class="px-1 xs:px-6 text-center flex flex-col flex-grow" :class="landscape?'flex flex-col justify-center':''">
        <NLink :to="chref" @click.native.prevent="portalize">
          <section class="font-bold text-xl" :class="noText?'':'mb-2'">{{ ctitle }}</section>
        </NLink>
        <v-clamp v-if="!noText && ctext" autoresize :max-lines="5"
        class="my-auto text-gray-700 text-base">{{cteaser}}</v-clamp>
        <div v-if="showTags" class="px-6 pt-4 pb-2 mt-auto">
          <span
            v-for="tag of ctags"
            :key="tag"
            class="inline-block bg-gray-200 dark:bg-gray-dark-700 text-gray-700 dark:text-gray-400 rounded-full px-3 py-1 text-sm mr-2 mb-2"
          >
            {{ tag }}
          </span>
        </div>
      </section>
    </section>
  </Card>
</template>

<script>
import VClamp from 'vue-clamp'
import CardMix from "@/mixins/card";
export default {
  components: { VClamp },
  mixins: [CardMix],
  props: {
    landscape: { type: Boolean, required: false, default: false },
    // big: { type: Boolean, required: false, default: false },
    bookSize: {
      type: String,
      required: false,
      default: 'auto'
    }
  },
  computed: {
    ccollection() {
      return "libros";
    },
    sizeBook() {
      if(this.bookSize==='auto') return 'xs:book-xs sm:book-sm md:book-md'
      return this.bookSize
    }
  },
  methods: {
    portalize(event) {
      this.clicked= true
      /*console.log(event)
      event.preventDefault()
      let e = event.target;
      while(e.tagName!=="A")
        e=e.parentNode
        console.log('target', e)
      let card = e
      while(card&&!card.classList.contains('card')) {
        card = card.parentNode
      }
      if(card) {
        let inn = document.createElement("DIV")
        inn = card.cloneNode(true)
        inn.classList.remove('card')
        let box = document.createElement("DIV")
        box.classList.add('surface')

        document.body.appendChild(box)
        document.body.appendChild(inn)
        // document.body.appendChild(inn)
        const pos = card.getBoundingClientRect()
        box.classList.add('expand')
        box.style.zIndex = 1000
        box.style.position = 'fixed'
        box.style.left = pos.left + 'px'
        box.style.top = pos.top + 'px'
        box.style.width = pos.width + 'px'
        box.style.height = pos.height + 'px'
        box.style.transition = 'all .5s ease-out'
        box.style.pointerEvents = 'none'
        box.style.border="5px solid black"

        inn.style.zIndex = 1001
        inn.style.position = 'fixed'
        inn.style.left = pos.left + 'px'
        inn.style.top = pos.top + 'px'
        inn.style.width = pos.width + 'px'
        inn.style.height = pos.height + 'px'
        inn.style.transition = 'all .5s'
        
        setTimeout(()=>{
          inn.style.opacity = 0
          box.style.opacity = 0
          box.style.left = 0
          box.style.top = 0
          box.style.width = screen.width + 'px'
          box.style.height = screen.height + 'px'
          setTimeout(()=>{
            box.parentNode.removeChild(box)
            inn.parentNode.removeChild(inn)
          }, 2000)
        }, 50)
      }
      return false*/
    }
  }
}
</script>

<style>
.travelling .card {
  opacity: 0;
  pointer-events: none;
}

.travelling .card[clicked] {
  opacity: 1
}
</style>
