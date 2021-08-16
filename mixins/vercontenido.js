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
      .replace(/<img[^>]+>/g, (p0, p1, offset, s) =>
      {
        const data = p0.match(/src=['"]([^'"]+)['"]/)
        if(!data||!data[1]) return p0
        // const src = this.$img(data[1], {sizes: "xs:100vw xm:100vw sm:100vw md:100vw lg:100vw xl:100vw"})
        // if(!src) return p0
        const xs = this.$img(data[1], {width: 320})
        const xm = this.$img(data[1], {width: 480})
        const sm = this.$img(data[1], {width: 640})
        const md = this.$img(data[1], {width: 768})
        const lg = this.$img(data[1], {width: 1024})
        // const xl = this.$img(data[1], {fit:'cover', width: 1280})
        // const xxl = this.$img(data[1], {fit:'cover', width: 1536})
        return  `<picture loading='lazy'>
  <source media="(min-width: 320px)"
          sizes="100vw"
          srcset="${xs} 320w,
                  ${xm} 480w,
                  ${sm} 640w,
                  ${md} 768w,
                  ${lg} 1024w">
  <img src="${lg}" loading='lazy'
       sizes="100vw"
       srcset="${xs} 320w,
              ${xm} 480w,
              ${sm} 640w,
              ${md} 768w,
              ${lg} 1024w">
</picture>`
      })
    return html
  }
}
}
