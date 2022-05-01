export default (context, inject) => {
  const alert = (options) => {
    if (typeof options === 'string')
      options = {
        message: options
      }
    window.$nuxt.$emit('alert', {
      ...options,
      open: true
    });
  }

  alert.close = (options) => {
    window.$nuxt.$emit('alert', {
      ...options,
      open: false
    });
  }

  inject('alert', alert);
}
