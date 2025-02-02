<template>
  <section v-show="show">
    <q-card flat square class="q-pa-xs gradient">
      <q-card-section class="row justify-between gradient-h  q-py-none q-px-sm">
        <NuxtLink to="/#" aria-label="You May Also Like" title="You May Also Like" style="text-decoration: none">
          <h5 class="text-h5 text-capitalize text-primary text-weight-medium q-my-sm">
            You May Also Like
          </h5>
        </NuxtLink>
        <q-btn to="/#" color="primary" flat padding="sm" dense size="md" icon="more_vert"
          aria-label="You May Also Like" />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-px-xs q-py-sm">
        <q-infinite-scroll :offset="100" @load="onLoad">
          <div class="row q-col-gutter-sm gradient justify-center">
            <div v-for="item in product" :key="item" class="col-6">
              <NuxtLink :to="`/product/${item.fg_url}`" :aria-label="item.acc_ledger_name" :title="item.acc_ledger_name"
                style="text-decoration: none">
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
          <template #loading>
            <div v-if="!no_more_data" class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-card-section>
    </q-card>
  </section>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const show = ref(true)
interface DataType {
  [x: string]: any;
}
const loading = ref(false);
const no_more_data = ref(false);
const start = ref(0);
const limit = ref(20);
const product = ref<DataType>([]);
// const nuxtApp = useNuxtApp();

onMounted(async () => {
  let sessionTag = "";
  sessionTag = localStorage.getItem("sessionTag") ?? "";
  if (sessionTag) {
    sessionTag = localStorage.getItem("sessionTag") ?? "";
  } else {
    sessionTag = "";
  }

  const { data }: any = await $fetch("/api/suggested-ai", {
    query: {
      limit: limit.value,
      start: start.value,
      tagId: sessionTag,
      tag: config.public.tagFiltering,
    },
  });
  product.value = data;
  // product.value = [];
  if (product.value.length == 0) show.value = false;
});

function onLoad(index: any, done: any) {
  loading.value = true;
  start.value += 20;
  limit.value = 20;
  let sessionTag = "";
  if (localStorage.getItem("sessionTag")) {
    sessionTag = localStorage.getItem("sessionTag") ?? "";
  }
  if (!no_more_data.value) {
    setTimeout(async () => {
      const { data }: any = await $fetch("/api/suggested-ai", {
        query: {
          start: start.value,
          limit: limit.value,
          tagId: sessionTag,
          tag: config.public.tagFiltering,
        },
      });
      const old = product.value.length;
      product.value = product.value.concat(data);
      const current = product.value.length;
      if (old === current) {
        no_more_data.value = true;
      }
      loading.value = false;
      done();
    }, 1000);
  }
}
</script>
