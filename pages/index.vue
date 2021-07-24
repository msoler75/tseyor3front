<template>
  <div class="max-w-lg mx-auto">

    <Config :breadcrumb="false" />

    <NLink v-for="item of items" :key="item.name" :to="item.url" :class="'flex w-full my-5 shadow rounded p-3 ' + (item.bg?item.bg:' card')">
      <div :class="'text-5xl sm:text-3xl flex justify-center items-center pr-4 '+item.color" style="width: 2.8em; transform: scale(1.2)">
        <icon :icon="item.icon" />
      </div>
      <div>
        <h3 :class="item.color">
          {{ item.name }}
        </h3>
        <p class="text-gray">
          {{ item.description }}
        </p>
      </div>
      <div class="text-3xl flex justify-center items-center ml-auto pl-4 text-gray-300" style="width: 2.2em; transform: scale(1.2)">
        <icon icon="chevron-right" />
      </div>
    </NLink>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          hero: true,
          bg: 'bg-amber-50',
          icon: 'fas fa-route',
          color: 'text-amber-800',
          name: 'Conocer Tseyor',
          description: 'Visita guiada para conocer Tseyor',
          url: '/presentacion/visita'
        },
        {
          icon: 'fas fa-bolt',
          color: 'text-red',
          name: 'Novedades',
          description: 'Noticias, blogs, eventos y otras publicaciones',
          url: '/novedades'
        },
        {
          icon: 'fas fa-headphones',
          color: 'text-light-blue',
          name: 'Audios para meditar',
          description: 'Escucha nuestros audios con meditaciones guiadas',
          url: '/audios'
        },
        {
          icon: 'fas fa-broadcast-tower',
          color: 'text-pink-800 dark:text-pink-50',
          name: 'Radio Tseyor',
          description: 'Escucha la Radio Tseyor',
          url: '/radio'
        },
        {
          icon: 'fas fa-book',
          color: 'text-gray-dark-600 dark:text-gray-50',
          name: 'Leer',
          description: 'Inspírate y aprende con los mensajes de las estrellas',
          url: '/leer'
        },
        {
          icon: 'far fa-comments',
          color: 'text-green-800 dark:text-green-50',
          name: 'Reuniones',
          description: 'Consulta tu agenda de reuniones',
          url: '/agenda?reuniones'
        }
      ]
    }
  }
}
</script>
