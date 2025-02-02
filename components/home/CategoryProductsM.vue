<script setup lang="ts">
const $q = useQuasar();
const config = useRuntimeConfig();
const img = useImage();
const tab = ref<TabType>([]);
const nuxtApp = useNuxtApp();
const limit = ref(4);

interface TabType {
  [x: string]: any;
}

if ($q.screen.gt.sm && $q.screen.lt.md) {
  limit.value = 4;
}

const { data: response, status }: any = useAsyncData(
  'home-category-product',
  async () =>
    $fetch("/api/home-category-product", {
      query: {
        limit: limit.value,
        start: "0",
      },
    }),
  {
    default: () => [],
    lazy: true,
    deep: false,
    transform(response: any) {
      for (let i = 0; i < response.data.length; i++) {
        tab.value.push("trending_" + i);
      }
      return {
        data: response.data,
        fetchedAt: new Date(),
        tab: tab.value,
      };
    },
    getCachedData(key) {
      const data: any = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
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

<template>
  <div v-if="status != 'pending'">
    <section v-for="(category, index) in response.data" :key="category">
      <div v-if="
        category.trending.length !== 0 ||
        category.featured.length !== 0 ||
        category.discounted.length !== 0
      ">
        <q-card flat square>
          <NuxtLink :to="`/category/${category.fg_category_url}`">
            <NuxtImg v-if="category.fg_category_component_img" loading="lazy" class="fit" :src="category.fg_category_component_img" :alt="category.fg_category_name" :title="category.fg_category_name">
            </NuxtImg>
          </NuxtLink>
          <q-toolbar class="bg-primary q-px-none">
            <q-tabs v-model="response.tab[index]" class="bg-primary text-white q-px-none" inline-label active-color="white" no-caps dense indicator-color="white" shrink stretch size="xs">
              <q-tab v-if="category.trending.length !== 0" icon="trending_up" :name="`trending_${index}`" label="Trending" />
              <q-tab v-if="category.featured.length !== 0" icon="bookmark" :name="`featured_${index}`" label="Featured" />
              <q-tab v-if="category.discounted.length !== 0" icon="percent" :name="`discounted_${index}`" label="Deals" />
            </q-tabs>
            <q-space />
            <q-btn id="More" round flat outline :to="`/category/${category.fg_category_url}`" color="grey-4" aria-label="More">
              <q-icon size="sm" name="more_vert" />
            </q-btn>
          </q-toolbar>
          <q-tab-panels v-model="response.tab[index]" swipeable infinite transition-prev="fade" transition-next="fade" animated @touchstart.stop @mousedown.stop>
            <q-tab-panel v-if="category.trending.length !== 0" :name="`trending_${index}`" class="q-pa-sm gradient">
              <div class="row q-col-gutter-sm justify-center">
                <div v-for="item in category.trending" :key="item" :class="$q.screen.lt.sm ? 'col-6' : 'col-3'">
                  <NuxtLink :to="`/product/${item.fg_url}`" style="text-decoration: none" class="text-secondary">
                    <q-card class="shadow-5 overflow-hidden">
                      <q-card-section class="q-pa-none border-bottom row">
                        <NuxtImg v-if="status === 'pending'" loading="lazy" src="/placeholder.gif" width="171" format="webp" quality="50" class="fit" :draggable="false" />
                        <NuxtImg v-else loading="lazy" placeholder="/placeholder.gif" class="fit" width="171" height="228" format="webp" quality="50" :draggable="false" :src="item.fg_image" :alt="item.acc_ledger_name" :title="item.acc_ledger_name" />
                      </q-card-section>
                      <q-icon v-if="item.fg_featured > 0 && status === 'success'" name="bookmark" color="primary" size="xs" class="absolute" style="top: 5px; left: 5px" />
                      <div v-if="item.fg_view > 0" size="xs" class="absolute row items-center bg-transparent text-caption text-weight-medium" style="top: 5px; right: 8px">
                        <q-icon size="xs" name="trending_up" color="primary" class="q-mr-xs" />
                        <span class="text-primary text-caption">
                          {{ viewCount(item.fg_view) }}
                        </span>
                      </div>
                      <q-card-section class="q-pa-sm q-gutter-xs">
                        <div class="text-subtitle2 ellipsis-2-lines" style="height: 44px">
                          <q-skeleton v-if="status === 'pending'" type="text" width="120px" />
                          <span v-else>
                            {{ item.acc_ledger_name }}
                          </span>
                        </div>
                        <div class="items-baseline justify-between row">
                          <div v-if="
                            item.fg_discount > 0 &&
                            inDateRange(
                              item.fg_discount_start_date,
                              item.fg_discount_end_date
                            ) &&
                            status === 'success'
                          " class="text-caption text-bold text-primary text-uppercase">
                            -{{ item.fg_discount }}%
                          </div>
                          <q-space />
                          <div class="text-subtitle2 text-weight-medium">
                            <q-skeleton v-if="status === 'pending'" type="text" width="60px" />
                            <span v-else>
                              {{ config.public.currencyBefore }}
                              {{ formatMoney(item.fg_up_final * 1.0) }}
                              {{ config.public.currencyAfter }}
                            </span>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </NuxtLink>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel v-if="category.featured.length !== 0" :name="`featured_${index}`" class="q-pa-sm gradient">
              <div class="row q-col-gutter-sm justify-center">
                <div v-for="item in category.featured" :key="item" :class="$q.screen.lt.sm ? 'col-6' : 'col-3'">
                  <NuxtLink :to="`/product/${item.fg_url}`" style="text-decoration: none" class="text-dark">
                    <q-card class="shadow-5 overflow-hidden">
                      <q-card-section class="q-pa-none border-bottom row">
                        <NuxtImg v-if="status === 'pending'" loading="lazy" src="/placeholder.gif" width="171" format="webp" quality="50" class="fit" :draggable="false" />
                        <NuxtImg v-else loading="lazy" placeholder="/placeholder.gif" class="fit" width="171" height="228" format="webp" quality="50" :draggable="false" :src="item.fg_image" :alt="item.acc_ledger_name" :title="item.acc_ledger_name" />
                      </q-card-section>
                      <q-icon v-if="item.fg_featured > 0" name="bookmark" color="primary" size="xs" class="absolute" style="top: 5px; left: 5px" />
                      <div v-if="item.fg_view > 0" size="xs" class="absolute row items-center bg-transparent text-caption text-weight-medium" style="top: 5px; right: 8px">
                        <q-icon size="xs" name="trending_up" color="primary" class="q-mr-xs" />
                        <span class="text-primary text-caption">
                          {{ viewCount(item.fg_view) }}
                        </span>
                      </div>
                      <q-card-section class="q-pa-sm q-gutter-xs">
                        <div class="text-subtitle2 ellipsis-2-lines" style="height: 44px">
                          {{ item.acc_ledger_name }}
                        </div>
                        <div class="items-baseline justify-between row">
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
            </q-tab-panel>
            <q-tab-panel v-if="category.discounted.length !== 0" :name="`discounted_${index}`" class="q-pa-sm gradient">
              <div class="row q-col-gutter-sm justify-center">
                <div v-for="item in category.discounted" :key="item" :class="$q.screen.lt.sm ? 'col-6' : 'col-3'">
                  <NuxtLink :to="`/product/${item.fg_url}`" style="text-decoration: none" class="text-dark">
                    <q-card class="shadow-5 overflow-hidden">
                      <q-card-section class="q-pa-none border-bottom row">
                        <NuxtImg v-if="status === 'pending'" loading="lazy" src="/placeholder.gif" width="171" format="webp" quality="50" class="fit" :draggable="false" />
                        <NuxtImg v-else loading="lazy" placeholder="/placeholder.gif" class="fit" width="171" height="228" format="webp" quality="50" :draggable="false" :src="item.fg_image" :alt="item.acc_ledger_name" :title="item.acc_ledger_name" />
                      </q-card-section>
                      <q-icon v-if="item.fg_featured > 0" name="bookmark" color="primary" size="xs" class="absolute" style="top: 5px; left: 5px" />
                      <div v-if="item.fg_view > 0" size="xs" class="absolute row items-center bg-transparent text-caption text-weight-medium" style="top: 5px; right: 8px">
                        <q-icon size="xs" name="trending_up" color="primary" class="q-mr-xs" />
                        <span class="text-primary text-caption">
                          {{ viewCount(item.fg_view) }}
                        </span>
                      </div>
                      <q-card-section class="q-pa-sm q-gutter-xs">
                        <div class="text-subtitle2 ellipsis-2-lines" style="height: 44px">
                          {{ item.acc_ledger_name }}
                        </div>
                        <div class="items-baseline justify-between row">
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
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </section>
  </div>
</template>