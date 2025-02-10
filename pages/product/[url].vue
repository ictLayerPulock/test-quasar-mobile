<script setup lang="ts">
const $q = useQuasar();
const nuxtApp = useNuxtApp();
const config = useRuntimeConfig();
const route = useRoute();
const customPrice = useCustomPrice();
const url = route.params.url;
const customerIsAuth = ref(false);
const customerID = useCustomerID();
const showShareBtn = ref(false);
const productTagName = ref("");
const shareToEarnModal = useShareToEarnModal();
// const fgRating = ref<number>(0);

// ** If a user receives a product URL shared by another user via the share option, the URL will include a referral ID (e.g., product/product-url/?ref=customer_id). 
// ** This referral ID is stored in cookies, and if the recipient purchases any product, the referral ID will be sent through the API.
if (route.query.ref) {
  const customerRef = useCookie("customerRef", { maxAge: 604800 * 4 });
  customerRef.value = typeof route.query.ref === "string" ? route.query.ref : "";
}

const { data: product }: any = await useAsyncData(
  `product-detail: ${url}`,
  async () =>
    $fetch("/api/product-detail/" + url, {
      query: {
        fg_url: url,
      },
    }),
  {
    deep: false,
    transform(responseData: any) {
      responseData = {
        fg_id: responseData.fg_id,
        acc_ledger_name: responseData.acc_ledger_name,
        fg_discount: responseData.fg_discount,
        fg_discount_end_date: responseData.fg_discount_end_date,
        fg_discount_start_date: responseData.fg_discount_start_date,
        fg_image: responseData.fg_image,
        fg_sku: responseData.fg_sku,
        fg_tag_id: responseData.fg_tag_id,
        fg_up: responseData.fg_up,
        fg_url: responseData.fg_url,
        fg_delivery_fee: responseData.fg_delivery_fee,
        fg_shipping_cost_free: responseData.fg_shipping_cost_free,
        fg_view: responseData.fg_view,
        fg_rating: responseData.fg_rating,
        fg_category_name: responseData.fg_category_name,
        fg_category_url: responseData.fg_category_url,
        fg_detail_content_editor: responseData.fg_detail_content_editor,
        fg_detail_at_a_glance: responseData.fg_detail_at_a_glance,
        fg_detail_video: responseData.fg_detail_video,
        fg_detail_meta_title: responseData.fg_detail_meta_title,
        fg_detail_meta_desc: responseData.fg_detail_meta_desc,
        fg_up_final: responseData.fg_up_final.toString(),
        fg_up_final_props: formatMoney(responseData.fg_up_final * 1.0),
        fg_tag_arr: responseData.fg_tag_arr,
        images: responseData.images,
        fg_review_count: responseData.fg_review_count,
        fetchedAt: responseData.fetchedAt,
        fg_order_type: responseData.fg_order_type,
        // "acc_ledger_id": responseData.acc_ledger_id,
        // "acc_ledger_name_bn": responseData.acc_ledger_name_bn,
        // "fg_attribute_id": responseData.fg_attribute_id,
        // "fg_brand_id": responseData.fg_brand_id,
        fg_brand_name: responseData.fg_brand_name,
        // "fg_brand_url": responseData.fg_brand_url,
        // "fg_brand_logo": responseData.fg_brand_logo,
        fg_category_id: responseData.fg_category_id,
        // "fg_gender": responseData.fg_gender,
        // "fg_image_file_name": responseData.fg_image_file_name,
        // "fg_model_name": responseData.fg_model_name,
        // "fg_sale_history": responseData.fg_sale_history,
        // "fg_tag": responseData.fg_tag,
        // "fg_type_id": responseData.fg_type_id,
        // "fg_type_url": responseData.fg_type_url,
        // "fg_featured": responseData.fg_featured,
        // "fg_warranty_month": responseData.fg_warranty_month,
        // "unit_id": responseData.unit_id,
        // "unit_name": responseData.unit_name,
        // "fg_lead_time": responseData.fg_lead_time,
        // "fg_attr": responseData.fg_attr,
        // "fg_detail_id": responseData.fg_detail_id,
        // "fg_detail_content_ol_editor": responseData.fg_detail_content_ol_editor,
        // "fg_detail_at_a_glance_other_lang": responseData.fg_detail_at_a_glance_other_lang,
        // "fg_detail_video_src": responseData.fg_detail_video_src,
        // "fg_set_count": responseData.fg_set_count,
      };
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
// ** stores tags into session storage for Suggested Product 
function storeSessionTags(product: any) {
  if (product.fg_tag_arr) {
    const tagsNameArr: string[] = [];
    for (const key in product.fg_tag_arr) {
      tagsNameArr.push(product.fg_tag_arr[key].fg_tag_name);
    }
    productTagName.value = tagsNameArr.join(",");
  }
  if (product.fg_tag_id != "" && product.fg_tag_id != null) {
    if (typeof localStorage !== "undefined") {
      if (localStorage.getItem("sessionTag")) {
        const sessionTag = localStorage.getItem("sessionTag");
        const sessionTagArr = (sessionTag as any)?.split(",");
        const fgTagArr = product.fg_tag_id.split(",");
        const difference = fgTagArr.filter(
          (item: string) => !sessionTagArr.includes(item)
        );
        if (difference.length > 0) {
          const finalArr = sessionTagArr.concat(difference);
          if (finalArr.length > 19) {
            const indexToRemove = 0; // Index of the item to remove
            finalArr.splice(indexToRemove, 1);
          }
          localStorage.setItem("sessionTag", finalArr.join(","));
        }
      } else {
        if (product.fg_tag_id != "" && product.fg_tag_id != null) {
          localStorage.setItem("sessionTag", product.fg_tag_id);
        }
      }
    }
  }
}
// ** stores fg id into localStorage for recently views
function addToRecent(product: any) {
  let historyFg: string[] = [];
  if (typeof localStorage !== "undefined") {
    if (localStorage.getItem("history")) {
      let localStorageFg = localStorage.getItem("history");
      historyFg = (localStorageFg ?? "").split(",");
      if (!historyFg.includes(product.fg_id)) {
        historyFg.push(product.fg_id);
        localStorageFg = historyFg.join(",");
        localStorage.setItem("history", localStorageFg);
      }
    } else {
      historyFg.push(product.fg_id);
      const localStorageFg = historyFg.join(",");
      localStorage.setItem("history", localStorageFg);
    }
  }
}

function shareToEarn() {
  if (typeof localStorage !== "undefined") {
    const customerAuth = JSON.parse(localStorage.getItem("auth_customer_data") ?? "{}");
    if (customerAuth) {
      customerID.value = customerAuth.customer_id;
      customerIsAuth.value = true;
      showShareBtn.value = true;
    } else {
      showShareBtn.value = false;
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
  }
}

onMounted(() => {
  if (!product.value.fg_id) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product Not Found'
    })
  }
  addToRecent(product.value);
  storeSessionTags(product.value);
  shareToEarn();
  useRefreshHistory();
});

// Modify the HTML content by adding inline styles to specific tags
const rawVHtml = ref(product.value.fg_detail_content_editor);
const rawVHtmlGlance = ref(product.value.fg_detail_at_a_glance);
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
const styledHtmlGlance = computed(() => {
  return rawVHtmlGlance.value
    .replace(/<p>/g, '<p style="font-size: 14px; line-height: 1.4; margin: 0 0 5px 0;">')
});


</script>
<template>
  <div>
    <q-card v-if="product.fg_id">
      <q-card-section class="q-pa-none">
        <ProductCarousalImagesM :name="product.acc_ledger_name" :image="product.images" :customerIsAuth="customerIsAuth" :showShareBtn="showShareBtn" :video="product.fg_detail_video" />
      </q-card-section>
      <q-card-section v-if="product.fg_id" class="q-pa-sm">
        <h1 class="text-h6 text-primary text-weight-medium q-ma-none text-capitalize text-center">
          {{ product.acc_ledger_name }}
        </h1>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div class="row justify-between items-center q-px-sm">
          <div class="row justify-center items-center">
            <q-icon name="qr_code" color="primary" class="q-mr-xs" left />
            <div class="text-overline">
              {{ product.fg_sku }}
            </div>
          </div>
          <div class="row justify-start items-center">
            <NuxtLink :to="`/category/${product.fg_category_url}`" :title="product.fg_category_name" :aria-label="product.fg_category_name" style="text-decoration: none" class="row justify-center items-center text-secondary">
              <q-icon name="category" class="q-mr-xs" left />
              <p class="q-ma-none">
                {{ product.fg_category_name }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <div class="row justify-between items-center">
          <div v-if="product.fg_view > 0" class="row items-center text-caption text-primary">
            <q-icon name="trending_up" color="primary" class="q-mr-xs" left />
            {{ viewCount(product.fg_view) }}
          </div>
          <q-space />
          <NuxtLink v-if="product.fg_rating > 0" :to="`/product/review/${product.fg_url}`" class="row items-center" title="Review/Rating" aria-label="Review/Rating" style="text-decoration: none">
            <span v-if="product.fg_review_count > 0" class="text-caption text-grey-7" style="padding-top: 2px">
              ({{ product.fg_review_count }})
            </span>
            <q-rating v-model="product.fg_rating" class="q-ml-xs" size="16px" :max="5" color="primary" readonly />
          </NuxtLink>
          <NuxtLink v-else :to="`/product/review/${product.fg_url}`" class="row items-center q-gutter-xs no-wrap" title="Review/Rating" aria-label="Review/Rating" style="text-decoration: none">
            <q-icon v-if="product.fg_id" name="star" color="primary" style="margin-bottom: 2px" />
            <span v-if="product.fg_id" class="text-caption text-primary text-capitalize">
              Give First Rating!
            </span>
          </NuxtLink>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="product.fg_id" class="q-pa-sm bg-grey-3">
        <div v-if="
          product.fg_discount > 0 &&
          inDateRange(product.fg_discount_start_date, product.fg_discount_end_date)
        " class="row justify-center items-center q-gutter-x-lg text-primary">
          <div>
            <p class="q-mr-md text-bold text-uppercase q-ma-none">
              {{ product.fg_discount }}% Off
            </p>
          </div>
          <div>
            <p v-if="product.fg_discount_end_date" class="text-overline text-bold q-ma-none text-capitalize">
              (Ends {{ useTimeAgo(product.fg_discount_end_date) }})
            </p>
          </div>
        </div>
        <div class="row justify-center q-gutter-x-lg">
          <div>
            <p v-if="
              product.fg_discount > 0 &&
              inDateRange(product.fg_discount_start_date, product.fg_discount_end_date)
            " class="text-strike text-primary text-subtitle2 text-h6 q-ma-none text-weight-medium">
              {{ config.public.currencyBefore }}
              {{ formatMoney(product.fg_up) }}
              {{ config.public.currencyAfter }}
            </p>
          </div>
          <div>
            <h5 class="text-h5 text-primary text-weight-medium q-ma-none">
              Price: {{ config.public.currencyBefore }}
              {{ formatMoney(product.fg_up_final * 1.0 + customPrice * 1.0) }}
              {{ config.public.currencyAfter }}
            </h5>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        {{ url }}
        <ProductAttributesCardOptionM v-if="product.fg_id" :fg-id="product.fg_id" :fg-order-type="product.fg_order_type" />
        <ProductAddToCartM v-if="product.fg_id" :fg-id="product.fg_id" :fg-order-type="product.fg_order_type" />
       
      </q-card-section>
      <q-card-section v-if="product.fg_detail_at_a_glance" flat class="bg-grey-2 q-pa-none">
        <div class="q-px-sm">
          <div class="text-justify q-pa-xs text-body2 text-capitalize" v-html="styledHtmlGlance" />
        </div>
      </q-card-section>
      <q-card-section v-if="product.fg_detail_content_editor" flat square class="bg-grey-1 q-py-none">
        <div class="q-px-sm">
          <div class="text-justify q-pa-xs text-body2" v-html="styledHtml" />
        </div>
      </q-card-section>
    </q-card>
    <ProductRelatedProductsM :url="(url as any)" />
    <LazySuggestedProductsM />
  </div>
</template>
