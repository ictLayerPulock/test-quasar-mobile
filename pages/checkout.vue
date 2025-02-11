<script setup lang="ts">
const getEnvValue = await $fetch("/api/get-env-value", {});
const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);
// const { formatMoney } = useNuxtApp()
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const cartCount = useCartCount();
const noItemText = ref("");

// const shape = ref('line')
const paymentSelect = ref(0);

const filter = ref("");
const filterRef = ref("");

function resetFilter() {
  filter.value = "";
  filterRef.value = "";
}

/* Delivery Type */
interface DataType {
  [x: string]: any;
}
const deliveryType = ref<DataType>([]);
const disabledBtn = ref(true);
const selected = ref("Choose Delivery Location / Area / Landmark*");
const deliveryLocationModal = ref(false);
const selectedLocation = ref(0);

interface RegDevFeeType {
  [x: string]: any;
}
const regDevFee = ref<RegDevFeeType>([]);

interface ExprDevFeeType {
  [x: string]: any;
}
const exprDevFee = ref<ExprDevFeeType>([]);

interface ExprDevHourType {
  [x: string]: any;
}
const exprDevHour = ref<ExprDevHourType>([]);

interface ExprDevDayHourType {
  [x: string]: any;
}
const exprDevDayHour = ref<ExprDevDayHourType>([]);

interface ExprDevRemainHourType {
  [x: string]: any;
}
const exprDevRemainHour = ref<ExprDevRemainHourType>([]);

interface RegDevDayType {
  [x: string]: any;
}
const regDevDay = ref<RegDevDayType>([]);

interface PreDevDayType {
  [x: string]: any;
}
const preDevDay = ref<PreDevDayType>([]);

interface ItemCheckedType {
  [x: string]: any;
}
const itemChecked = ref<ItemCheckedType>([]);

interface ShoppingCartType {
  [x: string]: any;
}
const shoppingCart = ref<ShoppingCartType>([]);

function locationChanged(
  id: number,
  regularFee: number,
  expressFee: number,
  regularDay: any,
  expressHour: number,
  preorderDay: any
) {
  selectedLocation.value = id;
  for (const index in shoppingCart.value) {
    regDevFee.value[index] = 0;
    exprDevFee.value[index] = 0;
    regDevDay.value[index] = 0;
    preDevDay.value[index] = 0;
    exprDevHour.value[index] = 0;
    exprDevDayHour.value[index] = 0;
    exprDevRemainHour.value[index] = 0;
    if (shoppingCart.value[index].fg_shipping_cost_free != 1) {
      regDevFee.value[index] =
        regularFee * 1.0 + shoppingCart.value[index].fg_delivery_fee * 1.0;
      if (expressFee > 0) {
        exprDevFee.value[index] =
          expressFee * 1.0 + shoppingCart.value[index].fg_delivery_fee * 1.0;
      } else {
        exprDevFee.value[index] = 0;
      }
    }

    regDevDay.value[index] = regularDay;
    preDevDay.value[index] = preorderDay;

    exprDevHour.value[index] = expressHour;

    const expressDevDay = expressHour / 24;
    exprDevDayHour.value[index] = Math.floor(expressDevDay);

    const expressRemain = expressHour % 24;
    exprDevRemainHour.value[index] = expressRemain;

    shoppingCart.value[index].delivery = "regular";
    shoppingCart.value[index].delivery_fee = regDevFee.value[index];
    shoppingCart.value[index].delivery_day = regDevDay.value[index];
  }
  setCartData(shoppingCart.value);
  checkDisabledBtn();
}

// fetch location tree ↓↓↓↓

const locationJson = ref([]);

interface LocationListType {
  [x: string]: any;
}
const locationList = ref<LocationListType>([]);

const { data: response }: any = await useFetch("/api/get-location-chain", {
  method: "POST",
  transform(response: any) {
    locationJson.value = response.data;
    locationList.value = response.location_list;
    return {
      ...response,
    };
  },
});

// fetch payment gateway list ↑↑↑↑
const customerName = ref("");
const customerPhone = ref("");
const customerEmail = ref("");
const customerAddress = ref("");
const paymentGatewayID = ref("");

// fetch location tree ↑↑↑↑
// fetch payment gateway list ↓↓↓↓
const paymentGatewayList = ref<DataType>([]);
const { data: paymentGateWays }: any = await useFetch(
  "/api/payment-gateway-list",
  {
    method: "POST",
    transform(paymentGateWays: any) {
      paymentGatewayList.value = paymentGateWays.data;
      paymentGatewayID.value = paymentGatewayList.value[0].payment_gateway_id;
      return {
        ...paymentGateWays,
      };
    },
  }
);

const cartItemData = ref("");
const cartItemDataArr: any = ref("");

const nameError = ref("");
const phoneError = ref("");
const emailError = ref("");
const addressError = ref("");
const orderError = ref("");
const locationError = ref("");

const coupon_code = ref(null);
const coupon_data = ref<any>(null);
const cartTotal = ref(0);
const shippingTotal = ref(0);
const customerRef = useCookie("customerRef");
const customerRefId = ref(customerRef);

