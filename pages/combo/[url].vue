<template>
  <div class="bg-grey-2">
    <q-card flat square>
      <q-card-section class="q-pa-none">
        <NuxtImg loading="lazy" ratio="3:4" placeholder="/placeholder.gif" class="fit" format="webp" quality="50"
          :src="combo.fg_combo_img" :alt="combo.fg_combo_name" :title="combo.fg_combo_name" />
        <q-btn dense round flat size="md" class="absolute bg-grey-2" icon="share" color="primary"
          style="top: 12px; right: 12px; z-index: 60; opacity: 75%" aria-label="Share" />
      </q-card-section>
      <q-card-section class="q-pa-sm gradient-h">
        <h1 class="text-h6 text-primary text-weight-medium q-ma-none text-capitalize text-center">
          {{ combo.fg_combo_name }}
        </h1>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div class="row justify-between items-center q-px-sm">
          <div class="row justify-center items-center">
            <q-icon name="qr_code" color="primary" class="q-mr-xs" left />
            <div class="text-overline">
              {{ combo.fg_combo_id }}
            </div>
          </div>
          <div v-if="combo.fg_combo_view > 0" class="row items-center text-caption text-primary">
            <q-icon name="trending_up" color="primary" class="q-mr-xs" left />
            {{ viewCount(combo.fg_combo_view) }}
          </div>
        </div>
      </q-card-section>

      <ComboImagesM :images="combo.images" />

      <q-card-section class="q-pa-sm bg-grey-3">
        <div class="row justify-center items-center q-gutter-x-lg text-primary">
          <div>
            <p class="q-mr-md text-bold text-uppercase q-ma-none">
              {{ formatMoney(combo.fg_combo_discount * 1.0) }}% OFF
            </p>
          </div>
          <div>
            <p class="text-overline text-bold q-ma-none text-capitalize">
              (Ends {{ useTimeAgo(combo.fg_combo_end_date) }})
            </p>
          </div>
        </div>
        <div class="row justify-center q-gutter-x-lg">
          <div>
            <p class="text-strike text-primary text-subtitle2 text-h6 q-ma-none text-weight-medium">
              {{ config.public.currencyBefore }}
              {{ formatMoney(combo_total_fg_up) }}
              {{ config.public.currencyAfter }}
            </p>
          </div>
          <div>
            <h5 class="text-h5 text-primary text-weight-medium q-ma-none">
              Price: {{ config.public.currencyBefore }}
              {{ formatMoney(combo_total_fg_up_final) }}
              {{ config.public.currencyAfter }}
            </h5>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-py-sm">
        <div class="row justify-center">
          <q-btn push color="primary" elevated class="text-primary text-weight-medium text-uppercase"
            style="width: 200px" @click="addToCartAndCheckout(combo.fg_combo_id)">
            Buy Now
          </q-btn>
        </div>
      </q-card-section>
    </q-card>

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
                <NuxtImg loading="lazy" placeholder="/placeholder.gif" :width="config.public.imageGridMediumWidthMobile"
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

    <q-card v-if="styledHtml" flat class="bg-grey-1">
      <div class="q-px-md q-py-sm">
        <div class="text-justify q-pa-xs" v-html="`${styledHtml}`" />
      </div>
    </q-card>
    <!-- share to earn -->
    <q-dialog v-model="shareToEarnModal" class="flex flex-center">
      <LazyProductShareToEarnModalM />
    </q-dialog>
    <!-- Video Modal -->
    <q-dialog v-model="videoModal" position="bottom">
      <q-card class="shadow-up-10">
        <ComboVideoModalM :video="videoCode" style="height: 330px" />
        <q-card-actions class="justify-center row q-pa-sm gradient-bottom">
          <q-btn v-close-popup outline label="Close" color="primary" style="width: 120px" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const route = useRoute();
const $q = useQuasar();
const url = route.params.url;
const customerIsAuth = ref(false);
const showShareBtn = ref(false);
const shareToEarnModal = ref(true);
const customerID = ref("");
const slide = ref(1)
// const { share } = useShare();

onMounted(() => {
  const customerAuth = JSON.parse(
    localStorage.getItem("auth_customer_data") ?? "{}"
  );
  if (customerAuth) {
    customerID.value = customerAuth.customer_id;
    customerIsAuth.value = true;
    showShareBtn.value = false;
  } else {
    showShareBtn.value = true;
  }
  if (customerIsAuth) {
    const shareToEarnState = JSON.parse(
      localStorage.getItem("shareToEarnState") ?? "{}"
    );
    if (shareToEarnState == 1) {
      shareToEarnModal.value = true;
    } else {
      shareToEarnModal.value = false;
    }
  }
  localStorage.removeItem("shareToEarnState");
});

const { data: response, status }: any = await useAsyncData(
  `product-combo-detail`,
  async () =>
    $fetch("/api/product-combo-detail", {
      method: "POST",
      body: {
        fg_combo_url: url,
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
const combo = response.value.data;
// refresh()

const videoModal = ref(false);
const videoCode = ref();

function openVideoModal(video: any) {
  videoModal.value = true;
  videoCode.value = video;
}

/* TODO: Show All products regardless of sets */

const product = combo.products;
const combo_total_fg_up = ref(0);
const combo_total_fg_up_final = ref(0);

if (product) {
  for (let i = 0; i < product.length; i++) {
    combo_total_fg_up.value += product[i].fg_up;
  }
  for (let i = 0; i < product.length; i++) {
    combo_total_fg_up_final.value += product[i].fg_up_final;
  }
}

async function addToCartAndCheckout(fgComboId: any) {
  const cartArr = [];
  const cartItem = { fg_combo_id: 0 };
  cartItem.fg_combo_id = fgComboId;

  cartArr.push(cartItem);
  localStorage.setItem("comboCartItem", JSON.stringify(cartArr));
  showNotif();
  navigateTo("/combo-checkout");
}

const rawVHtml = ref(combo.fg_combo_content_editor);
const styledHtml = computed(() => {
  return rawVHtml.value
    .replace(/<h1>/g, '<h1 style="font-size: 18px; line-height: 1.5; margin: 0 0 7px 0; font-weight: 500;">')
    .replace(/<h2>/g, '<h2 style="font-size: 17px; line-height: 1.5; margin: 0 0 7px 0; font-weight: 500;">')
    .replace(/<h3>/g, '<h3 style="font-size: 16px; line-height: 1.5; margin: 0 0 7px 0; font-weight: 500;">')
    .replace(/<p>/g, '<p style="font-size: 14px; line-height: 1.4; margin: 0 0 5px 0;">')
    .replace(/<ul>/g, '<ul style="font-size: 14px; line-height: 1.5; margin: 0 0 5px 0;">')
    .replace(/<li>/g, '<li style="font-size: 14px; line-height: 1.4; margin: 0 0 5px 0;">')
    .replace(/<img/g, '<img style="width:100%; height:400px;"')
    .replace(/<iframe/g, '<iframe style="width:100%; height:400px;"');
});

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
