<template>
  <q-chip
    square
    clickable
    outline
    class="bg-white"
    icon="share"
    color="primary"
    label="Share"
    @click="startShare()"
  />
</template>
<script setup lang="ts">
import { useShare } from "@vueuse/core"
const { share } = useShare()

function startShare() {
	share({
		// title: "Hello",
		// text: "Hello my friend!",
		url: location.href,
	})
}
</script>
