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



<style scoped>
.searchpage >>> ol.ais-Hits-list {
  @apply list-none grid gap-4 grid-cols-fill-w-72 text-center;
  grid-template-columns: repeat(auto-fill, minmax( 24rem	 , 1fr))
}
.searchpage >>>  .ais-Hits-item>div {height: 100%}

.searchpage >>> .ais-SearchBox-form {
  @apply mb-4;
}
.searchpage >>> .ais-SearchBox-submit,
.searchpage >>> .ais-SearchBox-reset {
  @apply hidden;
}

</style>