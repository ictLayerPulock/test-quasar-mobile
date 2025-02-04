<template>

<div class="q-gutter-y-md" style="margin-top: 56px">
    <div v-if="page_banner" class="row justify-around items-center bg-grey-2">
      <h1 class="text-h5 text-uppercase text-primary text-weight-medium text-center q-ma-sm" :title="title">
        {{ title }}
      </h1>
    </div>
    <q-card v-else square flat>
      <NuxtImg loading="lazy" format="webp" quality="50" class="fit" height="60" :draggable="false"
        placeholder="/placeholder.gif" :src="page_banner" alt="page-banner" title="page-banner" />
    </q-card>
    <!-- Product List -->
    <div v-if="show" class="q-gutter-xs q-mt-md">
      <q-infinite-scroll :offset="100" @load="onLoad">
        <q-card v-if="status === 'pending'" flat square class="q-pa-sm q-gutter-y-sm gradient"
          >
          <div class="row q-col-gutter-sm gradient justify-center">
            <div v-for="item in 8" :key="item" :class="isMobileSize <= 450 ? 'col-6' : 'col-3'">
              <q-card class="shadow-5 q-pa-none overflow-hidden">
                <q-card-section class="q-pa-none border-bottom">
                  <NuxtImg loading="lazy" ratio="3:4" placeholder="/placeholder.gif" class="fit" format="webp"
                    quality="50" alt="image" title="image" />
                </q-card-section>

                <q-card-section class="q-pa-sm q-gutter-xs">
                  <div class="ellipsis-2-lines" style="height: 48px">
                    <div class="items-baseline justify-between row q-my-xs no-wrap">
                      <q-skeleton type="text" width="120px" />
                    </div>
                  </div>
                  <div class="row justify-between items-baseline">
                    <div class="items-baseline justify-between row q-my-xs no-wrap">
                      <q-skeleton type="text" width="20px" />
                    </div>
                    <q-space />
                    <div class="items-baseline justify-between row q-my-xs no-wrap">
                      <q-skeleton type="text" width="20px" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card>
        <q-card v-else flat square class="q-pa-sm q-gutter-y-sm gradient">
          <div class="row q-col-gutter-sm gradient justify-center">
            <div v-for="item in product" :key="item" :class="isMobileSize <= 450 ? 'col-6' : 'col-3'">
              <NuxtLink :to="`/product/${item.fg_url}`" :aria-label="item.acc_ledger_name" :title="item.acc_ledger_name"
                style="text-decoration: none" class="text-secondary">
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
                    <div class="text-primary text-capitalize q-pr-sm" :title="'Ends ' + useTimeAgo(item.fg_discount_end_date)">
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
    <q-toolbar class="text-white bg-grey-3 q-pa-xs shadow-4">
      <q-toolbar-title>
        <!-- Sort Filter -->
        <q-scroll-area class="q-py-xs q-pr-xs flex flex-center" style="height: 44px" :thumb-style="{ opacity: '0' }"
          @touchstart.stop @mousedown.stop>
          <div class="row" style="width: 490px">
            <!-- gender -->
            <!-- <q-chip v-if="genderFilter == ''" square clickable outline class="bg-white" :icon="gender" color="primary" text-color="white" @click="changeGender('man')">
                                Gender
                            </q-chip>
                            <q-chip v-if="genderFilter == 'M'" square clickable outline class="bg-white" :icon="gender" color="primary" text-color="white" @click="changeGender('woman')">
                                Men
                            </q-chip>
                            <q-chip v-if="genderFilter == 'F'" square clickable outline class="bg-white" :icon="gender" color="primary" text-color="white" @click="changeGender('wc')">
                                Women
                            </q-chip>
                            <q-separator vertical spaced inset color="primary" /> -->
            <!-- rating -->
            <q-chip v-if="!ratingHigh" square clickable outline class="bg-white" icon="star" icon-right="import_export"
              color="primary" text-color="white" @click="orderByRatingLowtoHigh">
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
</template>
<script setup lang="ts">
const nuxtApp = useNuxtApp();
const config = useRuntimeConfig();
const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);
const show = ref(true);
const title = ref("Most Popular");

const clearCache = (done: any) => {
  clearNuxtData();
  reloadNuxtApp();
  useShowNotif($q, "restart_alt", "Cache Cleared. Reloading...");
  done();
};

const page_banner = ref("https://placehold.co/100x50");
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

const {
  data: response,
  refresh,
  status,
} = await useAsyncData(
  "page-most-popular",
  async () =>
    $fetch("/api/page-most-popular", {
      query: {
        limit: limit.value,
        start: start.value,
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
    // default: () => [],
    // lazy: true,
    // deep: false,
    transform(input: any) {
      input.data = input.data.map((product: any) => ({
        acc_ledger_name: product.acc_ledger_name,
        fg_discount: product.fg_discount,
        fg_discount_end_date: product.fg_discount_end_date,
        fg_image: product.fg_image,
        fg_url: product.fg_url,
        fg_featured: product.fg_featured,
        fg_view: product.fg_view,
        fg_up_final: product.fg_up_final,
        /* For List Cards */
        fg_sku: product.fg_sku,
        fg_rating: product.fg_rating,
        fg_up: product.fg_up,
        fg_category_url: product.fg_category_url,
        fg_category_name: product.fg_category_name,
        // fg_tag_arr: product.fg_tag_arr,
        // acc_ledger_name_bn: product.acc_ledger_name_bn,
        // fg_image_file_name: product.fg_image_file_name,
        // fg_gender: product.fg_gender,
        // fg_brand_id: product.fg_brand_id,
        // fg_brand_name: product.fg_brand_name,
        // fg_brand_logo: product.fg_brand_logo,
        // fg_type_id: product.fg_type_id,
        // fg_tag_id: product.fg_tag_id,
        // fg_type_name: product.fg_type_name,
        // fg_type_url: product.fg_type_url,
      }));
      if (input.data.length == 0) show.value = false;
      product.value = input.data; // For Lazy & Filter
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
product.value = response.value.data; // For await & page reload

async function onLoad(index: any, done: any) {
  loading.value = true;
  start.value += 12;
  limit.value = 12;
  if (!no_more_data.value) {
    const { data } = await useAsyncData(
      () =>
        $fetch("/api/page-most-popular", {
          query: {
            limit: limit.value,
            start: start.value,
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
  }
}

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
  limit.value = 12;
  start.value = 0;
}

async function orderByRatingLowtoHigh() {
  resetAllFilter();
  ratingHigh.value = 1;
  refresh();
  no_more_data.value = false;
}

async function orderByRatingHightoLow() {
  resetAllFilter();
  ratingHigh.value = -1;
  refresh();
  no_more_data.value = false;
}

async function orderByTrendingLowtoHigh() {
  resetAllFilter();
  trendingHigh.value = 1;
  refresh();
  no_more_data.value = false;
}

async function orderByTrendingHightoLow() {
  resetAllFilter();
  trendingHigh.value = -1;
  refresh();
  no_more_data.value = false;
}

async function orderByRecentLowtoHigh() {
  resetAllFilter();
  recentHigh.value = 1;
  refresh();
  no_more_data.value = false;
}

async function orderByRecentHightoLow() {
  resetAllFilter();
  recentHigh.value = -1;
  refresh();
  no_more_data.value = false;
}

async function orderByPriceLowtoHigh() {
  resetAllFilter();
  priceHigh.value = 1;
  refresh();
  no_more_data.value = false;
}

async function orderByPriceHightoLow() {
  resetAllFilter();
  priceHigh.value = -1;
  refresh();
  no_more_data.value = false;
}
</script>
