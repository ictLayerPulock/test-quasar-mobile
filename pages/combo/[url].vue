<template>
    <!-- Mobile View -->
    <q-page v-if="mobileAndTab()" class="q-gutter-sm bg-grey-2">
      <q-card flat square>
        <q-card-section class="q-px-sm row items-center gradient flex flex-center">
          <div class="col items-center justify-start row">
            <q-icon name="qr_code" left />
            <div class="text-caption">
              {{ combo.fg_combo_id
              }}<!-- 4 chars max -->
            </div>
          </div>
          <h1 class="col-8 text-h6 no-margin justify-center text-capitalize">
            {{ combo.fg_combo_name }}
          </h1>
          <div :class="combo.fg_combo_view == 0
            ? 'col invisible'
            : 'col row items-center justify-end text-caption'
            ">
            <q-icon name="trending_up" left />
            <span>
              {{ combo.fg_combo_view }}
              <!-- 4 chars max -->
            </span>
          </div>
        </q-card-section>
      </q-card>
      <q-card square>
        <q-card-section class="no-padding">
          <q-img v-if="combo.fg_combo_img != null" :src="`${combo.fg_combo_img}`" spinner-color="primary" spinner-size="82px" loading="lazy" />
        </q-card-section>
      </q-card>
      <!-- Additional Images -->
      <ComboImagesM :images="combo.images" />
      <q-card flat square>
        <q-card-section>
          <div class="items-baseline justify-center row q-gutter-lg">
            <div class="text-h6 text-primary">
              {{ formatMoney(combo.fg_combo_discount * 1.0) }}% OFF
            </div>
            <span class="text-caption text-primary text-bold">
              (Ends {{ useTimeAgo(combo.fg_combo_end_date) }})
            </span>
          </div>
          <div class="items-baseline justify-center q-gutter-lg row">
            <div class="text-body1 text-strike text-grey-6 text-weight-regular">
              {{ config.public.currencyBefore }}
              {{ formatMoney(combo_total_fg_up) }}
              {{ config.public.currencyAfter }}
            </div>
            <div class="text-h6">
              {{ config.public.currencyBefore }}
              {{ formatMoney(combo_total_fg_up_final) }}
              {{ config.public.currencyAfter }}
            </div>
          </div>
        </q-card-section>
      </q-card>
      <!-- Add To Cart -->
      <q-card flat class="bg-white">
        <q-card-section class="q-py-sm">
          <div class="items-center justify-center row">
            <div class="text-white flex flex-center">
              <div class="text-h5 row justify-evenly text-weight-bolder text-capitalize">
                <q-btn push color="primary" elevated class="text-primary text-weight-medium text-uppercase" style="width: 200px" @click="addToCartAndCheckout(combo.fg_combo_id)">
                  Buy Now
                </q-btn>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-scroll-area :style="`height:` + config.public.scrollAreaHeightMobile" :thumb-style="{ opacity: '0' }" @touchstart.stop @mousedown.stop>
        <q-card-section class="row q-pa-sm q-col-gutter-sm bg-grey-1" :style="combo.products.length == 3 ? `width:480px` : `width:780px`">
          <div v-for="item in combo.products.slice(0, 4)" :key="item.fg_id" :class="combo.products.length == 3 ? 'col-4' : 'col-3'">
            <q-card class="shadow-5 shadow-on-hover">
              <NuxtImg loading="lazy" placeholder="/placeholder.gif" sizes="100vw sm:50vw md:170px" width="170" :src="item.fg_image" :alt="item.acc_ledger_name" :title="item.acc_ledger_name" format="webp" quality="50" class="fit" :draggable="false" />
              <q-btn dense round flat size="sm" class="absolute gradient" icon="play_arrow" color="primary" style="top: 6px; right: 6px; opacity: 90%" @click="openVideoModal(item.fg_detail_video)">
                <q-tooltip anchor="center left" self="center right" class="text-caption text-weight-medium gradient text-primary shadow-4" transition-show="jump-left" transition-hide="jump-right" :offset="[10, 10]">
                  Watch Video
                </q-tooltip>
              </q-btn>
              <q-icon v-if="item.fg_featured > 0" name="bookmark" color="primary" size="xs" class="absolute" style="top: 5px; left: 5px" />
              <div v-if="item.fg_view > 0" size="xs" class="absolute row items-center bg-transparent text-caption text-weight-medium" style="top: 5px; right: 8px">
                <q-icon size="xs" name="trending_up" color="primary" class="q-mr-xs" />
                <span class="text-primary text-caption">
                  {{ viewCount(item.fg_view) }}
                </span>
              </div>
              <NuxtLink :to="`/product/${item.fg_url}`" style="text-decoration: none" class="text-dark">
                <q-card-section class="q-pa-sm q-gutter-xs">
                  <div class="text-body2 text-weight-regular ellipsis-2-lines" style="height: 44px">
                    {{ item.acc_ledger_name }}
                  </div>
                  <div class="items-center justify-between row">
                    <div v-if="
                      item.fg_discount > 0 &&
                      inDateRange(
                        item.fg_discount_start_date,
                        item.fg_discount_end_date
                      )
                    " class="text-caption text-grey-6 text-uppercase">
                      -{{ item.fg_discount }}%
                    </div>
                    <q-space />
                    <div class="text-subtitle1 text-weight-medium">
                      {{ config.public.currencyBefore }}
                      {{ formatMoney(item.fg_up_final * 1.0) }}
                      {{ config.public.currencyAfter }}
                    </div>
                  </div>
                </q-card-section>
              </NuxtLink>
            </q-card>
          </div>
        </q-card-section>
      </q-scroll-area>
      <q-card v-if="combo.fg_combo_content_editor" flat class="bg-grey-1">
        <div class="q-px-md q-py-sm">
          <div class="text-justify q-pa-xs text-body2 text-grey-7" v-html="`${combo.fg_combo_content_editor}`" />
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
    </q-page>
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
const { share } = useShare();

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

if(product){ 
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
}
function startShare() {
  if (customerID.value != "") {
    share({
      title: "Share To Earn",
      text: "Share URL",
      url: location.href + "?ref=" + customerID.value,
    });
  } else {
    share({
      title: "Share To Earn",
      text: "Share URL",
      url: location.href,
    });
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
