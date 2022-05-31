// custom.vmodel.mixin.js
export default {
  props: {
    value: {}
  },
  data () {
    return {
      localValue: this.value
    }
  },
  watch: {
    localValue (value) {
      this.$emit('input', value)
    },
    value (value) {
      this.$set(this,'localValue',value)
    }
  }
}
