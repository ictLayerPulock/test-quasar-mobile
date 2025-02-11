<template>
  <div style="padding-top: 90px">
    <div v-if="product.length > 0" class="q-gutter-xs q-mt-md">
      <q-infinite-scroll :offset="100" @load="onLoad">
        <q-card flat square class="row justify-center q-pa-sm q-gutter-sm gradient">
          <div v-for="(item, index) in product" :key="item" :class="isMobileSize <= 450 ? 'col-6' : ''" :style="isMobileSize <= 450 ? 'width:100%; max-width:500px' : 'width:100%; max-width:325px'">
            <q-card>
              <q-card-section horizontal class="overflow-hidden">
                <q-card-section class="col q-pa-none border-right">
                  <NuxtLink :to="`/product/${item.fg_url}`">
                    <NuxtImg loading="lazy" placeholder="/placeholder.gif" sizes="100vw sm:50vw md:170px" width="170" :src="item.fg_image" :alt="item.acc_ledger_name" :title="item.acc_ledger_name" format="webp" quality="50" class="fit" :draggable="false" />
                  </NuxtLink>
                </q-card-section>
                <q-icon v-if="item.fg_featured > 0" name="bookmark" color="primary" size="xs" class="absolute" style="top: 5px; left: 5px" />
                <q-card-section class="col-7 q-pa-sm q-col-gutter-sm">
                  <div class="text-subtitle2 ellipsis-2-lines text-secondary"
                    @click="navigateTo('/product/' + item.fg_url)">
                    <p class="q-ma-none">{{ item.acc_ledger_name }}</p>
                  </div>
                  <div class="row justify-between items-center no-wrap">
                    <div class="row items-center  no-wrap">
                      <q-icon name="qr_code" color="primary" class="q-mr-xs" />
                      <div class="text-caption q-mr-xs ellipsis">
                        {{ item.fg_sku }}
                      </div>
                    </div>
                    <NuxtLink :to="`/category/${item.fg_category_url}`" class="text-caption text-primary ellipsis" style="text-decoration: none">
                      {{ item.fg_category_name }}
                    </NuxtLink>
                  </div>
                  <div class="row justify-between items-center">
                    <NuxtLink v-if="item.fg_rating > 0" :to="`/product/review/${item.fg_url}`" class="items-center row no-wrap text-secondary" style="text-decoration: none">
                      <q-rating v-model="item.fg_rating" class="q-mr-sm" size="12px" :max="5" color="primary" readonly />
                      <span v-if="item.fg_reviews != ''" class="text-caption">
                        ({{ item.fg_reviews }}00)
                      </span>
                    </NuxtLink>
                    <q-space />&nbsp;
                    <div  v-if="item.fg_view > 0" class="row items-center text-caption text-primary">
                      <q-icon color="primary" name="trending_up" class="q-mr-xs" left />
                      <p class="q-ma-none">
                        {{ viewCount(item.fg_view) }}
                      </p>
                    </div>
                  </div>
                  <div class="row justify-between items-baseline">
                    <div v-if="
                      item.fg_discount > 0 &&
                      inDateRange(
                        item.fg_discount_start_date,
                        item.fg_discount_end_date
                      )
                    " class="text-caption text-bold text-primary text-uppercase">
                      <span class="q-mr-sm"> -{{ item.fg_discount }}% </span>
                    </div>
                    <q-space />
                    <div class="row text-subtitle2 text-weight-medium text-primary">
                      <span>
                        {{ config.public.currencyBefore }}
                        {{ formatMoney(item.fg_up_final * 1.0) }}
                        {{ config.public.currencyAfter }}
                      </span>
                    </div>
                  </div>
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
    <div v-else flat outline bordered class="bg-grey-1 flex flex-center">
      <q-card-section class="text-subtitle1 text-primary text-uppercase">
        No Product To Show
      </q-card-section>
    </div>

    <q-page-sticky expand position="top">
      <q-toolbar class="text-white bg-grey-2 q-pa-xs shadow-4">
        <q-toolbar-title>
          <!-- TO DO: Autocomplete -->
          <q-input v-model="searched_keyword" label="Search" class="col q-pa-xs" bg-color="white" autofocus label-color="primary" outlined dense color="primary" type="text" @keyup.enter="searchClicked">
            <template #append>
              <span class="text-overline text-weight-light text-grey-6">
                Searched Keyword
              </span>
              <q-btn flat outline round icon="search" color="primary" @click="searchClicked" />
            </template>
            <template #after>
              <q-btn outline round size="sm" icon="filter_alt" color="primary" @click="filterQuery()" />
            </template>
          </q-input>
          <!-- Sort Filter -->
          <q-scroll-area class="q-py-xs q-pr-xs" style="height: 44px" :thumb-style="{ opacity: '0' }" @touchstart.stop @mousedown.stop>
            <div class="row justify-center" style="width: 490px">
              <!-- gender -->
              <!-- <q-chip
                  v-if="genderFilter == ''"
                  square
                  clickable
                  outline
                  class="bg-white"
                  :icon="gender"
                  color="primary"
                  text-color="white"
                  @click="changeGender('man')"
                >
                  Gender
                </q-chip>
                <q-chip
                  v-if="genderFilter == 'M'"
                  square
                  clickable
                  outline
                  class="bg-white"
                  :icon="gender"
                  color="primary"
                  text-color="white"
                  @click="changeGender('woman')"
                >
                  Men
                </q-chip>
                <q-chip
                  v-if="genderFilter == 'F'"
                  square
                  clickable
                  outline
                  class="bg-white"
                  :icon="gender"
                  color="primary"
                  text-color="white"
                  @click="changeGender('wc')"
                >
                  Women
                </q-chip>
                <q-separator
                  vertical
                  spaced
                  inset
                  color="primary"
                /> -->
              <!-- rating -->
              <q-chip v-if="!ratingHigh" square clickable outline class="bg-white" icon="star" icon-right="import_export" color="primary" text-color="white" @click="orderByRatingLowtoHigh">
                Rating
              </q-chip>
              <q-chip v-if="ratingHigh == 1" square clickable outline class="bg-white" icon="star" icon-right="arrow_upward" color="primary" text-color="white" @click="orderByRatingHightoLow">
                Rating
              </q-chip>
              <q-chip v-if="ratingHigh == -1" square clickable outline class="bg-white" icon="star" icon-right="arrow_downward" color="primary" text-color="white" @click="orderByRatingLowtoHigh">
                Rating
              </q-chip>
              <!-- trending -->
              <q-chip v-if="!trendingHigh" square clickable outline class="bg-white" icon="trending_up" icon-right="import_export" color="primary" text-color="white" @click="orderByTrendingLowtoHigh">
                Trending
              </q-chip>
              <q-chip v-if="trendingHigh == 1" square clickable outline class="bg-white" icon="trending_up" icon-right="arrow_upward" color="primary" text-color="white" @click="orderByTrendingHightoLow">
                Trending
              </q-chip>
              <q-chip v-if="trendingHigh == -1" square clickable outline class="bg-white" icon="trending_up" icon-right="arrow_downward" color="primary" text-color="white" @click="orderByTrendingLowtoHigh">
                Trending
              </q-chip>
              <!-- recent -->
              <q-chip v-if="!recentHigh" square clickable outline class="bg-white" icon="calendar_month" icon-right="import_export" color="primary" text-color="white" @click="orderByRecentLowtoHigh">
                Recent
              </q-chip>
              <q-chip v-if="recentHigh == 1" square clickable outline class="bg-white" icon="calendar_month" icon-right="arrow_upward" color="primary" text-color="white" @click="orderByRecentHightoLow">
                Recent
              </q-chip>
              <q-chip v-if="recentHigh == -1" square clickable outline class="bg-white" icon="calendar_month" icon-right="arrow_downward" color="primary" text-color="white" @click="orderByRecentLowtoHigh">
                Recent
              </q-chip>
              <!-- price -->
              <q-chip v-if="!priceHigh" square clickable outline class="bg-white" icon="payments" icon-right="import_export" color="primary" text-color="white" @click="orderByPriceLowtoHigh">
                Price
              </q-chip>
              <q-chip v-if="priceHigh == 1" square clickable outline class="bg-white" icon="payments" icon-right="arrow_upward" color="primary" text-color="white" @click="orderByPriceHightoLow">
                Price
              </q-chip>
              <q-chip v-if="priceHigh == -1" square clickable outline class="bg-white" icon="payments" icon-right="arrow_downward" color="primary" text-color="white" @click="orderByPriceLowtoHigh">
                Price
              </q-chip>
            </div>
          </q-scroll-area>
        </q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>
    <!-- Filter Query Modal -->
    <q-dialog v-model="filterQueryModal" backdrop-filter="blur(1px) brightness(90%)" transition-show="fade" transition-hide="fade">
      <!-- Query Filters -->
      <q-card class="shadow-3">
        <!-- <q-card-section class="text-primary items-center row text-h6 gradient"> -->
        <q-card-section class="text-primary items-center q-py-sm row justify-center bg-grey-2">
          <div class="text-body1 text-weight-medium">
            Filters ({{ productCount }})
          </div>
          <q-space />
          <q-btn v-close-popup outline round size="sm" icon="close" color="primary" />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 70vh" class="bg-grey-1 scroll q-px-xs">
          <q-list class="rounded-borders">
            <q-item>
              <q-item-section avatar>
                <q-icon color="primary" name="category" />
              </q-item-section>
              <q-item-section class="text-h6 text-weight-regular">
                Category
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <q-btn v-if="category_selected == true" outline size="sm" color="primary" @click="filterSubmit">
                    Apply
                  </q-btn>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-tree v-model:selected="selectedCategoryUrl" class="text-capitalize text-body1" :nodes="categoryJson" default-expand-all accordion dense node-key="fg_category_url" label-key="label" color="primary" @click="categoryFilterChanged" />
              </q-item-section>
            </q-item>
            <q-separator spaced inset />
            <!-- attribute -->
            <q-item v-if="attrList.length != 0">
              <q-item-section avatar>
                <q-icon color="primary" name="tag" />
              </q-item-section>
              <q-item-section class="text-h6 text-weight-regular">
                Attribute
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <q-btn v-if="selectedAttrName.length > 0" outline size="sm" color="primary" @click="filterSubmit">
                    Apply
                  </q-btn>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="attrList.length != 0">
              <q-item-section>
                <q-scroll-area :visible="attrList.length > 5 ? false : true" style="height: 110px">
                  <q-option-group v-model="selectedAttrName" inline class="text-capitalize text-body1" keep-color :options="attrList" type="checkbox" label="Select Attribute" color="primary" />
                </q-scroll-area>
              </q-item-section>
            </q-item>
            <!-- attribute ↑↑ -->
            <q-separator v-if="attrList.length != 0" inset spaced />
            <!-- tag -->
            <q-item v-if="tagList.length != 0">
              <q-item-section avatar>
                <q-icon color="primary" name="tag" />
              </q-item-section>
              <q-item-section class="text-h6 text-weight-regular">
                Tag
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <q-btn v-if="selectedTagUrl.length > 0" outline size="sm" color="primary" @click="filterSubmit">
                    Apply
                  </q-btn>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="tagList.length != 0">
              <q-item-section>
                <q-scroll-area :visible="tagList.length > 5 ? false : true" style="height: 110px">
                  <q-option-group v-model="selectedTagUrl" inline class="text-capitalize text-body1" keep-color :options="tagList" type="checkbox" label="Select Tag" color="primary" />
                </q-scroll-area>
              </q-item-section>
            </q-item>
            <!-- tag ↑↑ -->
            <q-separator v-if="tagList.length != 0" inset spaced />
            <!-- brand -->
            <q-item v-if="brandList.length != 0">
              <q-item-section avatar>
                <q-icon color="primary" name="star" />
              </q-item-section>
              <q-item-section class="text-h6 text-weight-regular">
                Brand
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <q-btn v-if="selectedBrandUrl.length > 0" outline size="sm" color="primary" @click="filterSubmit">
                    Apply
                  </q-btn>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="brandList.length != 0">
              <q-item-section>
                <q-scroll-area :visible="brandList.length > 5 ? false : true" style="height: 110px">
                  <q-option-group v-model="selectedBrandUrl" inline color="primary" class="text-capitalize text-body1" keep-color :options="brandList" type="checkbox" />
                </q-scroll-area>
              </q-item-section>
            </q-item>
            <!-- brand ↑↑ -->
            <q-separator v-if="brandList.length != 0" inset spaced />
            <!-- type -->
            <q-item v-if="typeList.length != 0">
              <q-item-section avatar>
                <q-icon color="primary" name="auto_awesome" />
              </q-item-section>
              <q-item-section class="text-h6 text-weight-regular">
                Type
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <q-btn v-if="selectedTypeUrl.length > 0" outline size="sm" color="primary" @click="filterSubmit">
                    Apply
                  </q-btn>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="typeList.length != 0">
              <q-item-section>
                <q-scroll-area :visible="typeList.length > 5 ? false : true" style="height: 110px">
                  <q-option-group v-model="selectedTypeUrl" inline color="primary" class="text-capitalize text-body1" keep-color :options="typeList" type="checkbox" />
                </q-scroll-area>
              </q-item-section>
            </q-item>
            <!-- type ↑↑ -->
            <q-separator v-if="typeList.length != 0" inset spaced />
            <!-- price -->
            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="primary" name="payments" />
              </q-item-section>
              <q-item-section class="text-h6 text-weight-regular">
                Price
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <q-btn outline size="sm" color="primary" @click="filterSubmit">
                    Apply
                  </q-btn>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="row q-gutter-md justify-between items-baseline">
                  <div class="col">
                    <q-input v-model="minPrice" outlined dense color="primary" type="number" placeholder="10000" input-class="text-right" suffix="" prefix="MIN" />
                  </div>
                  <div class="col">
                    <q-input v-model="maxPrice" outlined dense color="primary" type="number" placeholder="10000" input-class="text-right" suffix="MAX" />
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <!-- price -->
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const img = useImage();
const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);

