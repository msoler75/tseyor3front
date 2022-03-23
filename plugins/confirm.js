export default (context, inject) => {
    const confirm = {
      open: (options) => {
        window.$nuxt.$emit('confirm', { ...options, open: true });
      },
      close: (options) => {
        window.$nuxt.$emit('confirm', { ...options, open: false });
      }
    };
    inject('confirm', confirm);
  };