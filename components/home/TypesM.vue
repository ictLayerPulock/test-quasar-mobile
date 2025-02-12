<template>
    <div v-if="status != 'pending'">
        <section v-show="response.data.length">
            <q-card flat square class="gradient q-py-none">
                <q-card-section class="row justify-between gradient-h q-py-none q-px-sm">
                    <NuxtLink to="/type" aria-label="Type" title="Type" style="text-decoration: none">
                        <h3 class="text-h5 text-capitalize text-primary text-weight-medium q-my-sm" title="Type">
                            Type
                        </h3>
                    </NuxtLink>
                    <q-btn to="/type" color="primary" flat padding="sm" dense size="md" icon="more_vert"
                        aria-label="Type" />
                </q-card-section>
                <q-separator />
                <q-scroll-area :style="{ height: response.data.length > 2 ? '180px' : '350px' }">
                    <q-card-section v-if="status === 'pending'" class="row q-pa-sm q-col-gutter-sm gradient"
                        style="width: 1080px">
                        <div v-for="item in 12" :key="item" class="col-2">
                            <q-card class="shadow-5 overflow-hidden">
                                <q-card-section class="q-pa-none border-bottom row">
                                    <NuxtImg loading="lazy" sizes="100vw sm:50vw md:170px" width="170" quality="50"
                                        class="fit relative" format="webp" src="/placeholder.gif" :draggable="false" />
                                    <div class="absolute-bottom text-body1 text-bold text-center"
                                        style="backdrop-filter: blur(2px);">
                                        <q-skeleton height="100%" width="100%" />
                                    </div>
                                </q-card-section>
                            </q-card>
                        </div>
                    </q-card-section>
                    <q-card-section v-else class="row q-pt-sm q-px-sm q-gutter-x-sm q-pb-none gradient"
                        style="width: 400px">
                        <div v-for="type in response.data" :key="type">
                            <NuxtLink :to="`/type/${type.fg_type_url}`" :aria-label="type.fg_type_name"
                                style="text-decoration: none" class="text-secondary">
                                <q-card class="shadow-6 shadow-on-hover zoom-on-hover cursor-pointer rounded">
                                    <q-card-section class="q-pa-none" style="width:120px;">
                                        <NuxtImg loading="lazy" placeholder="/placeholder.gif" width="120" height="120"
                                            format="webp" quality="50" class="rounded"
                                            :src="type.fg_type_component_img ? type.fg_type_component_img : `https://dummyimage.com/96x80/c9c9c9/000.jpg&text=${type.fg_type_name}`"
                                            :alt="type.fg_type_name" :title="type.fg_type_name" />
                                        <p class="text-subtitle2 text-center q-px-sm q-pb-xs text-capitalize ellipsis">
                                            {{ type.fg_type_name }}
                                        </p>
                                    </q-card-section>
                                </q-card>
                            </NuxtLink>
                        </div>
                    </q-card-section>
                </q-scroll-area>
            </q-card>
        </section>
    </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const show = ref(true)
const { data: response, status }: any = useAsyncData(
    "home-type-list",
    async () =>
        $fetch("/api/home-type-list", {
            query: {
                limit: "12",
                start: "0",
            },
        }),
    {
        default: () => [],
        lazy: true,
        deep: false,
        transform(response: any) {
            if (response.data.length == 0) show.value = false;
            return {
                data: response.data,
                fetchedAt: new Date(),
            };
        },
        getCachedData(key) {
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