<script setup lang="ts">
const nuxtApp = useNuxtApp()
const route: any = useRoute()
const config = useRuntimeConfig()
const cartCount = useCartCount()
const invoiceId = ref(null)
const customerName = ref("")
const customerPhone = ref("")
const customerEmail = ref("")
const customerAddress = ref("")
const cartItemData = ref("")
const coupon_data = ref("")
const selectedLocation = ref("")
const affiliate_id = ref("")

const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);

interface PaymentGatewaysType {
  [x: string]: any
}
const getEnvValue = await $fetch('/api/get-env-value', {})
const paymentGateways = ref<PaymentGatewaysType>([])
interface InvoiceData {
  [x: string]: any
}

const invoiceData: InvoiceData = ref([])
const invId = ref(0)
onMounted(() => {
  localStorage.removeItem("cartItem")

  const localStorageCart = JSON.parse(localStorage.getItem("cartItem") ?? "{}")
  cartCount.value = localStorageCart.length
})
if (route.query.q.length === 32) {
  invoiceId.value = route.query.q
  try {
    const response: any = await $fetch("/api/payment-detail", {
      method: "POST",
      body: {
        enc_invoice_id: route.query.q,
      },
    })
    const status = response.status
    const data = response.data

    if (status === 200) {
      invoiceData.value = data.invoice_data
      paymentGateways.value = data.payment_gateways
    }
  } catch (error) {
    // console.log(error)
  }
}
</script>
<template>
  <div>
    <!-- Order Header -->
    <q-card>
      <q-card-section class="text-center">
        <NuxtImg loading="lazy" height="120" width="300" quality="70" format="webp" src="/images/order-cancelled.webp"
          alt="order-cancelled" title="order-cancelled" />
        <h6 class="text-h6 q-ma-xs text-primary text-capitalize">
          Your Payment has been canceled!
        </h6>
        <h5 class="text-h5 text-bold q-ma-xs q-pt-sm text-primary">
          Order ID: #{{ invoiceData.invoice_id }}
        </h5>
      </q-card-section>
      <q-separator />
      <q-card-section :class="isMobileSize <= 450 ? 'q-gutter-y-sm' : 'row'">
        <div class="col-6">
          <h6 class="text-primary text-h6 q-ma-none">
            Order Details
          </h6>
          <p class="q-ma-none"><q-icon size="xs" name="person" /><span class="text-bold">Name:</span>  {{ invoiceData.customer_name }}</p>
          <p class="q-ma-none q-py-xs"><q-icon size="xs" name="phone" /> <span class="text-bold">Phone:</span>  {{ invoiceData.customer_phone }}</p>
          <p class="q-ma-none"><q-icon size="xs" name="mail" /><span class="text-bold"> Email: </span> {{ invoiceData.customer_email }}</p>
          <p class="q-ma-none q-py-xs"><q-icon size="xs" name="tag" /><span class="text-bold"> Order ID:</span>  {{ invoiceData.invoice_id }}</p>
          <p class="q-ma-none"><q-icon size="xs" name="payment" /><span class="text-bold"> Oder Total :</span>  {{ config.public.currencyBefore }} {{
            formatMoney(invoiceData.invoice_final_price * 1.00 + invoiceData.invoice_delivery_fee * 1.00) }} {{
              config.public.currencyAfter }}</p>
          <p class="q-ma-none q-py-xs"><q-icon size="xs" name="calendar_month" /><span class="text-bold"> Oder Date:</span>  {{ invoiceData.invoice_date }}</p>
          <p class="q-ma-none q-py-xs"><q-icon size="xs" name="schedule" /><span class="text-bold"> Estimated Delivery Date:</span> {{
            invoiceData.invoice_delivery_date }} </p>
          <p class="text-body1 q-ma-none text-weight-bold">
            Your Closing Balance: {{ invoiceData.balance < 0 ? 'Cr.' + formatMoney(Math.abs(invoiceData.balance) * 1.00)
              + " " + config.public.currency + " Advance" : 'Dr.' + formatMoney(invoiceData.balance * 1.00) + " " +
              config.public.currency + " Due" }} </p>
        </div>
        <div class="col-6">
          <h6 class="text-primary text-h6 q-ma-none">
            Payment Method
          </h6>
          <p class="text-body1 text-weight-bold q-ma-none">
            Your Order Is {{ invoiceData.invoice_status }}
          </p>
          <p class="text-subtitle1 q-ma-none">
            Total Paid:
            {{ config.public.currencyBefore }} {{ invoiceData.payment_received ?
              formatMoney(invoiceData.payment_received * 1.00) : 0 }} {{ config.public.currencyAfter }}
          </p>

          <p class="text-subtitle1 q-ma-none">
            Your Due (This Invoice):
            {{ config.public.currencyBefore }} {{ formatMoney(invoiceData.invoice_due * 1.00) }} {{
              config.public.currencyAfter }}
          </p>
          <div v-if="true" class="q-py-sm">
            <q-form v-for="payment in paymentGateways" :key="payment.payment_gateway_id"
              :action="getEnvValue.api_url + '/payment-only'" method="post">
              <q-input v-model="getEnvValue.c_code" style="display: none" name="company_code" />
              <q-input v-model="invoiceId" style="display: none" name="invoice_id" />
              <q-input v-model="payment.payment_gateway_id" style="display: none" name="payment_gateway_id" />
              <q-input v-model="customerName" style="display: none" name="name" />
              <q-input v-model="customerPhone" style="display: none" name="phone" />
              <q-input v-model="customerEmail" style="display: none" name="email" />
              <q-input v-model="customerAddress" style="display: none" name="address" />
              <q-input v-model="cartItemData" style="display: none" name="cart_item" />
              <q-input v-model="coupon_data" style="display: none" name="coupon" />
              <q-input v-model="affiliate_id" style="display: none" name="affiliate_id" />
              <q-input v-model="selectedLocation" style="display: none" name="location" />
              <q-btn ref="submit" outline dense type="submit" color="primary"
                :label="`PAY WITH: ` + payment.payment_gateway_name" no-caps class="bg-grey-1 shadow-3" />
            </q-form>
            <div class="q-pt-sm">
              <q-btn outline color="primary" dense type="submit" class="bg-grey-2 shadow-3">
                Cash On Delivery
              </q-btn>
            </div>
          </div>
          <div class="">
            <q-btn href="/" color="primary">
              Continue Shopping
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="row justify-center q-py-none" >
            <NuxtImg loading="lazy" height="50" quality="50" format="webp" src="/images/payment-gateway.webp"
              alt="payment-gateway" title="payment-gateway" />
          </q-card-section>
    </q-card>
  </div>
</template>