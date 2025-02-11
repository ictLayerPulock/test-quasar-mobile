<script setup lang="ts">
const $q = useQuasar()
// const customerInfo = ref(null)
const tab = ref("accounts")

interface CustomerType {
  [x: string]: any;
}
const customerInfo: CustomerType = ref([])

onMounted(async () => {
  if (localStorage.getItem("auth_customer_data")) {

    customerInfo.value = JSON.parse(localStorage.getItem("auth_customer_data") ?? "{}")
  }
})

// const product: productType = (data as any)?.value?.data
</script>

<template>

  <Head>
    <Title>Customer Profile</Title>
  </Head>
  <!-- Customer Account -->
  <div>

    <div v-if="customerInfo">
      <!-- Account Page Headers -->
      <div class="q-pa-xs bg-grey-4">
        <div class="items-center justify-evenly row q-pt-sm q-pa-xs">
          <h1 class="text-h6 text-uppercase text-primary text-weight-medium q-ma-none">
            My Profile
          </h1>
        </div>
      </div>
      <!-- Account Information -->
      <q-card square class="q-pa-sm bg-grey-1">
        <q-tabs narrow-indicator dense class="text-primary">
          <q-route-tab to="/customer/accounts" label="My Profile" />
          <q-route-tab to="/customer/order-list" label="My Orders" />
        </q-tabs>

        <q-card>
          <q-card-section class="row justify-center">
            <q-avatar size="100px">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg">
            </q-avatar>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-card class="my-card text-white" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
              <q-card-section class="q-pa-sm">
                <div class="row items-center">
                  <q-btn to="/customer/accounts" flat round icon="person" title="My Profile" />
                  <h6 class="q-ma-none text-h6">{{ customerInfo.name }}</h6>
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div class="row items-center">
                  <q-btn to="/customer/accounts" flat size="xs" round icon="phone" title="Phone" />
                  <p class="q-ma-none text-subtitle2">{{ customerInfo.phone }}</p>
                </div>
                <div class="row items-center">
                  <q-btn to="/customer/accounts" flat size="xs" round icon="mail" title="Email" />
                  <p class="q-ma-none text-subtitle2">{{ customerInfo.email }}</p>
                </div>
                <div class="row items-center">
                  <q-btn to="/customer/accounts" flat size="xs" round icon="location_on" title="Address" />
                  <p class="q-ma-none text-subtitle2">{{ customerInfo.billing_address }}</p>
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card>
      </q-card>
    </div>
  </div>
</template>