const nuxtApp = useNuxtApp();

const productCount = ref(0);
const category_selected = ref(false);

interface ProductType {
  fg_url: string;
  fg_image: string;
  fg_featured: number;
  acc_ledger_name: string;
  fg_sku: string;
  fg_category_url: string;
  fg_category_name: string;
  fg_reviews: string;
  fg_rating: number;
  fg_view: number;
  fg_discount: number;
  fg_up: number;
  fg_up_final: number;
  fg_discount_start_date: string;
  fg_discount_end_date: string;
}
/* Filter Search Modal */
const filterQueryModal = ref(false);

function filterQuery() {
  if (typeof window !== "undefined") {
    filterQueryModal.value = true;
  }
}

// const visibleAttr = ref(true)

/* For Query Filters (Static) */

const selectedCategoryUrl = ref("");
const categoryJson = ref([]);
const brandList = ref([]);
const typeList = ref([]);
const tagList = ref([]);
const attrList = ref([]);
const selectedBrandUrl = ref<string[]>([]);
const selectedTypeUrl = ref<string[]>([]);
const selectedTagUrl = ref<string[]>([]);
const selectedAttrName = ref<string[]>([]);

/* Price */
const minPrice = ref(0);
const maxPrice = ref(0);

const loading = ref(false);
const no_more_data = ref(false);
const start = ref(0);
const limit = ref(8);
const product = ref<ProductType[]>([]);
const genderFilter = ref("");
const priceHigh = ref(0);
const recentHigh = ref(0);
const trendingHigh = ref(0);
const ratingHigh = ref(0);

