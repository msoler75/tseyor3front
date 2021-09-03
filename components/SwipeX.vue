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
            type: Array | Object,
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
            x0: -1,
            y0: -1,
            localValue: this.value
        }
    },
    methods: {
        touchStart(event) {
            this.x0 = event.changedTouches[0].screenX
            this.y0 = event.changedTouches[0].screenY
        },
        touchEnd(event) {
            if(this.x0 === -1) return
            const x1 = event.changedTouches[0].screenX
            const y1 = event.changedTouches[0].screenY
            const dy = Math.abs(y1-this.y0)
            const dx = Math.abs(x1-this.x0)
            // console.log(Math.round(dx), Math.round(dy), )
            // check if major movement is in X axis
            if(dy>dx)
                return
            if(x1 + this.threshold < this.x0)
                this.next()
            else if(x1 - this.threshold > this.x0)
                this.prev()
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
            this.x0 = -1
        }
    }
}
</script>