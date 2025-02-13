<template>
  <div v-if="images.length > 0" class="q-pa-sm">
    <div class="row no-wrap justify-center q-gutter-x-sm" style="overflow-x: auto; overflow-y: visible">
      <q-img v-for="(item, index) in images" :key="item" :ref="(el) => {
          thumbRef[index] = el;
        }
        " class="cursor-pointer rounded-borders col-2" :class="index === indexZoomed ? 'fixed-center z-top' : void 0"
        style="" :style="index === indexZoomed ? 'width: 900px; max-width: 80vw' : void 0
          " :src="(item as string)" @click="zoomImage(index)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUpdate } from "vue";
// import { morph } from "quasar"
interface DataType {
  [x: string]: any;
}
/* Component Props */
const props = defineProps({
  images: { type: Array, default: () => [], required: false },
});

const thumbRef = ref<DataType>([]);

const indexZoomed = ref(void 0);
const images = props.images.slice(1);

function zoomImage(index: any) {
  const indexZoomedState = indexZoomed.value;
  // let cancel = void 0

  indexZoomed.value = void 0;

  if (index !== void 0 && index !== indexZoomedState) {
    // cancel = morph({
    // 	from: thumbRef.value[index].$el,
    // 	onToggle: () => {
    // 		indexZoomed.value = index
    // 	},
    // 	duration: 500,
    // 	onEnd: end => {
    // 		if (end === "from" && indexZoomed.value === index) {
    // 			indexZoomed.value = void 0
    // 		}
    // 	}
    // })
  }

  if (
    indexZoomedState !== void 0
    // && (cancel === void 0 || cancel() === false)
  ) {
    // console.log("to")
    // morph({
    // 	from: thumbRef.value[indexZoomedState].$el,
    // 	waitFor: 100,
    // 	duration: 300
    // })
  }
}

// Make sure to reset the dynamic refs before each update.
onBeforeUpdate(() => {
  thumbRef.value = [];
});
</script>
