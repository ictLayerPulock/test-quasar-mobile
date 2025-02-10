<template>
  {{ response.data }}
  <q-card v-show="show" flat square>
    <div class="items-center justify-around row q-py-sm bg-grey-3">
      <div class="text-primary text-h6 text-weight-medium text-capitalize">
        Related Products
      </div>
    </div>
    <q-scroll-area :style="`height:` + '300px'" :thumb-style="{ opacity: '0' }" @touchstart.stop @mousedown.stop
      class="gradient">
      <q-card-section v-if="status === 'pending'" class="row q-pa-sm q-col-gutter-sm gradient" style="width: 1080px">
        <div v-for="item in 6" :key="item" class="col-2">
          <q-card class="shadow-5 overflow-hidden">
            <q-card-section class="q-pa-none border-bottom row">
              <NuxtImg loading="lazy" sizes="100vw sm:50vw md:170px" width="170" height="170" src="/placeholder.gif"
                format="webp" quality="50" class="fit" :draggable="false" />
            </q-card-section>
            <q-card-section class="q-pa-sm q-gutter-xs">
              <div class="text-body2 text-weight-regular ellipsis-2-lines" style="height: 44px">
                <q-skeleton type="text" width="200px"></q-skeleton>
              </div>
              <div class="items-baseline justify-between row">
                <q-space />
                <div class="text-subtitle2 text-weight-medium">
                  <q-skeleton type="text" width="40px"></q-skeleton>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
      <q-card-section v-else class="row q-pa-sm q-gutter-x-sm gradient no-wrap"
        >
        <div v-for="item in response.data" :key="item" >
          <NuxtLink :to="`/product/${item.fg_url}`" :aria-label="item.acc_ledger_name" style="text-decoration: none"
            class="text-dark">
            <q-card class="shadow-5 overflow-hidden">
              <q-card-section class="q-pa-none border-bottom row">
                <NuxtImg loading="lazy" placeholder="/placeholder.gif" sizes="100vw sm:50vw md:170px" width="170"
                  height="170" :src="item.fg_image" :alt="item.acc_ledger_name" :title="item.acc_ledger_name"
                  format="webp" quality="50" class="fit" :draggable="false" />
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
                <div class="text-caption text-weight-regular ellipsis-2-lines" style="height: 44px">
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
                  <div class="text-caption text-weight-medium">
                    {{ config.public.currencyBefore }}
                    {{ formatMoney(item.fg_up_final * 1.0) }}
                    {{ config.public.currencyAfter }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </NuxtLink>
        </div>
      </q-card-section>
    </q-scroll-area>
  </q-card>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const $q = useQuasar();
const show = ref(true);

/* Component Props */
interface DataType {
  [x: string]: any;
}

const props = defineProps({
  url: { type: String, required: true },
});

console.log(props.url)

const { data: response, status }: DataType = useAsyncData(
  `product-related: ${props.url}`,
  async () =>
    $fetch("/api/product-related", {
      query: {
        fg_url: props.url,
        limit: "9",
        start: "0",
      },
    }),
  {
    default: () => [],
    lazy: true,
    deep: false,
    transform(input: any) {
      input.data = input.data
        .map((item: any) => ({
          acc_ledger_name: item.acc_ledger_name,
          fg_discount: item.fg_discount,
          fg_image: item.fg_image,
          fg_url: item.fg_url,
          fg_featured: item.fg_featured,
          fg_view: item.fg_view,
          fg_up_final: item.fg_up_final,
          // fg_discount_end_date: item.fg_discount_end_date,
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
      // if (input.data.length <= 1) show.value = false;
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
      // if (data.data.length <= 1) show.value = false;
      return data;
    },
  }
);
</script>
