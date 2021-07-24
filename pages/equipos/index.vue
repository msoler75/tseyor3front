<template>
  <div class="max-w-3xl">
    <h1>Equipos</h1>
    <section class="flex">
      <div></div>
      <div class="ml-auto">
        <SearchInput
          v-model="buscarPor"
          class="w-40 xl:mb-0"
          placeholder="Buscar equipo..."
        />
      </div>
    </section>
    <div v-for="equipo of equiposFiltrados" :key="equipo.id" class="mt-4">
      <Card class="p-3">
        <div class="flex items-center whitespace-nowrap">
          <div class="w-14 h-14 mr-5 flex-shrink-0">
            <nuxt-img
              :src="'./images/' + equipo.imagen"
              class="w-full h-full rounded-full"
              fit="cover"
            ></nuxt-img>
          </div>
          <div class="flex-shrink pr-4 whitespace-normal">
            <div>
              <div class="font-bold text-lg">{{ equipo.nombre }}</div>
              <div class="text-sm text-diminished">
                {{ equipo.descripcion }}
              </div>
            </div>
          </div>
          <div class="ml-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="flex flex-col justify-center items-center">
              <div class="uppercase font-bold text-sm">miembros</div>
              <span
                ><icon icon="user" class="mr-2 text-gray" />
                {{ equipo.miembros }}</span
              >
            </div>
            <div class="flex flex-col justify-center items-center">
              <div class="uppercase font-bold text-sm">reuniones</div>
              <span
                ><icon icon="calendar-day" class="mr-2 text-gray" />
                {{ equipo.reuniones }}</span
              >
            </div>
            <div class="flex flex-col justify-center items-center">
              <div class="uppercase font-bold text-sm">anexos</div>
              <span
                ><icon icon="paperclip" class="mr-2 text-gray" />
                {{ equipo.anexos }}</span
              >
            </div>
            <div class="flex flex-col justify-center items-center">
              <div class="uppercase font-bold text-sm">actas</div>
              <span
                ><icon icon="file-alt" class="mr-2 text-gray" />
                {{ equipo.actas }}</span
              >
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ app }) {
    const equipos = [];
    for (let i = 1; i < 24; i++) {
      const tags = [];
      equipos.push({
        id: i,
        clase: "equipos",
        nombre: "Equipo " + app.$lorem(1, 2, 5),
        imagen: "imagen" + ((i % 8) + 1) + ".jpg",
        descripcion: app.$lorem(1),
        miembros: Math.ceil(Math.random() * 70),
        reuniones: Math.ceil(Math.random() * 40),
        actas: Math.ceil(Math.random() * 20),
        anexos: Math.ceil(Math.random() * 50),
      });
    }
    return { equipos };
  },
  data() {
    return {
      buscarPor: "",
    };
  },
  computed: {
    equiposFiltrados() {
      if (!this.buscarPor) return this.equipos;
      return this.equipos.filter(
        (x) =>
          (x.nombre + x.descripcion).search(new RegExp(this.buscarPor, "i")) >
          -1
      );
    },
  },
};
</script>
