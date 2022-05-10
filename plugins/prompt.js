export default (context, inject) => {
  const prompt = (options) => {
    if (typeof options === 'string')
    options = {
      message: options
    }
    window.$nuxt.$emit('prompt', {
      ...options,
      open: true
    });
  }

  prompt.close = (options) => {
    window.$nuxt.$emit('prompt', {
      ...options,
      open: false
    });
  }
  
  inject('prompt', prompt);
}
