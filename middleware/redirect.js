//import route from './route'

export default function (ctx) {
  // console.log('ctx!',ctx)
  let { route, redirect } = ctx
  // console.warn('route.path', route.path)
  const redirects = [
    /*{
      from: '/archivos',
      to: '/archivos/'
    }*/
  ]
  const mustRedirect = redirects.find(r => r.from === route.path)
  // console.warn('mustRedirect', mustRedirect)

  if (mustRedirect) redirect(mustRedirect.to)
}
