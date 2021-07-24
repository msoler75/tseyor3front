export default {
    data () {
        return {
          scrollPosition: 0      
        }
      },
      mounted() {
        this.handler=window.addEventListener('scroll', this.updateScroll);
      },
      destroy() {
        window.removeEventListener('scroll', this.updateScroll)
      },
      methods: {
        updateScroll() {
          this.scrollPosition = window.scrollY
        }
      }
}