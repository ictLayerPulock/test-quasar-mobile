<template>
    <section class="q-pb-sm">
        
        <div v-if="status === 'pending'">
            <q-skeleton class="q-py-md" height="280px"></q-skeleton>
        </div>
        <div v-else>
            <p v-if="attributes.data.length > 1 && fgOrderType == 0" class="text-subtitle2 q-mb-xs text-center">Select Attribute
                For In Stock</p>
            <p v-if="attributes.data.length > 1 && fgOrderType == 1" class="text-subtitle2 q-mb-xs text-center">Select Attribute
                For Order</p>
            <p v-if="attributes.data.length > 1 && fgOrderType == 2" class="text-subtitle2 q-mb-xs text-center">Select Attribute
                For Pre-Order</p>
            <div v-if="attributes.data.length > 1" class="row q-col-gutter-sm justify-center items-center">
                <div v-for="attr in attributes.data" class="col-sm-6" style="width: 110px">
                    <q-card class="cursor-pointer shadow-6 shadow-on-hover overflow-hidden"
                        :style="getCardStyle(attr.fg_attribute_id)" @click="attrChanged(attr.fg_attribute_id)">
                        <q-card-section class="q-pa-none">
                            <q-img v-if="attr.attr_images.length > 0" placeholder="/placeholder.gif" loading="lazy"
                                :alt="attr.fg_attribute_name" :title="attr.fg_attribute_name" :src="img(attr.attr_images[0], {
                                    sizes: '280px',
                                    width: 280,
                                    height: 280,
                                })"></q-img>
                            <q-img v-else placeholder loading="lazy" :alt="attr.fg_attribute_name"
                                :title="attr.fg_attribute_name" :src="img(`/placeholder.gif`, {
                                    sizes: '280px',
                                    width: 280,
                                    height: 280, quality: 70
                                })">
                                </q-img>
                        </q-card-section>
                        <div class="absolute bg-transparent" style="top: 0px; left: 0px">
                            <q-radio v-model="attribute" :val="attr.fg_attribute_id" size="25px" color="negative"
                                style="opacity: 90%" />
                        </div>
                        <div v-if="attr.available_stock > 0" class="absolute bg-transparent text-caption"
                            style="top: 2px; right: 4px">
                            {{ numberShortFormat(attr.available_stock) }}/ Qty.
                        </div>
                        <div v-else class="absolute bg-transparent text-caption" style="top: 2px; right: 4px">
                            Pre-Order
                        </div>
                        <q-card-section class="q-pa-xs bg-grey-2 text-center">
                            <div class="text-caption text-weight-light ellipsis-2-lines">
                                {{ attr.fg_attribute_name }}
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
const nuxtApp = useNuxtApp();
const config = useRuntimeConfig();

// const attribute = ref("gray");
const getCardStyle = (value: any) => {
    const isSelected = attribute.value === value;
    return {
        border: `1px solid ${isSelected ? "red" : "darkgrey"}`,
        borderRadius: "5px",
    };
};

const props = defineProps({
    fgId: { type: String, required: true },
    fgOrderType: { type: [Number, String], required: true },
    fgDiscount: { type: Number, required: false, default: 0 },
    // img start
    height: { type: [Number, String], default: '500' },
    // img end
})
// nuxt img start
const img = useImage()
// nuxt img end
const attrAvailable = useState(`attrAvailable${props.fgId}`)

// api start
const selectedAttrStock = useSelectedAttrStock();
const selectedAttr = useSelectedAttr();
const quantity = ref(1);
const preOrderType = usePreOrderType();

const {
    data: attributes,
    status,
}: any = await useAsyncData(`product-attribute-add-to-cart: ${props.fgId}`,
    async () => $fetch("/api/product-attribute-add-to-cart", {
        query: {
            fg_id: props.fgId,
        },
    }), {
    default: () => [],
    transform(responseData: any) {
        responseData.data = responseData.data.map((attr: any) => ({
            fg_attribute_id: attr.fg_attribute_id,
            // fg_attribute_type_name: attr.fg_attribute_type_name,
            fg_attribute_name: attr.fg_attribute_name,
            fg_attribute_image: attr.fg_attribute_image,
            // fg_attribute_image_file_name: attr.fg_attribute_image_file_name,
            // fg_attribute_image_unique_id: attr.fg_attribute_image_unique_id,
            // fg_attribute_image_helper: attr.fg_attribute_image_helper,
            // fg_attribute_color_code: attr.fg_attribute_color_code,
            available_stock: attr.available_stock,
            available_stock_all: attr.available_stock_all,
            fg_id: attr.fg_id,
            attr_images: attr.attr_images,
        }))
        if (responseData.data.length > 0) {
            attrAvailable.value = true
        }
        else {
            attrAvailable.value = false
        }

        return {
            ...responseData,
            fetchedAt: new Date(),
        };
    },
    getCachedData(key: any) {
        const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        if (!data) {
            return;
        }
        const expDate = new Date(data.fetchedAt);
        expDate.setTime(expDate.getTime() + config.public.cacheMinAge);
        const isExpired = expDate.getTime() < Date.now();
        if (isExpired) {
            return;
        }
        return data;
    },
});

// Check if attributes.value.data is defined and not empty before accessing its properties
const attribute = ref(
    attributes.value.data && attributes.value.data.length > 0
        ? attributes.value.data[0].fg_attribute_id
        : null
);

selectedAttrStock.value = attributes.value.data && attributes.value.data.length > 0 ? attributes.value.data[0].available_stock : null;
selectedAttr.value = attributes.value.data && attributes.value.data.length > 0 ? attributes.value.data[0].fg_attribute_id : null;
const discounted = ref(false);
if (props.fgDiscount > 0) {
    discounted.value = true;
}

function orderTypeChangeState() {
    if (quantity.value > selectedAttrStock.value) {
        preOrderType.value = 1;
    } else {
        preOrderType.value = 0;
    }
}

function attrChanged(attrValue: any) {
    attribute.value = attrValue;
    quantity.value = 1;
    selectedAttr.value = attribute.value

    for (const index in attributes.value.data) {
        if (attributes.value.data[index].fg_attribute_id == selectedAttr.value) {
            selectedAttrStock.value = attributes.value.data[index].available_stock;
        }
    }
    orderTypeChangeState();
}

orderTypeChangeState();
// api end

</script>