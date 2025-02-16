<template>
  <div class="bg-grey-2">
    <q-card flat square>
      <q-card-section class="q-pa-none">
        <ProductCarousalImagesM :name="combo.fg_combo_name" :image="combo.images" :customerIsAuth="customerIsAuth" :showShareBtn="showShareBtn" :video="combo.fg_detail_video" />
      </q-card-section>
      <q-card-section class="q-pa-sm gradient-h">
        <h1 class="text-h6 text-primary text-weight-medium q-ma-none text-capitalize text-center">
          {{ combo.fg_combo_name }}
        </h1>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div class="row justify-between items-center q-px-sm">
          <div class="row justify-center items-center">
            <q-icon size="xs" name="tag" color="primary" class="q-mr-xs" />
            <span class="text-primary text-caption">
              {{ viewCount(combo.fg_combo_id) }}
            </span>
          </div>
          <div v-if="combo.fg_combo_view > 0" class="row items-center text-caption text-primary">
            <q-icon name="trending_up" color="primary" class="q-mr-xs" left />
            {{ viewCount(combo.fg_combo_view) }}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm bg-grey-2">
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
      <q-card-section class="q-py-sm q-gutter-y-sm">
        <div class="row justify-center">
          <q-btn push color="primary" elevated class="text-primary text-weight-medium text-uppercase"
            style="width: 200px" @click="addToCartAndCheckout(combo.fg_combo_id)">
            Buy Now
          </q-btn>
        </div>
        <div class="row justify-center">
          <q-btn push to="/combo" color="primary" outline icon="arrow_back" elevated class="text-primary text-weight-medium text-uppercase"
            style="width: 200px" >
            Back Combo Page
          </q-btn>
        </div>
      </q-card-section>
    </q-card>

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
