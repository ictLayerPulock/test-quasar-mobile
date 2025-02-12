<template>
  <div v-if="status != 'pending'">
    <section v-show="response.data.length">
      <q-card flat square class="gradient q-py-none">
        <q-card-section class="row justify-between gradient-h q-py-none q-px-sm">
          <NuxtLink to="/tag" aria-label="Tag" title="Tag" style="text-decoration: none">
            <h3 class="text-h5 text-capitalize text-primary text-weight-medium q-my-sm">
              Tag
            </h3>
          </NuxtLink>
          <q-btn to="/tag" color="primary" flat padding="sm" dense size="md" icon="more_vert" aria-label="Tag" />
        </q-card-section>
        <q-separator />
        <q-scroll-area :style="{ height: response.data.length < 2 ? '180px' : '345px' }">
          <q-card-section v-if="status === 'pending'" class="row q-pa-sm q-col-gutter-sm gradient"
            style="width: 1080px">
            <div v-for="item in 12" :key="item" class="col-2">
              <q-card class="shadow-5 overflow-hidden">
                <q-card-section class="q-pa-none border-bottom row">
                  <NuxtImg loading="lazy" sizes="100vw sm:50vw md:170px" width="170" quality="50" class="fit"
                    format="webp" src="/placeholder.gif" :draggable="false" />
                  <div class="absolute-bottom text-body1 text-bold text-center" style="backdrop-filter: blur(2px);">
                    <q-skeleton height="100%" width="100%" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>
          <q-card-section v-else class="row q-pt-sm q-px-sm q-gutter-x-sm q-pb-none gradient" style="width: 530px">
            <div v-for="tag in response.data" :key="tag">
              <NuxtLink :to="`/tag/${tag.fg_series_url}`" :aria-label="tag.fg_series_name" style="text-decoration: none"
                class="text-secondary">
                <q-card class="shadow-6 shadow-on-hover zoom-on-hover cursor-pointer rounded">
                  <q-card-section class="q-pa-none" style="width:120px;">
                    <NuxtImg loading="lazy" placeholder="/placeholder.gif" width="120" height="120" format="webp"
                      quality="50" class="rounded"
                      :src="tag.fg_tag_banner ? tag.fg_tag_banner : `https://dummyimage.com/96x80/c9c9c9/000.jpg&text=${tag.fg_tag_name}`"
                      :alt="tag.fg_tag_name" :title="tag.fg_tag_name" />
                    <p class="text-subtitle2 text-center q-px-sm q-pb-xs text-capitalize ellipsis">
                      {{ tag.fg_tag_name }}
                    </p>
                  </q-card-section>
                </q-card>
              </NuxtLink>
            </div>
          </q-card-section>
        </q-scroll-area>
      </q-card>
    </section>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const show = ref(true)
const { data: response, status }: any = useAsyncData(
  "home-tag-list",
  async () =>
    $fetch("/api/home-tag-list", {
      query: {
        limit: "8",
        start: "0",
      },
    }),
  {
    default: () => [],
    lazy: true,
    deep: false,
    transform(response: any) {
      if (response.data.length == 0) show.value = false;
      return {
        data: response.data,
        fetchedAt: new Date(),
      };
    },
    getCachedData(key) {
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
  }
);
</script>