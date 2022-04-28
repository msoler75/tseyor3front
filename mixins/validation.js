export default {
  data() {
    return {
      errors: {
        message: ''
      },
    }
  },
  methods: {
    clearErrors() {
      for (const e in this.errors)
        this.errors[e] = ''
    },
    translate(msg) {
      return msg
        .replace('Request failed with status code 403', 'Acceso denegado')
        .replace('Request failed with status code 400', 'Error en los datos')
        .replace('errors ocurred', 'errores encontrados')
        .replace('must be one of the following values', 'debe ser uno de estos valores')
        .replace('must be defined', 'debe estar definido')
        .replace('must be at least', 'debe ser de al menos')
        .replace('characters', 'caracteres')
    },
    fieldValidate(field) {
      return this.errors[field] ? 'border-4 border-red' : ''
    },
    setErr(error) {
      console.log('setErr', JSON.stringify(error))
      this.errors.message = this.translate(error.message)
      let firstEl = null
      //if(response.error)
      console.log('1')
      this.errors.message = this.translate(error.message)
      console.log('status', error.status)
      switch (error.status) {
        case 400:
          console.log('400')
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
        this.$scrollTo('#' + firstEl.id, 500, {
          offset: -250
        })
    }
  }
}
