export default {
  data() {
    return {
      mostrarComentarios: false,
      viendoCompartir: false,
      relacionados: []
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
    cdate() {
      return this.date || this.fecha || (this.contenido ? this.contenido.publishedAt : null)
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
          (this.contenido.slug || this.contenido.id)
        );
      }
      return r;
    },
    ctext() {
      return (
        this.text ||
        !this.contenido ? '' :
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
      let src = this.image || this.imagen || (this.contenido?(this.contenido.image || this.contenido.imagen):'')
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
  async mounted() {
    // CARGA Nº de COMENTARIOS
    this.$set(this.contenido, 'comentarios', await this.$strapi.count('comentarios', {
      filters: {
        uid: {
          $eq: this.uid
        }
      }
    }))
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
          return `<img
          src="${this.$img(src, { quality: 70 })}"
          srcset="${img.srcset}"
          sizes="${img.sizes}"
        >`
        })
      return html
    },
    async cargarRelacionados() {
      if (!this.relacionados||!this.relacionados.length) {
        const {
          data: relacionados
        } = await this.$strapi.find(this.ccoleccion, {
          filters: {
            id: {
              $ne: this.contenido.id,
              $gt: this.contenido.id - 10,
              $lt: this.contenido.id + 10,
            }
          },
          populate: {
            imagen: {
              fields: ['url', 'width', 'height']
            }
          },
          pagination: {
            limit: 7
          }
        })
        this.relacionados = relacionados
      }
    }
  }
}
