export default function ({redirect, route, $strapi}) {
    if (!$strapi.user) {
      return redirect('/ingresar?desde='+route.path)
    }
  }