<template>
  <section v-show="show">
    <q-card v-if="status == 'pending'">
      <q-card-section class="q-pa-none">
       <div class="row q-col-gutter-y-sm">
        <div v-for="item in 6" :key="item" class="col-4">
          <q-card style="width:80px" class="shadow-3 q-pa-none">
              <NuxtImg loading="lazy" rounded width="100" height="75" placeholder="placeholder.gif" />
            </q-card>
        </div>
       </div>
      </q-card-section>
    </q-card>  
    <q-card v-else flat square class="gradient">
      <!-- Two Rows -->
      <q-scroll-area style="height:175px" :thumb-style="{ opacity: '0' }" draggable="false" @touchstart.stop
        @mousedown.stop>
        <div class="row justify-start items-center q-pa-sm q-gutter-sm" :style="isMobileSize ? 'width:720px' : 'width:1500px'">
          <NuxtLink v-for="item in response.data" :key="item" :to="`/category/${item.fg_category_url}`"
            style="text-decoration: none" :aria-label="item.fg_category_name">
            <q-card style="width:80px" class="shadow-3 q-pa-none">
              <NuxtImg loading="lazy" rounded width="100" height="75"
                :src="item.fg_category_icon ? item.fg_category_icon : `https://dummyimage.com/100x75/d4d4d4/000.jpg&text=${item.fg_category_name}`"
                :title="item.fg_category_name" :alt="item.fg_category_name" />
            </q-card>
          </NuxtLink>
        </div>
      </q-scroll-area>
    </q-card>
  </section>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const show = ref(false);
const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);

const { data: response, status }: any = useAsyncData(
  "home-category-icon",
  async () =>
    $fetch("/api/home-category-icon", {
      query: {
        limit: "16",
        start: "0",
      },
    }),
  {
    default: () => [],
    lazy: true,
    transform(responseData: any) {
      if (responseData.data.length > 0) show.value = true;
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
      if (data.data.length > 0) show.value = true
      const isExpired = expDate.getTime() < Date.now();
      if (isExpired) {
        return;
      }
      return data;
    },
  }
);
</script>
