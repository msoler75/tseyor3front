export default (context, inject) => {
  const confirm = (options) => {
    window.$nuxt.$emit('confirm', {
      ...options,
      open: true
    });
  }

  confirm.close = (options) => {
    window.$nuxt.$emit('confirm', {
      ...options,
      open: false
    });
  }
  
  inject('confirm', confirm);
}
