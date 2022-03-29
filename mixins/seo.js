// https://huleos.com/buenas-practicas-de-seo-para-optimizar-tu-web-con-nuxt/
// https://masteringnuxt.com/blog/setting-up-nuxt-for-social-cards-and-meta-tags-to-improve-seo

export default {
  head () {
    return {
      title: this.$teaser(this.seotitle, 58) + ' | TSEYOR',
      meta: [
        {
          hid: 'description',
          name: 'description',
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
          content: this.seotitle
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
          content: this.seotitle
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
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.seourl
        }
      ]
    }
  },
  jsonld () {
    return {
      '@context': 'http://schema.org',
      '@type': 'WebPage',
      name: this.seotitle + ' | TSEYOR',
      url: this.seourl,
      description: this.seodescription,
      "publisher": {
        "@type": "Organization",
        "name": this.$config.organizationName,
        "url": this.$config.baseUrl,
        "logo": this.$config.baseUrl + this.$config.imageLogoPath 
      },
    }
  },
  computed: {
    seotitle () {
      return this.ctitle || this.title || 'TSEYOR'
    },
    seodescription () {
      return this.$teaser(this.description || this.cdescription, 156)
    },
    seourl () {
      return this.$config.baseUrl + (this.url || this.$route.fullPath)
    }
  }
}
