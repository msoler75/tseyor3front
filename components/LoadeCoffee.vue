<template>
  <div class="!border-0 flex w-full box-content justify-center items-center">
    <div class="loader-coffee">
      <span />
      <span />
      <span />
    </div>
  </div>
</template>

<style scoped>
/* https://cssloaders.github.io/  */

.loader-coffee {
  box-sizing: border-box;
  width: 48px;
  height: 40px;
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 20px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  display: inline-block;
  position: relative;
  background: #fff;
  border-radius: 15% 15% 35% 35%;
  mix-blend-mode: difference;
}
.loader-coffee::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  background: #fff;
  left: -15px;
  bottom: -10px;
  width: 80px;
  height: 10px;
  border-radius: 0 0 6px 6px;
}
.loader-coffee::after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  left: 45px;
  top: 4px;
  border: 5px solid #fff;
  width: 16px;
  height: 20px;
  border-radius: 0 6px 10px 0;
}
.loader-coffee span {
  position: absolute;
  opacity: 0;
  color: #fff;
  top: -14px;
  left: 16px;
  animation: steam 1.2s linear infinite;
}

.loader-coffee span:nth-child(2) {
  animation-delay: 0.33s;
  left: 26px;
}

.loader-coffee span:nth-child(3) {
  animation-delay: 0.66s;
  left: 6px;
}

.loader-coffee span:after {
  content: "\007E";
  font-weight: semibold;
  display: block;
  color: #fff;
  transform: scaleY(2) rotate(90deg);
}

.loader-coffee span:nth-child(2):after {
  transform: scaleY(2) scaleX(-1) rotate(90deg);
}

@keyframes steam {
  0% {
    opacity: 0;
    transform: translateY(0px);
  }
  50% {
    opacity: 0.6;
    transform: translateY(-15px);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
}

</style>