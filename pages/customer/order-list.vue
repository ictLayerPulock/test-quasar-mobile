<script setup lang="ts">
import { useDateFormat, useNow } from "@vueuse/core";
const today = useDateFormat(useNow(), "YYYY-MM-DD", { locales: "en-US" });
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const $q = useQuasar();
const showLoadMore = ref(false);
const limit = ref(12);
const start = ref(0);

interface CustomerOrders {
  [x: string]: any;
}

const customerOrders: CustomerOrders = ref([]);
const customerOrderError = ref(null);
onMounted(async () => {
  if (localStorage.getItem("auth_customer_data")) {
    const customerInfo = JSON.parse(
      localStorage.getItem("auth_customer_data") ?? "{}"
    );
    const response: any = await $fetch("/api/customer-order-list", {
      method: "POST",
      body: {
        customer_id: customerInfo.customer_id,
        limit: limit.value,
        start: start.value,
      },
    });
    const status = response.status;
    const message = response.message;
    const data = response.data;
    if (status === 200) {
      customerOrders.value = data;
      showLoadMore.value = true;
    } else {
      customerOrderError.value = message.error;
      showLoadMore.value = false;
    }
  }
});

const tab = ref("order-list");

async function onLoad() {
  limit.value += 12;
  start.value += 12;
  if (localStorage.getItem("auth_customer_data")) {
    const customerInfo = JSON.parse(
      localStorage.getItem("auth_customer_data") ?? "{}"
    );
    const response: any = await $fetch("/api/customer-order-list", {
      method: "POST",
      body: {
        customer_id: customerInfo.customer_id,
        limit: limit.value,
        start: start.value,
      },
    });
    const status = response.status;
    const message = response.message;
    const data = response.data;
    if (status === 200) {
      if (data.length > 0) {
        customerOrders.value = customerOrders.value.concat(data);
        showLoadMore.value = true;
      } else {
        showLoadMore.value = false;
      }
    } else {
      customerOrderError.value = message.error;
      showLoadMore.value = false;
    }
  }
}
</script>
<template>

  <Head>
    <Title>Customer Order List</Title>
  </Head>
  <div>
      <!-- Account Page Headers -->
      <div class="row justify-center q-pa-sm bg-grey-4">
          <h1 class="text-h6 text-uppercase text-primary text-weight-medium q-ma-none">
            My Order
          </h1>
      </div>
      <!-- Account Information -->
      <q-card v-if="customerOrders" square flat class="q-pa-sm  bg-grey-1">
        <q-tabs narrow-indicator dense class="text-primary">
          <q-route-tab to="/customer/accounts" label="My Profile" />
          <q-route-tab to="/customer/order-list" label="My Orders" />
        </q-tabs>
        <div class="q-pa-xs q-pt-md q-gutter-y-sm">
          <div v-for="order in customerOrders" :key="order.invoice_id">
            <NuxtLink :to="`/order/${order.invoice_id_encrypted}`" class="text-secondary" style="text-decoration: none">
              <q-card bordered>
                <q-card-section class="q-pa-sm q-col-gutter-xs">
                  <div class="row justify-between items-center no-wrap">
                    <div class="text-body1 ellipsis-2-lines">
                      Order ID# {{ order.invoice_id }}
                    </div>
                    <div class="text-body1 text-weight-medium ellipsis">
                      {{ config.public.currencyBefore }}
                      {{
                        formatMoney(
                          order.invoice_final_price * 1.0 +
                          order.invoice_delivery_fee * 1.0
                        )
                      }}
                      {{ config.public.currencyAfter }}
                    </div>
                  </div>
                  <div class="row justify-between items-center q-mb-sm no-wrap">
                    <div class="row items-center no-wrap">
                      <q-icon name="calendar_today" class="q-mr-xs" />
                      <div class="text-caption">
                        {{ order.invoice_date }}
                      </div>
                    </div>
                    <div class="text-caption ellipsis">
                      Item: {{ formatMoney(order.order_qty * 1.0) }} -
                      {{ formatMoney(order.shift_qty * 1.0) }} =
                      {{ formatMoney(order.remaining_qty * 1.0) }}
                    </div>
                  </div>
                  <div class="row justify-between items-center q-mt-sm">
                    <div class="row items-center no-wrap q-col-gutter-sm">
                      <span class="text-green-8">
                        Delivered on: {{ order.delivery_date }}
                      </span>
                    </div>
                    <div class="row justify-start items-center text-caption">
                      <q-icon name="schedule" left class="q-mr-xs" />
                      <span>
                        {{ order.days_since_invoice }}
                      </span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </NuxtLink>
          </div>
        </div>
      </q-card>
      <q-card-actions v-if="showLoadMore" class="row justify-center items-center bg-grey-2">
        <q-btn color="primary" class="text-primary text-weight-medium text-uppercase" style="width: 120px" @click="onLoad">
          View More
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else class="q-pa-xs row justify-center bg-grey-2">
          <h3 class="text-h6 text-uppercase text-primary text-weight-medium q-ma-sm text-center">
            {{ customerOrderError }}
          </h3>
      </q-card-actions>
  </div>
</template>