const couponDiscountPercentage = ref(0);
const couponDiscountAmount = ref(0);
const affiliate_id = ref(null);
const noItemFound = ref(false);
const disabledAddQtyBtn = ref(false)
function checkDisabledBtn() {
  if (
    customerName.value &&
    customerPhone.value &&
    customerAddress.value &&
    selected.value != "Choose Delivery Location / Area / Landmark*"
  ) {
    if (
      customerPhone.value.length == 11 &&
      customerName.value != "" &&
      customerAddress.value != ""
    ) {
      for (const index in cartItemDataArr.value) {
        if (cartItemDataArr.value[index].item_checked != "") {
          disabledBtn.value = false;
        }
      }
    } else {
      disabledBtn.value = true;
    }
  } else {
    if (
      customerPhone.value.length == 11 &&
      customerName.value != "" &&
      customerAddress.value != ""
    ) {
      for (const index in cartItemDataArr.value) {
        if (cartItemDataArr.value[index].item_checked != "") {
          disabledBtn.value = false;
        }
      }
    } else {
      disabledBtn.value = true;
    }
  }
}
onMounted(async () => {
  const cartItem = JSON.parse(localStorage.getItem("cartItem") ?? "{}");
  if (cartItem.length > 0) {
    cartItemData.value = localStorage.getItem("cartItem") ?? "";
    cartItemDataArr.value = JSON.parse(cartItemData.value);

    const fgIdArray = cartItem.map((item: { fgId: any }) => item.fgId);
    const fgIds = fgIdArray.join(",");

    if (cartItem.length != 0) {
      const response: any = await $fetch("/api/shopping-cart", {
        method: "POST",
        body: {
          fg_id: fgIds,
        },
      });
      const status = response.status;
      const data = response.data;

      if (status === 200) {
        data.forEach(
          (fg: {
            fg_id: any;
            fg_image: string;
            fg_stock_and_attribute: string | any[];
            fg_attribute_id: string;
            selected_attribute: null;
            pre_order_qty: number;
            fg_shipping_cost_free: number;
            fg_price: number;
            fg_discounted_price: number;
          }) => {
            const foundIndex = fgIdArray.findIndex((item: string | any[]) =>
              item.includes(fg.fg_id)
            );
            fgIdArray[foundIndex] = "0";

            if (!fg.fg_image) fg.fg_image = "/no-image.webp";

            try {
              fg.fg_stock_and_attribute = (
                fg.fg_stock_and_attribute as string
              ).split(",");
            } catch (error) {
              fg.fg_stock_and_attribute = [];
            }

            try {
              const fgAttributeIdArray = fg.fg_attribute_id.split(",");
              const foundAttrIndex = fgAttributeIdArray.findIndex((item) =>
                item.includes(cartItem[foundIndex].selectedAttr)
              );

              fg.selected_attribute = fg.fg_stock_and_attribute[foundAttrIndex];
            } catch (error) {
              fg.selected_attribute = null;
            }

            fg.pre_order_qty = getPreOrderQuantity(
              cartItem[foundIndex],
              fg.selected_attribute
            );
            cartItem[foundIndex].item_checked = "checked";
            cartItem[foundIndex].delivery = "regular";
            cartItem[foundIndex].fg_shipping_cost_free =
              fg.fg_shipping_cost_free * 1.0;
            if (cartItem[foundIndex].customPrice) {
              fg.fg_price =
                fg.fg_price * 1.0 + cartItem[foundIndex].customPrice * 1.0;
              fg.fg_discounted_price =
                fg.fg_discounted_price * 1.0 +
                cartItem[foundIndex].customPrice * 1.0;
            }

            deliveryType.value[foundIndex] = "regular";
            regDevFee.value[foundIndex] = 0;
            exprDevFee.value[foundIndex] = 0;
            cartItem[foundIndex] = { ...cartItem[foundIndex], ...fg };
          }
        );
        shoppingCart.value = cartItem;

        if (cartItem.length > 0) {
          noItemFound.value = false;
        } else {
          noItemFound.value = true;
        }
        setCartData(cartItem);
      }
    } else {
      noItemText.value = "No Item in Shopping Cart";
    }
  } else {
    noItemText.value = "No Item in Shopping Cart";
  }
  const customerInfo = JSON.parse(
    localStorage.getItem("auth_customer_data") ?? "{}"
  );
  if (customerInfo) {
    customerName.value = customerInfo.name;
    customerPhone.value = customerInfo.phone;
    customerEmail.value = customerInfo.email;
    customerAddress.value = customerInfo.shipping_address;
    selectedLocation.value = customerInfo.location_id;
    if (selectedLocation.value > 0) {
      for (const index in locationList.value) {
        if (selectedLocation.value == locationList.value[index].id) {
          const location = locationList.value[index];
          locationChanged(
            location.id,
            location.regular_fee,
            location.express_fee,
            location.location_regular_delivery_days,
            location.location_express_delivery_hours,
            location.location_preorder_delivery_days
          );
          selected.value = location.chain;
        }
      }
    }
  }
  // if customer login ↑↑↑
});

