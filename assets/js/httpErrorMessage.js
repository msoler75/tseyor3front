export default function(code) {
    switch (code) {
      case 400:
        return 'No se pudo interpretar la solicitud'
      case 401:
        return 'Requiere autenticación'
      case 403:
        return 'Acceso denegado'
      case 404:
        return 'Página no encontrada'
      case 405:
        return 'Método no permitido'
      case 406:
        return 'No se encontró contenido apropiado'
      case 408:
        return 'El tiempo de espera de respuesta caducó'
      case 415:
        return 'Tipo de multimedia no soportado'
      case 429:
        return 'Demasiadas solicitudes'
      case 431:
        return 'Campos de encabezado demasiado largos'
      case 503:
        return 'Servicio no disponible temporalmente'
      case 500:
        return 'Error interno'
      case 501:
        return 'No implementado'
      case 502:
        return 'Bad Gateway'
      case 504:
        return 'No se pudo obtener respuesta'
      case 505:
        return 'Versión HTTP no soportada'
    }
    return 'Error no reconocido'
  }
  