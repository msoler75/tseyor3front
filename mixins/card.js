export default {
  props: {
    image: {
      type: String,
      required: false,
      default: ""
    },
    imageSizes: {
      type: String,
      required: false,
      default: "sizes"
    },
    imageWidth: {
      type: Number,
      required: false,
      default: 640
    },
    title: {
      type: String,
      required: false,
      default: ""
    },
    text: {
      type: String,
      required: false,
      default: ""
    },
    noText: {
      type: Boolean,
      required: false,
      default: false
    },
    noDate: {
      type: Boolean,
      required: false,
      default: false
    },
    creation: { // define la fecha segun la creación del contenido, no de la ultima modificación
      type: Boolean,
      required: false,
      default: false
    },
    href: {
      type: String,
      required: false,
      default: ""
    },
    tags: {
      type: Array,
      required: false,
      default () {
        return [];
      }
    },
    showTags: {
      type: Boolean,
      required: false,
      default: false
    },
    collection: {
      type: String,
      required: false,
      default: undefined
    },
    center: {
      type: Boolean,
      required: false,
      default: false
    },
    data: {
      type: Object,
      required: false,
      default () {
        return {};
      }
    },
    categoryFunction: {
      type: Function,
      required: false,
      default: null
    }
  },
  data() {
    return {
      clicked: false
    }
  },
  computed: {
    ctitle() {
      return (
        this.title ||
        this.data.title ||
        this.data.titulo ||
        this.data.titular ||
        this.data.name ||
        this.data.nombre ||
        this.data.nombreSimbolico ||
        this.data.username
      );
    },
    ccollection() {
      return this.collection || this.data.collection || this.data.colleccion;
    },
    ccategory() {
      if (this.categoryFunction)
        return this.categoryFunction(this.data)
      return null
    },
    chref() {
      const r =
        this.href || this.data.href || this.data.url || this.data.enlace;
      if (!r && this.data) {
        return "/" + (this.ccollection + "/" + (this.data.slug || this.data.id));
      }
      return r;
    },
    ctext() {
      return (
        this.text ||
        this.data.text ||
        this.data.texto ||
        this.data.description ||
        this.data.descripcion
      );
    },
    cteaser() {
      var t = this.teaser || this.data.description || this.data.descripcion;
      if (!t) t = this.$md.render(this.ctext);
      if (t.indexOf("</") > -1)
        t = t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
      t = t.substr(0, 1024)
      return t
    },
    ctags() {
      return this.tags || this.data.tags || this.data.etiquetas;
    },
    cdate() {
      return this.date || this.data.date || (this.creation ? this.data.created_at : this.data.updated_at || this.data.modified_at || this.data.published_at) || (this.creation ? this.data.updated_at || this.data.published_at : this.data.created_at) || this.data.updated_at || this.data.published_at || this.data.created_at || this.data.fecha || null
    },
    cclase() {
      return this.data ? this.data.clase : "default";
    },
    cimage() {
      let src = this.image || this.data.image || this.data.imagen;
      if (src && Array.isArray(src)) src = src[0]
      if (src && typeof src === "object") src = src.url;
      if(!src) return this.$config.defaultImage
      return src
    },
    imageBg() {
      const imgUrl = this.$img(this.cimage, {
        width: this.imageWidth,
        format: 'webp',
        quality: 70
      })
      return {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
    }
  },
  watch: {
    clicked(newValue) {
      const card = this.$el
      const pos = card.getBoundingClientRect()
      const box = document.createElement("DIV")
      document.body.appendChild(box)
      box.classList.add('flash')
      box.classList.add('surface')
      box.style.left = pos.left + 'px'
      box.style.top = pos.top + 'px'
      box.style.width = pos.width + 'px'
      box.style.height = pos.height + 'px'
      setTimeout(() => {
        box.parentNode.removeChild(box)
      }, 2500)
    }
  }
}
