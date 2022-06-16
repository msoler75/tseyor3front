<template>
  <div class="!border-0 flex box-content justify-center items-center w-[24px]">
    <div class="loader-spinner flex-shrink-0" />
  </div>
</template>

<style scoped>
.loader-spinner {
  box-sizing: border-box;
  width: 22px;
  height: 22px;
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
  border: 2px solid #000;
  @apply border-sello-fuerte;
  animation: prixClipFix 1.6s linear infinite;
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