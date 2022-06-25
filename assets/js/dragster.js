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
      this.drop = this.drop.bind(this)
      this.el = el
      this.first = false
      this.second = false
      this.el.addEventListener("dragenter", this.dragenter, false)
      this.el.addEventListener("dragleave", this.dragleave, false)
      this.el.addEventListener("drop", this.drop, false)
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
    console.log('>>>>>>>>>>>>>>>>>>>>>>')
    console.log(this.el.id + '.dragenter to', event.target.id)
    console.log('first:', this.first, 'second:', this.second)
    // if (event.target.id in Dragster.dragsters && event.stopPropagation) {}
    // if(event.target.id in Dragster.dragsters)
    if (event.stopPropagation) {
      console.log('stop propagation', event)
      event.stopPropagation()
    }

    if (this.first) {
      this.second = true
    } else {
      this.first = true
      // this.customEvent = document.createEvent("CustomEvent")
      // this.customEvent.initCustomEvent("dragster-enter", true, true, {
      this.customEvent = new CustomEvent("dragster-enter", {
        bubbles: true,
        cancelable: true,
        detail: {
          dataTransfer: event.dataTransfer,
          sourceEvent: event
        }
      })
      this.el.dispatchEvent(this.customEvent)

    }
    // if(event.target.id in Dragster.dragsters)
    this.leaveAscendants({
      ...event,
      target: this.el
    })
  }

  dragleave(event) {
    console.log('<<<<<<<<<<<<<<<<<<<<<')
    console.log(this.el.id + '.dragleave from', event.target.id)
    console.log('first:', this.first, 'second:', this.second)

    if (event.stopPropagation) {
      console.log('stop propagation', event)
      event.stopPropagation()
    }

    // if (!this.first && !this.second) return

    if (this.second) {
      this.second = false
    } else if (this.first) {
      this.first = false
    }

    if (!this.first && !this.second) {
      //this.customEvent = document.createEvent("CustomEvent")
      //this.customEvent.initCustomEvent("dragster-leave", true, true, {
      this.customEvent = new CustomEvent("dragster-leave", {
        bubbles: true,
        cancelable: true,
        detail: {
          dataTransfer: event.dataTransfer,
          sourceEvent: event
        }
      })
      this.el.dispatchEvent(this.customEvent)

      // if (event.target.id && event.target.id in Dragster.dragsters)
      //this.enableFirstAscendant(event)
    }

  }

  drop(event) {
    console.log('dragster.dropped in', event.target.id)
    event.preventDefault()
    event.stopPropagation()

    //if(event.target.id!=this.el.id) return    
    this.customEvent = new CustomEvent("dragster-drop", {
      bubbles: true,
      cancelable: true,
      detail: {
        dataTransfer: event.dataTransfer,
        sourceEvent: event
      }
    })
    this.el.dispatchEvent(this.customEvent)

    this.resetAll()

    return false
  }


  // dragleave on all ascendants
  leaveAscendants(event) {
    console.log('leaveAscendants', event.target.id)
    let src = event.target.parentNode
    while (src) {
      if (src.id && src.id in Dragster.dragsters && (Dragster.dragsters[src.id].first || Dragster.dragsters[src.id].second)) {
        Dragster.dragsters[src.id].dragleave(event)
      }
      src = src.parentNode
    }
  }

  // reset all dragster elems
  resetAll() {
    for (const d of Dragster.dragsters)
      d.reset()
  }

  // activate first dragster element container of leaving event
  enableFirstAscendant(event) {
    console.log('enableFirstAscendant', event.target.id)
    const ids = Object.keys(Dragster.dragsters)
    let src = event.target.parentNode
    while (src) {
      if (src.id && ids.indexOf(src.id) > -1) {
        console.log('src', src.id, Dragster.dragsters[src.id])
        Dragster.dragsters[src.id].reset()
        return Dragster.dragsters[src.id].dragenter({
          ...event,
          target: Dragster.dragsters[src.id].el
        })
      }
      src = src.parentNode
    }
  }

  removeListeners() {
    this.el.removeEventListener("dragenter", this.dragenter, false)
    this.el.removeEventListener("dragleave", this.dragleave, false)
    return this.el.removeEventListener("drop", this.drop, false)
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
