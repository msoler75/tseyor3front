export class Dragster {
  constructor(el) {
    if (!Dragster.dragsters) {
      Dragster.dragsters = {}
    }
    if (Dragster.dragsters[el.id])
      console.warn('A Dragster for element with id "' + el.id + '" has already been instantiated')
    else {
      this.dragenter = this.dragenter.bind(this)
      this.dragleave = this.dragleave.bind(this)
      this.el = el
      this.first = false
      this.second = false
      this.el.addEventListener("dragenter", this.dragenter, false)
      this.el.addEventListener("dragleave", this.dragleave, false)
      this.destroy = this._destroy.bind(this)
      Dragster.dragsters[this.el.id] = this
    }
  }

  static getDragster(id) {
    return Dragster.dragsters[id]
  }

  static reset(el) {
    Dragster.dragsters[el.id].reset()
  }

  dragenter(event) {
    event.preventDefault()
    if (this.first) {
      this.second = true
    } else {
      this.first = true
      // this.customEvent = document.createEvent("CustomEvent")
      // this.customEvent.initCustomEvent("dragster-enter", true, true, {
      this.customEvent = new CustomEvent("dragster-enter", { bubbles: true, cancelable: true, detail: {
        dataTransfer: event.dataTransfer,
        sourceEvent: event
      }})
      this.el.dispatchEvent(this.customEvent)
    }
  }

  dragleave(event) {
    if (this.second) {
      this.second = false
    } else if (this.first) {
      this.first = false
    }
    
    if (!this.first && !this.second) {
      //this.customEvent = document.createEvent("CustomEvent")
      //this.customEvent.initCustomEvent("dragster-leave", true, true, {
      this.customEvent = new CustomEvent("dragster-leave", { bubbles: true, cancelable: true, detail: {
        dataTransfer: event.dataTransfer,
        sourceEvent: event
      }})
      this.el.dispatchEvent(this.customEvent)
    }
  }

  removeListeners() {
    this.el.removeEventListener("dragenter", this.dragenter, false)
    return this.el.removeEventListener("dragleave", this.dragleave, false)
  }

  // Must call after drop or a second drop to the same target sometimes gets missed
  reset() {
    this.first = false
    return this.second = false
  }

  _destroy() {
    if (Dragster.dragsters[this.el.id]) {
      Dragster.dragsters[this.el.id].removeListeners()
      delete Dragster.dragsters[this.el.id]
    }
  }
}