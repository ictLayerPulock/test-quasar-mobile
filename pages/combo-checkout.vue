<script setup lang="ts">
import { useQuasar } from "quasar";

const getEnvValue = await $fetch("/api/get-env-value", {});

const $q = useQuasar();
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
</script>
<template>

  <Head>
    <Title>Combo Checkout Page</Title>
    <Meta name="robots" content="none" />
    <Link rel="canonical" :href="baseURL + '/combo-checkout'" />
  </Head>
  <div>
    <div style="padding-bottom: 56px; padding-top: 56px">
      <q-card flat square class="bg-grey-1">
        <q-tab-panels v-if="shoppingCart.length != 0" v-model="tab" swipeable infinite animated
          transition-prev="jump-right" transition-next="jump-left">
          <q-tab-panel name="combo-checkout" class="fit gradient q-pa-none">
            <q-card-section v-for="(item, index) in shoppingCart" :key="item.fg_id" class="q-pa-xs">
              <q-card class="col">
                <q-card-section horizontal>
                  <NuxtImg loading="lazy" ratio="3:4" width="200" quality="50" class="col-4" format="webp"
                    :src="item.fg_image" :draggable="false" />

                  <q-card-section class="col q-pa-sm">
                    <div>
                      <div class="row justify-between items-center q-my-xs no-wrap">
                        <div class="text-subtitle1 ellipsis-2-lines text-primary">
                          {{ item.acc_ledger_name }}
                        </div>
                      </div>
                      <div class="row justify-between items-center no-wrap">
                        <div class="text-caption q-mr-xs">
                          <q-icon name="qr_code" color="primary" class="q-mr-xs" />
                          {{ item.fg_sku }}
                        </div>
                        <q-chip v-if="item.fg_set" outline size="sm" dense class="text-caption text-capitalize"
                          color="primary">
                          Combo: {{ item.fg_set }}
                        </q-chip>
                      </div>
                      <div class="row justify-between">
                        <div v-if="item.fg_price != item.fg_discounted_price"
                          class="text-caption text-strike text-primary">
                          {{
                            formatMoney(
                              item.fg_price * item.fg_combo_detail_qty
                            )
                          }}
                          {{ config.public.currencyAfter }}
                        </div>
                        <q-space />
                        <div class="text-body2 text-weight-medium text-primary">
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
                    </div>

                    <div class="q-pt-sm">
                      <div class="row justify-center items-center q-col-gutter-md">
                        <q-input v-model.number="item.fg_combo_detail_qty" dense outlined type="number" color="primary"
                          style="max-width: 48px" min="1" readonly />
                        <q-select v-model="item.selected_attribute" dense outlined fill color="primary"
                          :options="item.fg_stock_and_attribute" style="width: 150px; max-width: 350px"
                          @update:model-value="(val: any) => handelAttrChange(val, index)
                            " />
                      </div>
                    </div>

                    <q-separator v-show="selectedLocation != 0 &&
                      (regDevFee[index] > 0 || exprDevFee[index] > 0) &&
                      item.fg_shipping_cost_free != 1
                      " inset />
                    <!-- Delivery Type -->
                    <div v-show="selectedLocation != 0 && regDevFee[index] > 0" class="items-center q-px-xs q-py-xs">
                      <div class="items-center row justify-between">
                        <q-radio v-model="deliveryType[index]" size="xs" val="regular"
                          @click="onchangeDeliveryType(index, 'regular')">
                          <template #default>
                            <div class="column q-pl-sm">
                              <span class="text-subtitle2 q-ma-none">
                                Regular Delivery
                              </span>
                              <p v-if="item.pre_order_qty > 0"
                                class="text-weight-regular text-caption q-ma-none">
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
                    <q-separator v-show="exprDevFee[index] > 0 && item.pre_order_qty == 0" inset />
                    <div v-show="exprDevFee[index] > 0 && item.pre_order_qty == 0" class="items-center q-px-xs q-py-xs">
                      <div class="items-center row justify-between">
                        <q-radio v-model="deliveryType[index]" size="xs" val="express"
                          @click="onchangeDeliveryType(index, 'express')">
                          <template #default>
                            <div class="column q-pl-sm">
                              <span class="text-subtitle2 q-ma-none">
                                Express Delivery
                              </span>
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
                    <q-separator v-show="selectedLocation != 0 && item.fg_shipping_cost_free == 1" class="q-mt-sm"/>
                    <!-- Free Shipping -->
                    <div v-show="selectedLocation != 0 && item.fg_shipping_cost_free == 1"
                      class="row justify-between q-px-md q-py-sm q-col-gutter-y-xs q-pb-md">
                      <div class="row items-center">
                        <div class="row justify-center items-center">
                          <div class="row items-center q-gutter-md">
                            <q-radio v-model="deliveryType[index]" size="xs" val="regular"
                              @click="onchangeDeliveryType(index, 'regular')">
                              <template #default>
                                <div class="column q-pl-sm q-ma-none">
                                  <span class="text-subtitle2">
                                    Free Delivery
                                  </span>
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
                        </div>
                      </div>
                    </div>
                    <!-- Free Shipping Ends -->
                    <q-separator v-if="item.pre_order_qty > 0" inset />
                    <div v-if="item.pre_order_qty > 0"
                      class="row justify-center q-py-xs text-caption text-weight-medium text-primary">
                      {{ item.pre_order_qty }} Pre-Ordered&nbsp;
                      <span v-if="item.pre_order_qty > 1">Items</span>
                      <span v-else>Item</span>
                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>
        <q-card v-else flat bordered class="row justify-center items-center q-mx-xs gradient" style="height: 120px">
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
                <q-btn v-close-popup class="col" label="Yes" type="submit" color="primary"
                  @click="confirmDeleteAll()" />
                <q-btn v-close-popup class="col" outline label="No" color="primary" />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card>
      <!-- Delivery Details -->
      <div class="q-gutter-y-sm q-pt-sm">
        <!-- If Customer LOGGED IN after register -->
        <q-card square class="q-pa-xs text-center">
          <q-card-section class="q-gutter-y-md q-pa-sm">
            <q-input filled v-model="customerName" type="text" label="Name" placeholder="Please enter your name" dense
               required>
              <template v-slot:prepend>
                <q-icon size="xs" name="person" />
              </template>
            </q-input>

            <small v-if="nameError" class="text-primary text-capitalize q-pl-sm">{{ nameError }}</small>
            <q-input filled v-model="customerPhone" placeholder="017XXXXXXXX" hint="017XXXXXXXX" dense maxlength="11"
              type="tel" label="Mobile Number*" required >
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
            <small v-if="addressError" class="text-primary text-capitalize q-pl-xs">{{ addressError }}</small>
            <!-- Delivery Location -->
            <q-input v-model="selected" class="q-pt-sm" standout type="text" dense readonly required
              @click="deliveryLocationModal = true" />
            <small v-if="orderError" class="text-primary text-capitalize q-pl-sm">{{ orderError }}</small>
          </q-card-section>
          <q-card v-if="shoppingCart.length != 0" id="total" class="gradient rounded-borders text-center">
            <q-card-section class="q-pb-sm">
              <div class="column text-weight-light">
                <h6 class="text-h6 q-ma-none text-primary">
                  Item Total {{ config.public.currencyBefore }}
                </h6>
                <h6 class="text-h6 q-ma-none text-primary">
                  {{ formatMoney(cartTotal) }}
                  {{ config.public.currencyAfter }}
                </h6>
              </div>
            </q-card-section>
            <q-card-section class="row q-pb-md">
              <q-space />
              <q-input v-model:model-value="coupon_code" standout="bg-primary text-white" :hint="coupon_code
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
              <q-space />
            </q-card-section>
            <q-card-section class="q-pb-md q-py-none">
              <div class="column q-gutter-md">
                <div v-if="couponDiscountAmount > 0" class="col text-subtitle1 column text-weight-medium">
                  <h6 class="text-bold q-ma-none text-h6 q-pb-xs text-primary">
                    Invoice Total {{ config.public.currencyBefore }}
                  </h6>
                  <h6 class="text-primary text-h6 q-ma-none text-weight-medium">
                    {{ formatMoney(cartTotal - couponDiscountAmount) }}
                    {{ config.public.currencyAfter }}
                  </h6>
                  <h6 class="text-overline q-ma-none text-weight-medium text-primary">
                    ( {{ formatMoney(cartTotal) }}
                    {{ config.public.currencyAfter }} -
                    {{ formatMoney(couponDiscountAmount * 1.0) }}
                    {{ config.public.currencyAfter }} )
                  </h6>
                </div>
                <div v-else class="col column text-weight-medium">
                  <h6 class="text-bold text-h6 q-ma-none text-primary q-pb-xs">
                    Invoice Total {{ config.public.currencyBefore }}
                  </h6>
                  <h6 class="text-primary text-h6 q-ma-none text-primary">
                    {{ formatMoney(cartTotal) }}
                    {{ config.public.currencyAfter }}
                  </h6>
                </div>
                <q-separator inset />
                <div v-show="shippingTotal > 0" class="col column text-weight-medium">
                  <span class="text-bold text-body1 q-pb-xs">
                    Shipping Charge {{ config.public.currencyBefore }}
                  </span>
                  <span class="text-orange-14 text-h5 text-bold">
                    {{ formatMoney(shippingTotal) }}
                    {{ config.public.currencyAfter }}
                  </span>
                </div>
                <div class="column text-weight-medium">
                  <h6 class="text-h5 q-ma-none text-primary">
                    Payable Amount {{ config.public.currencyBefore }}
                  </h6>
                  <h6 class="text-primary text-h4 q-ma-xs text-bold">
                    {{
                      formatMoney(
                        cartTotal * 1.0 -
                        couponDiscountAmount +
                        shippingTotal * 1.0
                      )
                    }}
                    {{ config.public.currencyAfter }}
                  </h6>
                </div>
              </div>
            </q-card-section>
            <!-- PAY WITH SSL COMMERCE,  -->
            <q-card-section class="row justify-center q-gutter-md q-py-xs">
              <q-form v-for="(payment, index) in paymentGatewayList" :key="payment"
                :action="getEnvValue.api_url + '/paynow-order'" method="post">
                <q-input v-model="getEnvValue.c_code" style="display: none" name="company_code" />
                <q-input v-model="payment.payment_gateway_id" style="display: none" name="payment_gateway_id" />
                <q-input v-model="customerName" style="display: none" name="name" />
                <q-input v-model="customerPhone" style="display: none" name="phone" />
                <q-input v-model="customerEmail" style="display: none" name="email" />
                <q-input v-model="customerAddress" style="display: none" name="address" />
                <q-input v-model="cartItemData.value" style="display: none" name="cart_item" />
                <q-input v-model="coupon_data" style="display: none" name="coupon" />
                <q-input v-model="affiliate_id" style="display: none" name="affiliate_id" />
                <q-input v-model="customerRefId" style="display: none" name="reference_id" />
                <q-input v-model="selectedLocation" style="display: none" name="location" />
                <q-btn ref="submit" outline type="submit" color="primary"
                  :label="`PAY WITH: ` + payment.payment_gateway_name" no-caps class="bg-grey-1 shadow-3">
                  <!-- Pay With {{ payment.payment_gateway_name }} -->
                </q-btn>
              </q-form>
              <q-btn outline color="primary" class="bg-grey-1 shadow-3" @click="orderNow()">
                Cash On Delivery
              </q-btn>
            </q-card-section>
            <q-card-section>
              <q-img class="rounded-borders" src="/images/payment-gateway.web" />
            </q-card-section>
          </q-card>
        </q-card>
        <!-- Delivery Location Modal -->
        <q-dialog v-model="deliveryLocationModal" position="bottom">
          <q-card flat bordered style="width: 400px">
            <q-card-section class="q-py-sm">
              <div class="text-overline text-primary text-capitalize text-center">
                Delivery Location
              </div>
            </q-card-section>
            <q-card-section>
              <q-input ref="filterRef" v-model="filter" class="bg-white" dense outlined label="Search Location">
                <template #append>
                  <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
                </template>
              </q-input>
              <q-scroll-area style="height: 200px" class="q-pa-sm">
                <q-tree class="text-capitalize text-body2" default-expand-all dense :nodes="locationJson"
                  :filter="filter" node-key="label" label-key="label" color="primary">
                  <template #header-select="prop">
                    <q-radio v-model="selected" size="xs" :val="prop.node.chain" :label="prop.node.label" @click="
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
            <q-card-actions class="row q-gutter-lg flex flex-center">
              <q-btn v-close-popup outline color="primary" label="Close" style="width: 120px" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
      <!-- Checkout Header -->
      <q-page-sticky expand position="top">
        <q-toolbar class="text-primary gradient-bottom shadow-2 q-py-sm q-px-sm">
          <q-toolbar-title class="text-body1 text-weight-medium">
            <h6 class="q-ma-xs text-h6 text-weight-medium">Combo Cart</h6>
          </q-toolbar-title>
          <q-btn v-if="shoppingCart.length != 0" icon="delete_outline" flat dense no-caps color="primary"
            class="q-ml-sm" label="Delete All" @click="deleteAllCartItemsModal()" />
          <q-btn v-if="selectedLocation != 0" v-ripple rounded icon="place" dense no-caps color="primary"
            class="q-ml-md" unelevated @click="deliveryLocationModal = true" />
          <q-btn v-else v-ripple rounded icon="place" dense no-caps color="primary" class="q-ml-md" outline
            @click="deliveryLocationModal = true" />
        </q-toolbar>
      </q-page-sticky>
    </div>
  </div>
</template>
