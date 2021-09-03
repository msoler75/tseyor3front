import Path from 'path';

export default {

  target: 'server',

  dev: process.env.NODE_ENV !== 'production',

  router: {
    // base: '/web3/',
    prefetchLinks: false,
    middleware: ['route']
  },

  // https://nuxtjs.org/docs/2.x/directory-structure/nuxt-config#publicruntimeconfig
  publicRuntimeConfig: {
    // baseUrl: process.env.BASE_URL || 'http://tseyor.org',
    publicFolder: Path.resolve(__dirname, 'static')
  },

  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-server
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0', // default: localhost,
    timing: {
      total: true
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Tseyor 3.0',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
      'Grupo Tseyor en representación de la Confederación de Mundos Habitados de la Galaxia' ||
      ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/global.js',
    '~plugins/axios',
    { src: '~plugins/vue-observe-visibility.js', mode: 'client' },
    { src: '~plugins/scrollactive.js', mode: 'client' },
    // { src: '~plugins/nuxt-hammer.js', mode: 'client' },
    // { src: '~plugins/vue-touch.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

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
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://dynamic.blokwise.io/
    '@blokwise/dynamic',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/apollo',
    '@nuxtjs/strapi',
    '@nuxtjs/proxy',
    // Doc: https://github.com/nuxt-community/dotenv-module
    // '@nuxtjs/dotenv',
    '@nuxtjs/auth',
    // https://www.npmjs.com/package/@nuxtjs/svg
    '@nuxtjs/svg',
    // '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/dayjs',
    ['nuxt-gmaps', {key: process.env.MAPS_API_KEY,
      //you can use libraries: ['places']
    }],
    'nuxt-compress',
    // https://github.com/nuxt-community/robots-module
    '@nuxtjs/robots',
    // https://www.npmjs.com/package/vue-social-sharing
    'vue-social-sharing/nuxt',
    // https://github.com/nuxt-community/markdownit-module
    '@nuxtjs/markdownit',
    // ['nuxt-tailvue', {modal: true, toast: true}],
    // https://github.com/Maronato/vue-toastification
    "vue-toastification/nuxt"
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: '/api'
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: '/api/graphql'
      }
    },
    defaultOptions: {
      // See 'apollo' definition
      // For example: default query options
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network'
      }
    }
  },

  /*
   ** Auth module configuration
   ** See https://auth.nuxtjs.org/schemes/local.html#options
   */
  auth: {
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
      }
    }
  },

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
    url: '/api'
    // entities: ['noticias']
  },

  proxy: {
    '/api': {
      target: 'http://localhost:1337',
      pathRewrite: {
        '^/api': '/'
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
    // analyze: true,
    extend(config, { isDev, isClient }) {
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
    // format: 'webp',
    //dir: '',
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
        solid: ['faBars', 'faHeart', 'faDownload', 'faPlay', 'faPause', 'faChevronRight', 'faChevronLeft', 'faChevronDown','faChevronUp', 'faExclamation', 'faSearch', 'faSignInAlt', 'faFileAlt', 'faBook', 'faComments', 'faMusic', 'faSitemap', 'faRoute', 'faBolt', 'faHeadphones', 'faBroadcastTower', 'faLink', 'faBalanceScale', 'faScroll', 'faArrowRight', 'faFilePdf', 'faFileAudio', 'faHome', 'faUser', 'faMapMarkedAlt', 'faThLarge', 'faCheckCircle', 'faInfoCircle', 'faCheck', 'faShareAlt', 'faCalendarDay', 'faPaperclip', 'faCalendarAlt', 'faGlobe', 'faHourglass', 'faDonate', 'faQuestion', 'faQuestionCircle', 'faTree', 'faBookOpen', 'faFolderOpen', 'faUsers', 'faGavel', 'faFileSignature', 'faWalking', 'faMapSigns', 'faCalendarWeek', 'faPeopleCarry', 'faLocationArrow', 'faCircle', 'faUserAstronaut', 'faEdit', 'faNewspaper', 'faBullhorn', 'faPenAlt', 'faRss', 'faFastBackward', 'faGlobeAmericas', 'faGraduationCap', 'faHandsHelping', 'faChessRook', 'faUniversity', 'faPlayCircle', 'faExchangeAlt', 'faEnvelopeOpenText', 'faBriefcaseMedical', 'faChalkboardTeacher', 'faCaretRight', 'faCaretLeft', 'faStepBackward', 'faStepForward', 'faSignOutAlt', 'faDoorOpen'],
        regular: ['faHeart', 'faComments', 'faClipboard', 'faFrown', 'faComment', 'faCalendarAlt', 'faUser'],
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
    typographer:  true, // ... → …    (c) => ©     (tm) (TM) → ™
    // autofill: true, // for markdown-it-imsize
    use: [
      'markdown-it-div',
      '@gerhobbelt/markdown-it-attrs',
      // '@jochenlinnemann/markdown-it-imsize'
    ]
  },

  // https://github.com/Maronato/vue-toastification
  toast: {
    timeout: 5000,
    closeOnClick: true
  }  

}
