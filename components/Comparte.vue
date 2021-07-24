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
          :url="url"
          :title="title"
          :description="description"
          hashtags="tseyor,blogs"
          class="flex items-center bg-light-blue-200 rounded"
        >
          <div class="bg-blue mr-5 bg-white text-blue-700 py-1 px-2">
            <icon icon="fab fa-facebook" class="text-2xl" />
          </div>
          <span class="py-1 px-2 text-blue-contrast">Compartir on Facebook</span>
        </ShareNetwork>

        <ShareNetwork
          network="twitter"
          :url="url"
          :title="title"
          :description="description"
          hashtags="tseyor,blogs"
          twitterUser="TSEYOR"
          class="flex items-center bg-blue-900 rounded"
        >
            <div class="bg-blue mr-5 bg-white text-light-blue py-1 px-2">
            <icon icon="fab fa-twitter" class="text-2xl" />
          </div>
          <span class="py-1 px-2 text-blue-contrast">Compartir on Twitter</span>
        </ShareNetwork>
        </Grid>
      </Card>
    </Glass>
  </FadeTransition>
</template>

<script>
export default {
  props: {
    value: {}
  },
  data() {
    return {
      showing: this.value,
      url: this.$config.baseUrl + this.$route.fullPath,
      title: "Os comparto esta información...",
      description: "Descripción detallada..."
    };
  },
  watch: {
    showing(value) {
      this.$emit("input", value);
    },
    value(value) {
      this.showing = value;
    }
  }
};
</script>