const route = useRoute();
const search_url = route.params.url as string;
const searched_keyword = ref<string>(search_url);

const categoryUrlValue = ref("");
if (route.query.category) {
  categoryUrlValue.value = route.query.category as string;
  selectedCategoryUrl.value = route.query.category as string;
}

if (route.query.brand) {
  selectedBrandUrl.value = (route.query.brand as string).split(" ");
}
if (route.query.type) {
  selectedTypeUrl.value = (route.query.type as string).split(" ");
}

if (route.query.tag) {
  selectedTagUrl.value = (route.query.tag as string).split(" ");
}
if (route.query.attr) {
  selectedAttrName.value = (route.query.attr as string).split(" ");
}

if (route.query.priceMin) {
  minPrice.value = route.query.priceMin as unknown as number;
  maxPrice.value = route.query.priceMax as unknown as number;
}

async function searchClicked() {
  // location.replace(searched_keyword.value as string)
  return navigateTo(searched_keyword.value as string);
}

async function searchFilterApiCall() {
  start.value = 0;
  limit.value = 8;
  const { data } = await useFetch("/api/search", {
    method: "POST",
    body: {
      limit: limit.value,
      start: start.value,
      keyword: search_url,
      categoryUrl: categoryUrlValue.value,
      brandUrl: selectedBrandUrl.value.join("+"),
      typeUrl: selectedTypeUrl.value.join("+"),
      tagUrl: selectedTagUrl.value.join("+"),
      attrId: selectedAttrName.value.join("+"),
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
      gender: genderFilter.value,
      orderByRating: ratingHigh.value,
      orderByTrending: trendingHigh.value,
      orderByRecent: recentHigh.value,
      orderByPrice: priceHigh.value,
    },
  });
  product.value = (data as any)?.value.data;
  productCount.value = (data as any)?.value.productCount;
  if (productCount.value == 0) {
    no_more_data.value = true;
  }
  if (productCount.value > 0) {
    minPrice.value = (data as any)?.value.minPrice;
    maxPrice.value = (data as any)?.value.maxPrice;
  }

  // fetch category tree ↓↓↓↓

  const { data: response } = await useFetch("/api/get-category-tree", {
    method: "POST",
    body: {
      keyword: search_url,
      categoryUrl: categoryUrlValue.value,
      brandUrl: selectedBrandUrl.value.join("+"),
      typeUrl: selectedTypeUrl.value.join("+"),
      tagUrl: selectedTagUrl.value.join("+"),
      attrId: selectedAttrName.value.join("+"),
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
    },
  });
  const categoryTree = (response as any)?.value.data;
  categoryJson.value = categoryTree;

  // fetch category tree ↑↑↑↑

  // fetch brand list ↓↓↓↓
  const { data: brands } = await useFetch("/api/get-brand-list", {
    method: "POST",
    body: {
      keyword: search_url,
      categoryUrl: categoryUrlValue.value,
      typeUrl: selectedTypeUrl.value.join("+"),
      tagUrl: selectedTagUrl.value.join("+"),
      attrId: selectedAttrName.value.join("+"),
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
    },
  });
  brandList.value = (brands as any)?.value.data;

  // fetch brand list ↑↑↑↑

  // fetch type list ↓↓↓↓

  const { data: types } = await useFetch("/api/get-type-list", {
    method: "POST",
    body: {
      keyword: search_url,
      categoryUrl: categoryUrlValue.value,
      brandUrl: selectedBrandUrl.value.join("+"),
      tagUrl: selectedTagUrl.value.join("+"),
      attrId: selectedAttrName.value.join("+"),
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
    },
  });
  typeList.value = (types as any)?.value.data;

  // fetch type list ↑↑↑↑

  // fetch tag list ↓↓↓↓
  const { data: tags } = await useFetch("/api/get-tag-list", {
    method: "POST",
    body: {
      keyword: search_url,
      categoryUrl: categoryUrlValue.value,
      brandUrl: selectedBrandUrl.value.join("+"),
      typeUrl: selectedTypeUrl.value.join("+"),
      tagUrl: selectedTagUrl.value.join("+"),
      attrId: selectedAttrName.value.join("+"),
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
    },
  });
  tagList.value = (tags as any)?.value.data;

  // fetch tag list ↑↑↑↑

  // fetch attr list ↓↓↓↓

  const { data: attributes } = await useFetch("/api/get-fg-attr-list", {
    method: "POST",
    body: {
      keyword: search_url,
      categoryUrl: categoryUrlValue.value,
      brandUrl: selectedBrandUrl.value.join("+"),
      typeUrl: selectedTypeUrl.value.join("+"),
      tagUrl: selectedTagUrl.value.join("+"),
      attrId: selectedAttrName.value.join("+"),
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
    },
  });
  attrList.value = (attributes as any)?.value.data;

  // fetch attr list ↑↑↑↑
}

