<template>
  <q-layout view="hHh LpR lff">
    <!-- Header -->
    <q-header elevated class="gradient" height-hint="60">
      <q-toolbar class="justify-between items-center" style="height: 60px">
        <q-btn id="menu" @click="leftDrawer" aria-label="Menu" flat color="primary" round icon="menu" />
        <q-toolbar-title class="row justify-center">
          <NuxtImg loading="lazy" @click="navigateTo('/')" format="webp" width="150" height="40" sizes="150px"
            class="cursor-pointer " src="https://placehold.co/150x40" alt="Company-Logo" title="Company-Logo" />
        </q-toolbar-title>
        <div class="row justify-end">
          <q-btn id="checkout" color="primary" :class="router.currentRoute.value.path == '/checkout' ? 'primary' : ''"
            to="/checkout" flat round aria-label="Checkout" icon="shopping_cart">
            <span v-show="cartCount > 0" class="absolute-top-right text-bold text-primary text-caption"
              style="padding-inline: 3px; border-radius: 25%; right: -2px" title="Checkout">
              {{ cartCount }}
            </span>
          </q-btn>
          <q-btn v-if="customerIsAuth" color="primary" to="/customer/accounts" flat round icon="person"
            title="My Profile" />
        </div>
      </q-toolbar>
    </q-header>
    <!-- Left Drawer (Category List) -->
    <q-drawer v-model="leftDrawerOpen" side="left" :width="300" :breakpoint="500" overlay elevated
      class="gradient-left text-body2">
      <q-scroll-area :style="customerIsAuth
        ? 'height: calc(100% - 110px); margin-top: 130px'
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
          <q-item v-ripple active-class="bg-primary" to="/policy/terms-and-conditions" clickable>
            <q-item-section avatar>
              <q-icon size="25px" name="policy" />
            </q-item-section>
            <q-item-section>
              Term & Conditions
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-primary" to="/policy/affiliate-earning" clickable>
            <q-item-section avatar>
              <q-icon size="25px" name="monetization_on" />
            </q-item-section>
            <q-item-section>
              Affiliate Earning
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-primary" href="tel:+880170000000" clickable>
            <q-item-section avatar>
              <q-icon size="25px" name="call" />
            </q-item-section>
            <q-item-section>
              +880&#8209;0175&#8209;00000
            </q-item-section>
          </q-item>
          <q-item v-ripple active-class="bg-primary" clickable>
            <q-item-section avatar>
              <q-icon size="25px" name="restart_alt" />
            </q-item-section>
            <q-item-section @click="clearCache()">
              Clean Cache
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator spaced inset />
        <div class="q-gutter-xs row justify-center">
          <q-btn href="mailto:info@demo.com.bd" target="_blank" size="md" class="q-pa-sm" flat color="primary"
            icon="email" />
          <q-btn href="https://wa.me/+8801926680888" size="md" class="q-pa-sm" flat title="Whatsapp" role="button"
            target="_blank">
            <q-avatar size="36px">
              <q-img src="/service-icons/whatsapp.svg" />
            </q-avatar>
          </q-btn>
          <q-btn href="https://www.facebook.com/demoltd" target="_blank" size="md" class="q-pa-sm" flat color="primary"
            icon="facebook" />
          <q-btn href="https://www.youtube.com/@demoLtd-official" target="_blank" size="md" class="q-pa-sm" flat
            color="primary" icon="smart_display" />
        </div>
        <q-separator spaced inset />
        <div class="row justify-center q-pb-xs">
          <q-btn flat icon="code" dense size="11px" label="Created By ICT Layer" no-caps
            href="https://www.ictlayer.com/" />
        </div>
      </q-scroll-area>
      <div class="absolute-top bg-grey-5">
        <div v-if="customerIsAuth" class="q-pa-sm">
          <div class="column q-gutter-md">
            <NuxtLink to="/customer/accounts" class="text-secondary" style="text-decoration: none">
              <p class="text-weight-bold text-capitalize q-ma-none">
                {{ customerInfo.name }}
              </p>
              <div class="text-caption">
                {{ customerInfo.phone }}
              </div>
            </NuxtLink>
            <q-btn dense color="primary" class="bg-grey-4" outline @click="confirmLogout()" aria-label="Logout">
              <q-icon name="logout" class="q-pr-sm" />
              Logout
            </q-btn>
          </div>
        </div>
        <div v-else class="q-pa-md">
          <div class="column q-gutter-md">
            <q-btn dense outline to="/login" color="primary" class="bg-grey-4" aria-label="Login">
              <q-icon name="login" class="q-pr-sm" />
              Login / Signup
            </q-btn>
          </div>
        </div>
      </div>
    </q-drawer>
    <q-drawer v-model="rightDrawerOpen" side="right" elevated :width="320" class="bg-grey-2">
      <LayoutsRightDrawerM />
    </q-drawer>
    <!-- page-container -->
    <q-page-container class="bg-primary" v-touch-swipe.mouse.right="toggleLeftDrawer"
      v-touch-swipe.mouse.left="toggleRightDrawer">
      <q-page class="q-pa-sm">
        <div style="min-width: 320px; max-width: 3840px; width: 100%;" class="bg-green-10">
          <slot />
        </div>
        <q-dialog v-model="logout_confirm_modal">
          <q-card class="shadow-up-10">
            <q-card-section class="bg-grey-2 text-body1">
              <div>Are you sure you want to logout?</div>
            </q-card-section>
            <q-separator space />
            <q-card-section>
              <div class="row justify-between q-gutter-md">
                <q-btn v-close-popup class="col" label="Yes" type="submit" color="primary" @click="logoutCustomer()" />
                <q-btn v-close-popup class="col" outline label="No" color="primary" />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
    <!-- Page Scroller Start -->
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn id="scroll_to_top" fab-mini icon="keyboard_arrow_up" color="primary" aria-label="Scroll To Top" />
    </q-page-scroller>
    <!-- Page Scroller End -->
    <q-footer dense reveal elevated class="row justify-center items-center gradient-bottom text-grey-10">
      <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" switch-indicator>
        <q-route-tab to="/tracking" icon="location_searching" aria-label="Tracking" class="q-pa-sm" />
        <q-route-tab to="/showroom" icon="place" aria-label="Showroom" class="q-pa-sm" />
        <q-route-tab to="/" icon="home" aria-label="Home" class="q-pa-sm text-primary" />
        <q-route-tab to="/search/na" icon="search" aria-label="Search" class="q-pa-sm" />
        <q-route-tab flat round icon="history" aria-label="History" @click="toggleRightDrawer" class="q-pa-sm" />
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
const tab = ref("home");
const { $pwa }: any = useNuxtApp();
const install = ref();
const logout_confirm_modal = ref(false);
const confirmLogout = async () => {
  logout_confirm_modal.value = true;
};

const customerIsAuth = ref(false);
const customerID = ref("");
const customerInfo = ref<DataType>([]);
const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);

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