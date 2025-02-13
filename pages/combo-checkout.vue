<script setup lang="ts">
import { useQuasar } from "quasar";

const getEnvValue = await $fetch("/api/get-env-value", {});
const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const cartCount = useCartCount();
const noItemText = ref("");
const filter = ref("");
const filterRef = ref("");
interface DataType {
  [x: string]: any;
}
function resetFilter() {
  filter.value = "";
  filterRef.value = "";
  // filterRef.value.focus()
}

/* Delivery Type */
const deliveryType = ref<DataType>([]);
const selected = ref("Choose Delivery Location / Area / Landmark*");
const deliveryLocationModal = ref(false);
const selectedLocation = ref(0);

const regDevFee = ref<DataType>([]);
const exprDevFee = ref<DataType>([]);
const exprDevHour = ref<DataType>([]);
const exprDevDayHour = ref<DataType>([]);
const exprDevRemainHour = ref<DataType>([]);
const regDevDay = ref<DataType>([]);
const preDevDay = ref<DataType>([]);

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
}

// fetch location tree ↓↓↓↓

const locationJson = ref([]);
const locationList = ref<DataType>([]);

const { data: response }: any = await useFetch("/api/get-location-chain", {
  method: "POST",
});
locationJson.value = response.value.data;
locationList.value = response.value.location_list;

// fetch location tree ↑↑↑↑

// fetch payment gateway list ↓↓↓↓

const paymentGatewayList = ref<DataType>([]);

const paymentGateWays: any = await useFetch("/api/payment-gateway-list", {
  method: "POST",
});
paymentGatewayList.value = paymentGateWays.data.value.data;

// fetch payment gateway list ↑↑↑↑

const customerName = ref("");
const customerPhone = ref("");
const customerEmail = ref("");
const customerAddress = ref("");
const cartItemData = ref<DataType>([]);

const nameError = ref("");
const phoneError = ref("");
const emailError = ref("");
const addressError = ref("");
const orderError = ref("");
const locationError = ref("");

const coupon_code = ref(null);
const coupon_data = ref<any>([]);
const shoppingCart = ref<DataType>([]);
const cartTotal = ref(0);
const shippingTotal = ref(0);
const customerRef = useCookie("customerRef");
const customerRefId = ref(customerRef);

const couponDiscountPercentage = ref(0);
const couponDiscountAmount = ref(0);
const affiliate_id = ref(null);
const noItemFound = ref(false);

