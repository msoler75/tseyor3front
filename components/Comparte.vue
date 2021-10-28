<template>
  <FadeTransition>
    <Glass
      v-show="showing"
      class="fixed left-0 top-0 w-screen h-screen z-50 bg-black bg-opacity-80 flex justify-center items-center"
      @click.native="showing = false"
    >
      <Card class="p-2 sm:p-4">
        <Grid class="cols-none gap-4">
          <ShareNetwork
            network="facebook"
            :url="curl"
            :title="title"
            :description="description"
            hashtags="tseyor,blogs"
            class="flex select-none transition duration-200 font-semibold rounded-lg items-center bg-light-blue-200"
          >
            <div class="bg-blue mr-5 bg-white text-blue-700 py-1 px-2">
              <icon icon="fab fa-facebook" class="text-2xl" />
            </div>
            <span class="py-1 px-2 text-blue-contrast">Compartir on Facebook</span>
          </ShareNetwork>

          <ShareNetwork
            network="twitter"
            :url="curl"
            :title="title"
            :description="description"
            hashtags="tseyor,blogs"
            twitterUser="TSEYOR"
            class="flex select-none transition duration-200 font-semibold rounded-lg items-center bg-blue-900"
          >
            <div class="bg-blue mr-5 bg-white text-light-blue py-1 px-2">
              <icon icon="fab fa-twitter" class="text-2xl" />
            </div>
            <span class="py-1 px-2 text-blue-contrast">Compartir on Twitter</span>
          </ShareNetwork>

          <div @click="copy">
            <div class="text-center cursor-pointer btn btn-gray"><icon icon="copy" class="mr-2"/> Copiar en el portapapeles</div>
          </div>
        </Grid>
      </Card>
    </Glass>
  </FadeTransition>
</template>

<script>
export default {
  props: {
    url: {},
    value: {}
  },
  data() {
    return {
      showing: this.value,
      title: "Os comparto esta información...",
      description: "Descripción detallada..."
    };
  },
  computed: {
    curl() {
      return this.$config.baseUrl + (this.url || this.$route.fullPath)
    }
  },
  watch: {
    showing(value) {
      this.$emit("input", value);
    },
    value(value) {
      this.showing = value;
    }
  },
  methods: {
    copy() {
      if (navigator.clipboard) {
        const cb = navigator.clipboard
        cb.writeText(this.curl).then(() => alert('Enlace copiado'));
      } else {
        // old browsers:
        const body = document.querySelector('body');
        const area = document.createElement('textarea');
        body.appendChild(area);

        area.value = this.curl
        area.select();
        document.execCommand('copy')
        body.removeChild(area);
      }
    },
  }
};
</script>
