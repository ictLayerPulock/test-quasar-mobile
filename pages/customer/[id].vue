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
      <div class="row justify-center q-pa-sm bg-grey-4">
          <h1 class="text-h6 text-uppercase text-primary text-weight-medium q-ma-none">
            My Profile
          </h1>
      </div>
      <!-- Account Information -->
      <q-card square class="q-pa-sm bg-grey-1">
        <q-tabs narrow-indicator dense class="text-primary">
          <q-route-tab to="/customer/accounts" label="My Profile" />
          <q-route-tab to="/customer/order-list" label="My Orders" />
        </q-tabs>
        <div class="q-pa-sm row justify-center">
          <q-card class="shadow-7 rounded bg-white" style="width: 100%; max-width: 500px;">
            <q-card-section class="row justify-center">
              <q-avatar size="100px">
                <NuxtImg loading="lazy" width="100" height="100" format="webp" quality="50"
                  src="https://placehold.co/100x100" alt="Profile-Image" title="Profile-Image"/>
              </q-avatar>
            </q-card-section>
            <q-card-section class="q-pa-xs">
              <div class="row justify-center items-center q-col-gutter-sm">
                <q-icon name="person" size="sm" color="primary" />
                <p class="q-ma-none text-h6">{{ customerInfo.name }}</p>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="row justify-center items-center q-col-gutter-sm">
                <q-icon name="phone"  color="primary" />
                <p class="q-ma-none text-subtitle2">{{ customerInfo.phone }}</p>
              </div>
              <div class="row justify-center items-center q-col-gutter-sm">
                <q-icon name="mail"  color="primary" />
                <p class="q-ma-none text-subtitle2">{{ customerInfo.email }}</p>
              </div>
              <div class="row justify-center items-center q-col-gutter-sm">
                <q-icon name="location_on"  color="primary" />
                <p class="q-ma-none text-subtitle2">{{ customerInfo.billing_address }}</p>
              </div>
            </q-card-section>
            <div class="row justify-center absolute" style="top: 5px; right: 5px">
              <q-btn round color="primary" title="Profile-Edit" outline size="sm" icon="edit" />
            </div>
          </q-card>
        </div>
      </q-card>
    </div>
  </div>
</template>