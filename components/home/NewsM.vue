<template>
  <section v-show="show">
    <q-card v-if="status != 'pending'" flat square class="bg-grey-2">
      <q-card-section class="row justify-between gradient-h q-py-none q-px-sm">
        <NuxtLink to="/news" aria-label="News & Updates" title="News & Updates" style="text-decoration: none">
          <h4 class="text-h5 text-capitalize text-primary text-weight-medium q-my-sm">
            News & Updates
          </h4>
        </NuxtLink>
        <q-btn to="/news" color="primary" flat padding="sm" dense size="md" icon="more_vert"
          aria-label="News & Updates" />
      </q-card-section>
      <q-separator />
      <q-scroll-area style="height: 280px" :thumb-style="{ opacity: '0' }" @touchstart.stop @mousedown.stop>
        <q-card-section v-if="status === 'pending'" class="row q-pa-sm q-col-gutter-sm" style="width: 1060px">
          <div v-for="item in 6" :key="item" class="col-2">
            <q-card class="shadow-5 bg-grey-1">
              <NuxtImg loading="lazy" sizes="100vw sm:50vw md:170px" width="170" quality="50" class="fit" format="webp"
                src="/placeholder.gif" :draggable="false" />
              <q-card-section class="q-pa-sm">
                <div class="text-body2 text-weight-regular ellipsis-2-lines text-capitalize"
                  style="height: 42px">
                  <q-skeleton type="text" width="120px" />
                </div>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <div class="row justify-between items-center">
                  <q-space />
                  <div class="row items-center text-caption">
                    <q-skeleton type="text" width="40px" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section v-else class="row q-pa-sm q-col-gutter-sm" style="width: 1060px">
          <div v-for="item in response.data" :key="item">
            <NuxtLink :to="`/news/${item.news_url}`" :aria-label="item.news_title" style="text-decoration: none" class="text-secondary">
              <q-card class="shadow-5 overflow-hidden" style="width:165px">
                <q-card-section class="q-pa-none border-bottom">
                  <NuxtImg loading="lazy" width="165" height="165" format="webp" quality="50" :draggable="false"
                    placeholder="/placeholder.gif" :src="item.news_image" :alt="item.news_title"
                    :title="item.news_title" />
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <div class="text-body2 text-weight-regular ellipsis-2-lines text-capitalize" style="height: 38px">
                   <p class="q-ma-none">{{ item.news_title }}</p> 
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <div class="row items-center justify-between">
                    <div class="row items-center justify-start">
                      <q-icon name="schedule" color="primary" class="q-mr-xs" left />
                      <div class="text-caption">
                        <span class=" text-capitalize text-primary">
                          {{ useTimeAgo(item.news_date) }}
                        </span>
                      </div>
                    </div>
                    <div v-if="item.news_view > 0" class="row items-center text-primary text-caption">
                      <q-icon name="trending_up" color="primary" class="q-mr-xs" left />
                      <span>
                        {{ item.news_view }}
                      </span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </NuxtLink>
          </div>
        </q-card-section>
      </q-scroll-area>
    </q-card>
  </section>
</template>
<script setup lang="ts">
const nuxtApp = useNuxtApp();
const config = useRuntimeConfig();
const show = ref(false);

const { data: response, status }: any = useAsyncData(
  "home-news",
  async () =>
    $fetch("/api/home-news", {
      query: {
        limit: "6",
        start: "0",
      },
    }),
  {
    default: () => [],
    lazy: true,
    deep: false,
    transform(responseData: any) {
      if (responseData.data.length > 2) show.value = true;
      return {
        ...responseData,
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
      if (data.data.length > 2) show.value = true;
      return data;
    },
  }
);
</script>
