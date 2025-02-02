<template>
    <section>
        <q-card flat square class="gradient">
            <q-card-section class="row justify-between gradient-h  q-py-none q-px-sm">
                <NuxtLink to="/brand" aria-label="Brands" title="Brands" style="text-decoration: none">
                    <h3 class="text-h5 text-capitalize text-primary text-weight-medium q-my-sm">
                        Brands
                    </h3>
                </NuxtLink>
                <q-btn to="/brand" color="primary" flat padding="sm" dense size="md" icon="more_vert"
                    aria-label="Brands" />
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-sm" style="height:120px">
                <div v-if="status === 'pending'">
                    <div class="text-weight-medium text-black ellipsis q-mt-md text-capitalize">
                        <q-skeleton type="text" width="80px"></q-skeleton>
                    </div>
                </div>
                <div v-else>
                    {{ response.brandLis }}
                    <Vue3Marquee :pause-on-hover="true" animateOnOverflowOnly>
                        <div v-for="brands in response.brandList" :key="brands" class="row items-center">
                            <div class="q-mr-sm"></div>
                            <NuxtLink :to="`/brand/${brands.fg_brand_url}`" :aria-label="brands.fg_brand_name"
                                style="text-decoration: none" class="text-dark">
                                <q-card class="shadow-5 shadow-on-hover zoom-on-hover cursor-pointer rounded">
                                    <q-card-section class="q-pa-none" style="width:100px;">
                                        <NuxtImg loading="lazy" rounded width="100" height="75" format="webp" quality="50" class="fit"
                                            :src="brands.fg_brand_logo ? brands.fg_brand_logo : `https://dummyimage.com/100x75/d4d4d4/ffffff.jpg&text=${brands.fg_brand_name}`"
                                            :title="brands.fg_brand_name" :alt="brands.fg_brand_name" />
                                        <p
                                            class="text-negative text-subtitle2 text-center q-px-sm q-pb-xs text-capitalize ellipsis">
                                            {{ brands.fg_brand_name }}
                                        </p>
                                    </q-card-section>
                                </q-card>
                            </NuxtLink>
                        </div>
                    </Vue3Marquee>
                </div>
            </q-card-section>
        </q-card>
    </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

const { data: response, status }: any = useAsyncData(
    "home-brand-list",
    async () =>
        $fetch("/api/home-brand-list", {
            query: {
                limit: "4",
                start: "0",
            },
        }),
    {
        default: () => [],
        lazy: true,
        transform(responseData: any) {
            return {
                brandList: responseData.data,
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
    }
);
</script>
