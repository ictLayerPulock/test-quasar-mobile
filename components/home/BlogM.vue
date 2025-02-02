<template>
    <section v-show="show">
        <q-card v-if="status != 'pending'" flat square class="bg-grey-2">
            <q-card-section class="row justify-between gradient-h q-py-none q-px-sm">
                <NuxtLink to="/blog" aria-label="Blog" title="Blog" style="text-decoration: none">
                    <h3 class="text-h5 text-capitalize  text-weight-medium q-my-sm">
                        Blog
                    </h3>
                </NuxtLink>
                <q-btn to="/blog" color="primary" flat padding="sm" dense size="md" icon="more_vert"
                    aria-label="Blog" />
            </q-card-section>
            <q-separator />
            <q-scroll-area style="height: 273px" :thumb-style="{ opacity: '0' }" @touchstart.stop @mousedown.stop>
                <q-card-section v-if="status === 'pending'" class="row q-pa-sm q-col-gutter-sm" style="width: 890px">
                    <div v-for="item in 6" :key="item" class="col-2">
                        <q-card class="shadow-5 bg-grey-1">
                            <NuxtImg loading="lazy" sizes="100vw sm:50vw md:170px" width="170" quality="50" class="fit"
                                format="webp" src="/placeholder.gif" :draggable="false" />
                            <q-card-section class="q-pa-sm">
                                <div class="text-body2 text-secondary text-weight-regular ellipsis-2-lines text-capitalize"
                                    style="height: 42px">
                                    <q-skeleton type="text" width="120px" />
                                </div>
                            </q-card-section>
                            <q-card-section class="q-pa-sm">
                                <div class="items-center justify-between row">
                                    <q-space />
                                    <div class="items-center row text-caption text-secondary">
                                        <q-skeleton type="text" width="40px" />
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </q-card-section>
                <q-card-section v-else class="row q-px-sm q-pt-sm q-pb-none q-col-gutter-sm" style="width: 890px">
                    <div v-for="blog in response.data" :key="blog">
                        <NuxtLink :to="`/blog/${blog.blog_url}`" :aria-label="blog.blog_title"
                            style="text-decoration: none" class="">
                            <q-card class="shadow-5 overflow-hidden" style="width:165px">
                                <q-card-section class="q-pa-none border-bottom row">
                                    <NuxtImg loading="lazy" width="165" height="165" format="webp" quality="50"
                                        :draggable="false" placeholder="/placeholder.gif" :src="blog.blog_image"
                                        :alt="blog.blog_title" :title="blog.blog_title" />
                                </q-card-section>
                                <q-card-section class="q-pa-sm">
                                    <div class="text-body2 text-weight-regular ellipsis-2-lines text-capitalize"
                                        style="height: 38px">
                                        {{ blog.blog_title }}
                                    </div>
                                </q-card-section>
                                <q-card-section class="q-pa-sm">
                                    <div class="items-center justify-between row">
                                        <div class="items-center justify-start row ">
                                            <q-icon name="schedule" class="q-mr-xs" left />
                                            <div class="text-caption">
                                                <span class=" text-capitalize">
                                                    {{ useTimeAgo(blog.blog_date) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div v-if="blog.blog_view > 0" class="items-center row text-caption">
                                            <q-icon name="trending_up" class="q-mr-xs" left />
                                            <span>
                                                {{ blog.blog_view }}
                                            </span>
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
const nuxtApp = useNuxtApp();
const config = useRuntimeConfig();
const show = ref(false);

const { data: response, status }: any = useAsyncData(
    "home-blog",
    async () =>
        $fetch("/api/home-blog", {
            query: {
                limit: "6",
                start: "0",
            },
        }),
    {
        default: () => [],
        lazy: true,
        deep: false,
        transform(responseData: any) {
            if (responseData.data.length > 2) show.value = true;
            return {
                ...responseData,
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
            if (data.data.length > 2) show.value = true;
            return data;
        },
    }
);
</script>