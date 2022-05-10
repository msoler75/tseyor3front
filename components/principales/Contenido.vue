<template>
    <div class="px-3 sm:px-5 md:px-7 relative w-full shrink-0 flex-grow-1 max-w-3xl flex flex-col items-start">
        
        <div class="hidden 4xl:block absolute right-0 translate-x-3 5xl:translate-x-10 h-full">
            <SocialIcons class="sticky top-32 mb-6 text-xs 5xl:text-sm" :content="contenido" @share="$emit('share')" />
        </div>

        <!-- article wrapper -->
        <ArticleWrapper>
            <!-- article heading -->
            <h1 class>{{ ctitle }}</h1>

            <div class="w-full flex mb-5 items-center justify-start text-xs sm:text-sm">
                <div>
                    <icon icon="far fa-calendar-alt" class="mr-1" />
                    <span>{{ $dayjs(cdate).format("DD-MMM-YYYY") }}</span>
                </div>

                <div class="4xl:hidden ml-auto">
                    <SocialIcons :content="contenido" :horizontal="true" @share="$emit('share')" />
                </div>
            </div>

            <!-- article content -->
            <Article class="my-9 text-justify" v-html="chtml" />
            
        </ArticleWrapper>

    </div>
</template>

<script>
import vercontenido from "@/mixins/vercontenido.js"
export default {
    mixins: [vercontenido],
    props: {
        contenido: {},
        fecha: {}
    },
    computed: {
        chtml() {
            return this.renderMarkdown(this.ctext)
        }
    }
}
</script>