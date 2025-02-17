<template>
  <section v-show="show">
    <q-card v-if="status != 'pending'" flat square class="gradient">
      <q-card-section class="flex justify-between items-center gradient-h q-py-none q-px-sm">
        <NuxtLink to="/new-arrivals" aria-label="New-Arrivals" title="New Arrivals" style="text-decoration: none">
          <h1 class="text-h5 text-capitalize text-primary text-weight-medium q-my-sm">
            New Arrivals
          </h1>
        </NuxtLink>
        <q-btn to="/new-arrivals" color="primary" flat padding="sm" dense size="md" icon="more_vert"/>
      </q-card-section>
      <q-separator />
      <q-scroll-area :style="`height:` + config.public.scrollAreaHeightMobile" :thumb-style="{ opacity: '0' }"
        @touchstart.stop @mousedown.stop>
        <q-card-section v-if="status === 'pending'" class="row q-pa-sm q-col-gutter-sm gradient" style="width: 1080px">
          <div v-for="item in 6" :key="item" class="col-2">
            <q-card class="shadow-5 overflow-hidden">
              <q-card-section class="q-pa-none border-bottom">
                <NuxtImg loading="lazy" sizes="100vw sm:50vw md:170px" width="170" quality="50" class="fit"
                  format="webp" src="/placeholder.gif" :draggable="false" />
              </q-card-section>
              <q-card-section class="q-pa-sm q-gutter-xs">
                <div class="text-body2 text-weight-regular ellipsis-2-lines" style="height: 44px">
                  <q-skeleton type="text" width="200px"></q-skeleton>
                </div>
                <div class="flex justify-between items-baseline">
                  <q-space />
                  <div class="text-subtitle2 text-weight-medium">
                    <q-skeleton type="text" width="40px"></q-skeleton>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section v-else class="row q-pa-sm q-col-gutter-sm gradient"
          :style="{ width: `${response.data.length * parseInt(config.public.scrollAreaWidthMobile)}px` }">
          <div v-for="(item, index) in response.data" :key="index" class="col-2">
            <NuxtLink :to="`/product/${item.fg_url}`" :aria-label="item.acc_ledger_name" style="text-decoration: none"
              class="text-secondary">
              <q-card class="shadow-5 overflow-hidden" :style="`width: ${config.public.imageGridMediumWidthMobile}`">
                <q-card-section class="flex q-pa-none border-bottom">
                  <NuxtImg loading="lazy" placeholder="/placeholder.gif"
                    :width="config.public.imageGridMediumWidthMobile"
                    :height="config.public.imageGridMediumHeightMobile" format="webp" quality="50" :src="item.fg_image"
                    :alt="item.acc_ledger_name" :title="item.acc_ledger_name" />
                </q-card-section>
                <q-icon v-if="item.fg_featured > 0" name="bookmark" color="primary" size="xs" class="absolute"
                  style="top: 5px; left: 5px" />
                <div v-if="item.fg_view > 0" size="xs"
                  class="absolute flex justify-center items-center bg-transparent text-caption text-weight-medium"
                  style="top: 5px; right: 8px">
                  <q-icon size="xs" name="trending_up" color="primary" class="q-mr-xs"/>
                  <p class="text-caption q-ma-none text-primary">
                    {{ viewCount(item.fg_view) }}
                  </p>
                </div>
                <q-card-section class="q-pa-sm q-gutter-xs">
                  <q-chip v-if="
                    item.fg_discount > 0 &&
                    inDateRange(
                      item.fg_discount_start_date,
                      item.fg_discount_end_date
                    )
                  " rounded outline no-caps size="sm" color="grey-5 q-px-none q-mx-none"
                    class="absolute flex justify-center text-weight-bold bg-white"
                    style="top: 0; right: 4px; transform: translateY(-50%)">
                    <q-icon right size="13px" class="q-pr-xs q-ml-sm" name="schedule" color="primary" />
                    <div class="text-primary text-capitalize q-pr-sm" :title="'Ends ' + useTimeAgo(item.fg_discount_end_date)">
                      Ends {{ useTimeAgo(item.fg_discount_end_date) }}
                    </div>
                  </q-chip>
                  <div style="height: 48px">
                    <p class="text-subtitle2 text-left text-weight-regular ellipsis-2-lines q-pt-xs q-mx-none">
                      {{ item.acc_ledger_name }}
                    </p>
                  </div>
                  <div class="flex justify-between items-baseline">
                    <div v-if="
                      item.fg_discount > 0 &&
                      inDateRange(
                        item.fg_discount_start_date,
                        item.fg_discount_end_date
                      )
                    " class="text-caption text-bold text-primary text-uppercase">
                      <p class="q-ma-none">-{{ item.fg_discount }}%</p>
                    </div>
                    <q-space />
                    <div class="text-body2 text-weight-medium">
                      <p class="q-ma-none">
                        {{ config.public.currencyBefore }}
                        {{ formatMoney(item.fg_up_final * 1.0) }}
                        {{ config.public.currencyAfter }}
                      </p>
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
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const show = ref(false);
// const img = useImage();

const { data: response, status }: any = useAsyncData(
  "home-new-arrival",
  async () =>
    $fetch("/api/home-new-arrival", {
      query: {
        limit: "9",
        start: "0",
      },
    }),
  {
    default: () => [],
    lazy: true,
    deep: false,
    transform(responseData: any) {
      responseData.data = responseData.data
        .map((item: any) => ({
          acc_ledger_name: item.acc_ledger_name,
          fg_discount: item.fg_discount,
          fg_image: item.fg_image,
          fg_url: item.fg_url,
          fg_featured: item.fg_featured,
          fg_view: item.fg_view,
          fg_up_final: item.fg_up_final,
          fg_discount_start_date: item.fg_discount_start_date,
          fg_discount_end_date: item.fg_discount_end_date,
          // fg_tag_arr: item.fg_tag_arr,
          // fg_sku: item.fg_sku,
          // fg_rating: item.fg_rating,
          // acc_ledger_name_bn: item.acc_ledger_name_bn,
          // fg_image_file_name: item.fg_image_file_name,
          // fg_up: item.fg_up,
          // fg_category_name: item.fg_category_name,
          // fg_category_url: item.fg_category_url,
          // fg_gender: item.fg_gender,
          // fg_brand_id: item.fg_brand_id,
          // fg_brand_name: item.fg_brand_name,
          // fg_brand_logo: item.fg_brand_logo,
          // fg_type_id: item.fg_type_id,
          // fg_tag_id: item.fg_tag_id,
          // fg_type_name: item.fg_type_name,
          // fg_type_url: item.fg_type_url,
        }))
        .splice(0, 6);
      if (responseData.data.length > 2) show.value = true;
      return {
        ...responseData,
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
      if (data.data.length > 2) show.value = true;
      return data;
    },
  }
);

</script>