async function removeQty(index: any) {
  if (typeof window !== "undefined") {
    const cartItemString = localStorage.getItem("cartItem");
    if (cartItemString) {
      const cartItem = JSON.parse(cartItemString);
      if (cartItem[index].cartQty > 1) {
        shoppingCart.value[index].cartQty--;
        shoppingCart.value[index].pre_order_qty--;
        cartItem[index].cartQty--;
        disabledAddQtyBtn.value = false
        const preOrderQty = getPreOrderQuantity(
          cartItem[index],
          cartItem[index].selected_attribute
        );
        shoppingCart.value[index].pre_order_qty = preOrderQty;
        cartItem[index].pre_order_qty = preOrderQty;
        if (deliveryType.value[index] == "regular") {
          if (cartItem[index].pre_order_qty > 0) {
            cartItem[index].delivery = "regular";
            cartItem[index].delivery_fee = regDevFee.value[index];
            cartItem[index].delivery_day =
              preDevDay.value[index] * 1.0 + regDevDay.value[index] * 1.0;
          } else {
            cartItem[index].delivery = "regular";
            cartItem[index].delivery_fee = regDevFee.value[index];
            cartItem[index].delivery_day = regDevDay.value[index] * 1.0;
          }
        } else {
          cartItem[index].delivery = "express";
          cartItem[index].delivery_fee = exprDevFee.value[index];
          cartItem[index].delivery_day = exprDevDayHour.value[index] * 1.0;
        }
        setCartData(cartItem);
      }
    }
  }
}
function addQty(index: any) {
  if (typeof window !== "undefined") {
    const cartItemString = localStorage.getItem("cartItem");
    if (cartItemString) {
      const cartItem = JSON.parse(cartItemString);
      shoppingCart.value[index].cartQty++;
      shoppingCart.value[index].pre_order_qty++;
      cartItem[index].cartQty++;
      let preOrderQty = getPreOrderQuantity(
        cartItem[index],
        cartItem[index].selected_attribute
      );
      if (cartItem[index].fgOrderType == 0 && preOrderQty > 0) {
        disabledAddQtyBtn.value = true
        shoppingCart.value[index].cartQty--;
        shoppingCart.value[index].pre_order_qty--;
        cartItem[index].cartQty--;
        preOrderQty = getPreOrderQuantity(
          cartItem[index],
          cartItem[index].selected_attribute
        );
      }
      shoppingCart.value[index].pre_order_qty = preOrderQty;
      cartItem[index].pre_order_qty = preOrderQty;
      if (deliveryType.value[index] == "regular") {
        if (cartItem[index].pre_order_qty > 0) {
          cartItem[index].delivery = "regular";
          cartItem[index].delivery_fee = regDevFee.value[index];
          cartItem[index].delivery_day =
            preDevDay.value[index] * 1.0 + regDevDay.value[index] * 1.0;
        } else {
          cartItem[index].delivery = "regular";
          cartItem[index].delivery_fee = regDevFee.value[index];
          cartItem[index].delivery_day = regDevDay.value[index] * 1.0;
        }
      } else {
        cartItem[index].delivery = "express";
        cartItem[index].delivery_fee = exprDevFee.value[index];
        cartItem[index].delivery_day = exprDevDayHour.value[index] * 1.0;
      }
      setCartData(cartItem);
    }
  }
}

function setCartData(cartItem: any) {
  let total = 0;
  let shipping = 0;
  const modifiedCartItemString = JSON.stringify(cartItem);
  localStorage.setItem("cartItem", modifiedCartItemString);

  cartItemData.value = localStorage.getItem("cartItem") ?? "";

  cartItem.forEach((item: any, index: any) => {
    if (item.item_checked == "checked") {
      if (deliveryType.value[index] == "regular") {
        if (regDevFee.value[index]) {
          total += item.fg_discounted_price * item.cartQty;
          shipping += regDevFee.value[index];
        } else {
          total += item.fg_discounted_price * item.cartQty;
        }
        // total += ((item.fg_price * item.cartQty) + (regDevFee.value[index]) ? regDevFee.value[index] : 0);
      } else {
        if (item.pre_order_qty > 0) {
          deliveryType.value[index] = "regular";

          if (regDevFee.value[index]) {
            total += item.fg_discounted_price * item.cartQty;
            shipping += regDevFee.value[index];
          } else {
            total += item.fg_discounted_price * item.cartQty;
          }
        } else {
          if (exprDevFee.value[index]) {
            total += item.fg_discounted_price * item.cartQty;
            shipping += exprDevFee.value[index];
          } else {
            total += item.fg_discounted_price * item.cartQty;
          }
        }
        // total += ((item.fg_price * item.cartQty) + (exprDevFee.value[index]) ? exprDevFee.value[index] : 0);
      }
      itemChecked.value[index] = true;
    } else {
      itemChecked.value[index] = false;
    }
  });
  cartTotal.value = total;
  shippingTotal.value = shipping;
  resetCoupon();
}

