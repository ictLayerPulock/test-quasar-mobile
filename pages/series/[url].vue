<template>

  <Head>
    <Title>{{ series_info.fg_series_meta_title }}</Title>
  </Head>

  <div style="padding-top: 48">
    <q-pull-to-refresh @refresh="clearCache">
      <div>
        <q-skeleton v-if="series_info.fg_series_name === 'pending'" width="320px" height="50px"
          style="margin-top: 60px" />
        <div v-else class="bg-grey-4">
          <div v-if="!series_info.fg_series_banner" class="row justify-around items-center bg-grey-2">
            <h1 class="text-h5 text-uppercase text-primary text-weight-medium text-center q-ma-sm"
              :title="series_info.fg_series_name">
              {{ series_info.fg_series_name }}
            </h1>
          </div>
          <q-card v-else square flat>
            <NuxtImg loading="lazy" format="webp" quality="50" class="fit" height="50" :draggable="false"
              placeholder="/placeholder.gif" :src="series_info.fg_series_banner" alt="page-banner"
              title="page-banner" />
            <h1 class="text-h6 text-center q-ma-none text-primary q-pa-sm">
              {{ series_info.fg_series_name }}
            </h1>
          </q-card>
        </div>

        <LazySeriesTrendingProductsM :url="(url as any)" />
        <div v-if="show" class="q-gutter-xs q-mt-md">
          <q-infinite-scroll :offset="100" @load="onLoad" class="q-pa-none">
            <q-card v-if="status === 'pending'" flat square class="row q-pa-sm q-gutter-y-sm gradient">
              <div v-for="item in 3" :key="item" :class="isMobileSize <= 450 ? 'col-6' : 'col-3'">
                <q-card>
                  <q-card-section horizontal class="overflow-hidden">
                    <q-card-section class="col q-pa-none border-right">
                      <NuxtImg loading="lazy" src="/placeholder.gif" width="114" height="152" format="webp" quality="50"
                        class="fit" :draggable="false" />
                    </q-card-section>
                    <q-card-section class="col-7 q-pa-sm column q-col-gutter-sm justify-between text-primary no-wrap">
                      <div class="row justify-between items-baseline q-my-xs no-wrap">
                        <q-skeleton type="text" width="120px" />
                      </div>
                      <div class="row justify-between items-center q-gutter-x-md q-my-xs no-wrap">
                        <div class="row items-center text-grey-6 no-wrap ellipsis">
                          <div class="text-caption ellipsis" style="width: 100px">
                            <q-skeleton type="text" width="120px" />
                          </div>
                        </div>
                      </div>
                      <div class="row justify-between items-baseline">
                        <q-space />
                        <div class="col items-baseline row text-subtitle2 text-weight-medium justify-end q-gutter-x-xs">
                          <q-skeleton type="text" width="80px" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </div>
            </q-card>
            <q-card v-else flat square class="row justify-center q-px-xs q-gutter-y-sm gradient q-pb-md">
              <div v-for="item in product" :key="item" class="q-px-xs" :class="isMobileSize <= 450 ? 'col-6' : 'col-3'">
                <NuxtLink :to="`/product/${item.fg_url}`" :aria-label="item.acc_ledger_name"
                  :title="item.acc_ledger_name" style="text-decoration: none" class="text-secondary">
                  <q-card class="shadow-5 q-pa-none overflow-hidden">
                    <q-card-section class="q-pa-none border-bottom">
                      <NuxtImg loading="lazy" ratio="3:4" placeholder="/placeholder.gif" class="fit" format="webp"
                        quality="50" :src="item.fg_image" :alt="item.acc_ledger_name" :title="item.acc_ledger_name" />
                    </q-card-section>
                    <q-icon v-if="item.fg_featured > 0" name="bookmark" color="primary" size="xs" class="absolute"
                      style="top: 5px; left: 5px" />
                    <div v-if="item.fg_view > 0" size="xs"
                      class="absolute row items-center bg-transparent text-caption text-weight-medium"
                      style="top: 5px; right: 8px">
                      <q-icon size="xs" name="trending_up" color="primary" class="q-mr-xs" />
                      <span class="text-primary text-caption">
                        {{ viewCount(item.fg_view) }}
                      </span>
                    </div>
                    <q-card-section class="q-pa-sm q-gutter-xs">
                      <q-chip v-if="
                        item.fg_discount > 0 &&
                        inDateRange(
                          item.fg_discount_start_date,
                          item.fg_discount_end_date
                        )
                      " rounded outline no-caps size="sm" color="grey-5 q-px-none q-mx-none"
                        class="absolute row justify-center text-weight-bold bg-white"
                        style="top: 0; right: 4px; transform: translateY(-50%)">
                        <q-icon right size="13px" class="q-pr-xs q-ml-sm" name="schedule" color="primary" />
                        <div class="text-primary text-capitalize q-pr-sm"
                          :title="'Ends ' + useTimeAgo(item.fg_discount_end_date)">
                          Ends {{ useTimeAgo(item.fg_discount_end_date) }}
                        </div>
                      </q-chip>
                      <div style="height: 48px">
                        <p class="text-subtitle2 text-left text-weight-regular ellipsis-2-lines q-pt-xs q-mx-none">
                          <span class="text-subtitle2" :title="item.acc_ledger_name">
                            {{ item.acc_ledger_name }}
                          </span>
                        </p>
                      </div>
                      <div class="row justify-between items-baseline">
                        <div v-if="
                          item.fg_discount > 0 &&
                          inDateRange(
                            item.fg_discount_start_date,
                            item.fg_discount_end_date
                          )
                        " class="text-caption text-bold text-primary text-uppercase">
                          -{{ item.fg_discount }}%
                        </div>
                        <q-space />
                        <div class="text-subtitle2 text-weight-medium">
                          {{ config.public.currencyBefore }}
                          {{ formatMoney(item.fg_up_final * 1.0) }}
                          {{ config.public.currencyAfter }}
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </NuxtLink>
              </div>
            </q-card>
            <template #loading>
              <div v-if="!no_more_data" class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </div>
        <div v-else flat outline bordered class="bg-grey-1 flex flex-center">
          <q-card-section class="text-subtitle1 text-primary text-uppercase">
            No Product To Show
          </q-card-section>
        </div>
      </div>
      <!-- Sort Filter -->
      <q-page-sticky expand position="top">
        <q-toolbar class="bg-grey-3 q-pa-xs shadow-4">
          <q-toolbar-title>
            <!-- Sort Filter -->
            <q-scroll-area class="q-py-xs q-pr-xs flex flex-center" style="height: 44px" :thumb-style="{ opacity: '0' }"
              @touchstart.stop @mousedown.stop>
              <div class="row" style="width: 490px">
                <q-chip v-if="!ratingHigh" square clickable outline class="bg-white" icon="star"
                  icon-right="import_export" color="primary" text-color="white" @click="orderByRatingLowtoHigh">
                  Rating
                </q-chip>
                <q-chip v-if="ratingHigh == 1" square clickable outline class="bg-white" icon="star"
                  icon-right="arrow_upward" color="primary" text-color="white" @click="orderByRatingHightoLow">
                  Rating
                </q-chip>
                <q-chip v-if="ratingHigh == -1" square clickable outline class="bg-white" icon="star"
                  icon-right="arrow_downward" color="primary" text-color="white" @click="orderByRatingLowtoHigh">
                  Rating
                </q-chip>
                <!-- trending -->
                <q-chip v-if="!trendingHigh" square clickable outline class="bg-white" icon="trending_up"
                  icon-right="import_export" color="primary" text-color="white" @click="orderByTrendingLowtoHigh">
                  Trending
                </q-chip>
                <q-chip v-if="trendingHigh == 1" square clickable outline class="bg-white" icon="trending_up"
                  icon-right="arrow_upward" color="primary" text-color="white" @click="orderByTrendingHightoLow">
                  Trending
                </q-chip>
                <q-chip v-if="trendingHigh == -1" square clickable outline class="bg-white" icon="trending_up"
                  icon-right="arrow_downward" color="primary" text-color="white" @click="orderByTrendingLowtoHigh">
                  Trending
                </q-chip>
                <!-- recent -->
                <q-chip v-if="!recentHigh" square clickable outline class="bg-white" icon="calendar_month"
                  icon-right="import_export" color="primary" text-color="white" @click="orderByRecentLowtoHigh">
                  Recent
                </q-chip>
                <q-chip v-if="recentHigh == 1" square clickable outline class="bg-white" icon="calendar_month"
                  icon-right="arrow_upward" color="primary" text-color="white" @click="orderByRecentHightoLow">
                  Recent
                </q-chip>
                <q-chip v-if="recentHigh == -1" square clickable outline class="bg-white" icon="calendar_month"
                  icon-right="arrow_downward" color="primary" text-color="white" @click="orderByRecentLowtoHigh">
                  Recent
                </q-chip>
                <!-- price -->
                <q-chip v-if="!priceHigh" square clickable outline class="bg-white" icon="payments"
                  icon-right="import_export" color="primary" text-color="white" @click="orderByPriceLowtoHigh">
                  Price
                </q-chip>
                <q-chip v-if="priceHigh == 1" square clickable outline class="bg-white" icon="payments"
                  icon-right="arrow_upward" color="primary" text-color="white" @click="orderByPriceHightoLow">
                  Price
                </q-chip>
                <q-chip v-if="priceHigh == -1" square clickable outline class="bg-white" icon="payments"
                  icon-right="arrow_downward" color="primary" text-color="white" @click="orderByPriceLowtoHigh">
                  Price
                </q-chip>
              </div>
            </q-scroll-area>
          </q-toolbar-title>
        </q-toolbar>
      </q-page-sticky>
    </q-pull-to-refresh>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);
