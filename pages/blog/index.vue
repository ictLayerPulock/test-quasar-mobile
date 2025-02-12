<template>
  <div>
    <div class="q-pa-xs gradient">
      <h1 class="text-h6 text-center text-uppercase text-primary text-weight-medium q-ma-sm">
       Latest Blog
      </h1>
    </div>
    <q-card square flat class="q-pa-sm bg-grey-2">
      <q-infinite-scroll :offset="50" @load="onLoad">
        <div class="row q-col-gutter-sm">
          <NuxtLink v-for="item in blog" :key="item" :aria-label="item.blog_title" :to="`/blog/${item.blog_url}`"
            style="text-decoration: none" class="text-secondary"
            :class="isMobileSize < 450 ? 'col-12' : isMobileSize < 790 ? 'col-6' : isMobileSize < 1600 ? 'col-4' : 'col-3'">
          <q-card class="shadow-5 overflow-hidden q-pa-none">
            <NuxtImg loading="lazy" class="fit border-bottom relative" width="170" height="170" :src="item.blog_image"
              :alt="item.blog_title" :title="item.blog_title" />
            <q-chip color="primary" class="absolute bg-grey-3 text-primary" style="bottom: 70px; right: 3px" square
              flat>
              <q-icon name="schedule" class="q-mr-sm" left />
              <span class="text-capitalize">
                {{ useTimeAgo(item.blog_date) }}
              </span>
            </q-chip>
            <q-chip v-if="item.blog_view > 0" color="primary" class="absolute bg-grey-3 text-primary"
              style="bottom: 70px; left: 3px">
              <q-icon name="trending_up" class="q-mr-sm" left />
              <span>
                {{ item.blog_view }}
              </span>
            </q-chip>
            <q-card-section class="q-pa-none">
              <p class="text-body1 q-ma-sm text-weight-regular text-capitalize ellipsis-2-lines" style="height: 50px;">
                {{ item.blog_title }}
              </p>
            </q-card-section>
          </q-card>
          </NuxtLink>
        </div>
        <template #loading>
          <div v-if="!no_more_data" class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-card>
  </div>
</template>
<script setup lang="ts">
const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);
const config = useRuntimeConfig()
const baseURL = config.public.baseURL;

const loading = ref(false);
const no_more_data = ref(false);
const start = ref(0);
const limit = ref(3);
const loadLimit = ref(0);

if ($q.platform.is.mobile == true) {
  limit.value = 3;
  loadLimit.value = 3;
} else {
  limit.value = 12;
  loadLimit.value = 6;
}

interface blogType {
  [x: string]: any;
}

const blog: blogType = ref([]);

const { data: response }: blogType = await useAsyncData(
  "blog",
  async () =>
    $fetch("/api/blog", {
      query: {
        limit: limit.value,
        start: start.value,
      },
    }),
  {
    transform(input: any) {
      blog.value = input.data;
      return {
        ...input,
        fetchedAt: new Date(),
      };
    },
    // getCachedData(key: any) {
    //   const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    //   if (!data) {
    //     return;
    //   }
    //   const expDate = new Date(data.fetchedAt);
    //   expDate.setTime(expDate.getTime() + 20 * 1000);
    //   const isExpired = expDate.getTime() < Date.now();
    //   if (isExpired) {
    //     return;
    //   }
    //   return data;
    // },
  }
);
blog.value = response.value.data;

function onLoad(index: any, done: any) {
  loading.value = true;
  start.value += limit.value;
  limit.value = loadLimit.value;
  setTimeout(async () => {
    const { data }: blogType = await useAsyncData("blog", async () =>
      $fetch("/api/blog", {
        query: {
          limit: limit.value,
          start: start.value,
        },
      })
    );
    const old = blog.value.length;
    blog.value = blog.value.concat(data.value.data);
    const current = blog.value.length;
    if (old === current) {
      no_more_data.value = true;
    }
    loading.value = false;
    done();
  }, 1000);
}
</script>
