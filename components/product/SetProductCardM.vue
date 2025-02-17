<template>
  <section>
    <q-card v-if="product.length > 0" flat>
      <q-card-section class="row items-center gradient-h q-py-none q-px-sm">
        <h3 class="text-h5 text-capitalize text-primary text-weight-medium q-my-sm">
          Product Set Items
        </h3>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-carousel  v-if="status === 'pending'" v-model="slide" class="fit gradient q-pa-none" :autoplay="5000" infinite transition-prev="fade" transition-next="fade" swipeable animated control-color="grey-5" padding :arrows="carousal.length > 1">
          <q-carousel-slide v-for="itemSet in 6" :key="itemSet" :name="itemSet">
            <div :class="carousal.length == 1 ? 'fit' : ''" class="row items-center no-wrap">
              <div v-for="(item, index) in 6" :key="item" class="col-6 q-px-xs">
                <q-card class="col-3 rounded-borders cursor-pointer q-pa-none" @click="openSetModal(item)">
                  <NuxtImg  loading="lazy" style="width: 200px; height: 250px" placeholder="/placeholder.gif" />
                  <div class="absolute-bottom text-center text-caption bg-grey-7 text-white" style="z-index: 50; height: 40px;">
                    <q-skeleton dense type="text" width="120px" />
                    <q-skeleton type="text" width="100px" />
                  </div>
                  <q-btn class="absolute-top-right bg-grey-3 cursor-pointer" size="sm" flat square color="primary" padding="8px" icon="shopping_cart" @click="openSetModal(item)" />
                </q-card>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
        <q-carousel v-else v-model="slide" class="fit gradient q-pa-none" :autoplay="5000" infinite transition-prev="fade" transition-next="fade" swipeable animated control-color="grey-5" padding :arrows="carousal.length > 1">
          <q-carousel-slide v-for="itemSet in carousal.length" :key="itemSet" :name="itemSet">
            <div :class="carousal.length == 1 ? 'fit' : ''" class="row items-center no-wrap">
              <div v-for="(item, index) in carousal[itemSet - 1].set" :key="item" class="col-6">
                <q-card class="rounded-borders cursor-pointer q-pa-none" @click="openSetModal(item)">
                  <NuxtImg  loading="lazy" class="fit" width="192" height="256" :src="`media/${item.fg_set_image}`" :alt="item.label" :title="item.label" />
                  <div class="absolute-bottom text-center text-subtitle2 q-py-sm bg-white" style="z-index: 50">
                    {{ item.label }} <br />
                    {{ config.public.currencyBefore }}
                    {{ formatMoney(item.fg_up_final_total * 1.0) }}
                    {{ config.public.currencyAfter }}
                  </div>
                  <q-btn class="absolute-top-right bg-grey-3 cursor-pointer" size="sm" flat square color="primary" padding="8px" icon="shopping_cart" @click="openSetModal(item)" />
                </q-card>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </q-card-section>
    </q-card>
  
    <q-dialog v-model="setProductModal" backdrop-filter="blur(1px) brightness(90%)" transition-show="fade" transition-hide="fade">
      <q-card class="gradient" style="width: 700px; max-width: 100vw">
        <q-card-section class="row justify-center text-primary">
          <h6 class="text-h6 q-ma-none text-center">{{ selectedSetProduct.label }}</h6>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 70vh" class="scroll">
          <div class="q-gutter-y-md no-wrap">
            <q-card v-for="(item, index) in selectedSetProduct.fg_set_value" :key="item" class="shadow-5">
              <q-card-section class="col q-pa-none border-right">
                <q-img :src="item.fg_image" :ratio="config.public.imgRatio" spinner-color="primary" spinner-size="82px" loading="lazy">
                  <div class="absolute-bottom text-subtitle1 text-center">
                   <p class="q-ma-none">{{ item.fg_name }}</p> 
                  </div>
                </q-img>
                <q-chip dense round flat square size="18px" class="text-subtitle2 absolute-top-left bg-grey-1" style="opacity: 80%">
                  Qty:&nbsp;
                  <span class="text-primary">
                    {{ item.fg_qty }}
                  </span>
                </q-chip>
              </q-card-section>
              <q-card-section v-if="item.fg_custom.length > 0" class="col bg-grey-3 text-primary overflow-hidden">
                <q-scroll-area :style="item.fg_custom.length > 3 ? 'height: 112px' : 'height: 57px'" :visible="false">
                  <div class="row items-center" style="width: 475px">
                    <q-chip v-for="custom in item.fg_custom" :key="custom" :color="selectedName[index] == custom.fg_custom_name
                      ? 'primary'
                      : 'white'
                      " :class="selectedName[index] == custom.fg_custom_name
                        ? 'text-primary bg-white'
                        : 'text-grey-10'
                        " class="cursor-pointer rounded-borders" flat square clickable size="24px" style="width: 150px" @click="selectCustomizedOption(index, custom)">
                      <q-avatar>
                        <q-img :src="custom.fg_custom_img_url" spinner-color="primary" spinner-size="24px">
                        </q-img>
                      </q-avatar>
                      <div class="ellipsis text-caption column">
                        <span>
                          {{ custom.fg_custom_name }}
                        </span>
                        <span v-if="custom.fg_custom_amount > 0">
                          {{ formatMoney(custom.fg_custom_amount * 1.0) }}
                          {{ config.public.currencyAfter }}
                        </span>
                        <span v-else class="text-caption text-grey-7"> Included </span>
                        <q-radio v-model="selectedName[index]" class="absolute-top-right bg-transparent" size="24px" :val="custom.fg_custom_name" style="top: 0px; right: 0px" @click="selectCustomizedOption(index, custom)" />
                      </div>
                    </q-chip>
                  </div>
                </q-scroll-area>
              </q-card-section>
              <q-card-section v-else class="row justify-center col-6 text-grey-7 text-caption">
                No Customization Available
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions class="row justify-between q-gutter-md q-px-md no-wrap">
          <q-btn :disable="!setSelectedCustomEqual" dense v-close-popup label="Cart" color="primary" @click="AddToCart(selectedSetProduct.fg_set_value)" />
          <div v-if="selectedSetProduct.fg_up_final_total > 0" class="text-body2">
            Total:
            {{
              formatMoney(
                selectedSetProduct.fg_up_final_total * 1.0 +
                totalCustomPrice * 1.0
              )
            }}
            {{ config.public.currencyAfter }}
          </div>
          <q-btn v-close-popup outline dense label="Close" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

