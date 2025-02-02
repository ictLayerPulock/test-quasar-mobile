<template>
  <div>
    <!-- Page Title -->
    <q-card>
      <q-card-section class="q-pa-none">
        <div class="q-pa-xs gradient-h">
          <h1 class="text-h5 text-uppercase text-primary text-weight-medium text-center">
            Categories of Womanish
          </h1>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div v-if="status === 'pending'">
          <q-card flat square class="gradient q-pa-none">
            <div class="row q-pa-sm q-gutter-sm flex-center">
              <div v-for="item in 6" :key="item" class="col-3">
                <q-card class="shadow-5 q-pa-none overflow-hidden">
                  <NuxtImg loading="lazy" rounded width="96" height="96" class="fit" src="/placeholder.gif" />
                  <p
                    class="text-body2 text-weight-regular text-primary text-weight-medium text-center q-px-sm q-my-xs text-capitalize ellipsis">
                    <q-skeleton type="text" width="100px"></q-skeleton>
                  </p>
                </q-card>
              </div>
            </div>
          </q-card>
          <div v-for="child in 1" :key="child">
            <q-card flat square class="q-mt-sm gradient">
              <div class="items-center justify-evenly row q-pt-sm q-pb-xs">
                <div class="text-primary text-h6 text-weight-medium text-capitalize">
                  <q-skeleton type="text" width="100px"></q-skeleton>
                </div>
              </div>
              <div class="row q-pa-sm q-col-gutter-sm justify-center">
                <div v-for="item in 4" :key="item" class="col-6">
                  <q-card class="shadow-5 overflow-hidden">
                    <q-card-section class="q-pa-none border-bottom row">
                      <NuxtImg loading="lazy" src="/placeholder.gif" sizes="100vw sm:50vw md:170px" width="170"
                        height="170" format="webp" quality="50" class="fit" :draggable="false" />
                    </q-card-section>
                    <q-card-section class="q-pa-sm q-gutter-xs">
                      <div class="text-body2 text-weight-regular ellipsis-2-lines" style="height: 44px">
                        <q-skeleton type="text" width="100px"></q-skeleton>
                      </div>
                      <div class="items-baseline justify-between row">
                        <q-space />
                        <div class="text-subtitle1 flex flex-right text-weight-medium">
                          <q-skeleton type="text" width="60px"></q-skeleton>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-card>
          </div>
        </div>
        <div v-else>
          <div class="row q-col-gutter-sm q-px-sm q-pt-sm justify-center">
            <div v-for="item in response.categoryParent" :key="item" class="col-4">
              <NuxtLink :to="`/category/${item.fg_category_url}`" class="text-black" style="text-decoration: none">
                <q-card class="shadow-5 q-pa-none">
                  <NuxtImg loading="lazy" rounded width="96" height="96" class="fit"
                    :src="item.fg_category_icon ? item.fg_category_icon : `https://dummyimage.com/96x96/d4d4d4/000.jpg&text=${item.fg_category_name}`"
                    :title="item.fg_category_name" :alt="item.fg_category_name" />
                  <p
                    class="text-body2 text-weight-regular text-primary text-weight-medium text-center q-px-sm q-my-xs text-capitalize ellipsis">
                    {{ item.fg_category_name }}
                  </p>
                </q-card>
              </NuxtLink>
            </div>
          </div>
          <div v-for="child in response.categoryParent" :key="child">
            <q-card flat square class="q-mt-sm gradient">
              <q-card-section class="row justify-between gradient-h q-py-none">
                <NuxtLink :to="`/category/${child.fg_category_url}`" :aria-label="child.fg_category_name"
                  :title="child.fg_category_name" style="text-decoration: none">
                  <h3 class="text-h5 text-capitalize text-primary text-weight-medium q-my-sm">
                    {{ child.fg_category_name }}
                  </h3>
                </NuxtLink>
                <q-btn :to="`/category/${child.fg_category_url}`" color="primary" flat padding="sm" dense size="md"
                  icon="more_vert" :aria-label="child.fg_category_name" />
              </q-card-section>
              <q-separator />
              <div class="row q-px-sm q-pt-sm q-col-gutter-sm justify-center">
                <div v-for="(item, index) in child.products
                  .slice(0, 6)" :key="item" class="col-6">
                  <NuxtLink :to="`/product/${item.fg_url}`" style="text-decoration: none" class="text-dark">
                    <q-card class="shadow-5 overflow-hidden q-pb-none">
                      <q-card-section class="q-pa-none border-bottom row">
                        <NuxtImg loading="lazy" placeholder="/placeholder.gif" class="fit" width="150" height="200"
                          :src="item.fg_image" :alt="item.acc_ledger_name" :title="item.acc_ledger_name"
                          :draggable="false" />
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
                        <div class="ellipsis-2-lines" style="height: 48px">
                          <h4 class="text-subtitle2 q-ma-none">
                            {{ item.acc_ledger_name }}
                          </h4>
                        </div>
                        <div class="items-baseline justify-between row">
                          <div v-if="
                            item.fg_discount > 0 &&
                            inDateRange(
                              item.fg_discount_start_date,
                              item.fg_discount_end_date
                            )
                          " class="text-caption text-bold text-uppercase">
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
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const $q = useQuasar();
const nuxtApp = useNuxtApp();

const { data: response, status }: any = useAsyncData(
  "category-parent-list",
  async () =>
    $fetch("/api/category-parent-list", {
      query: {
        limit: "20",
        start: "0",
      },
    }),
  {
    default: () => [],
    lazy: true,
    transform(input: any) {
      return {
        categoryParent: input.category,
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

const clearCache = (done: any) => {
  clearNuxtData();
  reloadNuxtApp();
  useShowNotif($q, "restart_alt", "Cache Cleared. Reloading...");
  done();
};
</script>
