<template>
  <!-- Banner Main -->
  <section>
      <q-skeleton v-if="status == 'pending'" height="auto" />
      <q-carousel v-else ref="carousel" v-model="slide" swipeable animated keep-alive :autoplay="true" transition-next="fade" transition-prev="fade" infinite height="460px" @touchstart.stop @mousedown.stop>
        <q-carousel-slide v-for="(banner, index) in template.main" :name="index + 1" class="q-pa-none rounded-borders" loading="lazy" :alt="banner.title" :title="banner.title" :img-src="img(banner.img, {
          width: 345,
          height: 460,
        })
          " />
      </q-carousel>
  </section>
</template>

<script setup lang="ts">
import { QSkeleton, QCarousel, QCarouselSlide } from "quasar";
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const img = useImage();
const slide = ref(1);

const { data: template, status }: any = await useAsyncData(
  "template-slide",
  async () => $fetch("/api/template-slide/"),
  {
    default: () => [],
    // lazy: true,
    deep: false,
    transform(template: any) {
      return {
        ...template.data.mobile,
        fetchedAt: new Date(),
      };
    },
    getCachedData(key: any) {
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      if (!data) {
        return;
      }
      const expDate = new Date(data.fetchedAt);
      expDate.setTime(expDate.getTime() + config.public.cacheMaxAge);
      const isExpired = expDate.getTime() < Date.now();
      if (isExpired) {
        return;
      }
      return data;
    },
  }
);
</script>