const customName = useCustomName();
const customPrice = useCustomPrice();
const customID = useCustomID();
const customImgUrl = useCustomImgUrl();

const cartCount = useCartCount();

interface DataType {
  [x: string]: any;
}

const selectedName = ref<DataType>([]);
const selectedPrice = ref<DataType>([]);
const selectedID = ref<DataType>([]);
const selectedCustomImgUrl = ref<DataType>([]);
const selectedFgImgUrl = ref<DataType>([]);
const totalCustomPrice: any = ref(0);

function selectCustomizedOption(index: string | number, custom: any) {
  selectedName.value[index] = custom.fg_custom_name;
  selectedPrice.value[index] = custom.fg_custom_amount * 1.0;
  selectedID.value[index] = custom.fg_custom_id;
  selectedCustomImgUrl.value[index] = custom.fg_custom_img_url;
  selectedFgImgUrl.value[index] = custom.fg_custom_add_img_url_1;
  areAllStringsEqual();

  // addTotalCustomPrice();
}

function setProductCustomFix(setValue: any) {
  let fgSetvalue = setValue;
  for (let i = 0; i < fgSetvalue.length; i++) {
    let fgCustom = fgSetvalue[i].fg_custom;
    for (let j = 0; j < fgCustom.length; j++) {
      if (fgCustom[j].fg_custom_default == 1) {
        selectCustomizedOption(i, fgCustom[j]);
      }
    }
  }
}


async function addTotalCustomPrice() {
  for (let i = 0; i < selectedPrice.value.length; i++) {
    totalCustomPrice.value += selectedPrice.value[i];
  }
}
const setSelectedCustomEqual = ref(false);

