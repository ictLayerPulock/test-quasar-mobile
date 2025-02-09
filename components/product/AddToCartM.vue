<template>
  <div v-if="attrAvailable == true" class="row items-center justify-center q-gutter-md q-pb-md">
    <q-card class="row q-pa-none">
      <q-btn color="primary" size="md" class="q-px-sm" icon="remove" flat @click="removeQty" />
      <q-input v-model.number="quantity" dense filled square type="number" color="primary" style="max-width:40px;"
        input-class="text-right" disable class="cursor-pointer" />
      <q-btn color="primary" size="md" icon="add" class="q-px-sm" flat @click="addQty" />
    </q-card>
    <q-btn color="primary" label="Add To Cart" style="height:41px ;width:120px" @click="addToCart" />
  </div>

  <q-card v-if="quantity > selectedAttrStock && attrAvailable==true && fgOrderType!=0 && fgOrderType!=1"
    flat class="bg-grey-2 text-body2 text-weight-medium">
    <q-card-section class="q-py-xs column items-center justify-center q-gutter-xs">
      <div class="text-primary">
        {{ quantity - selectedAttrStock }}
        <span v-if="quantity - selectedAttrStock > 1">Items</span>
        <span v-else>Item</span>
        Pre-Ordered
        <q-separator color="primary" />
      </div>
      <p class="text-caption text-capitalize q-mb-sm">
        Delivery Time different from regular orders.</p>
    </q-card-section>
  </q-card>
  <q-card v-if="attrAvailable==false" flat class="bg-grey-2 text-body2 text-weight-medium">
    <q-card-section class="q-pa-sm column items-center justify-center  q-gutter-xs">
      <p class="q-ma-none">Out of Stock</p>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
const cartCount = useCartCount();
const preOrderType = usePreOrderType();
const selectedAttrStock = useSelectedAttrStock();
const selectedAttr = useSelectedAttr();
const customName = useCustomName();
const customPrice = useCustomPrice();
const customID = useCustomID();
const customImgUrl = useCustomImgUrl();
const customFgImgUrl = useCustomFgImgUrl();
const disabledAddQtyBtn = ref(false)

/* Cart Notification (Toast / Alert) */
const $q = useQuasar();
async function showNotif() {
  $q.notify({
    color: "primary",
    icon: "shopping_cart",
    message: "Your Item Has Been Carted",
    position: "bottom",
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

/* Component Props */
const props = defineProps({
  fgId: { type: String, required: true },
  fgOrderType: { type: [Number, String], required: true, default: 0 },
  fgDiscount: { type: Number, required: false, default: 0 },
});
const attrAvailable = useState(`attrAvailable${props.fgId}`)

const quantity = ref(1);
const attribute = ref(0)
const attr_stock = ref(0)
attribute.value = selectedAttr.value
attr_stock.value = selectedAttrStock.value

const discounted = ref(false);
if (props.fgDiscount > 0) {
  discounted.value = true;
}

/* Order Type Change State */
function orderTypeChangeState() {
  if (quantity.value > attr_stock.value) {
    preOrderType.value = 1;
  } else {
    preOrderType.value = 0;
  }
}

async function removeQty() {
  if (quantity.value > 1) {
    quantity.value--;
  } else {
    quantity.value == 1;
  }
  if (quantity.value >= selectedAttrStock.value && attrAvailable.value == true && props.fgOrderType == 0) {
    disabledAddQtyBtn.value = true
  }
  else {
    disabledAddQtyBtn.value = false
  }
  orderTypeChangeState();
}
async function addQty() {
  if (quantity.value >= selectedAttrStock.value && attrAvailable.value == true && props.fgOrderType == 0) {
    disabledAddQtyBtn.value = true
  }
  else {
    quantity.value++;
    orderTypeChangeState();
  }
}
orderTypeChangeState();

/* Add To Cart */
async function addToCart() {
  if (localStorage.cartItem) {
    const localStorageCart = JSON.parse(localStorage.getItem("cartItem") ?? "{}");

    const cartItem: any = {
      cartQty: 0,
      fgId: 0,
      fgOrderType: props.fgOrderType,
      selectedAttr: [],
      customPrice: customPrice.value,
      customName: customName.value,
      customID: customID.value,
      customImgUrl: customImgUrl.value,
      customFgImgUrl: customFgImgUrl.value,
    };
    cartItem.cartQty = quantity.value;
    cartItem.fgId = props.fgId
    cartItem.selectedAttr = selectedAttr.value;
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
    const cartItem: any = {
      cartQty: 0,
      fgId: 0,
      fgOrderType: props.fgOrderType,
      selectedAttr: [],
      customPrice: customPrice.value,
      customName: customName.value,
      customID: customID.value,
      customImgUrl: customImgUrl.value,
      customFgImgUrl: customFgImgUrl.value,
    };
    cartItem.cartQty = quantity.value;
    cartItem.fgId = props.fgId
    cartItem.selectedAttr = selectedAttr.value;
    localStorageCart.push(cartItem);
    localStorage.setItem("cartItem", JSON.stringify(localStorageCart));
  }
  const localStorageCart = JSON.parse(localStorage.getItem("cartItem") ?? "{}");
  cartCount.value = localStorageCart.length;
  showNotif();
}
</script>
