<template>
  <section class="flex justify-center">
    <Card class="w-md py-7 px-10 mx-auto items-center text-justify">
      <h1 class="text-center">Preguntas Frecuentes</h1>
      <ul class="w-full">
        <li
          v-for="pregunta of preguntasReady"
          :key="pregunta.title"
          class="w-full py-6 border-gray-200 border-solid border-b"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-gray-800 text-base md:text-xl xl:text-2xl w-10/12"
            @click="pregunta.show=!pregunta.show ">
              {{ pregunta.title }}
            </h3>
            <div class="cursor-pointer text-xl text-gray-400">
              <icon v-show="!pregunta.show" icon="chevron-down" @click.prevent="pregunta.show=true"/>
              <icon v-show="pregunta.show" icon="chevron-up" @click.prevent="pregunta.show=false"/>
            </div>
          </div>
            <Accordion duration=".2s" :expanded="pregunta.show">
              <div class="py-5" v-html="pregunta.value"/>
          </Accordion>
        </li>
      </ul>
    </Card>
  </section>
</template>


<script>
export default {
  data() {
    return {
      preguntas: [
        {
          title: "There... How many time zones are there in all?",
          value:
            "Given a 24-hour day and 360 degrees of longitude around the Earth",
          category: "General",
          show: false,
        },
        {
          title: "Nani How long is a day and year on Venus?",
          value:
            "Venus takes 224.7 Earth days to complete one orbit around the Sun. Venus takes 224.7 Earth days to complete one orbit around the Sun. Venus takes 224.7 Earth days to complete one orbit around the Sun. Venus takes 224.7 Earth days to complete one orbit around the Sun.",
          category: "General",
          show: false,
        },
        {
          title: "What animal smells like popcorn?",
          value: "Binturongs smell like popcorn.",
          category: "General",
          show: false,
        },
        {
          title: "Many How many time zones are there in all?",
          value:
            "Given a 24-hour day and 360 degrees of longitude around the Earth",
          category: "Extraterrestres",
          show: false,
        },
        {
          title: "So How long is a day and year on Venus?",
          value:
            "Venus takes 224.7 Earth days to complete one orbit around the Sun.",
          category: "Extraterrestres",
          show: false,
        },
        {
          title: "Mmmm... What animal smells like popcorn?",
          value: "Binturongs smell like popcorn.",
          category: "Extraterrestres",
          show: false,
        },
        {
          title: "If... How many time zones are there in all?",
          value:
            "Given a 24-hour day and 360 degrees of longitude around the Earth",
          category: "ONG",
          show: false,
        },
        {
          title: "Long How long is a day and year on Venus?",
          value:
            "Venus takes 224.7 Earth days to complete one orbit around the Sun.",
          category: "ONG",
          show: false,
        },
        {
          title: "What if animal smells like popcorn?",
          value: "Binturongs smell like popcorn.",
          category: "ONG",
          show: false,
        },
      ],
    };
  },
  computed: {
    preguntasReady () {
      return this.preguntas
    }
  }
};
</script>