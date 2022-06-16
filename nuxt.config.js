import Path from 'path'

export default {

  target: 'server',

  dev: process.env.NODE_ENV !== 'production',

  router: {
    // base: '/web3/',
    prefetchLinks: false,
    middleware: ['route'],
    // mode:'history'
  },

  /* serverMiddleware: [
    '~/middleware/redirects.js'
  ], */

  // https://nuxtjs.org/docs/2.x/directory-structure/nuxt-config#publicruntimeconfig
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL || 'https://tseyor.org',
    siteName: 'TSEYOR',
    organizationName: 'TSEYOR | ONG Mundo Armónico TSEYOR',
    imageLogoPath: '/imagenes/sello.png',
    publicFolder: Path.resolve(__dirname, 'static'),
    twitter: '@TSEYOR',
    defaultImage: '/imagenes/poster-tseyor.jpg',
    defaultUserImage: '/imagenes/usuario.jpg',
    archivosRuta: '/archivos',
    meilisearchUrl: process.env.MEILISEARCH_URL || 'http://localhost:7700',
    meilisearchKey: process.env.MEILISEARCH_KEY,
    strapiUrl: 'http://localhost:3000/api'
  },


  pageTransition: {
    name: 'page',
    mode: 'out-in', // orden de páginas, primero desaparece (out) la página actual y luego aparece (in) la página nueva
    beforeEnter(el) {
      console.log('nuxt.config.beforeEnter', el)
      this.$store.dispatch('beforeEnter', el)
    },
    beforeRouteUpdate(to, from, next) {
      console.log('nuxt.config.beforeEnterUpdate')
    },
    beforeRouteEnter(to, from, next) {
      console.log('nuxt.config.beforeRouteEnter')
    },
    beforeRouteLeave(to, from, next) {
      console.log('nuxt.config.beforeRouteLeave')
      //this.$store.dispatch('beforeRouteLeave', from, next)
    },
    afterEnter(el) {
      console.log('nuxt.config.afterEnter', el);
    },
    beforeLeave(el, from, to) {
      console.log('nuxt.config.beforeLeave', el, from, to)
    },
    afterLeave(el) {
      console.log('nuxt.config.afterLeave', el)
    },
  },

  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-server
  server: {
    // port: process.env.PORT || 3000, // default: 3000
    // host: process.env.HOST || '0.0.0.0', // default: localhost,
    timing: {
      total: true
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Tseyor 3.0',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Grupo Tseyor en representación de la Confederación de Mundos Habitados de la Galaxia' ||
          ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // '~plugins/axios',
    '~plugins/strapi.js',
    '~plugins/global.js',
    '~plugins/borradores.js',
    {
      src: '~plugins/vue-observe-visibility.js',
      mode: 'client'
    },
    {
      src: '~plugins/scrollto.js',
      mode: 'client'
    },
    {
      src: '~plugins/meilisearch.js',
      mode: 'client'
    },
    // { src: '~plugins/nuxt-hammer.js', mode: 'client' },
    // { src: '~plugins/vue-touch.js', mode: 'client' },
    {
      src: '~plugins/window-confirm.js',
      mode: 'client'
    },
    {
      src: '~plugins/window-prompt.js',
      mode: 'client'
    },
    {
      src: '~plugins/window-alert.js',
      mode: 'client'
    },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,

  components: {
    dirs: [
      '~/components',
      '~/components/principales',
      '~/components/archivos',
    ]
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    // '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://nuxtjs.org/blog/going-dark-with-nuxtjs-color-mode
    '@nuxtjs/color-mode',
    // https://github.com/nuxt-community/stylelint-module
    //'@nuxtjs/stylelint-module'
    // https://github.com/nuxt-community/device-module
    '@nuxtjs/device',
    // https://github.com/nuxt-community/fontawesome-module
    '@nuxtjs/fontawesome',
    // https://github.com/harlan-zw/nuxt-build-optimisations
    // 'nuxt-build-optimisations'
  ],

  buildOptimisations: {
    profile: process.env.NODE_ENV === 'development' ? 'risky' : 'experimental'
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://dynamic.blokwise.io/
    '@blokwise/dynamic',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    // '@nuxtjs/pwa',
    // '@nuxtjs/apollo',
    //'@nuxtjs/strapi',
    '@nuxtjs/proxy',
    // Doc: https://github.com/nuxt-community/dotenv-module
    // '@nuxtjs/dotenv',
    // '@nuxtjs/auth',
    // https://www.npmjs.com/package/@nuxtjs/svg
    '@nuxtjs/svg',
    // '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/dayjs',
    ['nuxt-gmaps', {
      key: process.env.MAPS_API_KEY,
      //you can use libraries: ['places']
    }],
    // 'nuxt-compress',
    // https://github.com/nuxt-community/robots-module
    // '@nuxtjs/robots',
    // https://www.npmjs.com/package/vue-social-sharing
    'vue-social-sharing/nuxt',
    // https://github.com/nuxt-community/markdownit-module
    '@nuxtjs/markdownit',
    // ['nuxt-tailvue', {modal: true, toast: true}],
    // https://github.com/Maronato/vue-toastification
    "vue-toastification/nuxt",
    ['vue-scrollto/nuxt', {
      // default options
      container: "body",
      duration: 800,
      easing: "ease",
      offset: -120,
      force: true
    }],
    'portal-vue/nuxt'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // baseURL: '/api' 
  },


  loading: '~/components/Loading.vue',

  /*
   ** Auth module configuration
   ** See https://auth.nuxtjs.org/schemes/local.html#options
   */
  /*auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/auth/local',
            method: 'post',
            propertyName: 'jwt'
          },
          user: {
            url: '/api/users/me',
            method: 'get',
            propertyName: false
          },
          logout: false
        }
      },
      tokenRequired: true,
      tokenType: 'bearer'
    }
  }, */

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      author: 'Pigmalión',
    },
    manifest: {
      lang: 'es',
    }
  },

  strapi: {
    url: '/api',
    entities: ['noticias', 'comunicados']
  },

  proxy: {
    '/api': {
      target: process.env.STRAPI_URL || 'http://localhost:1337',
      /* pathRewrite: {
        '^/api': '/'
      } */
    },
    '/tseyor': {
      target: 'https://tseyor.org',
      pathRewrite: {
        '^/tseyor': '/'
      }
    }
  },

  tailwindcss: {
    // add '~tailwind.config` alias
    // exposeConfig: true
  },

  // https://tailwindcss.nuxtjs.org/examples/dark-mode
  colorMode: {
    classSuffix: ''
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', {
          loose: true
        }],
        ["@babel/plugin-proposal-private-property-in-object", {
          "loose": true
        }]
      ]
    },
    // analyze: true,
    extend(config, {
      isDev,
      isClient
    }) {
      // https://github.com/plotly/plotly.py/issues/2790
      config.node = {
        fs: 'empty',
      }

      if (isDev) {
        config.devtool = isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },

  // https://image.nuxtjs.org/api/options/
  image: {
    domains: ['https://storage.googleapis.com'],
    // format: 'webp',
    // dir: Path.resolve(__dirname, 'static'),
    provider: 'ipx',
    // The screen sizes predefined by `@nuxt/image`:
    screens: {
      xs: 320,
      xm: 480,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    },
  },

  // Optional
  dayjs: {
    locales: ['es'],
    defaultLocale: 'es',
    defaultTimeZone: 'Europe/Madrid',
    plugins: [
      'utc', // import 'dayjs/plugin/utc'
      'timezone',
      'relativeTime'
    ] // Your Day.js plugin
  },


  'nuxt-compress': {
    gzip: {
      threshold: 8192,
    },
    brotli: {
      threshold: 8192,
    },
  },

  robots: {
    UserAgent: '*',
    Disallow: '/admin'
  },

  // https://github.com/nuxt-community/device-module
  device: {
    refreshOnResize: true
  },

  fontawesome: {
    component: 'fa',
    // suffix: true,
    icons: {
      // list the icons you want to add, not listed icons will be tree-shaked
      solid: ['faBars', 'faHeart', 'faDownload', 'faPlay', 'faPause', 'faChevronRight', 'faChevronLeft', 'faChevronDown', 'faChevronUp', 'faExclamation', 'faExclamationTriangle', 'faSearch', 'faSignInAlt', 'faFile', 'faFileAlt', 'faFileImage', 'faFileAudio', 'faFileVideo', 'faFilePowerpoint', 'faFileWord', 'faFilePdf', 'faFileArchive', 'faBook', 'faComments', 'faMusic', 'faSitemap', 'faRoute', 'faBolt', 'faHeadphones', 'faBroadcastTower', 'faLink', 'faBalanceScale', 'faScroll', 'faArrowLeft', 'faArrowRight', 'faHome', 'faUser', 'faMapMarkedAlt', 'faList', 'faThLarge', 'faCheckCircle', 'faInfoCircle', 'faCheck', 'faShareAlt', 'faCalendarDay', 'faPaperclip', 'faCalendarAlt', 'faGlobe', 'faHourglass', 'faDonate', 'faQuestion', 'faQuestionCircle', 'faTree', 'faBookOpen', 'faFolderOpen', 'faFolder', 'faUsers', 'faGavel', 'faFileSignature', 'faWalking', 'faMapSigns', 'faCalendarWeek', 'faPeopleCarry', 'faLocationArrow', 'faCircle', 'faFeatherAlt', 'faEdit', 'faNewspaper', 'faBullhorn', 'faPenAlt', 'faRss', 'faFastBackward', 'faGlobeAmericas', 'faGraduationCap', 'faHandsHelping', 'faHandPaper', 'faChessRook', 'faUniversity', 'faPlayCircle', 'faExchangeAlt', 'faEnvelopeOpenText', 'faBriefcaseMedical', 'faChalkboardTeacher', 'faCaretRight', 'faCaretLeft', 'faStepBackward', 'faStepForward', 'faSignOutAlt', 'faDoorOpen', 'faHiking', 'faBell', 'faSync', 'faPlusSquare', 'faTrash', 'faTrashRestore', 'faCrop', 'faEye', 'faEyeSlash', 'faEnvelope', 'faPaperPlane', 'faCopy', 'faCut', 'faPaste', 'faImages', 'faUpload', 'faCloudUploadAlt', 'faSpinner', 'faTimes', 'faFolderPlus', 'faFileUpload', 'faMicrophone', 'faTasks', 'faCog', 'faSquare', 'faCheckSquare', 'faHistory'],
      regular: ['faHeart', 'faSquare', 'faComments', 'faClipboard', 'faFrown', 'faComment', 'faCalendarAlt', 'faUser', 'faBell', 'faClock', 'faEnvelope', 'faTrashAlt'],
      // include all icons. But dont do this.
      //regular: true, 
      brands: ['faFacebook', 'faTwitter', 'faYoutube', 'faWhatsapp', 'faTelegram', 'faInstagram', 'faPinterest', 'faBlogger']
    }
  },

  // [optional] markdownit options
  // See https://github.com/markdown-it/markdown-it
  markdownit: {
    html: true, // Enable HTML tags in source
    runtime: true, // Support `$md()`
    // preset: 'default',
    xhtmlOut: true,
    linkify: true,
    breaks: true,
    typographer: true, // ... → …    (c) => ©     (tm) (TM) → ™
    // autofill: true, // for markdown-it-imsize
    use: [
      'markdown-it-div',
      '@gerhobbelt/markdown-it-attrs',
      // '@jochenlinnemann/markdown-it-imsize'
    ]
  },

  // https://github.com/Maronato/vue-toastification
  toast: {
    position: "bottom-left",
    timeout: 5000,
    closeOnClick: true,
    hideProgressBar: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    closeButton: "button",
    rtl: false,
  }

}
