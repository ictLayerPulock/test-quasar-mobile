<script setup>
import { useQuasar } from "quasar";
import { ref, computed, onMounted } from "vue";

const $q = useQuasar();
const screenSize = ref("");
const mobileSize = ref(false);
const tabSize = ref(false);

onMounted(() => {
  // Ensure the custom screen sizes are properly applied
  $q.screen.setSizes({ sm: 300, md: 440, lg: 690, xl: 800 });
console.log("screenSize", $q.screen.width);
  // Detect screen size
  if ($q.screen.width <= 320) {
    console.log("S screenSize", $q.screen.width)
    screenSize.value = "sm (Small)";
    mobileSize.value = true;
  } else if ($q.screen.width <= 440) {
    console.log("M screenSize", $q.screen.width)
    screenSize.value = "md (Medium)";
  } else if ($q.screen.width <= 690) {
    screenSize.value = "lg (Large)";
    console.log("L screenSize", $q.screen.width)
    tabSize.value = true;
    // sertfsef
  } else {
    screenSize.value = "xl (Extra Large)";
  }
});


// Reactive computed property for checking screen size dynamically
const isSmallScreen = computed(() => $q.screen.lt.md); // True if screen width is below 440px
</script>

<template>
  <div class="bg-white q-pa-md">
    <h6>Screen Size Detection</h6>
    <p>Current Screen Size: {{ screenSize }}</p>
    <p>Tab Size: {{ tabSize }}</p>
    <p>Mobile Size: {{ mobileSize }}</p>
    <p> Size: {{ $q.screen.width }}</p>
    <p v-if="isSmallScreen">You are on a small screen (Mobile)</p>
    <p v-else>You are on a larger screen (Tablet/Desktop)</p>
  </div>
</template>
