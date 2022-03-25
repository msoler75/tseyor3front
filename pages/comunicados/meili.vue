<template>
  <div class="catalogo-comunicados container max-w-4xl mx-auto">
    <div class="px-1 xs:px-3 sm:px-7">
      <div class="mb-7">
        <h1>Comunicados Recientes</h1>
        <p>
          Aquí se publican los últimos comunicados, que progresivamente se van archivando en nuestro
          <NLink
            to="/biblioteca/comunicados"
            class="btn btn-gray py-1 px-2 inline-block whitespace-nowrap font-light"
          >archivo de comunicados</NLink>
        </p>
      </div>
    </div>

    <ais-instant-search
      :search-client="searchClient"
      index-name="comunicados"
      class="w-full"
    >
        <div class="flex justify-end items-center space-x-4">
          <ais-voice-search
            button-title="Buscar por voz"
            disabled-button-title="Búsqueda por voz deshabilitada"
            class="-mt-3"
          >
            <template
              v-slot="{
                isListening,
                voiceListeningState,
                toggleListening,
                isBrowserSupported
              }"
            >
              <span
                v-if="isBrowserSupported"
                title="Buscar por voz"
                @click="toggleListening"
                class="cursor-pointer"
              >
                <icon icon="microphone" />
              </span>
              <Modal value="true" v-show="isListening">
                <div
                  class="p-5 text-xl surface w-[20em] min-h-40 max-w-full flex flex-col justify-center items-center space-y-6"
                >
                  <icon icon="microphone" class="text-4xl text-red" />
                  <p>{{ voiceListeningState.transcript }}</p>
                </div>
              </Modal>
            </template>
          </ais-voice-search>
          <ais-search-box placeholder="Buscar..." class="w-64 sm:w-72 max-w-full" />
        </div>
        <ais-hits
          class="w-full py-7 px-2 md:p-7"
        >
          <div slot="item" slot-scope="{ item }">
            <Card
            :data="item"
            :key="item.id"
            collection="comunicados"
            class="mb-7 max-w-lg mx-auto"
          />
          </div>
        </ais-hits>
    </ais-instant-search>
  </div>
</template>


<script>
// RESET SEARCH: https://michaelcho.me/article/resetting-algolias-vue-instantsearch-when-clicking-a-result
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  data() {
    return {
       searchClient: instantMeiliSearch(
        this.$config.meilisearchUrl, this.$config.meilisearchKey
      ),
      // SEO:
      title: 'Comunicados',
      description: 'Comunicados telepáticos mantenidos con los Guías Estelares a través de Chac Mool Puente',
      image: 'imagen_a_definir'
    }
  },
}
</script>

<style scoped>
.card >>> .card-img {
  @apply h-72;
}

.catalogo-comunicados >>> .ais-InstantSearch ol.ais-Hits-list {
  @apply list-none grid gap-4 grid-cols-fill-w-40 md:grid-cols-fill-w-80 text-center;
}
</style>