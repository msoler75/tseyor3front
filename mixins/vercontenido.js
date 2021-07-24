export default {
  head () {
    return {
      title: this.$teaser(this.title, 48) + ' — TSEYOR'
    }
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
      const src = this.image || this.contenido.image || this.contenido.imagen;
      if (src && src.search("/") > -1) return src;
      return "./images/" + src;
    }
  },
  watch: {
    contenidoJSON (value) {
      console.log('noticias_id, watch title =', value)
      // this.$store.commit('setTitle', this.title)
    }
  }
}
