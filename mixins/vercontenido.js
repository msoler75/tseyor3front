export default {
  data() {
    return {
      mostrarComentarios: false,
      viendoCompartir: false
    };
  },
  computed: {
    id() {
      return parseInt(this.$route.params.id)
    },
    /* contenidoJSON () {
      return JSON.stringify(this.contenido)
    }, */
    ctitle() {
      const t = this.contenido ? this.contenido.titulo || this.contenido.titular || this.contenido.name || this.contenido.nombre : ''
      return t
    },
    cdescription() {
      if (this.contenido)
        return (this.contenido.descripcion || this.contenido.texto || this.contenido.frase || '').substr(0, 576)
      return (this.description || this.descripcion || '').substr(0, 576)
    },
    cclase() {
      return (
        this.type ||
        this.contenido.class ||
        this.contenido.table ||
        this.contenido.tabla ||
        this.contenido.clase)
    },
    chref() {
      const r = this.href || this.contenido.href || this.contenido.url || this.contenido.enlace;
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
    cclase() {
      return this.contenido ? this.contenido.clase : 'default'
    },
    cimage() {
      let src = this.image || this.imagen || this.contenido.image || this.contenido.imagen;
      if (Array.isArray(src)) src = src[0]
      if (src && typeof src === 'object')
        src = src.url
      // if (src && src.search("/") > -1) return src;
      // return "./imagenes/" + src;
      return src
    },
    imageBg() {
      const imgUrl = this.$img(this.cimage, {
        width: '100%',
        format: 'webp',
        quality: 70
      })
      return {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        zIndex: -1
      }
    },
    ccollection() {
      if (this.collection && typeof this.collection == 'string')
        return this.collection
      const parts = this.$route.path.split('/')
      return parts[parts.length - 2]
    },
    uid() {
      return `/${this.ccollection}/${this.contenido.id}`
    }
  },
  methods: {
    renderMarkdown(md) {
      let html = this.$md.render(md)
      html = html
        .replace(/(<img[^>]+>)<br \/>\n?\s*(<img)/gm, '$1\n$2')
        .replace(/(<img[^>]+>)<br \/>\n?\s*(<img)/gm, '$1\n$2')
        .replace(/<p[^>]*>(?:<strong>)?((?:\s*<img[^>]+>[\s\n]*)+)(?:<\/strong>)?<\/p>/gm, '$1')
        .replace(/<p[^>]*>(<img[^>]+>)<br\s*\/?>\n(.+?)<\/p>/g, '<figure>$1<figcaption>$2</figcaption></figure>')
        .replace(/<img[^>]+>/g, (p0) => {
          const data = p0.match(/src=['"]([^'"]+)['"]/)
          if (!data || !data[1]) return p0
          const src = data[1]
          const img = this.$img.getSizes(src, {
            sizes: 'xs:100vw xm:100vw sm:100vw md:100vw lg:100vw',
            modifiers: {
              format: 'webp',
              quality: 90,
              //height: 500,
            }
          })
          console.warn(img)
          return `<img
          src="${this.$img(src, { quality: 70 })}"
          srcset="${img.srcset}"
          sizes="${img.sizes}"
        >`
        })
      return html
    },
    // ---- LIKES ----
    /*async like(id) {
      if (!this.$strapi.user) return
      // console.log('like', id)
      this.likedItem(id)
      //this.$strapi.$http.setToken(this.$auth.getToken('local'))
      //this.$strapi.
      // await this.$strapi.$http.$put(`/${this.collection}/${id}/like`)

      await this.$strapi.create("likes", {
          uid: this.uid
        })
        .then(like => {
          this.$strapi.create('historials', {
            accion: 'like_contenido',
            titulo: this.ctitle,
            url: this.uid
          })
        })
      // este paso es opcional:
      // this.refreshItem(id);
    },
    async dislike(id) {
      if (!this.$strapi.user) return
      // console.log('dislike', id)
      this.dislikedItem(id)
      //this.$strapi.$http.setToken(this.$auth.getToken('local'))
      // await this.$strapi.$http.$put(`/${this.collection}/${id}/dislike`)
      const results = await this.$strapi.find('likes', {
        uid: this.uid,
        user: this.$strapi.user.id
      })
      if (results.length) {
        await this.$strapi.$http.$delete(`/likes/${results[0].id}`)
        // este paso es opcional:
        // this.refreshItem(id);
      }
    },
    async refreshItem(id) {
      const likes = await this.$strapi.find('likes', {
        uid: this.uid
      })
      this.saveRefreshedItem(id, likes)
    },
    
    // ---- end LIKES ----
    */

    likedItem(id) {
      if(!this.$strapi.user) return
      if (this.contenido.likes)
        this.contenido.likes.push({
          usuario: this.$strapi.user
        })
    },
    dislikedItem(id) {
      if(!this.$strapi.user) return
      if (this.contenido.likes) {
        console.log('disliked', id, this.contenido.likes)
        const idx = this.contenido.likes.findIndex(x => x.usuario.id === this.$strapi.user.id)
        if (idx > -1) this.contenido.likes.splice(idx, 1)
      }
    },
    saveRefreshedItem(id, likes) {
      this.$set(this.contenido, 'likes', likes)
    },
  }
}
