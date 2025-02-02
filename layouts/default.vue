<template>
  <!-- Mobile -->
  <q-layout view="hHh LpR lff" class="orientation-portrait no-rotation">
    <!-- Header -->
    <q-header elevated class="gradient" height-hint="60">
      <q-toolbar class="justify-between items-center" style="height: 60px">
        <q-btn id="menu" @click="leftDrawer" aria-label="Menu" flat color="dark" round icon="menu" />
        <q-toolbar-title class="row justify-center">
          <NuxtImg loading="lazy" format="webp" width="150" height="40" sizes="150px" src="https://placehold.co/150x40" alt="BFL"
            title="BFL" />
        </q-toolbar-title>

        <q-btn id="checkout" color="dark" :class="router.currentRoute.value.path == '/checkout' ? 'dark' : ''" to="/checkout" flat round aria-label="Checkout" icon="shopping_cart">
        <span v-show="cartCount > 0" class="absolute-top-right text-bold text-dark text-caption" style="padding-inline: 3px; border-radius: 25%; right: -2px" title="Checkout">
        {{ cartCount }}
        </span>
      </q-btn>
      </q-toolbar>
    </q-header>
    <!-- Left Drawer (Category List) -->
    <q-drawer v-model="leftDrawerOpen" side="left" :width="300" :breakpoint="500" overlay elevated
      class="gradient-left text-body2">
      <q-scroll-area :style="customerIsAuth
        ? 'height: calc(100% - 120px); margin-top: 120px'
        : 'height: calc(100% - 64px); margin-top: 64px'
        " visible>
        <q-list>
          <q-item v-ripple active-class="bg-grey-4" to="/" clickable>
            <q-item-section avatar class="q-pa-none">
              <q-icon size="25px" color="primary" class="q-pa-none" name="home" />
            </q-item-section>
            <q-item-section>
              Home
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-grey-4" to="/category" clickable>
            <q-item-section avatar>
              <q-icon size="25px" name="category" />
            </q-item-section>
            <q-item-section>
              Categories
            </q-item-section>
          </q-item>
          <q-item v-ripple :class="allDiscountMenu > 0 ? `` : `hidden`" active-class="bg-grey-4" to="/all-discounted"
            clickable>
            <q-item-section avatar>
              <q-icon size="25px" name="percent" />
            </q-item-section>
            <q-item-section>
              Discounts
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-grey-4" to="/news" clickable>
            <q-item-section avatar>
              <q-icon size="25px" name="newspaper" />
            </q-item-section>
            <q-item-section>
              News
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-grey-4" to="/blog" clickable>
            <q-item-section avatar>
              <q-icon size="25px" name="edit_note" />
            </q-item-section>
            <q-item-section>
              Blog
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-grey-4" to="/showroom" clickable>
            <q-item-section avatar>
              <q-icon size="25px" name="place" />
            </q-item-section>
            <q-item-section>
              Showrooms
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-grey-4" to="/vr" clickable>
            <q-item-section avatar>
              <q-icon size="25px" name="view_in_ar" />
            </q-item-section>
            <q-item-section>
              VR
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator spaced inset />
        <LayoutsCategoryMenu />
        <q-separator spaced inset />
        <q-list>
          <q-item v-ripple active-class="bg-grey-4" to="/policy/terms-and-conditions" clickable>
            <q-item-section avatar>
              <q-icon size="25px" color="primary" name="policy" />
            </q-item-section>
            <q-item-section>
              Term & Conditions
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-grey-4" to="/policy/affiliate-earning" clickable>
            <q-item-section avatar>
              <q-icon size="25px" color="green-9" name="monetization_on" />
            </q-item-section>
            <q-item-section>
              Affiliate Earning
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-grey-4" href="tel:+8809611777000" clickable>
            <q-item-section avatar>
              <q-icon size="25px" color="blue-9" name="call" />
            </q-item-section>
            <q-item-section>
              +880&#8209;9611&#8209;777000
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-grey-4" clickable>
            <q-item-section avatar>
              <q-icon size="25px" color="blue-9" name="restart_alt" />
            </q-item-section>
            <q-item-section @click="clearCache()">
              Clean Cache
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator spaced inset />
        <div class="q-gutter-xs row justify-center">
          <q-btn href="mailto:info@womanish.com.bd" target="_blank" size="md" class="q-pa-sm" flat color="green-9" icon="email" />
          <q-btn href="https://wa.me/+8801926680888" size="md" class="q-pa-sm" flat title="Whatsapp" role="button" target="_blank">
            <q-avatar size="36px">
              <q-img src="/service-icons/whatsapp.svg" />
            </q-avatar>
          </q-btn>
          <q-btn href="https://www.facebook.com/womanishltd" target="_blank" size="md" class="q-pa-sm" flat color="blue-9" icon="facebook" />
          <q-btn href="https://www.youtube.com/@womanishLtd-official" target="_blank" size="md" class="q-pa-sm" flat color="red-9" icon="smart_display" />
        </div>
        <q-separator spaced inset />
        <div class="row justify-center q-pb-xs">
          <q-btn flat icon="code" dense size="11px" label="Created By ICT Layer" no-caps href="https://www.ictlayer.com/" />
        </div>
      </q-scroll-area>
      <q-img class="absolute-top bg-primary" :style="customerIsAuth ? 'height: 120px' : 'height: 64px'">
        <div v-if="customerIsAuth" class="absolute-bottom">
          <div class="column q-gutter-md">
            <NuxtLink to="/customer/accounts"  style="text-decoration: none" aria-label="Accounts">
              <div class="text-weight-bold text-capitalize">
                Customer Name
              </div>
            </NuxtLink>
            <q-btn dense outline @click="confirmLogout()" aria-label="Logout">
              <q-icon name="logout" class="q-pr-sm" />
              Logout
            </q-btn>
          </div>
        </div>
        <div v-else class="absolute-bottom">
          <div class="column q-gutter-md">
            <q-btn dense outline to="/login" aria-label="Login">
              <q-icon name="login" class="q-pr-sm" />
              Login / Signup
            </q-btn>
          </div>
        </div>
      </q-img>
    </q-drawer>
    <q-drawer v-model="rightDrawerOpen" side="right" elevated :width="330" class="bg-grey-2">
      <LayoutsRightDrawerM />
    </q-drawer>
    <!-- page-container -->
    <q-page-container class="bg-red-9" v-touch-swipe.mouse.right="toggleLeftDrawer" v-touch-swipe.mouse.left="toggleRightDrawer">
      <q-page class="q-pa-sm">
        <div style="min-width: 300px; max-width: 800px; width: 100%;" class="bg-green-10">
          <slot />
        </div>
      </q-page>
    </q-page-container>

    <q-footer dense reveal elevated class="row justify-center items-center gradient-bottom text-grey-10">
      <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" switch-indicator>
        <q-route-tab to="/tracking" icon="location_searching" aria-label="Tracking" class="q-pa-sm text-dark" />
        <q-route-tab to="/showroom" icon="place" aria-label="Showroom" class="q-pa-sm text-dark" />
        <q-route-tab to="/" icon="home" aria-label="Home" class="q-pa-sm text-dark"  />
        <q-route-tab to="/search/na" icon="search" aria-label="Search" class="q-pa-sm text-dark" />
        <q-route-tab flat round icon="history" aria-label="History" @click="toggleRightDrawer" class="q-pa-sm text-dark" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
