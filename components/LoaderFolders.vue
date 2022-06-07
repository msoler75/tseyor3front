<template>
  <div class="!border-0 flex w-full box-content">      <span />    
    <div class="loader-folders">
      <span v-for="index in Math.min(4,items)+1" :key="index"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: { type: Number, required: false, default() {return Math.round(Math.random()*3)}},
  }
};
</script>

<style scoped>
.loader-folders {
  position: relative;
  padding-top: 50px;  
  width: 264px;
  height: fit-content;
  display: block;
  mix-blend-mode: difference;
  background-image: linear-gradient(#FFF 33px, transparent 0);
  background-repeat: no-repeat;
  background-position: 0 0px;
  background-size: 190px, 33px;
  box-sizing: border-box;
}

.loader-folders:after {
  content:"";
  position: absolute;
  left:0;
  top:0;
  width: 100%;
  height: 100%;
  background-image:  linear-gradient(90deg, transparent, rgba(38, 50, 56, 0.5) 50%, transparent);
  background-repeat: repeat-x; 
  background-position: 0 0; 
  background-size: 400px 400px;
  animation: animloader 1s linear infinite reverse;
  mix-blend-mode: hard-light;
}

@keyframes animloader {
  0% {
    background-position: 100px 0;
  }
  100% {
    background-position: 500px 0;
  }
}

.loader-folders span {
  margin-top: 10px;
  width: 264px;
  height: 60px;
  display: block;
  mix-blend-mode: difference;
  background-image:   
  linear-gradient(#FFF 70px, transparent 0),
  linear-gradient(#FFF 70px, transparent 0),
  linear-gradient(#FFF 19px, transparent 0);  
  background-repeat: no-repeat;
  background-position: 0 0, 94px 0, 94px 40px;
  background-size: 80px 60px, 180px 33px, 180px 19px;
  box-sizing: border-box;
}

</style>