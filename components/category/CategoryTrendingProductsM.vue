<template>
    <section>
        <q-card v-show="show" flat square class="gradient">
            <div class="gradient-h q-pa-sm">
                <h2 class="text-h5 text-primary text-capitalize text-weight-medium q-my-xs">
                    Trending Products
                </h2>
            </div>
            <q-scroll-area style="height:308px" :thumb-style="{ opacity: '0' }" @touchstart.stop @mousedown.stop>
                <q-card-section v-if="status === 'pending'" class="row q-pa-sm q-col-gutter-sm gradient"
                    style="width: 1070px">
                    <div v-for="item in 6" :key="item" class="col-2">
                        <q-card class="shadow-5 overflow-hidden">
                            <q-card-section class="q-pa-none border-bottom row">
                                <NuxtImg loading="lazy" width="150" height="200" quality="50" class="fit" format="webp"
                                    src="/placeholder.gif" :draggable="false" />
                            </q-card-section>
                            <q-card-section class="q-pa-sm q-gutter-xs">
                                <div class="text-body2 text-weight-regular ellipsis-2-lines" style="height: 44px">
                                    <q-skeleton type="text" width="200px"></q-skeleton>
                                </div>
                                <div class="items-baseline justify-between row">
                                    <q-space />
                                    <div class="text-subtitle2 text-weight-medium">
                                        <q-skeleton type="text" width="40px"></q-skeleton>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </q-card-section>
                <q-card-section v-else class="row q-pa-sm"
                    :style="{ width: `${response.data.length * parseInt(config.public.scrollAreaWidthMobile)}px` }">
                    <div v-for="(item, index) in response.data" :key="index" class="col-2" :class="{
                        'col-6': response.data.length === 2,
                        'col-4': response.data.length === 3,
                        'col-3': response.data.length === 4
                    }">
                        <NuxtLink :to="`/product/${item.fg_url}`" :aria-label="item.acc_ledger_name"
                            style="text-decoration: none" class="text-secondary">
                            <q-card class="shadow-5 overflow-hidden"
                                :style="`width: ${config.public.imageGridMediumWidthMobile}`">
                                <q-card-section class="row q-pa-none border-bottom">
                                    <NuxtImg loading="lazy" placeholder="/placeholder.gif"
                                        :width="config.public.imageGridMediumWidthMobile"
                                        :height="config.public.imageGridMediumHeightMobile" format="webp" quality="50"
                                        :src="item.fg_image" :alt="item.acc_ledger_name"
                                        :title="item.acc_ledger_name" />
                                </q-card-section>
                                <q-icon v-if="item.fg_featured > 0" name="bookmark" color="primary" size="xs"
                                    class="absolute" style="top: 5px; left: 5px" />
                                <div v-if="item.fg_view > 0" size="xs"
                                    class="absolute row justify-center items-center bg-transparent text-caption text-weight-medium"
                                    style="top: 5px; right: 8px">
                                    <q-icon size="xs" name="trending_up" color="primary" class="q-mr-xs" />
                                    <p class=" text-caption text-primary q-ma-none">
                                        {{ viewCount(item.fg_view) }}
                                    </p>
                                </div>
                                <q-card-section class="q-pa-sm q-gutter-xs">
                                    <div style="height: 48px">
                                        <h4
                                            class="text-subtitle2 text-left text-weight-regular ellipsis-2-lines q-ma-none">
                                            <q-skeleton v-if="status === 'pending'" type="text" width="120px" />
                                            <span v-else class="text-subtitle2" :title="item.acc_ledger_name">
                                                {{ item.acc_ledger_name }}
                                            </span>
                                        </h4>
                                    </div>
                                    <div class="row justify-between items-baseline">
                                        <div v-if="
                                            item.fg_discount > 0 &&
                                            inDateRange(
                                                item.fg_discount_start_date,
                                                item.fg_discount_end_date
                                            )
                                        " class="text-caption text-bold text-primary text-uppercase">
                                            <p class="q-ma-none">-{{ item.fg_discount }}%</p>
                                        </div>
                                        <q-space />
                                        <div class="text-body2 text-weight-medium">
                                            <p class="q-ma-none">
                                                {{ config.public.currencyBefore }}
                                                {{ formatMoney(item.fg_up_final * 1.0) }}
                                                {{ config.public.currencyAfter }}
                                            </p>
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </NuxtLink>
                    </div>
                </q-card-section>
            </q-scroll-area>
        </q-card>
    </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const show = ref(true);

const props = defineProps({
    url: { type: String, required: true },
});

/* Minimum 10 Products for Trending Component Mobile */
interface ProductType {
    [x: string]: any;
}
const nuxtApp = useNuxtApp();

// const product: ProductType = ref([]);


const { data: response, status }: ProductType = useAsyncData(
    `category-trending: ${props.url}`,
    () =>
        $fetch("/api/category-trending-product/" + props.url, {
            query: {
                fg_category_url: props.url,
                tag: config.public.tagFiltering,
                limit: "6",
                start: "0",
            },
        }),
    {
        lazy: true,
        transform(input: any) {
            input.data = input.data.map((item: any) => ({
                acc_ledger_name: item.acc_ledger_name,
                fg_discount: item.fg_discount,
                fg_discount_end_date: item.fg_discount_end_date,
                fg_image: item.fg_image,
                fg_url: item.fg_url,
                fg_featured: item.fg_featured,
                fg_view: item.fg_view,
                fg_up_final: item.fg_up_final,
                // fg_tag_arr: item.fg_tag_arr,
                // fg_sku: item.fg_sku,
                // fg_rating: item.fg_rating,
                // acc_ledger_name_bn: item.acc_ledger_name_bn,
                // fg_image_file_name: item.fg_image_file_name,
                // fg_up: item.fg_up,
                // fg_category_name: item.fg_category_name,
                // fg_category_url: item.fg_category_url,
                // fg_gender: item.fg_gender,
                // fg_brand_id: item.fg_brand_id,
                // fg_brand_name: item.fg_brand_name,
                // fg_brand_logo: item.fg_brand_logo,
                // fg_type_id: item.fg_type_id,
                // fg_tag_id: item.fg_tag_id,
                // fg_type_name: item.fg_type_name,
                // fg_type_url: item.fg_type_url,
            }));
            if (input.data.length == 0) show.value = false;
            return {
                ...input,
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
            if (data.data.length == 0) show.value = false;
            return data;
        },
    }
);
// product.value = (response as any).value.data;
</script>