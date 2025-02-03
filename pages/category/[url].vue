<template>
  <div>
    <div class="q-gutter-y-sm">
      <q-skeleton v-if="statusCat === 'pending'" width="320px" height="50px" style="margin-top: 60px" />
      <div v-else class="bg-grey-4" style="margin-top: 60px">
        <div v-if="
          responseCat.category.fg_category_name &&
          !(
            responseCat.category.fg_category_banner != null &&
            responseCat.category.fg_category_banner != ''
          )
        " class="row items-center flex-center">
          <h1 class="text-h6 text-uppercase text-primary text-weight-medium text-center q-ma-sm">
            {{ responseCat.category.fg_category_name }}
          </h1>
        </div>
        <q-card v-if="
          responseCat.category.fg_category_banner != null &&
          responseCat.category.fg_category_banner != ''
        " flat square>
          <q-img :src="responseCat.category.fg_category_banner" loading="lazy"
            :alt="responseCat.category.fg_category_name" :title="responseCat.category.fg_category_name">
            <template #loading>
              <q-skeleton height="151px" width="100%" />
            </template>
          </q-img>
        </q-card>
      </div>
      <q-card v-if="responseCat.sub_category.length > 0" square class="bg-grey-2 q-pa-xs">
        <q-scroll-area :style="responseCat.sub_category.length > 12
          ? 'height: 72px'
          : 'height: 34px'
          " :thumb-style="{ opacity: '0' }" @touchstart.stop @mousedown.stop>
          <div class="items-center justify-start row q-ml-xs q-pt-sm q-col-gutter-sm" :style="responseCat.sub_category.length > 23
            ? 'width: 300px'
            : 'width: 400px'
            ">
            <q-chip v-for="item in responseCat.sub_category" :key="item" square outline clickable class="bg-white"
              color="primary" text-color="white">
              <NuxtLink :to="`/category/${item.fg_category_url}`" style="text-decoration: none" class="text-secondary">
               <p class="q-ma-none text-subtitle2">{{ item.fg_category_name }} ({{ item.fg_count }})</p> 
              </NuxtLink>
            </q-chip>
          </div>
        </q-scroll-area>
      </q-card>
      <LazyCategoryTrendingProductsM :url="(url as any)" />
      <div v-if="show" class="q-gutter-xs q-pt-none">
        <q-infinite-scroll :offset="100" @load="onLoad" class="q-pa-none">
          <q-card v-if="status === 'pending'" flat square class="q-pa-sm q-gutter-y-sm gradient"
            :class="$q.screen.sm ? 'row' : ''">
            <div v-for="item in 3" :key="item" :class="$q.screen.sm ? 'col-6 q-px-xs' : ''">
              <q-card>
                <q-card-section horizontal class="overflow-hidden">
                  <q-card-section class="col q-pa-none border-right">
                    <NuxtImg loading="lazy" src="/placeholder.gif" width="114" height="152" format="webp" quality="50"
                      class="fit" :draggable="false" />
                  </q-card-section>
                  <q-card-section class="col-7 q-pa-sm column q-col-gutter-sm justify-between text-primary no-wrap">
                    <div class="items-baseline justify-between row q-my-xs no-wrap">
                      <q-skeleton type="text" width="120px" />
                    </div>
                    <div class="items-center justify-between q-gutter-x-md row q-my-xs no-wrap">
                      <div class="items-center row text-grey-6 no-wrap ellipsis">
                        <div class="text-caption ellipsis" style="width: 100px">
                          <q-skeleton type="text" width="120px" />
                        </div>
                      </div>
                    </div>
                    <div class="items-baseline justify-between row">
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
          <q-card v-else flat square class="q-px-sm q-py-xs q-gutter-y-sm gradient">
            <div v-for="item in product" :key="item">
              <q-card class="q-pa-none">
                <q-card-section horizontal class="overflow-hidden">
                  <q-card-section class="col q-pa-none border-right">
                    <NuxtLink :to="`/product/${item.fg_url}`">
                      <NuxtImg loading="lazy" placeholder="/placeholder.gif" width="114" height="152" format="webp"
                        class="fit" quality="50" :src="item.fg_image" :alt="item.acc_ledger_name"
                        :title="item.acc_ledger_name" :draggable="false" />
                    </NuxtLink>
                  </q-card-section>
                  <q-icon v-if="item.fg_featured > 0" name="bookmark" color="primary" size="xs" class="absolute"
                    style="top: 5px; left: 5px" />
                  <q-card-section class="col-8 q-pa-sm column justify-between no-wrap">
                    <q-card flat class="q-pa-none q-gutter-y-sm">
                      <q-card-section class="q-pa-none">
                        <div class="ellipsis-2-lines q-py-none" style="height: 40px">
                          <NuxtLink :to="`/product/${item.fg_url}`" style="text-decoration: none">
                            <h4 class="text-subtitle2 text-left text-weight-regular q-ma-none">
                              <q-skeleton v-if="status === 'pending'" type="text" width="120px" />
                              <span v-else class="text-subtitle2">
                                {{ item.acc_ledger_name }}
                              </span>
                            </h4>
                          </NuxtLink>
                        </div>
                      </q-card-section>
                      <q-card-section class="q-pa-none">
                        <div class="row items-center justify-between wrap q-my-none">
                          <div class="col-5 items-center row text-grey-10 no-wrap ellipsis">
                            <q-icon name="qr_code" class="q-mr-xs" left />
                            <p class="text-caption ellipsis q-ma-none">
                              {{ item.fg_sku }}
                            </p>
                          </div>
                          <NuxtLink :to="`/category/${item.fg_category_url}`" :aria-label="item.acc_ledger_name"
                           style="text-decoration: none">
                           <p class="text-caption ellipsis q-ma-none"> {{ item.fg_category_name }}</p>
                          </NuxtLink>
                        </div>
                      </q-card-section>
                      <q-card-section class="q-pa-none">
                        <div class="row items-center justify-between">
                          <NuxtLink v-if="item.fg_rating > 0" :to="`/product/review/${item.fg_url}`"
                            class="row items-center no-wrap" style="text-decoration: none">
                            <q-rating v-model="item.fg_rating" class="q-mr-xs" size="12px" :max="5" color="primary"
                              readonly />
                            <span v-if="item.fg_reviews > 0" class="text-caption text-grey-10">
                              ({{ item.fg_reviews }})
                            </span>
                          </NuxtLink>
                          <q-space />&nbsp;
                          <div class="row items-center justify-start text-caption">
                            <q-icon v-if="item.fg_view > 0" name="trending_up" class="q-mr-xs" left />
                            <span v-if="item.fg_view > 0">
                              <p class="text-caption q-ma-none">
                                {{ viewCount(item.fg_view) }}
                              </p>
                            </span>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-section class="q-pa-none">
                        <div class="row items-baseline justify-between">
                          <div v-if="
                            item.fg_discount > 0 &&
                            inDateRange(
                              item.fg_discount_start_date,
                              item.fg_discount_end_date
                            )
                          " class="text-caption text-bold text-uppercase">
                            <p class="q-ma-none">-{{ item.fg_discount }}%</p>
                          </div>
                          <q-space />
                          <div
                            class="col row items-baseline text-subtitle2 text-weight-medium justify-end q-gutter-x-xs">
                            <p class="q-ma-none">
                              {{ config.public.currencyBefore }}
                              {{ formatMoney(item.fg_up_final * 1.0) }}
                              {{ config.public.currencyAfter }}
                            </p>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </div>
          </q-card>
          <template #loading>
            <div v-if="!no_more_data" class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
      <div v-else flat outline bordered class="bg-grey-1 flex-center">
        <q-card-section class="text-subtitle1 text-uppercase">
          No Product To Show
        </q-card-section>
      </div>
    </div>
    <q-page-sticky expand position="top">
      <q-toolbar class="bg-grey-3 q-pa-xs shadow-4">
        <q-toolbar-title>
          <q-scroll-area class="q-py-xs q-pr-xs" style="height: 44px" :thumb-style="{ opacity: '0' }" @touchstart.stop
            @mousedown.stop>
            <div class="row" style="width: 485px">
              <q-chip v-if="!ratingHigh" square clickable outline icon="star" icon-right="import_export" color="primary"
                text-color="white" @click="orderByRatingLowtoHigh">
                Rating
              </q-chip>
              <q-chip v-if="ratingHigh == 1" square clickable outline icon="star" icon-right="arrow_upward"
                color="primary" text-color="white" @click="orderByRatingHightoLow">
                Rating
              </q-chip>
              <q-chip v-if="ratingHigh == -1" square clickable outline icon="star" icon-right="arrow_downward"
                color="primary" text-color="white" @click="orderByRatingLowtoHigh">
                Rating
              </q-chip>
              <!-- trending -->
              <q-chip v-if="!trendingHigh" square clickable outline icon="trending_up" icon-right="import_export"
                color="primary" text-color="white" @click="orderByTrendingLowtoHigh">
                Trending
              </q-chip>
              <q-chip v-if="trendingHigh == 1" square clickable outline icon="trending_up" icon-right="arrow_upward"
                color="primary" text-color="white" @click="orderByTrendingHightoLow">
                Trending
              </q-chip>
              <q-chip v-if="trendingHigh == -1" square clickable outline icon="trending_up" icon-right="arrow_downward"
                color="primary" text-color="white" @click="orderByTrendingLowtoHigh">
                Trending
              </q-chip>
              <!-- recent -->
              <q-chip v-if="!recentHigh" square clickable outline icon="calendar_month" icon-right="import_export"
                color="primary" text-color="white" @click="orderByRecentLowtoHigh">
                Recent
              </q-chip>
              <q-chip v-if="recentHigh == 1" square clickable outline icon="calendar_month" icon-right="arrow_upward"
                color="primary" text-color="white" @click="orderByRecentHightoLow">
                Recent
              </q-chip>
              <q-chip v-if="recentHigh == -1" square clickable outline icon="calendar_month" icon-right="arrow_downward"
                color="primary" text-color="white" @click="orderByRecentLowtoHigh">
                Recent
              </q-chip>
              <!-- price -->
              <q-chip v-if="!priceHigh" square clickable outline icon="payments" icon-right="import_export"
                color="primary" text-color="white" @click="orderByPriceLowtoHigh">
                Price
              </q-chip>
              <q-chip v-if="priceHigh == 1" square clickable outline icon="payments" icon-right="arrow_upward"
                color="primary" text-color="white" @click="orderByPriceHightoLow">
                Price
              </q-chip>
              <q-chip v-if="priceHigh == -1" square clickable outline icon="payments" icon-right="arrow_downward"
                color="primary" text-color="white" @click="orderByPriceLowtoHigh">
                Price
              </q-chip>
            </div>
          </q-scroll-area>
        </q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const $q = useQuasar();
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
const limit = ref(26);

