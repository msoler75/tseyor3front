export default {
  data() {
    return {
      errors: {
        message: '',
      },
      thereErrors: false
    }
  },
  computed: {
    erroresJSON() {
      return JSON.stringify(this.errors)
    }
  },
  watch: {
    erroresJSON(newValue) {
      console.log('watch erroresJSON', newValue)
      this.thereErrors = false
      const keys = Object.keys(this.errors)
      console.log('keys', keys)
      for (const key of keys) {
        console.log(`this.errors[${key}]`, this.errors[key])
        if (this.errors[key])
          this.thereErrors = true
      }
      console.log('thereErrores', this.thereErrors)
    }
  },
  methods: {
    clearErrors() {
      console.log('clearErrors')
      for (const e in this.errors)
        this.errors[e] = ''
    },
    translate(msg) {
      if(!msg||typeof msg!=='string') return msg
      if(msg.match('Error occured while trying to proxy'))
      return 'Servicio no disponible'
      return msg
        .replace('Request failed with status code 403', 'Acceso denegado')
        .replace('Request failed with status code 400', 'Error en los datos')
        .replace('errors occurred', 'errores encontrados')
        .replace('must be one of the following values', 'debe ser uno de estos valores')
        .replace('must be defined', 'debe estar definido')
        .replace('must be at least', 'debe ser de al menos')
        .replace('characters', 'caracteres')
        .replace('Policy Failed', 'Permiso denegado')
        .replace('Invalid identifier or password', 'Identificador o contraseña no válidos')
        .replace('Forbidden', 'No tienes permisos')        
    },
    inputClassError(field) {
      return this.errors[field] ? 'border-4 border-red' : ''
    },
    setErr(error) {
      console.log('setErr', JSON.stringify(error))
      console.log('errmess', error.message, this.translate(error.message))
      let firstEl = null
      //if(response.error)
      console.log('1')
      this.$set(this.errors, 'message', this.translate(error.message))
      console.log('this.errors', this.errors)
      console.log('status', error.status)
      switch (error.status) {
        case 400:
          console.log('400')
          if (error.details && error.details.errors)
            for (const specific of error.details.errors) {
              console.log(specific)
              const field = specific.path[0]
              console.log('field', field)
              this.$set(this.errors, field, this.translate(specific.message))
              if (!firstEl)
                firstEl = document.querySelector("#" + field)
            }
          break;
      }
      if (firstEl)
        this.$scrollTo(firstEl, 500, {
          offset: -250
        })
      console.log('this.errors', this.errors)
    }
  }
}