const customerDeliveryLocation = useCustomerDeliveryLocation();
const cartCount = useCartCount();
const router = useRouter();
const nuxtApp = useNuxtApp();
const config = useRuntimeConfig();
const logout_confirm_modal = ref(false);
const tab = ref("home");
const { $pwa }: any = useNuxtApp();
const install = ref();

const customerIsAuth = ref(false);
const customerID = ref("");
const customerInfo = ref<DataType>([]);


const { data: allDiscountMenu }: any = await useFetch(
  "/api/all-discounted-count",
  {
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
    transform(input: any) {
      return input.data;
    },
  }
);

interface DataType {
  [x: string]: any;
}

if (typeof window !== "undefined") {
  if (localStorage.getItem("auth_customer_data")) {
    customerInfo.value = JSON.parse(
      localStorage.getItem("auth_customer_data") ?? "{}"
    );
  }
}

/* Install App */


/* Customer */
if (typeof window !== "undefined") {
  const customerAuth = JSON.parse(
    localStorage.getItem("auth_customer_data") ?? "{}"
  );
  if (customerAuth.customer_id) {
    customerID.value = customerAuth.ledger_id;
    customerIsAuth.value = true;
    customerDeliveryLocation.value = customerAuth.location_id;
  }

  if (localStorage.getItem("cartItem")) {
    const cartItem = JSON.parse(localStorage.getItem("cartItem") ?? "{}");
    cartCount.value = cartItem.length;
  } else {
    cartCount.value = 0;
  }
}
const confirmLogout = async () => {
  logout_confirm_modal.value = true;
};

const logoutCustomer = async () => {
  localStorage.removeItem("auth_customer_data");
  window.location.href = "/login";
};

const clearCache = async () => {
  const response: any = $fetch("/api/remove-api-cache", {
    method: "POST",
  })
  location.reload()
}

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)
function leftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value

}
/* Drawers */
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
  refreshNuxtData("product-history");
}
</script>