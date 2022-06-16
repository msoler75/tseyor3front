<template>
  <div class="!border-0 flex w-full box-content">      <span />    
    <div class="loader-folders"
    :class="vista=='listado'?'':'mygrid w-full'">
      <span v-for="index in Math.min(4,items)+1" :key="index"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: { type: Number, required: false, default() {return Math.round(Math.random()*3)}},
    vista: {}
  }
};
</script>

<style scoped>
.loader-folders {
  position: relative;
  padding-top: 50px;  
  min-width: 264px;
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
  margin-left:20px;
  display: block;
  mix-blend-mode: difference;
  background-image:   
  linear-gradient(#FFF 70px, transparent 0),
  linear-gradient(#FFF 33px, transparent 0),
  linear-gradient(#FFF 19px, transparent 0);  
  background-repeat: no-repeat;
  background-position: 0 2px, 95px 3px, 95px 33px;
  background-size: 71px 50px, 180px 20px, 180px 19px;
  box-sizing: border-box;
}

.mygrid.loader-folders span {
  margin-top: 10px;
  width: 200px;
  height: 210px;  
  margin-left:0px;
  display: block;
  mix-blend-mode: difference;
  background-image:   
  linear-gradient(#FFF 90px, transparent 0),
  linear-gradient(#FFF 33px, transparent 0),
  linear-gradient(#FFF 16px, transparent 0);  
  background-repeat: no-repeat;
  background-position: 33px 14px, 34px 124px, 19px 153px;
  background-size: 120px 95px, 120px 20px, 150px 12px;
  box-sizing: border-box;
}

.mygrid {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(220px, 1fr));
  grid-auto-columns: minmax(160px, 200px);
  grid-auto-rows: minmax(200px, 210px);
  grid-auto-flow: dense;
  place-items: stretch stretch;
  max-width: calc(100% - 80px);
}

</style>