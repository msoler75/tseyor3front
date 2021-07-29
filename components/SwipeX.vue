<template>
    <div
      @touchstart="touchStart"
      @touchend="touchEnd"
      @touchmove="touchEnd"
      >
      <slot/>
    </div>
</template>

<script>
export default {
    props: {
        value: {},
        values: {
            type: Array,
            required: true
        },
        threshold: {
            type: Number,
            required: false,
            default: 70
        }
    },
    watch: {
        localValue(value) {
            this.$emit("input", value);
        },
        value(value) {
            this.localValue = value;
        }
    },
    data() {
        return  {
            touchstartX: -1,
            localValue: this.value
        }
    },
    methods: {
        touchStart(event) {
            this.touchstartX = event.changedTouches[0].screenX
        },
        touchEnd(event) {
            if(this.touchstartX === -1) return
            const touchendX = event.changedTouches[0].screenX;
            if(touchendX + this.threshold < this.touchstartX)
                this.prev()
            else if(touchendX - this.threshold > this.touchstartX)
            this.next()
        },
        prev() {
            this.add(-1)      
        },
        next() {
            this.add(+1)
        },
        add(a) {
            let idx = this.values.indexOf(this.localValue)
            if(idx===-1) idx = 0
            idx = (idx + a + this.values.length)%this.values.length
            this.localValue = this.values[idx]
            this.touchstartX = -1
        }
    }
}
</script>