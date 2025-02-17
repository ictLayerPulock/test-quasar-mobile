<template>
  <section v-show="show">
    <q-card v-if="status != 'pending'" flat square class="gradient">
      <q-card-section class="gradient-h q-py-none q-px-sm">
        <h3 class="text-h5 text-capitalize text-primary text-weight-medium q-my-sm">
          Latest Blog
        </h3>
      </q-card-section>
      <q-separator />
    <q-scroll-area
      style="height: 280px"
      :thumb-style="{ opacity: '0' }"
      @touchstart.stop
      @mousedown.stop
    >
      <q-card-section
        v-if="status === 'pending'"
        class="row q-pa-sm q-col-gutter-sm gradient"
        style="width: 1200px"
      >
        <div v-for="item in 6" :key="item" class="col-2">
          <q-card class="shadow-5 overflow-hidden">
            <q-card-section class="q-pa-none border-bottom row">
              <NuxtImg
                loading="lazy"
                sizes="100vw sm:50vw md:170px"
                width="170"
                height="170"
                src="/placeholder.gif"
                format="webp"
                quality="50"
                class="fit"
                :draggable="false"
              />
            </q-card-section>
            <q-card-section class="q-pa-sm q-gutter-xs">
              <div
                class="text-body2 text-weight-regular ellipsis-2-lines"
                style="height: 44px"
              >
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
      <q-card-section
        v-else
        class="row q-pa-sm q-col-gutter-sm"
        style="width: 1200px"
      >
      <div v-for="blog in response.data" :key="blog">
            <NuxtLink :to="`/blog/${blog.blog_url}`" :aria-label="blog.blog_title" style="text-decoration: none"
              class="text-secondary">
              <q-card class="shadow-5 overflow-hidden" style="width:165px">
                <q-card-section class="q-pa-none border-bottom row">
                  <NuxtImg loading="lazy" width="165" height="165" format="webp" quality="50" :draggable="false"
                    placeholder="/placeholder.gif" :src="blog.blog_image" :alt="blog.blog_title"
                    :title="blog.blog_title" />
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <div class="text-body2 text-weight-regular ellipsis-2-lines text-capitalize"
                    style="height: 38px">
                    {{ blog.blog_title }}
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <div class="row justify-between items-center">
                    <div class="row justify-start items-center text-primary">
                      <q-icon name="schedule" class="q-mr-xs" left />
                      <div class="text-caption">
                        <span class="text-primary text-capitalize">
                          {{ useTimeAgo(blog.blog_date) }}
                        </span>
                      </div>
                    </div>
                    <div v-if="blog.blog_view > 0" class="row items-center text-caption">
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
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const show = ref(true);
// const img = useImage();

interface DataType {
  [x: string]: any;
}
const blog = ref<DataType>([]);

const { data: response, status }: any = useAsyncData(
  "blog-latest",
  async () =>
    $fetch("/api/blog-latest", {
      query: {
        limit: "6",
        start: "0",
      },
    }),
  {
    default: () => [],
    lazy: true,
    deep: false,
    transform(input: any) {
      input.data = input.data
        .map((item: any) => ({
          blog_date: item.blog_date,
          blog_image: item.blog_image,
          blog_title: item.blog_title,
          blog_url: item.blog_url,
          blog_view: item.blog_view,
        }))
        .splice(0, 6);
      if (input.data.length == 0) show.value = false;
      return {
        ...input,
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
      if (data.data.length == 0) show.value = false;
      return data;
    },
  }
);
</script>
