<template>
  <div
    v-show="!closed && message"
    class="relative shadow rounded-md p-5"
    :class="cclass"
  >
    <span
      v-if="close"
      class="absolute right-2 top-2 w-6 h-6 text-xs cursor-pointer rounded-full text-white bg-black bg-opacity-20 flex justify-center items-center"
      @click="closed = true"
    >
      ✖
    </span>
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "Notification",
  props: {
    type: {
      type: String,
      default: "success",
      validator: (val) => ["danger", "success"].includes(val),
    },
    message: {
      type: String,
      default: "",
    },
    close: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      closed: false,
    }
  },
  watch: {
    message(newValue) {
      this.closed = false;
    },
    type(newValue) {
      this.closed = false;
    },
  },
  computed: {
    cclass() {
      return (
        (this.type === "success"
          ? "bg-green-100-accent text-green-900"
          : "bg-red-500 text-red-contrast") + (this.close ? " pr-3" : "")
      );
    },
  },
}
</script>