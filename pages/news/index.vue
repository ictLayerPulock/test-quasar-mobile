<template>
  <div>
      <div class="q-pa-xs gradient">
          <h1 class="text-h6 text-center text-uppercase text-primary text-weight-medium q-ma-sm">
            Womanish: Latest News & Hot Promotions Inside!
          </h1>
      </div>
      <q-card square flat class="q-pa-sm bg-grey-2">
        <div v-if="status == 'pending'">
          <div v-for="item in 6" :key="item">
              <q-card class="shadow-5 overflow-hidden">
                <NuxtImg loading="lazy" class="fit border-bottom"  sizes="170px" width="170" height="170" src="/placeholder.gif" alt="image" title="image" />
                <q-chip color="primary" class="absolute bg-grey-3 text-primary" style="top: 5px; left: 5px">
                  <q-skeleton type="text" width="60px" />
                </q-chip>
                <q-chip color="primary" class="absolute bg-grey-3 text-primary" style="top: 5px; right: 5px" square flat>
                  <q-skeleton type="text" width="120px" />
                </q-chip>
                <q-card-section class="q-py-sm">
                  <div class="text-body1 text-secondary text-weight-regular text-capitalize">
                    <q-skeleton type="text" width="120px" />
                  </div>
                </q-card-section>
              </q-card>
          </div>
        </div>
        <div v-else>
          <q-infinite-scroll :offset="50" @load="onLoad">
          <div v-for="item in news" :key="item">
            <NuxtLink v-if="item.news_image != null" :aria-label="item.news_title" :to="`/news/${item.news_url}`" style="text-decoration: none" class="text-secondary q-gutter-y-sm">
              <q-card class="shadow-5 overflow-hidden">
                <NuxtImg loading="lazy" class="fit border-bottom" sizes="170px" width="170" height="170" :src="item.news_image" :alt="item.news_title" :title="item.news_title" />
                <q-chip v-if="item.news_view > 0" color="primary" class="absolute bg-grey-3" style="top: 5px; left: 5px">
                  <q-icon color="primary" name="trending_up" class="q-mr-xs" left />
                  <span class="text-primary">
                    {{ item.news_view }}
                  </span>
                </q-chip>
                <q-chip class="absolute bg-grey-3" style="top: 3px; right: 3px" square flat>
                  <q-icon name="schedule" color="primary" class="q-mr-xs" left />
                  <span class="text-capitalize text-primary">
                    {{ useTimeAgo(item.news_date) }}
                  </span>
                </q-chip>
                <q-card-section class="q-py-sm">
                  <p class="text-body1 text-weight-regular text-capitalize">
                    {{ item.news_title }}
                  </p>
                </q-card-section>
              </q-card>
            </NuxtLink>
          </div>
          <template #loading>
            <div v-if="!no_more_data" class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
        </div>
      </q-card>
  </div>
</template>
<script setup lang="ts">
const $q = useQuasar();
const config = useRuntimeConfig()
const baseURL = config.public.baseURL;

const loading = ref(false);
const no_more_data = ref(false);
const start = ref(0);
const limit = ref(3);
const loadLimit = ref(0);

if ($q.platform.is.mobile == true) {
  limit.value = 3;
  loadLimit.value = 3;
} else {
  limit.value = 12;
  loadLimit.value = 6;
}

interface NewsType {
  [x: string]: any;
}

const news: NewsType = ref([]);

const { data: response , status }: NewsType = await useAsyncData(
  "news",
  async () =>
    $fetch("/api/news", {
      query: {
        limit: limit.value,
        start: start.value,
      },
    }),
  {
    transform(input: any) {
      news.value = input.data;
      return {
        ...input,
        fetchedAt: new Date(),
      };
    },
    // getCachedData(key: any) {
    //   const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    //   if (!data) {
    //     return;
    //   }
    //   const expDate = new Date(data.fetchedAt);
    //   expDate.setTime(expDate.getTime() + 20 * 1000);
    //   const isExpired = expDate.getTime() < Date.now();
    //   if (isExpired) {
    //     return;
    //   }
    //   return data;
    // },
  }
);
news.value = response.value.data;

function onLoad(index: any, done: any) {
  loading.value = true;
  start.value += limit.value;
  limit.value = loadLimit.value;
  setTimeout(async () => {
    const { data }: NewsType = await useAsyncData("news", async () =>
      $fetch("/api/news", {
        query: {
          limit: limit.value,
          start: start.value,
        },
      })
    );
    const old = news.value.length;
    news.value = news.value.concat(data.value.data);
    const current = news.value.length;
    if (old === current) {
      no_more_data.value = true;
    }
    loading.value = false;
    done();
  }, 1000);
}
</script>
