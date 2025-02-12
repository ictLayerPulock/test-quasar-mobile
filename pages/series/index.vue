<template>

  <Head>
    <Title>Furniture Series</Title>
  </Head>
  <div>
    <q-card>
      <q-card-section class="q-pa-sm gradient-h">
        <h1 class="text-h5 text-uppercase text-primary q-ma-none text-weight-medium text-center">
          Series
        </h1>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <p class="text-subtitle1 q-ma-none text-center text-weight-light q-px-sm q-pt-md">
          Welcomes you to our unique Series collection, perfect for your lifestyle.
        </p>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-infinite-scroll :offset="100" @load="onLoad">
          <div v-if="status === 'pending'" flat class="row q-pa-sm q-col-gutter-sm">
            <div v-for="item in 6" :key="item" class="col-6">
              <q-card class="shadow-5 shadow-on-hover overflow-hidden">
                <q-card-section class="q-pa-none border-bottom row">
                  <NuxtImg loading="lazy" placeholder="/placeholder.gif" width="120" height="100" format="webp"
                      quality="50" class="fit"  />
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div v-else flat class="row q-pa-sm q-col-gutter-x-sm">
            <div v-for="item in series" :key="item" :class="isMobileSize <= 450 ? 'col-4' : 'col-2'">
              <NuxtLink :to="`/series/${item.fg_series_url}`" style="text-decoration: none" class="text-secondary">
                <q-card class="shadow-6 zoom-on-hover cursor-pointer">
                  <q-card-section class="q-pa-none" style="width:100%;">
                    <NuxtImg loading="lazy" placeholder="/placeholder.gif" rounded width="96" height="96" format="webp"
                      quality="50" class="fit" :src="item.fg_series_banner" :alt="item.fg_series_name"
                      :title="item.fg_series_name" />
                    <p class="text-subtitle2 text-center q-px-sm q-pb-xs text-capitalize ellipsis">
                      {{ item.fg_series_name }}
                    </p>
                  </q-card-section>
                </q-card>
              </NuxtLink>
            </div>
          </div>
          <template #loading>
            <div v-if="!no_more_data" class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-card-section>
    </q-card>

  </div>
</template>
<script setup lang="ts">
const img = useImage();
const $q = useQuasar();
const nuxtApp = useNuxtApp();
const isMobileSize = computed(() => $q.screen.width);

const config = useRuntimeConfig();
const loading = ref(false);
const no_more_data = ref(false);
const start = ref(0);
const limit = ref(24);

const series: any = ref([]);

const { data: response, status } = await useAsyncData(
  "series-list",
  async () =>
    $fetch("/api/series-list", {
      query: {
        limit: limit.value,
        start: start.value,
      },
    }),
  {
    default: () => [],
    // lazy: true,
    transform(input: any) {
      return {
        ...input,
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
series.value = response.value.data;

function onLoad(index: any, done: any) {
  loading.value = true;
  start.value += 24;
  if (!no_more_data.value) {
    setTimeout(async () => {
      const { data } = await useFetch("/api/series-list", {
        query: {
          limit: limit.value,
          start: start.value,
        },
      });
      const old = series.value.length;
      series.value = series.value.concat((data as any).value.data);
      const current = series.value.length;
      if (old === current) {
        no_more_data.value = true;
      }
      loading.value = false;
      done();
    }, 1000);
  }
}
</script>
