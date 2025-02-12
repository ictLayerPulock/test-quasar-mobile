<template>
  <div v-if="!pending">
    <q-card v-if="tagList.data.length > 0" square flat class="bg-white">
      <q-card-section class="row q-pa-sm justify-center">
          <q-chip v-for="tag in tagList.data" :key="tag" square outline clickable color="primary" class="bg-white">
            <NuxtLink :to="`/tag/${tag.fg_tag_url}`" :title="tag.fg_tag_name" :aria-label="tag.fg_tag_name"
              class="text-primary text-capitalize text-subtitle2" style="text-decoration: none">
              # {{ tag.fg_tag_name }} ({{ tag.fg_count }})
            </NuxtLink>
          </q-chip>
      </q-card-section>
    </q-card>
  </div>
  <q-skeleton v-else height="150px" />
</template>

<script setup lang="ts">
const $q = useQuasar();

const nuxtApp = useNuxtApp();

const clearCache = (done: any) => {
  clearNuxtData();
  reloadNuxtApp();
  useShowNotif($q, "restart_alt", "Cache Cleared. Reloading...");
  done();
};
const config = useRuntimeConfig();

const { data: tagList, pending }: any = await useAsyncData(() =>
  $fetch("/api/tag-list", {
    query: {
      start: 0,
      limit: 10,
    },
    transform(tagList: any) {
      return {
        data: tagList.data,
        fetchedAt: new Date(),
      };
    },
    getCachedData(key: string | number) {
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      if (!data) {
        return;
      }
      const expDate = new Date(data.fetchedAt);
      expDate.setTime(expDate.getTime() + config.public.cacheMinAge);
      const isExpired = expDate.getTime() < Date.now();
      if (isExpired) {
        return;
      }
      return data;
    },
  })
);
</script>
