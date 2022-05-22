// TO-DO  drag from here, drop outside, and try to drag from outside -> it won't work
import {
  Dragster
} from '@/assets/js/dragster'
import {
  mapGetters
} from "vuex";
export default {
  data() {
    return {
      fromHere: false,
      prohibited: false,
    }
  },
  computed: {
    ...mapGetters(["dropHandler", "dropAccept"]),
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
      if (!this.dropHandler) return
      if (this.fromHere) return
      this.dragging = this.anyFile(e)
      this.prohibited = this.dragging && !this.acceptedFiles(e)
    },
    dragleave() {
      this.dragging = false
      this.prohibited = false
    },
    zoneenter(e) {
      if (this.fromHere) return
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
      if (this.fromHere) return
      this.fromHere = false
      if (this.anyFile(e)) {
        if (this.dropHandler && typeof this.dropHandler === 'function' &&
          this.acceptedFiles(e)
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