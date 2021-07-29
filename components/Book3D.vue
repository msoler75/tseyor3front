<template>
<div class="book-wrapper">
    <!-- xs:w-32 xs:h-24 sm:w-52 sm:h-36 md:w-64 md:h-48 lg:w-80 lg:h-56 xl:w-[21rem] xl:h-64 -->
  <div class="book">
    <nuxt-img :src="src" class="mx-auto w-1/2" 
    :sizes="imageSizes"
    />
  </div>
</div>
</template>

<script>
export default {
  props: {
    src: { type: String, required: true },
    imageSizes: {
      type: String,
      required: false,
      default: "xs:200px"
    },
  },
};
</script>

<style scoped>
/* to-do: https://codepen.io/Podgro/pen/yeEqPW */

.book {
  width: 18.5em;
  height: 23.0991em;
  /*position: absolute;
  left: 50%;*/
  box-shadow: -1.4em 1.7em 0.3em -0.3em rgba(0, 0, 0, 0.8),
    -1.6em 1.8em 0.9em -0.2em rgba(0, 0, 0, 0.5),
    0.3em 1.9em 1.3em rgba(0, 0, 0, 0.3);
  border-top-right-radius: 0.4em;
  margin-left: -147px;
}

.book img {
  border-top-right-radius: 0.4em;
  box-sizing: border-box;
  width: 100%;
  clip: rect(0em, 18.5em, 23.1em, 0em);
  display: block;
  position: absolute;
  filter: saturate(90%);
}
.book:before,
.book:after {
  content: "";
  position: absolute;
  top: 0;
}
.book:before {
  width: 105%;
  height: 105%;
  left: -5%;
  z-index: -1;
  background-repeat: no-repeat;
  background-image: linear-gradient(
      115deg,
      transparent 2.8%,
      #3f3f3f 3%,
      #3f3f3f 16%,
      transparent 16%
    ),
    linear-gradient(
      125deg,
      transparent 10%,
      #3f3f3f 10%,
      #3f3f3f 17%,
      #222 46.8%,
      transparent 47%
    ),
    linear-gradient(
      125deg,
      transparent 46%,
      rgba(0, 0, 0, 0.5) 46.5%,
      rgba(0, 0, 0, 0.25) 49%,
      transparent 53%
    ),
    linear-gradient(to right, #444, #666), linear-gradient(#444, #444),
    linear-gradient(
      140deg,
      transparent 45%,
      #eee 45%,
      #ccc 96.8%,
      rgba(170, 170, 170, 0) 97%
    );
  background-size: 100% 100%, 100% 100%, 100% 100%, 100% 0.4em, 94% 0.2em,
    100% 100%;
  background-position: 0 0, 0 0, 0 0, 0 95.8%, 0 100%, 0 0;
}
.book:after {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-image: linear-gradient(
      to right,
      transparent 2%,
      rgba(0, 0, 0, 0.1) 3%,
      rgba(0, 0, 0, 0.1) 4%,
      transparent 5%
    ),
    linear-gradient(-50deg, rgba(0, 0, 0, 0.1) 20%, transparent 100%),
    linear-gradient(-50deg, rgba(0, 0, 0, 0.2) 20%, transparent 100%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 20%, transparent 100%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 20%, transparent 100%);
  background-size: 100% 100%, 2% 20%, 1% 20%, 2% 20%, 1% 20%;
  background-position: 0 0, 2.2% 100%, 3% 100%, 2.2% 0, 3% 0;
}

.book-wrapper {
    @apply w-[6.5rem] h-[4.5rem]
 } 
.book {
    transform: translateY(-10rem) translateX(1.9rem) perspective(60em)
    scale(0.2) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
}



.book-xs {
    @apply w-32 h-24;
}
.book-xs .book {
    transform: translateY(-9.5rem) translateX(2.9rem) perspective(60em)
    scale(0.25) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
}
.book-sm.book-wrapper
{
    @apply w-52 h-36;
}
.book-sm .book {
    transform: translateY(-8.4rem) translateX(5rem) perspective(60em)
    scale(0.4) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
}
.book-md.book-wrapper {
    @apply w-64 h-48;
}
.book-md .book {
    transform: translateY(-7.2rem) translateX(6.5rem) perspective(60em)
    scale(0.5) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
}
.book-lg.book-wrapper {
    @apply w-80 h-56;
}
.book-lg .book {
    transform: translateY(-6.75rem) translateX(8rem) perspective(60em)
    scale(0.6) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
}
.book-xl.book-wrapper {
    @apply w-[21rem] h-64;
}
.book-xl .book {
    transform: translateY(-6rem) translateX(8.8rem) perspective(60em)
    scale(0.7) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
}



@screen xs{
    .xs\:book-xs {
        @apply w-32 h-24;
    }
    .xs\:book-xs .book {
     transform: translateY(-9.5rem) translateX(2.9rem) perspective(60em)
        scale(0.25) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
    .xs\:book-sm.book-wrapper {
       @apply w-52 h-36;
    }
    .xs\:book-sm .book {
      transform: translateY(-8.4rem) translateX(5rem) perspective(60em)
        scale(0.4) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
    .xs\:book-md.book-wrapper {
        @apply w-64 h-48;
    }
    .xs\:book-md .book {
      transform: translateY(-7.2rem) translateX(6.5rem) perspective(60em)
        scale(0.5) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
    .xs\:book-lg.book-wrapper {
        @apply w-80 h-56;
    }
    .xs\:book-lg .book {
      transform: translateY(-6.75rem) translateX(8rem) perspective(60em)
        scale(0.6) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
}
@screen sm {
    .sm\:book-sm.book-wrapper {
       @apply w-52 h-36;
    }
    .sm\:book-sm .book {
      transform: translateY(-8.4rem) translateX(5rem) perspective(60em)
        scale(0.4) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
    .sm\:book-md.book-wrapper {
        @apply w-64 h-48;
    }
    .sm\:book-md .book {
      transform: translateY(-7.2rem) translateX(6.5rem) perspective(60em)
        scale(0.5) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
    .sm\:book-lg.book-wrapper {
        @apply w-80 h-56;
    }
    .sm\:book-lg .book {
      transform: translateY(-6.75rem) translateX(8rem) perspective(60em)
        scale(0.6) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
    .sm\:book-xl.book-wrapper {
        @apply w-[21rem] h-64;
    }
    .sm\:book-xl .book {
      transform: translateY(-6rem) translateX(8.8rem) perspective(60em)
        scale(0.7) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
}

@screen md {
    .md\:book-md.book-wrapper {
        @apply w-64 h-48;
    }
    .md\:book-md .book {
      transform: translateY(-7.2rem) translateX(6.5rem) perspective(60em)
        scale(0.5) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
    .md\:book-lg.book-wrapper {
        @apply w-80 h-56;
    }
    .md\:book-lg .book {
      transform: translateY(-6.75rem) translateX(8rem) perspective(60em)
        scale(0.6) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
    .md\:book-xl.book-wrapper {
        @apply w-[21rem] h-64;
    }
    .md\:book-xl .book {
      transform: translateY(-6rem) translateX(8.8rem) perspective(60em)
        scale(0.7) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
}

@screen lg {
    .lg\:book-lg.book-wrapper {
        @apply w-80 h-56;
    }
    .lg\:book-lg .book {
      transform: translateY(-6.75rem) translateX(8rem) perspective(60em)
        scale(0.6) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
    .lg\:book-xl.book-wrapper {
        @apply w-[21rem] h-64;
    }
    .lg\:book-xl .book {
      transform: translateY(-6rem) translateX(8.8rem) perspective(60em)
        scale(0.7) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
}

@screen xl {
    .xl\:book-xl.book-wrapper {
        @apply w-[21rem] h-64;
    }
    .xl\:book-xl .book {
      transform: translateY(-6rem) translateX(8.8rem) perspective(60em)
        scale(0.7) rotateX(58deg) rotateZ(-34deg) skewY(-7deg);
    }
}


</style>