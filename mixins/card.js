export default {
  props: {
    image: {
      type: String,
      required: false,
      default: ""
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
    href: {
      type: String,
      required: false,
      default: ""
    },
    tags: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    showTags: {
      type: Boolean,
      required: false,
      default: false
    },
    type: {
        type: String,
        required: false,
        default: ''
    },
    center: {
        type: Boolean,
        required: false,
        default: false
      },
    data: {
      type: Object,
      required: false,
      default() {
        return {};
      }
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
        this.data.nombre
      );
    },
    cclase() {
        return (
        this.type || 
        this.data.class ||
        this.data.table ||
        this.data.tabla ||
        this.data.clase )
    },
    chref() {
      const r =
        this.href || this.data.href || this.data.url || this.data.enlace;
      if (!r && this.data) {
        return '/' + (
          this.cclase +
          "/" +
          this.data.id
        );
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
    ctags() {
      return this.tags || this.data.tags || this.data.etiquetas;
    },
    cclase () {
      return this.data?this.data.clase:'default'
    },
    cimage() {
      const src = this.image || this.data.image || this.data.imagen;
      if (src && src.search("/") > -1) return src;
      return "./assets/images/" + src;
    }
  }
}