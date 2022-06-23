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
      console.log('vmodel.input', value)
      this.$emit('input', value)
    },
    value (value) {
      this.$set(this,'localValue',value)
    }
  }
}
