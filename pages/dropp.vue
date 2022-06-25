<template>
<div contained="no">
  <Droppable
    @dropped="drop1"
    class="p-12"
    :class="d1 ? 'bg-yellow' : 'bg-white'"
    v-model="d1"
  >
    <Droppable
      @dropped="drop2"
      class="border-2 border-orange p-7"
      :class="d2 ? 'bg-yellow' : 'bg-white'"
      v-model="d2"
    >
      <Droppable
        @dropped="drop3"
        class="border-2 border-orange p-7"
        :class="d3 ? 'bg-yellow' : 'bg-white'"
        v-model="d3"
      >
        <span>Drop Here</span>
      </Droppable>
    </Droppable>
  </Droppable>
  <Droppable
    @dropped="drop4"
    class="p-12 mt-12"
    :class="d4 ? 'bg-yellow' : 'bg-white'"
    v-model="d4"
  >
  </div>
</template>

<script>
export default {
  data() {
    return {
      d1: false,
      d2: false,
      d3: false,
      d4: false,
    };
  },
  methods: {
    drop1() {
      alert("dropped in 1");
    },
    drop2() {
      alert("dropped in 2");
    },
    drop3() {
      alert("dropped in 3");
    },
    drop4() {
      alert("dropped in 4");
    }
  },
};
</script>