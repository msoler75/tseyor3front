<template>
    <div>
        <nuxt-img :src="'./imagenes/'+comunicado.imagen"/>
        <div class="mt-4" v-html="comunicado.texto"></div>
    </div>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  asyncData ({ route }) {
    // const noticiasGuays = await $strapi.$noticias.find({ id: 1 })
    const id = parseInt(route.params.id)
    const contenido =
        {
          id,
          href: `/comunicado/${id}`,
          titular: 'Comunicado ' + id + ' empieza con un viento extraordinario',
          imagen: 'imagen' + (id % 6 + 1) + '.jpg',
          texto:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non risus mattis, condimentum urna in, bibendum justo. Nunc posuere risus et arcu malesuada dignissim. Vivamus in gravida nisi, in faucibus neque. Nulla egestas tincidunt dui, eu tempor mauris varius ac. Nunc in volutpat ligula, et porta nunc. Sed tristique tincidunt volutpat. Curabitur eu euismod est. Mauris fringilla non nisi vel vestibulum. Donec dignissim tincidunt velit. Etiam tortor dui, bibendum ac laoreet sed, suscipit ac tortor. Donec rutrum, nunc sed malesuada lobortis, mauris ex placerat quam, non ornare nulla ligula quis nisl. <p>Donec ut tristique nunc. Donec malesuada arcu ac urna condimentum mattis. Praesent efficitur auctor augue, id dapibus nunc tempus imperdiet. Suspendisse at lacinia lorem. Vestibulum id dolor erat. Ut quis tincidunt elit. Donec sodales, leo a tincidunt viverra, est ante interdum libero, ac condimentum leo nulla nec magna. Vivamus sed dui sed quam eleifend luctus. Fusce et tellus venenatis, dignissim metus eget, aliquam ipsum. Duis vehicula massa turpis, sodales pellentesque odio suscipit sit amet. Vestibulum luctus ligula dui, auctor convallis orci iaculis eu. Nullam rhoncus massa nulla, at egestas ante gravida vel. Morbi dignissim magna et sem vulputate varius. Maecenas eget libero vitae felis elementum sagittis sed ac est. Nulla mollis nisl ut tortor ornare hendrerit. <p>Phasellus quam nunc, cursus a dui sit amet, facilisis malesuada turpis. Suspendisse ultrices nisi dui, eget ultrices diam dictum in. Vivamus at lorem nec sem feugiat condimentum in ut sem. Ut volutpat, massa ac sollicitudin dignissim, justo metus consequat nulla, eu malesuada risus ipsum eu mauris. Pellentesque sem orci, sollicitudin id dolor nec, vestibulum iaculis nisl. Maecenas finibus augue dui, sed ornare velit fermentum at. Integer et egestas tortor. Phasellus egestas tempus vestibulum. Nullam mollis diam nulla, sed lobortis metus tempor nec. Fusce nec quam neque.<p>Vestibulum eget urna commodo, scelerisque dolor eu, dignissim ipsum. Suspendisse rutrum egestas arcu et hendrerit. Nulla faucibus purus enim, vel consectetur nisl vehicula et. Nam bibendum magna eu tellus varius malesuada. Suspendisse non tristique leo. Vestibulum tristique aliquam arcu. Curabitur lacinia maximus diam. In arcu augue, iaculis id libero a, aliquam congue metus. Fusce suscipit metus at porttitor auctor. Curabitur a mi nulla.<p>Nam in dolor lacinia, elementum odio at, feugiat enim. Nam eu tincidunt tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi ac nisl massa. Duis sem magna, bibendum sit amet diam quis, sagittis tincidunt neque. Proin aliquam luctus erat, vitae scelerisque arcu tempus maximus. Maecenas blandit leo ipsum. Nullam in ligula ut turpis accumsan placerat vitae euismod augue.'
        }
    return { contenido, comunicado: contenido }
  }
}
</script>