onMounted(async () => {
  if (localStorage.getItem("comboCartItem")) {
    cartItemData.value = JSON.parse(
      localStorage.getItem("comboCartItem") ?? "{}"
    );

    if (cartItemData.value.length != 0) {
      const response: any = await $fetch("/api/shopping-cart-combo", {
        method: "POST",
        body: {
          combo_id: cartItemData.value[0].fg_combo_id,
        },
      });
      const status = response.status;
      const data = response.data;

      if (status === 200) {
        const cartItem: any = [];
        data.forEach(
          (
            fg: {
              fg_image: string;
              fg_stock_and_attribute: string | any[];
              fg_attribute_id: string;
              selected_attribute: null;
              pre_order_qty: number;
              fg_shipping_cost_free: number;
            },
            foundIndex: string | number
          ) => {
            cartItem[foundIndex] = fg;
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

            cartItem[foundIndex].selected_attribute =
              fg.fg_stock_and_attribute[0];

            fg.pre_order_qty = getPreOrderQuantity(
              cartItem[foundIndex],
              fg.selected_attribute
            );
            cartItem[foundIndex].delivery = "regular";
            cartItem[foundIndex].fg_shipping_cost_free =
              fg.fg_shipping_cost_free * 1.0;

            deliveryType.value[foundIndex] = "regular";
            regDevFee.value[foundIndex] = 0;
            exprDevFee.value[foundIndex] = 0;

            cartItem[foundIndex] = { ...cartItem[foundIndex], ...fg };
          }
        );
        shoppingCart.value = cartItem;
        noItemText.value = "";

        if (cartItem.length > 0) {
          noItemFound.value = false;
        } else {
          noItemFound.value = true;
        }
        setCartData(cartItem);
      }
    } else {
      noItemText.value = "No Item in Combo Cart";
    }
  } else {
    noItemText.value = "No Item in Combo Cart";
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

function setCartData(cartItem: any) {
  let total = 0;
  let shipping = 0;
  const modifiedCartItemString = JSON.stringify(cartItem);
  localStorage.setItem("comboCartItem", modifiedCartItemString);

  // cartItemData.value = localStorage.getItem("comboCartItem")

  cartItem.forEach(
    (
      item: {
        fg_discounted_price: number;
        fg_combo_detail_qty: number;
        pre_order_qty: number;
      },
      index: string | number
    ) => {
      if (deliveryType.value[index] == "regular") {
        if (regDevFee.value[index]) {
          total += item.fg_discounted_price * item.fg_combo_detail_qty;
          shipping += regDevFee.value[index];
        } else {
          total += item.fg_discounted_price * item.fg_combo_detail_qty;
        }
      } else {
        if (item.pre_order_qty > 0) {
          deliveryType.value[index] = "regular";

          if (regDevFee.value[index]) {
            total += item.fg_discounted_price * item.fg_combo_detail_qty;
            shipping += regDevFee.value[index];
          } else {
            total += item.fg_discounted_price * item.fg_combo_detail_qty;
          }
        } else {
          if (exprDevFee.value[index]) {
            total += item.fg_discounted_price * item.fg_combo_detail_qty;
            shipping += exprDevFee.value[index];
          } else {
            total += item.fg_discounted_price * item.fg_combo_detail_qty;
          }
        }
      }
    }
  );
  cartTotal.value = total;
  shippingTotal.value = shipping;
  resetCoupon();
}

function handelAttrChange(val: any, index: string | number) {
  if (typeof window !== "undefined") {
    const cartItemString = localStorage.getItem("comboCartItem");
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

function getPreOrderQuantity(
  cartItemIndex: { cartQty: number },
  selectedAttribute: string | null
) {
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

// function deleteProductModal(index) {
// 	deleteIndex.value = index
// 	if (typeof window !== "undefined") {
// 		delete_item_modal.value = true
// 	}
// }

function deleteAllCartItemsModal() {
  if (typeof window !== "undefined") {
    delete_all_modal.value = true;
  }
}

function confirmDelete() {
  const index = deleteIndex.value;
  const cartItemString = localStorage.getItem("comboCartItem");
  if (cartItemString) {
    const cartItem = JSON.parse(cartItemString);
    shoppingCart.value.splice(index, 1);
    cartItem.splice(index, 1);
    setCartData(cartItem);
  }
  deleteIndex.value = null;

  const localStorageCart = JSON.parse(
    localStorage.getItem("comboCartItem") ?? "{}"
  );
  cartCount.value = localStorageCart.length;
}

function confirmDeleteAll() {
  localStorage.removeItem("comboCartItem");
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

function couponNotification(type: string, message: unknown) {
  $q.notify({
    type: type,
    message: message as string,
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
    let cartItem = localStorage.getItem("comboCartItem");
    cartItem = JSON.parse(cartItem ?? "{}");
    if (localStorage.getItem("affiliate_id")) {
      affiliate_id.value = JSON.parse(
        localStorage.getItem("affiliate_id") ?? "{}"
      );
    }
    try {
      const { data: response }: any = await useFetch("/api/combo-order", {
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
        orderError.value = message.error || "";
      }
    } catch (error) {
      orderError.value = error as string;
    }
  }
}

function onchangeDeliveryType(
  index: string | number,
  deliveryTypeName: string
) {
  deliveryType.value[index] = deliveryTypeName;
  const cartItem = JSON.parse(localStorage.getItem("comboCartItem") ?? "{}");

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
const tab = ref("combo-checkout");

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

interface ItemCheckedType {
  [x: string]: any;
}
const itemChecked = ref<ItemCheckedType>([]);


// Remove Checkout
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
</script>

<template>
  <Head>
    <Title>Combo Checkout Page</Title>
  </Head>
  <div>
    <div style="padding-bottom: 65px; padding-top: 56px">
      <q-card flat square class="bg-grey-1">
        <div v-if="shoppingCart.length != 0" class="row q-pa-xs q-col-gutter-sm">
          <div v-for="(item, index) in shoppingCart" :key="item.fg_id" :class="isMobileSize <= 500 ? '' : 'col-6'">
            <q-card style="width: 100%;" :style="isMobileSize <= 500 ? 'max-width: 500px' : 'max-width: 500px'">
              <q-card-section horizontal>
                <NuxtImg loading="lazy" ratio="3:4" placeholder="/placeholder.gif" format="webp" class="col-4"
                  width="200" quality="50" :src="item.fg_image" :alt="item.acc_ledger_name"
                  :title="item.acc_ledger_name" />
                <!-- <q-checkbox v-model="itemChecked[index]" class="absolute" size="sm" color="primary" /> -->
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
                      {{
                            formatMoney(
                              item.fg_price * item.fg_combo_detail_qty
                            )
                          }}
                          {{ config.public.currencyAfter }}
                    </div>
                    <q-space />
                    <div class="text-subtitle2 text-weight-medium text-primary">
                      {{ config.public.currencyBefore }}
                          {{
                            formatMoney(
                              item.fg_discounted_price *
                              item.fg_combo_detail_qty
                            )
                          }}
                          {{ config.public.currencyAfter }}
                    </div>
                  </div>
                  <div class="row justify-center q-py-sm">
                    <q-select v-model="item.selected_attribute" dense outlined fill color="primary"
                      :options="item.fg_stock_and_attribute" style="width: 100%; max-width: 480px" @update:model-value="(val: any) => handelAttrChange(val, index)
                        " />
                  </div>

                  <!-- <div class="row justify-between items-center q-gutter-x-md" style="max-width: 200px; width: 100%;">
                    <q-btn outline round icon="remove" color="primary" size="xs" aria-label="Remove"
                      @click="removeQty(index)" />
                    <q-input v-model.number="item.cartQty" dense outlined type="number" color="primary"
                      style="max-width: 40px" min="1" readonly />
                    <q-btn outline round icon="add" color="primary" :disable="disabledAddQtyBtn" size="xs"
                      aria-label="Add" @click="addQty(index)" />
                    <q-btn icon="delete_outline" outline round size="sm" class="bg-white" color="primary"
                      aria-label="Delete" @click="deleteProductModal(index)" />
                  </div> -->
                  
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
        <q-card v-else flat bordered class="items-center q-mx-xs gradient row justify-center" style="height: 100px">
          <q-card-section class="text-uppercase text-h6 q-py-xl text-weight-regular text-grey-6 text-center">
            {{ noItemText }}
          </q-card-section>
        </q-card>
        
        <!-- Delete Modal -->
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
      </q-card>
      <!-- Delivery Details -->
      <div v-if="shoppingCart.length != 0" id="deliveryDetails" class="q-gutter-y-sm q-py-sm">
        <q-card flat square class="q-pa-xs text-center" :class="isMobileSize <= 450 ? 'column' : 'row'">
          <q-card-section class="q-gutter-y-sm q-pa-sm" :class="isMobileSize <= 450 ? '' : 'col-6'">
            <q-input filled v-model="customerName" type="text" label="Name" placeholder="Please enter your name" dense
              required>
              <template v-slot:prepend>
                <q-icon size="xs" name="person" />
              </template>
            </q-input>
            <small v-if="nameError" class="text-primary text-capitalize q-pl-sm">{{ nameError }}</small>
            <q-input filled v-model="customerPhone" placeholder="017XXXXXXXX" dense maxlength="11" type="tel"
              label="Mobile Number*" required :rules="[(val) => !!val || 'Field is required']">
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
              <p class="text-bold text-h6 q-ma-sm">
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
            <div class="q-pt-sm">
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
            <div class="row justify-center q-pb-md">
              <q-form :action="getEnvValue.api_url + 'paynow-order'" id="payNowForm" method="post"
                class="column q-gutter-sm text-center">
                  <q-btn outline color="primary" style="min-width: 160px" class="shadow-3" no-caps>
                    Cash On Delivery
                  </q-btn>
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
      <!-- Checkout Header -->
      <q-page-sticky expand position="top">
        <q-toolbar class="text-primary gradient-bottom shadow-2 q-py-sm q-px-sm">
          <q-toolbar-title class="text-body1 text-weight-medium">
            <h6 class="q-ma-xs text-h6 text-weight-medium">Combo Cart</h6>
          </q-toolbar-title>
          <!-- <q-btn v-if="checkedAll && shoppingCart.length != 0" v-model="checkedAll" icon="delete_outline" flat dense
            no-caps color="primary" class="text-caption" label="Delete All" @click="deleteAllCartItemsModal()" />
          <q-checkbox v-if="shoppingCart.length != 0" v-model="checkedAll" size="sm" color="primary" val="checkedAll"
            class="q-ml-sm text-caption" :class="checkedAll ? 'text-primary' : 'text-dark'" label="Select All"
            @click="onChangeSelectAll()" /> -->
        </q-toolbar>
      </q-page-sticky>

    </div>
  </div>
</template>
