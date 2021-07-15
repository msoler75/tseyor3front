<template>
  <div>
    <div
      class="max-w-sm rounded overflow-hidden shadow-lg mb-4 dark:bg-gray-900"
    >
      <img
        class="w-full"
        src="https://tailwindcss.com/img/card-top.jpg"
        alt="Sunset in the mountains"
      >
      <div class="px-6 py-4 pb-2">
        <div class="font-bold text-xl mb-2 dark:text-white">
          The Coldest Sunset
        </div>
        <p class="text-gray-700 dark:text-gray-300 text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
          quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
          nihil.
        </p>
      </div>
      <div class="px-6 py-4">
        <span class="badge mr-2">#photography</span>
        <span class="badge mr-2">#travel</span>
        <span class="badge">#winter</span>
      </div>
    </div>
    <n-link to="about">
      <t-button>About</t-button>
    </n-link>

    <div class="bg-primary p-5">
      Primary color
    </div>

    <div class="bg-gray p-5">
      Gray color 100
    </div>

    <div class="bg-complementary p-5">
      Warning color
    </div>

    <div class="bg-success p-5">
      Success color 100
    </div>

    <div class="bg-secondary p-5">
      Secondary color
    </div>

    <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
      <div class="rounded overflow-hidden">
        <div
          class="text-blue-contrast bg-blue px-6 py-4 text-sm font-semibold relative shadow z-10"
        >
          <div class="uppercase mb-2">
            blue
          </div>
        </div>

        <div
          class="text-blue-contrast bg-blue px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue</span>
          <span class="font-normal opacity-75">#2196f3</span>
        </div>
        <div
          class="text-blue-50-contrast bg-blue-50 px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-50</span>
          <span class="font-normal opacity-75">#e3f2fd</span>
        </div>
        <div
          class="text-blue-100-contrast bg-blue-100 px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-100</span>
          <span class="font-normal opacity-75">#bbdefb</span>
        </div>
        <div
          class="text-blue-200-contrast bg-blue-200 px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-200</span>
          <span class="font-normal opacity-75">#90caf9</span>
        </div>
        <div
          class="text-blue-300-contrast bg-blue-300 px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-300</span>
          <span class="font-normal opacity-75">#64b5f6</span>
        </div>
        <div
          class="text-red-100-contrast
           bg-red-400 px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-400</span>
          <span class="font-normal opacity-75">#42a5f5</span>
        </div>
        <div
          class="text-blue-500-contrast bg-blue-500 px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-500</span>
          <span class="font-normal opacity-75">#2196f3</span>
        </div>
        <div
          class="text-blue-600-contrast bg-blue-600 px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-600</span>
          <span class="font-normal opacity-75">#1e88e5</span>
        </div>
        <div
          class="text-blue-700-contrast bg-blue-700 px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-700</span>
          <span class="font-normal opacity-75">#1976d2</span>
        </div>
        <div
          class="text-blue-800-contrast bg-blue-800 px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-800</span>
          <span class="font-normal opacity-75">#1565c0</span>
        </div>
        <div
          class="text-blue-900-contrast bg-blue-900 px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-900</span>
          <span class="font-normal opacity-75">#0d47a1</span>
        </div>
        <div
          class="text-blue-100-accent-contrast bg-blue-100-accent px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-100-accent</span>
          <span class="font-normal opacity-75">#82b1ff</span>
        </div>
        <div
          class="text-blue-200-accent-contrast bg-blue-200-accent px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-200-accent</span>
          <span class="font-normal opacity-75">#448aff</span>
        </div>
        <div
          class="text-blue-400-accent-contrast bg-blue-400-accent px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-400-accent</span>
          <span class="font-normal opacity-75">#2979ff</span>
        </div>
        <div
          class="text-blue-700-accent-contrast bg-blue-700-accent px-6 py-3 text-sm font-semibold flex justify-between"
        >
          <span>blue-700-accent</span>
          <span class="font-normal opacity-75">#2962ff</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TButton from '~/components/TButton'

export default {
  components: {
    TButton
  }
}
</script>

<style lang="postcss" scoped>
.badge {
  @apply inline-block bg-gray-200 dark:bg-gray-700  rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200;
  &:hover {
    @apply bg-gray-300;
  }
}
</style>
