<template>
    <div ref="main" class="surface-0 w-full font-sans relative" 
        @dragover.prevent @drop.stop.prevent="dropNone"    
        @dragster-enter="dragenter" @dragster-leave="dragleave"
        @dragstart="dragstart"
        >
        <!-- https://stackoverflow.com/questions/63063312/why-doesnt-the-drop-event-work-for-me-in-vue  -->

        <Modal v-model="dragging" class="justify-center items-center" :closeable="false">
            <div ref="dropzone" pepito
                class="border-dash text-center max-w-full max-h-full text-gray-700 m-4 py-20 px-4 sm:px-32 sm:py-24 lg:px-64 text-lg xm:tracking-wider flex flex-col space-y-4"
                :class="prohibited ? 'prohibited' : inDropZone ? 'animated-dash' : ''" @dragster-enter.stop="zoneenter"
                @dragster-leave.stop="zoneleave" @dragover.prevent @drop.stop.prevent="drop">
                <icon v-if="prohibited" icon="hand-paper" class="text-3xl text-red" />
                <icon v-else icon="file" class="text-3xl" :class="inDropZone?'text-orange-500':''" />
                <span v-if="prohibited" class="text-red">Tipo de archivo no permitido</span>
                <span v-else :class="inDropZone?'text-orange-500':''">Arrastra aquí los archivos</span>
            </div>
        </Modal>

        <slot />
    </div>
</template>

<script>
// TO-DO  drag from here, drop outside, and try to drag from outside -> it won't work
import { Dragster } from '@/assets/js/dragster'
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            // drag & drop 
            fromHere: false,
            prohibited: false,
            dragging: false,
            inDropZone: false,
            d1: null,
            d2: null,
        }
    },
    computed: {
        ...mapGetters(["dropHandler", "dropAccept"]),
    },
    async mounted() {
        if (process.client) {
            this.d1 = new Dragster(this.checkId(this.$refs.main))
            // this.d2= new Dragster(this.$refs.main)
        }
    },
    watch: {
        dragging(d) {
            if (d)
                this.$nextTick(() => {
                    //if (this.$refs.dropzone)
                    this.d2 = new Dragster(this.checkId(this.$refs.dropzone))
                })
            else if (this.d2) {
                this.d2.destroy()
                this.d2 = null
            }
        }
    },
    methods: {
        checkId(elem) {
            if (!elem.id)
                elem.id = 'drag-here-' + Math.random()
            return elem
        },
        anyFile(e) {
            const items = e.detail ? e.detail.dataTransfer.items : e.dataTransfer.items
            var someFile = false
            for (const item of items)
                if (item.kind == 'file') someFile = true
            return someFile
        },
        acceptedFiles(e) {
            var ok = false
            const regex = new RegExp(this.dropAccept.replace(/\*/, '[^\/]*'))
            const items = e.detail ? e.detail.dataTransfer.items : e.dataTransfer.items
            for (const item of items) {
                if (item.kind == 'file' && regex.test(item.type)) 
                    ok = true
            }
            return ok
        },
        dragstart() {
            this.fromHere = true
        },
        dragenter(e) {
            if(!this.dropHandler) return
            if(this.fromHere) return
            this.dragging = this.anyFile(e)
            this.prohibited = this.dragging && !this.acceptedFiles(e)
        },
        dragleave() {
            this.dragging = false
            this.prohibited = false
        },
        zoneenter(e) {
            if(this.fromHere) return
            this.prohibited = this.dragging && !this.acceptedFiles(e)
            this.inDropZone = this.dragging && !this.prohibited
        },
        zoneleave() {
            this.inDropZone = false
        },
        dropNone(e) {
            this.fromHere = false
            this.inDropZone = false
            this.dragging = false
            this.d1.reset()
            if (this.d2) this.d2.reset()
        },
        drop(e) {
            if(this.fromHere) return
            this.fromHere = false
            if (this.anyFile(e)) {
                if (this.dropHandler && typeof this.dropHandler === 'function'
                && this.acceptedFiles(e)
                )
                    this.dropHandler(e)
                this.inDropZone = false
                this.dragging = false
                this.d1.reset()
                if (this.d2) this.d2.reset()
            }
        },
    }
}
</script>

<style scoped>
.border-dash {
    background: linear-gradient(90deg, gray 50%, transparent 50%), 
                linear-gradient(90deg, gray 50%, transparent 50%), 
                linear-gradient(0deg, gray 50%, transparent 50%), 
                linear-gradient(0deg, gray 50%, transparent 50%);
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size: 16px 4px, 16px 4px, 4px 16px, 4px 16px;
    background-position: 0% 0%, 100% 100%, 0% 100%, 100% 0px;
    border-radius: 5px;
}

.animated-dash {
    background-image: linear-gradient(90deg, orange 50%, transparent 50%), 
                linear-gradient(90deg, orange 50%, transparent 50%), 
                linear-gradient(0deg, orange 50%, transparent 50%), 
                linear-gradient(0deg, orange 50%, transparent 50%);
    animation: dash 5s linear infinite;
}

.prohibited {
    background-image: red !important
}

@keyframes dash {
    to {
        background-position: 100% 0%, 0% 100%, 0% 0%, 100% 100%;
    }
}
</style>