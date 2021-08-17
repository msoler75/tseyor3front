export default {
  head () {
    return {
      title: this.$teaser(this.title, 48) + ' — TSEYOR'
    }
  },
  data() {
    return {
      viendoCompartir: false
    };
  },
  computed: {
    id () {
      return parseInt(this.$route.params.id)
    },
    contenidoJSON () {
      return JSON.stringify(this.contenido)
    },
    ctitle() {
        const t = this.contenido ? this.contenido.titulo || this.contenido.titular || this.contenido.name || this.contenido.nombre : ''
        this.$store.commit('setTitle', t)
      return t
    },
    cclase() {
        return (
        this.type || 
        this.contenido.class ||
        this.contenido.table ||
        this.contenido.tabla ||
        this.contenido.clase )
    },
    chref() {
      const r =
        this.href || this.contenido.href || this.contenido.url || this.contenido.enlace;
      if (!r && this.contenido) {
        return '/' + (
          this.cclase +
          "/" +
          this.contenido.id
        );
      }
      return r;
    },
    ctext() {
      return (
        this.text ||
        this.contenido.text ||
        this.contenido.texto ||
        this.contenido.description ||
        this.contenido.descripcion
      );
    },
    ctags() {
      return this.tags || this.contenido.tags || this.contenido.etiquetas;
    },
    cclase () {
      return this.contenido?this.contenido.clase:'default'
    },
    cimage() {
      var src = this.image || this.contenido.image || this.contenido.imagen;
      if(typeof src === 'object')
        src = src.url 
      // if (src && src.search("/") > -1) return src;
      // return "./images/" + src;
      return src
    }
  },
  watch: {
    contenidoJSON (value) {
      console.log('noticias_id, watch title =', value)
      // this.$store.commit('setTitle', this.title)
    }
  },
  methods: {
  renderMarkdown(md) {
    var html = this.$md.render(md)
    // console.warn(html)
    html = html
      .replace(/(<img[^>]+>)<br \/>\n?\s*(<img)/gm, '$1\n$2')
      .replace(/(<img[^>]+>)<br \/>\n?\s*(<img)/gm, '$1\n$2')
      .replace(/<p[^>]*>(?:<strong>)?((?:\s*<img[^>]+>[\s\n]*)+)(?:<\/strong>)?<\/p>/gm, '$1')
      .replace(/<p[^>]*>(<img[^>]+>)<br\s*\/?>\n(.+?)<\/p>/g, '<figure>$1<figcaption>$2</figcaption></figure>')
      .replace(/<img[^>]+>/g, (p0) =>
      {
        const data = p0.match(/src=['"]([^'"]+)['"]/)
        if(!data||!data[1]) return p0
        const src = data[1]
        const img = this.$img.getSizes(src, {
          sizes: 'xs:100vw xm:100vw sm:100vw md:100vw lg:100vw',
          modifiers: {
            format: 'webp',
            quality: 90,
            //height: 500,
          }})
        console.warn(img)       
        return  `<img
        src="${this.$img(src, { quality: 70 })}"
        srcset="${img.srcset}"
        sizes="${img.sizes}"
      >`
      })
    return html
  }
}
}
