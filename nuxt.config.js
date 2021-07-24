import { resolve } from 'path'

export default {

  target: 'server',

  dev: process.env.NODE_ENV !== 'production',

  router: {
    // base: '/web3/',
    prefetchLinks: false,
    middleware: 'route'
  },

  // https://nuxtjs.org/docs/2.x/directory-structure/nuxt-config#publicruntimeconfig
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL || 'http://tseyor.org',
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
    link: process.env.NODE_ENV === 'production'
      ? [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
      : [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
          {
            hid: '',
            rel: 'stylesheet',
            href: '/fontawesome-free-5.15.1-web/css/all.min.css'
          },
          {
            rel: 'stylesheet',
            href: 'https://unicons.iconscout.com/release/v4.0.0/css/thinline.css'
          },
          {
            rel: 'stylesheet',
            href: 'https://unicons.iconscout.com/release/v4.0.0/css/line.css'
          }
        ],
    script:
      process.env.NODE_ENV === 'production'
        ? [
           {
              hid: 'fontawesome',
              src: 'https://kit.fontawesome.com/eb9a85c3fc.js',
              defer: true
            }
          ]
        : []
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/global.js',
    { src: '~plugins/scrollactive.js', mode: 'client' },
    // { src: '~plugins/nuxt-hammer.js', mode: 'client' },
    { src: '~plugins/vue-touch.js', mode: 'client' },
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
    // '@nuxtjs/fontawesome',
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
    // Doc: https://github.com/nuxt-community/dotenv-module
    // '@nuxtjs/dotenv',
    // '@nuxtjs/auth',
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
  ],


  alias: {
    'ximages': resolve(__dirname, './assets/images'),
    'svg': resolve(__dirname, './assets/svg'),
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // baseURL: process.env.API_AUTH_URL
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.BACKEND_URL || 'http://localhost:1337/graphql'
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
            url: 'auth/local',
            method: 'post',
            propertyName: 'jwt'
          },
          user: {
            url: 'users/me',
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
    manifest: {
      lang: 'es'
    }
  },

  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    entities: ['noticias']
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
  },

  // https://image.nuxtjs.org/api/options/
  image: {
    // format: 'webp',
    presets: {
      vcard: {
        modifiers: {
          fit: 'cover',
          width: 380,
          heigt: 200
        }
      },
      hcard: {
        modifiers: {
          fit: 'cover',
          width: 200,
          heigt: 380
        }
      },
      avatar: {
        modifiers: {
          width: 150,
          height: 150
        }
      }
    },
    dir: 'assets/images',
    provider: 'ipx'
  },

  // https://image.nuxtjs.org/providers/ipx/
  serverMiddleware: {
    '/_ipx': '~/server/middleware/ipx.js'
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
      suffix: true,
      icons: { 
        // list the icons you want to add, not listed icons will be tree-shaked
        solid: [
          'faHome',
          'faHeart'
        ],
        // include all icons. But dont do this.
        regular: [],
        brands: ['']
      }
  },

  // [optional] markdownit options
  // See https://github.com/markdown-it/markdown-it
  markdownit: {
    runtime: true, // Support `$md()`
    preset: 'default',
    linkify: true,
    breaks: true,
    use: [
      'markdown-it-div',
      '@gerhobbelt/markdown-it-attrs'
    ]
  },

}
