<template>
  <div class="flex w-full h-full justify-center items-center text-gray">
    <div v-if="spinner" class="loader-spinner" />
    <div v-else class="loader-coffee" />
  </div>
</template>

<script>
export default {
  props: {
    spinner: { type: Boolean, required: false, default: false },
  },
};
</script>

<style scoped>
/* https://cssloaders.github.io/  */
.loader-coffee {
  width: 48px;
  height: 40px;
  margin-top: 30px;
  display: inline-block;
  position: relative;
  background: #fff;
  border-radius: 15% 15% 35% 35%;
  opacity: 0.9;
  mix-blend-mode: difference;
}
.dark .loader-coffee {
  mix-blend-mode: normal;
}
.loader-coffee::after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  left: 45px;
  top: 8px;
  border: 4px solid #fff;
  width: 16px;
  height: 20px;
  border-radius: 0 6px 6px 0;
}
.loader-coffee::before {
  content: "";
  position: absolute;
  width: 1px;
  height: 10px;
  color: #fff;
  top: -15px;
  left: 11px;
  box-sizing: border-box;
  animation: steam 1s ease infinite;
}

@keyframes steam {
  0% {
    box-shadow: 2px 0px rgba(255, 255, 255, 0),
      12px 0px rgba(255, 255, 255, 0.3), 20px 0px rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 2px -5px rgba(255, 255, 255, 0.5),
      12px -3px rgba(255, 255, 255, 0.5), 20px -2px rgba(255, 255, 255, 0.6);
  }
  100% {
    box-shadow: 2px -8px rgba(255, 255, 255, 0),
      12px -5px rgba(255, 255, 255, 0), 20px -5px rgba(255, 255, 255, 0);
  }
}

.loader-spinner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;
}
.loader-spinner::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  inset: 0px;
  border-radius: 50%;
  border: 4px solid #000;
  animation: prixClipFix 1.6s linear infinite;
  opacity: .9;
}
.dark .loader-spinner::before {
  border-color: #fff;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}
</style>