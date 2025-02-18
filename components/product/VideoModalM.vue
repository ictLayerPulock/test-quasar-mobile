<template>
  <q-video
    :ratio="16/9"
    :src="`https://www.youtube.com/embed/${videoCode}?controls=0&autoplay=1&rel=0&mute=1&loop=1&showinfo=0`"
  />
</template>

<script setup lang="ts">
const props = defineProps({
	video: { type: String,default:"",required:false },
})
const videoCode = props.video
// console.log(videoCode)
</script>