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
      default() {
        return {};
      }
    }
  },
  data(){
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
    cclase() {
      return this.data ? this.data.clase : "default";
    },
    cimage() {
      let src = this.image || this.data.image || this.data.imagen;
      if (src && typeof src === "object") src = src.url;
      return src
    },
    imageBg () {
      const imgUrl = this.$img(this.cimage, {width: this.imageWidth, format: 'webp', quality: 70})
      return {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
    }
  }
}