function handelAttrChange(val: any, index: any) {
  if (typeof window !== "undefined") {
    const cartItemString = localStorage.getItem("cartItem");
    if (cartItemString) {
      const cartItem = JSON.parse(cartItemString);
      cartItem[index].selected_attribute = val;
      const foundAttrIndex = cartItem[index].fg_stock_and_attribute.findIndex(
        (item: string | any[]) => item.includes(val)
      );
      const fgAttributeIdArray = cartItem[index].fg_attribute_id.split(",");
      cartItem[index].selectedAttr = fgAttributeIdArray[foundAttrIndex];
      const preOrderQty = getPreOrderQuantity(
        cartItem[index],
        cartItem[index].selected_attribute
      );
      shoppingCart.value[index].pre_order_qty = preOrderQty;
      cartItem[index].pre_order_qty = preOrderQty;
      setCartData(cartItem);
    }
  }
}

function getPreOrderQuantity(cartItemIndex: any, selectedAttribute: any) {
  let preOrderQty = 0;
  if (selectedAttribute) {
    const match = selectedAttribute.match(/\((-?\d+)\)/);
    if (match) {
      const qtyDiff = parseInt(match[1], 10) - cartItemIndex.cartQty;
      preOrderQty = qtyDiff < 0 ? qtyDiff : 0;
    } else {
      preOrderQty = 0 - cartItemIndex.cartQty;
    }
    preOrderQty = Math.abs(preOrderQty);
  }
  return preOrderQty;
}

const delete_item_modal = ref(false);
const delete_all_modal = ref(false);
const deleteIndex = ref(null);

function deleteProductModal(index: any) {
  deleteIndex.value = index;
  if (typeof window !== "undefined") {
    delete_item_modal.value = true;
  }
}

function deleteAllCartItemsModal() {
  // deleteIndex.value = index
  if (typeof window !== "undefined") {
    delete_all_modal.value = true;
  }
}

function confirmDelete() {
  const index = deleteIndex.value;
  const cartItemString = localStorage.getItem("cartItem");
  if (cartItemString) {
    const cartItem = JSON.parse(cartItemString);
    shoppingCart.value.splice(index, 1);
    cartItem.splice(index, 1);
    setCartData(cartItem);
  }
  deleteIndex.value = null;

  const localStorageCart = JSON.parse(localStorage.getItem("cartItem") ?? "{}");
  cartCount.value = localStorageCart.length;

  if (cartCount.value == 0) {
    noItemText.value = "No Item in Shopping Cart";
  }
}

function confirmDeleteAll() {
  localStorage.removeItem("cartItem");
  // cartCount.value = localStorageCart.length
  window.location.reload();
}

/* TODO: Coupon */
async function addCoupon() {
  try {
    const { data: response }: any = await useFetch("/api/coupon", {
      method: "POST",
      body: {
        coupon_code: coupon_code.value,
        item_total: cartTotal.value,
      },
    });
    const status = response.value.status;
    const message = response.value.message;
    const data = response.value.data;

    if (status === 200) {
      if (message.success) {
        coupon_data.value = data;
        couponDiscountPercentage.value = data.coupon_discount;
        couponDiscountAmount.value = data.discount_amount;
        couponNotification("positive", message.success);
      }
    } else {
      couponDiscountPercentage.value = 0;
      couponDiscountAmount.value = 0;
      if (message.error) couponNotification("primary", message.error);
      if (message.coupon_code)
        couponNotification("primary", message.coupon_code);
      if (message.item_total) couponNotification("primary", message.item_total);
    }
  } catch (error) {
    couponNotification("primary", error);
  }
}

function resetCoupon() {
  coupon_code.value = null;
  couponDiscountPercentage.value = 0;
  couponDiscountAmount.value = 0;
}

function couponNotification(type: any, message: any) {
  $q.notify({
    type: type,
    message: message,
    position: "top-right",
  });
}

/** Order Now */

async function orderNow() {
  if (selectedLocation.value == 0) {
    $q.notify({
      color: "primary",
      icon: "warning",
      message: "Choose Delivery Location / Area / Landmark* First",
      position: "top-right",
      timeout: Math.random() * 5000 + 3000,
    });
  } else {
    const customerRef = useCookie("customerRef");
    let cartItem = localStorage.getItem("cartItem");
    cartItem = JSON.parse(cartItem ?? "{}");
    if (localStorage.getItem("affiliate_id")) {
      affiliate_id.value = JSON.parse(
        localStorage.getItem("affiliate_id") ?? "{}"
      );
    }
    try {
      const { data: response }: any = await useFetch("/api/order", {
        method: "POST",
        body: {
          name: customerName.value,
          phone: customerPhone.value,
          email: customerEmail.value,
          address: customerAddress.value,
          cart_item: cartItem,
          coupon: coupon_data.value,
          affiliate_id: affiliate_id.value,
          reference_id: customerRef.value,
          location: selectedLocation.value == 0 ? "" : selectedLocation.value,
        },
      });
      const status = response.value.status;
      const message = response.value.message;
      const data = response.value.data;

      if (status === 200) {
        localStorage.removeItem("cartItem");
        localStorage.removeItem("affiliate_id");
        return navigateTo("/order/" + data);
      } else {
        nameError.value = message.name || "";
        phoneError.value = message.phone || "";
        emailError.value = message.email || "";
        addressError.value = message.address || "";
        locationError.value = message.location || "";
        console.log(locationError.value);
        orderError.value = message.error || "";
        const element = document.getElementById("deliveryDetails");
        if (element) {
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          const offset = 110; // Adjust this value to scroll above the element
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }
      }
    } catch (error) {
      orderError.value = error as string;
    }
  }
}