function areThereAnyCustom() {
  for (let i = 0; i < selectedSetProduct.value.fg_set_value.length; i++) {
    if (selectedSetProduct.value.fg_set_value[i].fg_custom.length == 0)
      setSelectedCustomEqual.value = true;
  }
}

function areAllStringsEqual() {
  if (
    selectedName.value.length > 1 &&
    selectedName.value.every((item: any) => item === selectedName.value[0])
  )
    setSelectedCustomEqual.value = true;
  else setSelectedCustomEqual.value = false;
}

const selectedSetProduct = ref();
const setProductModal = ref(false);

function openSetModal(item: any) {
  setProductModal.value = true;
  selectedSetProduct.value = item;
  setProductCustomFix(item.fg_set_value);
  areAllStringsEqual();
  areThereAnyCustom();
}

interface ProductType {
  [x: string]: any;
}
const product = ref<ProductType[]>([]);

/* Component Props */
const props = defineProps({
  fgId: { type: [Number, String], required: true },
});

const { data: response, status }: any = await useAsyncData(
  `product-set: ${props.fgId}`,
  async () =>
    $fetch("/api/product-set/" + props.fgId, {
      query: {
        fg_id: props.fgId,
      },
    }),
  {
    default: () => [],
    // lazy: true,
    deep: false,
    transform(response: any) {
      product.value = response.data;
      return {
        ...response,
        fetchedAt: new Date(),
      };
    },
    getCachedData(key) {
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

product.value = response.value.data;

const carousal = ref<ProductType[]>([]);
const slide = ref(1);
const items = 3;
let set = 1;
const mod = product.value.length / items;
if (mod !== 0) {
  set = Math.ceil(mod);
}
let product_index = 0;

for (let set_count = 0; set_count < set; set_count++) {
  carousal.value.push({ set: [] });
  for (let product_count = 0; product_count < items; product_count++) {
    if (product_index < product.value.length) {
      carousal.value[set_count].set.push(product.value[product_index]);
    }
    product_index++;
  }
}

const $q = useQuasar();

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
          return navigateTo("/checkout");
        },
      },
    ],
    timeout: Math.random() * 5000 + 3000,
  });
}

function AddToCart(setValue: any) {
  for (let index: any = 0; index < setValue.length; index++) {
    if (localStorage.cartItem) {
      const localStorageCart = JSON.parse(
        localStorage.getItem("cartItem") ?? "{}"
      );
      const cartItem = {
        customName: selectedName.value[index],
        customPrice: selectedPrice.value[index],
        customID: selectedID.value[index],
        customImgUrl: selectedCustomImgUrl.value[index],
        customFgImgUrl: selectedFgImgUrl.value[index],
        fgId: setValue[index].fg_id,
        cartQty: setValue[index].fg_qty,
        selectedAttr: setValue[index].selected_attribute,
      };
      let sameFgCarted = false;
      for (const index in localStorageCart) {
        if (
          localStorageCart[index].fgId == cartItem.fgId &&
          localStorageCart[index].selectedAttr == cartItem.selectedAttr &&
          localStorageCart[index].customName == cartItem.customName
        ) {
          localStorageCart[index].cartQty = cartItem.cartQty;
          sameFgCarted = true;
        }
      }
      if (!sameFgCarted) {
        localStorageCart.push(cartItem);
      }
      localStorage.setItem("cartItem", JSON.stringify(localStorageCart));
    } else {
      const localStorageCart = [];
      const cartItem = {
        customName: selectedName.value[index],
        customPrice: selectedPrice.value[index],
        customID: selectedID.value[index],
        customImgUrl: selectedCustomImgUrl.value[index],
        customFgImgUrl: selectedFgImgUrl.value[index],
        fgId: setValue[index].fg_id,
        cartQty: setValue[index].fg_qty,
        selectedAttr: setValue[index].selected_attribute,
      };
      localStorageCart.push(cartItem);
      localStorage.setItem("cartItem", JSON.stringify(localStorageCart));
    }
  }
  const localStorageCart = JSON.parse(localStorage.getItem("cartItem") ?? "{}");
  cartCount.value = localStorageCart.length;
  showNotif();
}
</script>
