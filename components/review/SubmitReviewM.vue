<template>
  <section>
    <div v-if="logged_in" class="q-gutter-y-sm">
      <!-- If Product Purchased -->
      <div v-if="product_purchased">
        <q-card>
          <h3 class="q-ma-none text-h6 text-primary text-uppercase text-center q-pa-sm">Reviews & Ratings</h3>
          <q-form class="q-gutter-xs q-pa-sm" @submit="onSubmit">
            <q-input filled v-model="comment" type="text" maxlength="255" autogrow label="Write A Review"
              placeholder="Please Write A Review Here ..">
              <template v-slot:prepend>
                <q-icon size="xs" name="edit" />
              </template>
            </q-input>
            <div class="row justify-center q-col-gutter-md items-center q-pa-sm">
              <div class="column q-gutter-xs items-center">
                <q-rating v-model="rating_build" size="22px" color="primary" icon="star_border" icon-selected="star" />
                <p class="text-caption q-ma-none text-weight-bold">
                  Build Quality
                </p>
              </div>
              <div class="column q-gutter-xs items-center">
                <q-rating v-model="rating_price" size="22px" color="primary" icon="star_border" icon-selected="star" />
                <p class="text-caption q-ma-none text-weight-bold">
                  Product Pricing
                </p>
              </div>
              <div class="column q-gutter-xs items-center">
                <q-rating v-model="rating_service" size="22px" color="primary" icon="star_border"
                  icon-selected="star" />
                <p class="text-caption q-ma-none text-weight-bold">
                  Our Service
                </p>
              </div>
            </div>
            <div class="row justify-center">
              <q-btn dense label="Submit" type="submit" color="primary" style="width:120px" />
            </div>
          </q-form>
        </q-card>
      </div>
      <q-card v-else flat class="column">
        <q-card-section class="q-gutter-y-md text-center">
          <h3 class="q-ma-none text-h6 text-primary text-uppercase">Reviews & Ratings</h3>
          <p class="text-body2 q-ma-none text-uppercase"> Purchase this product to give a review.</p>
        </q-card-section>
      </q-card>
      <!-- If Product Reviewed Already-->
      <q-card v-show="customerReviewText != ''" flat>
        <div class="text-subtitle2 text-uppercase q-py-sm text-center">
          Reviews & Ratings
        </div>
        <q-card-section>
          <div class="items-center justify-between row">
            <p class="text-subtitle2 q-my-xs">
              Your Review
            </p>
            <p class="text-caption q-my-xs text-grey-7">
              {{ useTimeAgoReal(props.customerReviewDate) }}
            </p>
          </div>
          <div class="items-center justify-between row ">
            <p class="text-caption q-my-xs">
              "{{ props.customerReviewText }}"
            </p>
            <!-- TODO: Rating Average -->
            <q-rating v-model="reviewRating" size="12px" color="primary" icon="star_border" icon-selected="star"
              readonly />
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-else class="column justify-center q-gutter-md q-pa-sm text-center">
      <h3 class="q-ma-none text-h6 text-primary text-uppercase">Reviews & Ratings</h3>
      <p class="text-subtitle2 q-ma-none text-uppercase">Log in and purchase this item to submit your review.</p>
      <div>
        <NuxtLink to="/login" style="text-decoration:none">
          <q-btn color="primary">
            Sign Up / Login
          </q-btn>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const $q = useQuasar()
const url = route.params.url
interface DataType {
  [x: string]: any;

}
const logged_in = ref(false)
const product_purchased = ref(false) // Default: false
const product_reviewed = ref()	// Default: false

const authCustomer = ref<DataType>([])

const rating_build = ref(4)
const rating_price = ref(4)
const rating_service = ref(4)

const comment = ref("")
const invoiceId = ref(0)
const customer_id = ref(0)
const reviewRating = ref(0)

/* Component Props */
const props = defineProps({
  fgId: { type: [Number, String], required: true },
  customerReviewText: { type: String, default: "" },
  customerReviewDate: { type: String, default: "" },
  customerReviewRating: { type: [Number, String], default: "" },
})
reviewRating.value = props.customerReviewRating as number

onMounted(async () => {
  if (localStorage.getItem("auth_customer_data")) {
    logged_in.value = true
    authCustomer.value = JSON.parse(localStorage.getItem("auth_customer_data") ?? "{}")
    customer_id.value = authCustomer.value.customer_id
  }
  invoiceId.value = 0

  /* Review Permission */
  const response: any = await $fetch("/api/product-review-permission",
    {
      method: "POST",
      body: {
        "fg_id": props.fgId,
        "acc_customer_id": customer_id.value
      },
    }
  )

  invoiceId.value = response.invoice
  product_purchased.value = response.permission
})

async function onSubmit() {
  await useFetch("/api/product-review-submit",
    {
      method: "POST",
      body: {
        "fg_id": props.fgId,
        "rating_build": rating_build.value * 1.00,
        "rating_price": rating_price.value * 1.00,
        "rating_service": rating_service.value * 1.00,
        "comment_text": comment.value,
        "invoice_id": invoiceId.value,
        "acc_customer_id": customer_id.value
      },
    }
  )
  showNotif()
  product_reviewed.value = true
  navigateTo("/product/" + url)
}

async function showNotif() {
  $q.notify({
    color: "primary",
    icon: "star",
    message: "Your Review Has Been Submitted",
    position: "bottom-right",
    timeout: Math.random() * 5000 + 3000
  })
}

</script>