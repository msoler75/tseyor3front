// https://huleos.com/buenas-practicas-de-seo-para-optimizar-tu-web-con-nuxt/

export default {
    head () {
        return {
          title: this.$teaser(this.title || this.ctitle, 58) + ' | TSEYOR',
          meta: [
            {
              hid: "description",
              name:  'description',
              content: this.seodescription
            },
          // Open Graph
          {
            hid: 'og:type',
            property: 'og:type',
            content: this.type || 'website'
          },
          {
            hid: 'og:site_name',
            property: 'og:site_name',
            content: 'TSEYOR'
          },
          {
            hid: 'og:title',
            property: 'og:title',
            content: this.title || this.ctitle
          },
          {
            hid: 'og:description',
            property: 'og:description',
            content: this.seodescription
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: this.image || this.cimage
          },
          // Twitter
          {
            hid: 'twitter:card',
            name: 'twitter:card',
            content: this.seodescription
          },
          {
            hid: 'twitter:site',
            name: 'twitter:site',
            content: this.$config.twitter
          },
          {
            hid: 'twitter:title',
            name: 'twitter:title',
            content: this.title || this.ctitle
          },
          {
            hid: 'twitter:description',
            name: 'twitter:description',
            content: this.seodescription
          },
          {
            hid: 'twitter:image',
            name: 'twitter:image',
            content: this.image || this.cimage
          }
          ],
        }
    },
    computed: {
        seodescription() {
            return this.$teaser(this.description || this.cdescription, 156)
        }
    }
}