const show = ref(true);

const clearCache = (done: any) => {
  clearNuxtData();
  reloadNuxtApp();
  useShowNotif($q, "restart_alt", "Cache Cleared. Reloading...");
  done();
};
const route = useRoute();
const url = route.params.url;

const loading = ref(false);
const no_more_data = ref(false);

const start = ref(0);
const limit = ref(18);
const genderFilter = ref("");
const priceHigh = ref(0);
const recentHigh = ref(0);
const trendingHigh = ref(0);
const ratingHigh = ref(0);

interface ProductType {
  [x: string]: any;
}
const product: ProductType = ref([]);

const { data: response, status, refresh }: any = await useAsyncData(
  `series-product: ${url}`,
  async () =>
    $fetch("/api/series-product/" + url, {
      query: {
        start: start.value,
        limit: limit.value,
        fg_series_url: url,
        gender: genderFilter.value,
        tag: config.public.tagFiltering,
        rating:
          ratingHigh.value != 0 ? (ratingHigh.value == 1 ? "high" : "low") : "",
        trending:
          trendingHigh.value != 0
            ? trendingHigh.value == 1
              ? "high"
              : "low"
            : "",
        recent:
          recentHigh.value != 0 ? (recentHigh.value == 1 ? "high" : "low") : "",
        price:
          priceHigh.value != 0 ? (priceHigh.value == 1 ? "high" : "low") : "",
      },
    }),
  {
    transform(input: any) {
      input.data = input.data.map((item: any) => ({
        acc_ledger_name: item.acc_ledger_name,
        fg_discount: item.fg_discount,
        fg_discount_end_date: item.fg_discount_end_date,
        fg_image: item.fg_image,
        fg_url: item.fg_url,
        fg_featured: item.fg_featured,
        fg_view: item.fg_view,
        fg_up_final: item.fg_up_final,
        /* For List Card */
        fg_sku: item.fg_sku,
        fg_rating: item.fg_rating,
        fg_category_name: item.fg_category_name,
        fg_category_url: item.fg_category_url,
        // fg_up: item.fg_up,
        // fg_tag_arr: item.fg_tag_arr,
        // acc_ledger_name_bn: item.acc_ledger_name_bn,
        // fg_image_file_name: item.fg_image_file_name,
        // fg_gender: item.fg_gender,
        // fg_brand_id: item.fg_brand_id,
        // fg_brand_name: item.fg_brand_name,
        // fg_brand_logo: item.fg_brand_logo,
        // fg_type_id: item.fg_type_id,
        // fg_tag_id: item.fg_tag_id,
        // fg_type_name: item.fg_type_name,
        // fg_type_url: item.fg_type_url,
      }));
      if (input.data.length == 0) show.value = false;
      product.value = input.data;
      for (const key in product.value) {
        (product.value[key] as any).fg_rating =
          (product.value[key] as any).fg_rating * 1.0;
      }
      return {
        ...input,
        fetchedAt: new Date(),
      };
    },
    getCachedData(key: any) {
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
product.value = response.value.data;

for (const key in product.value) {
  (product.value[key] as any).fg_rating =
    (product.value[key] as any).fg_rating * 1.0;
}

function onLoad(index: any, done: any) {
  loading.value = true;
  start.value += 26;
  limit.value = 26;
  if (!no_more_data.value) {
    setTimeout(async () => {
      const { data }: any = useAsyncData(
        async () =>
          $fetch("/api/series-product/" + url, {
            query: {
              limit: limit.value,
              start: start.value,
              fg_series_url: url,
              gender: genderFilter.value,
              tag: config.public.tagFiltering,
              rating:
                ratingHigh.value != 0
                  ? ratingHigh.value == 1
                    ? "high"
                    : "low"
                  : "",
              trending:
                trendingHigh.value != 0
                  ? trendingHigh.value == 1
                    ? "high"
                    : "low"
                  : "",
              recent:
                recentHigh.value != 0
                  ? recentHigh.value == 1
                    ? "high"
                    : "low"
                  : "",
              price:
                priceHigh.value != 0
                  ? priceHigh.value == 1
                    ? "high"
                    : "low"
                  : "",
            },
          }),
        {
          default: () => [],
          lazy: true,
          deep: false,
          transform(input: any) {
            input.data = input.data.map((item: any) => ({
              acc_ledger_name: item.acc_ledger_name,
              fg_discount: item.fg_discount,
              fg_discount_end_date: item.fg_discount_end_date,
              fg_image: item.fg_image,
              fg_url: item.fg_url,
              fg_featured: item.fg_featured,
              fg_view: item.fg_view,
              fg_up_final: item.fg_up_final,
              /* For List Card */
              fg_sku: item.fg_sku,
              fg_rating: item.fg_rating,
              fg_category_name: item.fg_category_name,
              fg_category_url: item.fg_category_url,
              // fg_up: item.fg_up,
              // fg_tag_arr: item.fg_tag_arr,
              // acc_ledger_name_bn: item.acc_ledger_name_bn,
              // fg_image_file_name: item.fg_image_file_name,
              // fg_gender: item.fg_gender,
              // fg_brand_id: item.fg_brand_id,
              // fg_brand_name: item.fg_brand_name,
              // fg_brand_logo: item.fg_brand_logo,
              // fg_type_id: item.fg_type_id,
              // fg_tag_id: item.fg_tag_id,
              // fg_type_name: item.fg_type_name,
              // fg_type_url: item.fg_type_url,
            }));
            const old = product.value.length;
            product.value = product.value.concat(input.data);
            const current = product.value.length;
            if (old === current) {
              no_more_data.value = true;
            }
            loading.value = false;
            return {
              ...input,
              fetchedAt: new Date(),
            };
          },
        }
      );
      if ($q.platform.is.mobile && ($q.screen.sm || $q.screen.lt.sm)) done();
    }, 1000);
  }
}

const series_info: any = ref();
const series_category: any = ref();

const { data: series }: any = await useAsyncData(() =>
  $fetch("/api/series-by-series-url/" + url, {
    query: {
      fg_series_url: url,
    },
    transform(input: any) {
      return {
        ...input,
        fetchedAt: new Date(),
      };
    },
    getCachedData(key: any) {
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

series_info.value = series.value.series;
series_category.value = series.value.category;

/* Sort Filter Functions */
// const gender = ref("wc")
// async function changeGender(gen) {
// 	resetAllFilter()

// 	gender.value = gen
// 	if (gen == "wc") {
// 		genderFilter.value = ""
// 	}
// 	if (gen == "man") {
// 		genderFilter.value = "M"
// 	}
// 	if (gen == "woman") {
// 		genderFilter.value = "F"
// 	}

function resetAllFilter() {
  priceHigh.value = 0;
  recentHigh.value = 0;
  trendingHigh.value = 0;
  ratingHigh.value = 0;
  start.value = 0;
  limit.value = 26;
}

async function orderByRatingLowtoHigh() {
  resetAllFilter();
  ratingHigh.value = 1;
  refresh();
}

async function orderByRatingHightoLow() {
  resetAllFilter();
  ratingHigh.value = -1;
  refresh();
}

async function orderByTrendingLowtoHigh() {
  resetAllFilter();
  trendingHigh.value = 1;
  refresh();
}

async function orderByTrendingHightoLow() {
  resetAllFilter();
  trendingHigh.value = -1;
  refresh();
}

async function orderByRecentLowtoHigh() {
  resetAllFilter();
  recentHigh.value = 1;
  refresh();
}

async function orderByRecentHightoLow() {
  resetAllFilter();
  recentHigh.value = -1;
  refresh();
}

async function orderByPriceLowtoHigh() {
  resetAllFilter();
  priceHigh.value = 1;
  refresh();
}

async function orderByPriceHightoLow() {
  resetAllFilter();
  priceHigh.value = -1;
  refresh();
}
</script>