function categoryFilterChanged() {
  category_selected.value = true;
}

function onLoad(index: any, done: any) {
  loading.value = true;
  start.value += 8;
  limit.value = 8;
  if (!no_more_data.value) {
    setTimeout(async () => {
      const { data } = await useFetch("/api/search", {
        method: "POST",
        body: {
          limit: limit.value,
          start: start.value,
          keyword: search_url,
          categoryUrl: categoryUrlValue.value,
          brandUrl: selectedBrandUrl.value.join("+"),
          typeUrl: selectedTypeUrl.value.join("+"),
          tagUrl: selectedTagUrl.value.join("+"),
          attrId: selectedAttrName.value.join("+"),
          minPrice: minPrice.value,
          maxPrice: maxPrice.value,
          gender: genderFilter.value,
          orderByRating: ratingHigh.value,
          orderByTrending: trendingHigh.value,
          orderByRecent: recentHigh.value,
          orderByPrice: priceHigh.value,
        },
      });
      const old = product.value.length;
      product.value = product.value.concat((data as any)?.value.data);
      const current = product.value.length;
      if (old === current) {
        no_more_data.value = true;
      }
      loading.value = false;
      done();
    }, 1000);
  }
}

function filterSubmit() {
  const whereFilters = [];
  if (selectedCategoryUrl.value != null && selectedCategoryUrl.value != "") {
    whereFilters.push("category=" + selectedCategoryUrl.value);
    categoryUrlValue.value = selectedCategoryUrl.value;
  }
  if (selectedBrandUrl.value.length > 0) {
    const brandUrlSelected = selectedBrandUrl.value.join("+");
    whereFilters.push("brand=" + brandUrlSelected);
  }
  if (maxPrice.value >= minPrice.value) {
    whereFilters.push("priceMin=" + minPrice.value);
    whereFilters.push("priceMax=" + maxPrice.value);
  }
  if (selectedTypeUrl.value.length > 0) {
    const typeUrlSelected = selectedTypeUrl.value.join("+");
    whereFilters.push("type=" + typeUrlSelected);
  }
  if (selectedTagUrl.value.length > 0) {
    const tagUrlSelected = selectedTagUrl.value.join("+");
    whereFilters.push("tag=" + tagUrlSelected);
  }

  if (selectedAttrName.value.length > 0) {
    const attrUrlSelected = selectedAttrName.value.join("+");
    whereFilters.push("attr=" + attrUrlSelected);
  }

  navigateTo("/search/" + search_url + "?" + whereFilters.join("&"));
  searchFilterApiCall();
  // location.replace("/search/" + search_url + "?" + whereFilters.join("&"))
}

