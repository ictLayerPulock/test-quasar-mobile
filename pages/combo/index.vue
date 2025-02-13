<template>
  <head>
    <title>Combo</title>
  </head>
  <div>
    <div class="gradient-h q-pa-sm">
      <h1 class="text-h5 text-center text-primary text-capitalize text-weight-medium q-my-xs">
        Combo
      </h1>
    </div>

    <div v-if="comboData.length > 0">
      <q-card v-for="(combo, index) in comboData" :key="combo" flat square>
        <q-card-section class="q-pa-none">
          <NuxtImg loading="lazy" width="250" height="150" quality="50" class="fit" format="webp"
            :src="combo.fg_combo_img" :draggable="false" />
          <div class="absolute-bottom row justify-between">
            <q-btn push color="grey-3" class="text-black text-weight-medium text-uppercase"
              style="width: 120px;  left: 10px; bottom:10px">
              View Detail
            </q-btn>
            <q-btn push color="primary" class="text-primary text-weight-medium text-uppercase"
              style="width: 120px; right: 10px; bottom:10px" @click="addToCartAndCheckout(combo.fg_combo_id)">
              Buy Now
            </q-btn>
          </div>
          <div v-if="combo.fg_combo_view > 0" class="absolute" style="top:5px; right:5px">
            <q-icon size="xs" name="trending_up" color="primary" class="q-mr-xs" />
            <span class="text-primary text-caption">
              {{ viewCount(combo.fg_combo_view) }}
            </span>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-sm gradient-h">
          <NuxtLink :to="`/combo/${combo.fg_combo_url}`" style="text-decoration: none" class="text-secondary">
            <h5 class="text-subtitle1 justify-center text-center text-primary q-ma-none text-capitalize">
              {{ combo.fg_combo_name }}
            </h5>
          </NuxtLink>
        </q-card-section>
        <q-scroll-area style="height:308px" :thumb-style="{ opacity: '0' }" @touchstart.stop @mousedown.stop>
        <q-card-section v-if="status === 'pending'" class="row q-pa-sm q-col-gutter-sm gradient" style="width: 10650px">
          <div v-for="item in 6" :key="item" class="col-2">
            <q-card class="shadow-5 overflow-hidden">
              <q-card-section class="q-pa-none border-bottom">
                <NuxtImg loading="lazy" width="150" height="200" quality="50" class="fit" format="webp"
                  src="/placeholder.gif" :draggable="false" />
              </q-card-section>
              <q-card-section class="q-pa-sm q-gutter-xs">
                <div class="text-body2 text-weight-regular ellipsis-2-lines" style="height: 44px">
                  <q-skeleton type="text" width="200px"></q-skeleton>
                </div>
                <div class="row justify-between items-baseline">
                  <q-space />
                  <div class="text-subtitle2 text-weight-medium">
                    <q-skeleton type="text" width="40px"></q-skeleton>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section v-else class="row q-pa-sm"
          :style="{ width: `${combo.products.length * parseInt(config.public.scrollAreaWidthMobile)}px` }">
          <div v-for="(item, index) in combo.products" :key="index" class="col-2" :class="{
            'col-6': combo.products.length === 2,
            'col-4': combo.products.length === 3,
            'col-3': combo.products.length === 4,
            'col-2': combo.products.length === 6
          }">
            <NuxtLink :to="`/product/${item.fg_url}`" :aria-label="item.acc_ledger_name" style="text-decoration: none"
              class="text-secondary">
              <q-card class="shadow-5 overflow-hidden" :style="`width: ${config.public.imageGridMediumWidthMobile}`">
                <q-card-section class="row q-pa-none border-bottom">
                  <NuxtImg loading="lazy" placeholder="/placeholder.gif"
                    :width="config.public.imageGridMediumWidthMobile"
                    :height="config.public.imageGridMediumHeightMobile" format="webp" quality="50" :src="item.fg_image"
                    :alt="item.acc_ledger_name" :title="item.acc_ledger_name" />
                </q-card-section>
                <q-icon v-if="item.fg_featured > 0" name="bookmark" color="primary" size="xs" class="absolute"
                  style="top: 5px; left: 5px" />
                <div v-if="item.fg_view > 0" size="xs"
                  class="absolute row justify-center items-center bg-transparent text-caption text-weight-medium"
                  style="top: 5px; right: 8px">
                  <q-icon size="xs" name="trending_up" color="primary" class="q-mr-xs" />
                  <p class=" text-caption text-primary q-ma-none">
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

        <q-card-section class="gradient-h q-px-sm">
          <div class="items-baseline justify-between row q-gutter-xs">
            <div class="text-caption text-strike text-primary text-weight-regular">
              {{ config.public.currencyBefore }}
              {{ formatMoney(total_prices[index]) }}
              {{ config.public.currencyAfter }}
            </div>
            <div class="items-baseline row q-gutter-sm">
              <div class="text-caption text-bold text-primary">
                -{{ formatMoney(combo.fg_combo_discount * 1.0) }}%
              </div>
              <span class="text-caption text-primary text-bold">
                (Ends {{ useTimeAgo(combo.fg_combo_end_date) }})
              </span>
            </div>
            <div class="text-subtitle2 text-primary text-weight-medium">
              {{ config.public.currencyBefore }}
              {{ formatMoney(final_prices[index]) }}
              {{ config.public.currencyAfter }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-card v-else flat class="items-center q-mx-xs gradient row justify-center" style="height: 650px">
      <q-card-section class="text-uppercase text-h5 q-py-xl text-weight-regular text-grey-6 text-center">
        No Combo To Show
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

const $q = useQuasar();
interface DataType {
  [x: string]: any;
}
const slide = ref<DataType>([]);
const { data: response, status }: any = await useAsyncData(
  `product-combo-component`,
  async () =>
    $fetch("/api/product-combo-component", {
      method: "POST",
      body: {
        limit: "5",
        start: "0",
      },
    }),
  {
    deep: false,
    transform(responseData: any) {
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
      expDate.setTime(expDate.getTime() + config.public.cacheMaxAge);
      const isExpired = expDate.getTime() < Date.now();
      if (isExpired) {
        return;
      }
      return data;
    },
  }
);
const comboData = response.value.data;

const carousal_arr = ref<DataType>([]);
const carousal = ref<DataType>([]);
const addToCartClicked = ref(false);
for (const index in comboData) {
  slide.value.push(1);
  const items = 3;
  let set = 1;
  const mod = comboData[index].products.length / items;
  if (mod !== 0) {
    set = Math.ceil(mod);
  }
  let product_index = 0;

  for (let set_count = 0; set_count < set; set_count++) {
    carousal.value.push({ set: [] });
    for (let product_count = 0; product_count < items; product_count++) {
      if (product_index < comboData[index].products.length) {
        carousal.value[set_count].set.push(
          comboData[index].products[product_index]
        );
      }
      product_index++;
    }
  }
  carousal_arr.value.push(carousal.value);
  carousal.value = [];
}

/* Combo Price Calc */
const total_prices = ref<DataType>([]);
const total = ref(0);
for (let i = 0; i < comboData.length; i++) {
  total.value = 0;
  for (let j = 0; j < comboData[i].products.length; j++) {
    total.value += comboData[i].products[j].fg_up;
  }
  total_prices.value.push(total.value);
}

/* Final Price Calc */
const final_prices = ref<DataType>([]);
const final = ref(0);
for (let i = 0; i < comboData.length; i++) {
  final.value = 0;
  for (let j = 0; j < comboData[i].products.length; j++) {
    final.value +=
      comboData[i].products[j].fg_up -
      comboData[i].products[j].fg_up * (comboData[i].fg_combo_discount / 100);
  }
  final_prices.value.push(final.value);
}

async function addToCartAndCheckout(fgComboId: any) {
  addToCartClicked.value = true;
  const cartArr = [];
  const cartItem = { fg_combo_id: 0 };
  cartItem.fg_combo_id = fgComboId;

  cartArr.push(cartItem);
  localStorage.setItem("comboCartItem", JSON.stringify(cartArr));
  showNotif();

  navigateTo("/combo-checkout");
}

function routeTo(url: string) {
  if (!addToCartClicked.value) {
    navigateTo("/combo/" + url);
  }
}

async function showNotif() {
  $q.notify({
    color: "primary",
    icon: "shopping_cart",
    message: "Your Item Has Been Carted",
    position: "bottom-right",
    actions: [
      {
        label: "Go To Cart",
        color: "white",
        handler: () => {
          return navigateTo("/combo-checkout");
        },
      },
    ],
    timeout: Math.random() * 5000 + 3000,
  });
}
</script>