const genderFilter = ref("");
const priceHigh = ref(0);
const recentHigh = ref(0);
const trendingHigh = ref(0);
const ratingHigh = ref(0);

interface ProductType {
  [x: string]: any;
}

const product: ProductType = ref([]);

const { data: responseCat, status: statusCat }: any = await useAsyncData(
  `category-cat: ${url}`,
  async () =>
    $fetch("/api/category-by-category-url/" + url, {
      query: {
        fg_category_url: url,
      },
    }),
  {
    default: () => [],
    // lazy: true,
    deep: false,
    transform(input: any) {
      return {
        category: input.category,
        sub_category: input.sub_category,
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

const {
  data: response,
  refresh,
  status,
}: any = await useAsyncData(
  `category-product: ${url}`,
  async () =>
    $fetch("/api/category-product/" + url, {
      query: {
        start: start.value,
        limit: limit.value,
        fg_category_url: url,
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
      product.value = input.data; // For Lazy, and Filters (on Await)
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
      if (data.data.length == 0) show.value = false;
      product.value = data.data;
      return data;
    },
  }
);

product.value = response.value.data; // For await, page reload

/* TODO: FOR LAZY / NO Await */
/* For Lazy True: Cannot use cont product.value on Refresh */
/* Also LoadMore works second time on Lazy True */
/* FIND SOLn */

function onLoad(index: any, done: any) {
  loading.value = true;
  start.value += 26;
  limit.value = 26;
  if (!no_more_data.value) {
    setTimeout(async () => {
      const { data }: any = useAsyncData(
        async () =>
          $fetch("/api/category-product/" + url, {
            query: {
              limit: limit.value,
              start: start.value,
              fg_category_url: url,
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
