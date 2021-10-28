export default {
    data() {
        return {
            errors: {},
        }
    },
    methods: {
        clearErrors() {
            for (const e in this.errors)
                this.errors[e] = ''
        },
        translate(msg) {
            return msg
            .replace('must be defined', 'debe estar definido')
            .replace('must be at least', 'debe ser de al menos')
            .replace('characters', 'caracteres')
        },
        fieldValidate(field) {
            return this.errors[field] ? 'border-4 border-red' : ''
        },
        setErr(err) {
            let firstEl = null
            if (err.response.data.message === 'ValidationError') {
                const errors = err.response.data.data.errors
                for (const field in errors) {
                    this.$set(this.errors, field, this.translate(errors[field].join(', ')))
                    if (!firstEl)
                        firstEl = document.querySelector("#" + field)
                }
            }

            if (firstEl)
                this.$scrollTo('#' + firstEl.id, 500, { offset: -250 })
        }
    }
}