// upper filter
function resetAllFilter() {
  priceHigh.value = 0;
  recentHigh.value = 0;
  trendingHigh.value = 0;
  ratingHigh.value = 0;
  minPrice.value = 0;
  maxPrice.value = 0;
  navigateTo(searched_keyword.value as string);
  // location.replace(searched_keyword.value as string)
}


async function orderByRatingLowtoHigh() {
  resetAllFilter();
  ratingHigh.value = 1;
  searchFilterApiCall();
}

async function orderByRatingHightoLow() {
  resetAllFilter();
  ratingHigh.value = -1;
  searchFilterApiCall();
}

async function orderByTrendingLowtoHigh() {
  resetAllFilter();
  trendingHigh.value = 1;
  searchFilterApiCall();
}

async function orderByTrendingHightoLow() {
  resetAllFilter();
  trendingHigh.value = -1;
  searchFilterApiCall();
}

async function orderByRecentLowtoHigh() {
  resetAllFilter();
  recentHigh.value = 1;
  searchFilterApiCall();
}

async function orderByRecentHightoLow() {
  resetAllFilter();
  recentHigh.value = -1;
  searchFilterApiCall();
}

async function orderByPriceLowtoHigh() {
  resetAllFilter();
  priceHigh.value = 1;
  searchFilterApiCall();
}

async function orderByPriceHightoLow() {
  resetAllFilter();
  priceHigh.value = -1;
  searchFilterApiCall();
}

// upper filter ↑↑↑
searchFilterApiCall();
</script>