/* Select Payment Method */

async function selectPayment(id: any) {
  paymentGatewayID.value = id;
}

/** Pay and Order Now */

async function payAndOrder() {
  if (paymentSelect.value == -1) {
    orderNow();
  } else {
    console.log("form submit by function");
    const form: any = document.getElementById("payNowForm");
    form.submit();
  }
}

function onChangeShoppingCart(index: any) {
  const cartItemString = localStorage.getItem("cartItem");
  const cartItem = JSON.parse(cartItemString ?? "{}");
  if (itemChecked.value[index]) {
    cartItem[index].item_checked = "checked";
  } else {
    cartItem[index].item_checked = "unchecked";
  }
  setCartData(cartItem);
}

const checkedAll = ref(true);
function onChangeSelectAll() {
  if (checkedAll.value) {
    const cartItem = JSON.parse(localStorage.getItem("cartItem") ?? "{}");
    cartItem.forEach((item: any, index: string | number) => {
      cartItem[index].item_checked = "checked";
    });
    setCartData(cartItem);
  } else {
    const cartItem = JSON.parse(localStorage.getItem("cartItem") ?? "{}");
    cartItem.forEach((item: any, index: string | number) => {
      cartItem[index].item_checked = "unchecked";
    });
    setCartData(cartItem);
  }
}

function onchangeDeliveryType(
  index: string | number,
  deliveryTypeName: string
) {
  deliveryType.value[index] = deliveryTypeName;
  const cartItem = JSON.parse(localStorage.getItem("cartItem") ?? "{}");
  cartItem[index].delivery = deliveryTypeName;
  if (deliveryTypeName == "regular") {
    cartItem[index].delivery_fee = regDevFee.value[index];
    cartItem[index].delivery_day = regDevDay.value[index];
  }
  if (deliveryTypeName == "express") {
    cartItem[index].delivery_fee = exprDevFee.value[index];
    cartItem[index].delivery_day = exprDevHour.value[index];
  }
  setCartData(cartItem);
}

</script>

