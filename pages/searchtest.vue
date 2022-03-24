<template>
    <div class="searchpage flex justify-center items-center">
        
<ais-instant-search :search-client="searchClient" index-name="libros">
    <ais-search-box />
    <ais-hits>
      <div slot="item" slot-scope="{ item }">
        <!-- <CardBook :data="item" noText /> -->
        {{item}}
      </div>
    </ais-hits>
  </ais-instant-search>

    </div>
</template>

<script>
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

export default {
    data() {
        return {
            searchClient: instantMeiliSearch(
                this.$config.meilisearchUrl, this.$config.meilisearchKey
            ),
        };
    },
}
</script>