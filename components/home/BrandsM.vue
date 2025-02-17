<template>
    <section v-show="show">
        <q-card flat square class="gradient">
            <q-card-section class="row justify-between gradient-h  q-py-none q-px-sm">
                <NuxtLink to="/brand" aria-label="Brands" title="Brands" style="text-decoration: none">
                    <h5 class="text-h5 text-capitalize text-primary text-weight-medium q-my-sm">
                        Brands
                    </h5>
                </NuxtLink>
                <q-btn to="/brand" color="primary" flat padding="sm" dense size="md" icon="more_vert" aria-label="Brands" />
            </q-card-section>
            <q-separator />
            <!-- {{response.data}} -->
            <q-card-section class="q-px-none q-pt-xs q-pb-none" style="height:115px">
                <div v-if="status === 'pending'">
                    <div v-if="isMobileSize <= 450" class="row justify-center items-center">
                        <div v-for="item in 3" :key="item" class="col-4 q-pa-xs">
                            <q-card class="shadow-5 shadow-on-hover rounded q-pa-none" style="width: 100px; height: 100px;">
                                <NuxtImg loading="lazy" rounded width="100" height="75" format="webp" quality="50" class="fit" src="/placeholder.gif" />
                                <q-skeleton type="text" width="40px"></q-skeleton>
                            </q-card>
                        </div>
                    </div>
                    <div v-else class="row justify-center items-center">
                        <div v-for="item in 6" :key="item" class="col-2 q-pa-xs">
                            <q-card class="shadow-5 shadow-on-hover rounded q-pa-none" style="width: 100px; height: 75px;">
                                <NuxtImg loading="lazy" rounded width="100" height="75" format="webp" quality="50" class="fit" src="/placeholder.gif" />
                                <q-skeleton type="text" width="40px" class="q-mt-xs"></q-skeleton>
                            </q-card>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <Vue3Marquee :pause-on-hover="true" animateOnOverflowOnly :duration="50">
                        <div v-for="brands in response.data" :key="brands" class="col q-pa-xs items-center">
                            <NuxtLink :to="`/brand/${brands.fg_brand_url}`" :aria-label="brands.fg_brand_name" style="text-decoration: none" class="text-secondary">
                                <q-card class="shadow-5 shadow-on-hover zoom-on-hover cursor-pointer rounded">
                                    <q-card-section class="q-pa-none rounded" style="width:100px; height:75px;">
                                        <NuxtImg loading="lazy" rounded width="100" height="75" format="webp" quality="50" :src="brands.fg_brand_logo ? brands.fg_brand_logo : `https://dummyimage.com/100x75/d4d4d4/ffffff.jpg&text=${brands.fg_brand_name}`" :title="brands.fg_brand_name" :alt="brands.fg_brand_name" />
                                    </q-card-section>
                                    <p class="text-subtitle2 text-center q-ma-xs text-capitalize ellipsis">
                                        {{ brands.fg_brand_name }}
                                    </p>
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
const show = ref(false);
const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);
import { Vue3Marquee } from 'vue3-marquee'
const { data: response, status }: any = useAsyncData(
    "home-brand-list",
    async () =>
        $fetch("/api/home-brand-list", {
            query: {
                limit: "20",
                start: "0",
            },
        }),
    {
        default: () => [],
        lazy: true,
        transform(responseData: any) {
            if (responseData.data.length  > 0) show.value = true;
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
            if (data.data.length > 0) show.value = true;
            return data;
        },
    }
);
</script>
