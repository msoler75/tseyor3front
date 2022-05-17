<template>


<nuxt-child @publi="$emit('publi', $event)" @close="$emit('close')"/>
</template>