<template>

  <Head>
    <Title>Checkout Page</Title>
  </Head>
  <div>
    <div style="padding-bottom: 60px; padding-top: 56px">
      <!-- Checkout Items -->
      <q-card v-if="shoppingCart.length != 0" flat square class="bg-grey-1 q-pa-none">
        <div class="row justify-center q-pa-xs q-col-gutter-sm">
          <div v-for="(item, index) in shoppingCart" :key="item.fg_id" :class="isMobileSize <= 500 ? '' : 'col-6'">
            <q-card style="width: 100%;" :style="isMobileSize <= 500 ? 'max-width: 500px' : 'max-width: 500px'">
              <q-card-section horizontal>
                <NuxtImg loading="lazy" ratio="3:4" placeholder="/placeholder.gif" format="webp" class="col-4"
                  width="200" quality="50" :src="item.fg_image" :alt="item.acc_ledger_name"
                  :title="item.acc_ledger_name" />
                <q-checkbox v-model="itemChecked[index]" class="absolute" size="sm" color="primary" />
                <q-card-section class="q-pa-sm" style="width:100%">
                  <div class="text-subtitle2 ellipsis-2-lines text-secondary"
                    @click="navigateTo('/product/' + item.fg_url)">
                    <p class="q-ma-none">{{ item.acc_ledger_name }}</p>
                  </div>
                  <div class="row justify-between items-center q-py-xs">
                    <div class="row items-center no-wrap">
                      <q-icon name="qr_code" color="primary" class="q-mr-xs" />
                      <div class="text-caption q-mr-xs ellipsis">
                        {{ item.fg_sku }}
                      </div>
                    </div>
                    <div class="row no-wrap">
                      <q-chip v-if="item.customName" size="12px" style="width: 100px"
                        class="ellipsis bg-grey-3 overflow-hidden cursor-pointer no-margin" flat square color="primary">
                        <q-avatar square>
                          <q-img :src="item.customImgUrl" />
                        </q-avatar>
                        <div class="ellipsis text-subtitle2 row">
                          <span class="ellipsis">
                            {{ item.customName }}
                          </span>
                        </div>
                        <q-tooltip anchor="top middle" self="bottom middle" class="bg-primary text-body2">
                          Customized: {{ item.customName }}
                        </q-tooltip>
                      </q-chip>
                    </div>
                  </div>
                  <div class="row justify-between items-baseline">
                    <div v-if="item.fg_price != item.fg_discounted_price" class="text-caption text-strike">
                      {{ config.public.currencyBefore }}
                      {{ formatMoney(item.fg_price * item.cartQty) }}
                      {{ config.public.currencyAfter }}
                    </div>
                    <q-space />
                    <div class="text-subtitle2 text-weight-medium text-primary">
                      {{ config.public.currencyBefore }}
                      {{
                        formatMoney(item.fg_discounted_price * item.cartQty)
                      }}
                      {{ config.public.currencyAfter }}
                    </div>
                  </div>
                  <div class="row justify-center q-py-sm">
                    <q-select v-model="item.selected_attribute" dense outlined fill color="primary"
                      :options="item.fg_stock_and_attribute" style="width: 100%; max-width: 480px" @update:model-value="(val: any) => handelAttrChange(val, index)
                        " />
                  </div>

                  <div class="row justify-between items-center q-gutter-x-md" style="max-width: 200px; width: 100%;">
                    <q-btn outline round icon="remove" color="primary" size="xs" aria-label="Remove"
                      @click="removeQty(index)" />
                    <q-input v-model.number="item.cartQty" dense outlined type="number" color="primary"
                      style="max-width: 40px" min="1" readonly />
                    <q-btn outline round icon="add" color="primary" :disable="disabledAddQtyBtn" size="xs"
                      aria-label="Add" @click="addQty(index)" />
                    <q-btn icon="delete_outline" outline round size="sm" class="bg-white" color="primary"
                      aria-label="Delete" @click="deleteProductModal(index)" />
                  </div>
                  <!-- Regular Delivery -->
                  <div v-show="selectedLocation != 0 && regDevFee[index] > 0" class="items-center q-px-sm q-py-xs">
                    <div class="row justify-between items-center">
                      <q-radio v-model="deliveryType[index]" size="xs" val="regular"
                        @click="onchangeDeliveryType(index, 'regular')">
                        <template #default>
                          <div class="column q-pl-sm">
                            <p class="text-subtitle2 q-ma-none">
                              Regular Delivery
                            </p>
                            <p v-if="item.pre_order_qty > 0" class="text-weight-regular text-caption q-ma-none">
                              {{ config.public.currencyBefore }}
                              {{ formatMoney(regDevFee[index]) }}
                              {{ config.public.currencyAfter }} ({{
                                addDays(
                                  regDevDay[index] * 1.0 +
                                  preDevDay[index] * 1.0
                                )
                              }})
                            </p>
                            <p v-else class="text-weight-regular text-caption q-ma-none">
                              {{ config.public.currencyBefore }}
                              {{ formatMoney(regDevFee[index]) }}
                              {{ config.public.currencyAfter }} ({{
                                addDays(regDevDay[index] * 1.0)
                              }})
                            </p>
                          </div>
                        </template>
                      </q-radio>
                      <q-icon size="xs" name="local_shipping" color="primary" />
                    </div>
                  </div>
                  <!-- Express Delivery -->
                  <div v-show="exprDevFee[index] > 0 && item.pre_order_qty == 0" class="items-center q-px-sm q-py-xs">
                    <div class="row justify-between items-center">
                      <q-radio v-model="deliveryType[index]" size="xs" val="express"
                        @click="onchangeDeliveryType(index, 'express')">
                        <template #default>
                          <div class="column q-pl-sm">
                            <p class="text-subtitle2 q-ma-none">
                              Express Delivery
                            </p>
                            <p class="text-caption q-ma-none text-right">
                              {{ config.public.currencyBefore }}
                              {{ formatMoney(exprDevFee[index]) }}
                              {{ config.public.currencyAfter }} ({{
                                addDays(exprDevDayHour[index] * 1.0)
                              }})
                            </p>
                          </div>
                        </template>
                      </q-radio>
                      <q-icon size="xs" name="flash_on" color="primary" />
                    </div>
                  </div>

                  <!-- Free Shipping -->
                  <div v-show="selectedLocation != 0 && item.fg_shipping_cost_free == 1"
                    class="row justify-between items-center q-pt-sm">
                    <q-radio v-model="deliveryType[index]" size="xs" val="regular"
                      @click="onchangeDeliveryType(index, 'regular')">
                      <template #default>
                        <div class="column q-pl-sm">
                          <p class="text-subtitle2 q-ma-none">
                            Free Delivery
                          </p>
                          <p class="text-weight-regular text-caption q-ma-none">
                            {{
                              addDays(
                                regDevDay[index] * 1.0 +
                                preDevDay[index] * 1.0
                              )
                            }}
                          </p>
                        </div>
                      </template>
                    </q-radio>
                    <q-icon size="xs" name="local_shipping" color="primary" />
                  </div>
                  <div v-if="item.pre_order_qty > 0"
                    class="row justify-center q-py-xs text-caption text-weight-medium text-primary">
                    <p class="q-ma-none">{{ item.pre_order_qty }} Pre-Ordered&nbsp;</p>
                    <span v-if="item.pre_order_qty > 1">Items</span>
                    <span v-else>Item</span>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card>
      <q-card v-else flat square class="row justify-center gradient" style="height: 90px">
        <q-card-section class="text-uppercase text-h6 q-py-lg text-weight-regular text-grey-9 text-center">
          {{ noItemText }}
        </q-card-section>
      </q-card>
      <!-- Delivery Details -->
      <div v-if="shoppingCart.length != 0" id="deliveryDetails" class="q-gutter-y-sm q-pt-sm">
        <q-card flat square class="q-pa-xs text-center" :class="isMobileSize <= 450 ? 'column' : 'row'">
          <q-card-section class="q-gutter-y-sm q-pa-sm" :class="isMobileSize <= 450 ? '' : 'col-6'">
            <q-input filled v-model="customerName" type="text" label="Name" placeholder="Please enter your name" dense
              :rules="[(val) => !!val || 'Field is required']" @update:model-value="checkDisabledBtn" required>
              <template v-slot:prepend>
                <q-icon size="xs" name="person" />
              </template>
            </q-input>
            <small v-if="nameError" class="text-primary text-capitalize q-pl-sm">{{ nameError }}</small>
            <q-input filled v-model="customerPhone" placeholder="017XXXXXXXX" dense maxlength="11" type="tel"
              label="Mobile Number*" required :rules="[(val) => !!val || 'Field is required']"
              @update:model-value="checkDisabledBtn">
              <template v-slot:prepend>
                <q-icon size="xs" name="phone" />
              </template>
            </q-input>
            <small v-if="phoneError" class="text-primary text-capitalize q-pl-sm">{{ phoneError }}</small>
            <q-input filled v-model="customerEmail" type="email" label="Email" placeholder="example@mail.com" dense>
              <template v-slot:prepend>
                <q-icon size="xs" name="mail" />
              </template>
            </q-input>
            <small v-if="emailError" class="text-primary text-capitalize q-pl-sm">{{ emailError }}</small>

            <q-input filled v-model="customerAddress" type="text" maxlength="255" class="q-py-md" autogrow
              label="Address Details" placeholder="Please enter your address details" dense
              hint="Example: Apt Number, House Number, Street Name or Number, Block or Area or Moholla, District">
              <template v-slot:prepend>
                <q-icon size="xs" name="home" />
              </template>
            </q-input>
            <q-input v-model="selected" class="q-pt-lg" standout type="text" dense readonly required
              @click="deliveryLocationModal = true" />
            <small v-if="orderError" class="text-primary text-capitalize q-pl-sm">{{ orderError }}</small>
          </q-card-section>
          <q-card-section v-if="shoppingCart.length != 0" id="total" class="gradient rounded-borders q-pa-none"
            :class="isMobileSize <= 450 ? '' : 'col-6'">
            <div>
              <h6 class="text-h6 q-ma-none">
                Item Total {{ config.public.currencyBefore }}
              </h6>
              <h6 class="text-h6 q-ma-none text-primary">
                {{ formatMoney(cartTotal) }}
                {{ config.public.currencyAfter }}
              </h6>
            </div>
            <div class="row justify-center q-pa-sm">
              <q-input v-model:model-value="coupon_code" filled :hint="coupon_code
                ? 'Discount: ' +
                formatMoney(couponDiscountPercentage * 1.0) +
                ' %  (' +
                formatMoney(couponDiscountAmount * 1.0) +
                ' ' +
                config.public.currencyAfter +
                ')'
                : ''
                " label="Add Coupon" dense @keyup.enter="addCoupon">
                <template #after>
                  <q-btn type="submit" style="width: 120px; height: 40px" color="primary" @click="addCoupon()">
                    Add
                  </q-btn>
                </template>
              </q-input>
            </div>
            <!-- Invoice total -->
            <div v-if="couponDiscountAmount > 0">
              <p class="text-bold text-h6 q-ma-none">
                Invoice Total {{ config.public.currencyBefore }}
              </p>
              <h6 class="text-primary text-h6 q-ma-none text-weight-medium">
                {{ formatMoney(cartTotal - couponDiscountAmount) }}
                {{ config.public.currencyAfter }}
              </h6>
              <span class="text-overline text-weight-medium">
                ( {{ formatMoney(cartTotal) }}
                {{ config.public.currencyAfter }} -
                {{ formatMoney(couponDiscountAmount * 1.0) }}
                {{ config.public.currencyAfter }} )
              </span>
            </div>
            <div v-else>
              <h6 class="text-bold text-h6 q-ma-none">
                Invoice Total {{ config.public.currencyBefore }}
              </h6>
              <h6 class="text-primary text-h6 q-ma-none text-weight-medium">
                {{ formatMoney(cartTotal) }}
                {{ config.public.currencyAfter }}
              </h6>
            </div>
            <div v-show="shippingTotal > 0">
              <h6 class="text-bold q-ma-none text-body1 text-center q-pb-xs">
                Shipping Charge {{ config.public.currencyBefore }}
              </h6>
              <h6 class="text-orange-14 text-h6 q-ma-none text-bold">
                {{ formatMoney(shippingTotal) }}
                {{ config.public.currencyAfter }}
              </h6>
            </div>
            <q-separator />
            <div>
              <h6 class="text-h6 text-center q-ma-none">
                Payable Amount {{ config.public.currencyBefore }}
              </h6>
              <h5 class="text-primary text-h5  text-center q-ma-none text-bold">
                {{
                  formatMoney(
                    cartTotal * 1.0 -
                    couponDiscountAmount +
                    shippingTotal * 1.0
                  )
                }}
                {{ config.public.currencyAfter }}
              </h5>
            </div>
            <div class="row justify-center">
              <q-form :action="getEnvValue.api_url + 'paynow-order'" id="payNowForm" method="post"
                class="column q-gutter-sm text-center">
                <q-radio v-model="paymentSelect" :val="-1" :title="disabledBtn ? 'Fill Up The Delivery Details' : ''"
                  :disable="disabledBtn">
                  <q-btn outline color="primary" style="min-width: 160px" class="shadow-3" no-caps>
                    Cash On Delivery
                  </q-btn>
                </q-radio>
                <q-btn @click="payAndOrder()" style="min-width: 160px" v-ripple label="Pay Now" color="primary"
                  class="q-ml-md" :title="disabledBtn ? 'Fill Up The Delivery Details' : ''" :disabled="disabledBtn" />
              </q-form>
            </div>
          </q-card-section>
        </q-card>

        <!-- Delivery Location Modal -->
        <q-dialog v-model="deliveryLocationModal" backdrop-filter="blur(1px) brightness(90%)" transition-show="fade"
          transition-hide="fade">
          <q-card flat bordered style="width: 400px">
            <q-card-section class="q-py-sm">
              <h6 class="text-h6 text-primary q-ma-none text-capitalize text-center">
                Delivery Location
              </h6>
            </q-card-section>
            <q-card-section class="q-py-sm">
              <q-input ref="filterRef" v-model="filter" class="bg-white" dense outlined label="Search Location">
                <template #append>
                  <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
                </template>
              </q-input>
              <q-scroll-area style="height: 400px" class="q-pa-sm">
                <q-tree class="text-capitalize text-body2" default-expand-all dense :nodes="locationJson"
                  :filter="filter" node-key="label" label-key="label" color="primary">
                  <template #header-select="prop">
                    <q-radio v-model="selected" v-close-popup size="xs" :val="prop.node.chain" :label="prop.node.label"
                      @click="
                        locationChanged(
                          prop.node.id,
                          prop.node.regular_fee,
                          prop.node.express_fee,
                          prop.node.location_regular_delivery_days,
                          prop.node.location_express_delivery_hours,
                          prop.node.location_preorder_delivery_days
                        )
                        " />
                  </template>
                </q-tree>
              </q-scroll-area>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
      <q-dialog v-model="delete_item_modal">
        <q-card class="shadow-up-10">
          <q-card-section class="bg-grey-2 text-body1">
            <div>Remove this item from shopping cart?</div>
          </q-card-section>
          <q-separator space />
          <q-card-section>
            <div class="row justify-between q-gutter-md">
              <q-btn v-close-popup class="col" label="Yes" type="submit" color="primary" @click="confirmDelete()" />
              <q-btn v-close-popup class="col" outline label="No" color="primary" />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- Delete All Modal -->
      <q-dialog v-model="delete_all_modal">
        <q-card class="shadow-up-10">
          <q-card-section class="bg-grey-2 text-body1">
            <div>Remove all items from shopping cart?</div>
          </q-card-section>
          <q-separator space />
          <q-card-section>
            <div class="row justify-between q-gutter-md">
              <q-btn v-close-popup class="col" label="Yes" type="submit" color="primary" @click="confirmDeleteAll()" />
              <q-btn v-close-popup class="col" outline label="No" color="primary" />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <LazySuggestedProductsM />

      <!-- Checkout Header -->
      <q-page-sticky expand position="top" style="margin-top: 1px;">
        <q-toolbar class="text-primary bg-grey-2 shadow-2 q-px-md">
          <q-toolbar-title>
            <h1 class="text-h6 text-bold">Checkout</h1>
          </q-toolbar-title>
          <q-btn v-if="checkedAll && shoppingCart.length != 0" v-model="checkedAll" icon="delete_outline" flat dense
            no-caps color="primary" class="text-caption" label="Delete All" @click="deleteAllCartItemsModal()" />
          <q-checkbox v-if="shoppingCart.length != 0" v-model="checkedAll" size="sm" color="primary" val="checkedAll"
            class="q-ml-sm text-caption" :class="checkedAll ? 'text-primary' : 'text-dark'" label="Select All"
            @click="onChangeSelectAll()" />
        </q-toolbar>
      </q-page-sticky>
    </div>
  </div>
</template>
