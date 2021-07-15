import https from 'https'

export default function ({ $axios, redirect }) {
  const agent = new https.Agent({
    rejectUnauthorized: false
  })

  // Axios default options
  $axios.defaults.baseURL = process.env.apiBaseUrl
  $axios.setHeader('Content-Type', 'application/json')
  $axios.setHeader('Access-Control-Allow-Origin', '*')

  $axios.onRequest(config => {
    config.httpsAgent = agent
  })

  $axios.onError(({ response }) => {
    const statusCode = response.status
    const data = response.data
    switch (statusCode) {
      case 401:
        redirect('/session-expired')
        break
      case 404:
        const path = '/404'
        redirect(path)
        break
      case 500:
        return this.$nuxt.error({ statusCode })
      default:
        return false
    }
  })
}
