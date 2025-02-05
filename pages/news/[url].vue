<script setup lang="ts">
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const route = useRoute();
const $q = useQuasar();
const url = route.params.url;
const videoModal = useVideoModal();
const slide = ref(1);

interface NewsType {
  [x: string]: any;
}

const nuxtApp = useNuxtApp();
const addImgUrl: any = ref([]);
const news: any = ref();

const { data: response }: any = await useAsyncData(
  `news-details: ${url}`,
  async () =>
    $fetch("/api/news-details/" + url, {
      query: {
        news_url: url,
      },
    }),
  {
    // default: () => [],
    // lazy: true,
    // deep: false,
    transform(input: any) {
      return {
        ...input.data[0],
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

for (let i = 0; i <= response.value.add_img_url.length; i++) {
  if (response.value.add_img_url[i] != null) {
    addImgUrl.value.push(response.value.add_img_url[i]);
  }
}
news.value = response.value;

console.log(news.value.news_article )
console.log(news.news_article)
// Modify the HTML content by adding inline styles to specific tags
const rawVHtml = ref(news.value.news_article );
const styledHtml = computed(() => {
  return rawVHtml.value
    .replace(/<h1>/g, '<h1 style="font-size: 18px; line-height: 1.5; margin: 0 0 7px 0; font-weight: 500;">')
    .replace(/<h2>/g, '<h2 style="font-size: 17px; line-height: 1.5; margin: 0 0 7px 0; font-weight: 500;">')
    .replace(/<h3>/g, '<h3 style="font-size: 16px; line-height: 1.5; margin: 0 0 7px 0; font-weight: 500;">')
    .replace(/<p>/g, '<p style="font-size: 14px; line-height: 1.4; margin: 0 0 5px 0;">')
    .replace(/<ul>/g, '<ul style="font-size: 14px; line-height: 1.5; margin: 0 0 5px 0;">')
    .replace(/<li>/g, '<li style="font-size: 14px; line-height: 1.4; margin: 0 0 5px 0;">');
});
</script>

<template>
  <div class="bg-grey-2">
    <q-card flat>
        <q-card-section class="q-pa-sm">
          <h1 class="text-subtitle1 q-ma-none text-primary text-weight-medium text-capitalize text-center">
            {{ news.news_title }}
          </h1>
        </q-card-section>
      <q-card-section class="q-pa-none">
        <q-carousel ref="carousel" v-model="slide" swipeable :autoplay="60000" animated height="200px">
          <q-carousel-slide v-for="(item, index) in addImgUrl" :key="item" class="q-ma-none q-pa-sm" :name="index + 1">
            <NuxtImg loading="lazy" class="border-bottom fit" width="150" height="200" :src="news.add_img_url[index]" :alt="item.news_title" :title="item.news_title" />
          </q-carousel-slide>
          <q-carousel-slide v-if="news.news_video" class="q-pa-none justify-center row" :name="addImgUrl.length + 1" label="Next">
            <!-- <q-video loading="lazy" style="height: 100%; width: 100%" :alt="news.news_title" :title="news.news_title" :src="`https://www.youtube.com/embed/${news.news_video}?controls=0&autoplay=1&rel=0&mute=0&loop=1&showinfo=0`" /> -->
            <ScriptYouTubePlayer ref="video" :video-id="news.news_video">
              <template #awaitingLoad>
                <div class="absolute-center" style="height: 48px; width: 68px">
                  <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
                    <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00" />
                    <path d="M 45,24 27,14 27,34" fill="#fff" />
                  </svg>
                </div>
              </template>
            </ScriptYouTubePlayer>
          </q-carousel-slide>
        </q-carousel>
        <div class="row justify-between q-px-sm">
          <div class="row justify-start items-center text-primary">
            <q-icon name="schedule" class="q-mr-xs" left />
            <div class="text-overline">
              <span class="text-primary text-capitalize">
                {{ useTimeAgo(news.news_date) }}
              </span>
            </div>
          </div>
          <div v-if="news.news_view > 0" class="row justify-start items-center text-primary text-overline">
            <q-icon name="trending_up" color="primary" class="q-mr-xs" left />
            <span>
              {{ news.news_view }}
            </span>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-py-sm q-px-sm bg-grey-3">
        <div class="row" :class="news.news_video ? 'justify-between' : 'justify-end'">
          <div class="row" v-if="news.news_video">
            <q-btn-toggle class="bg-white text-grey-10" size="10px" outline v-model="slide" :options="[
              { label: 'Picture', value: 1 },
              { label: 'Video', value: 2 },
            ]" />
          </div>
          <div>
            <q-btn flat dense size="xs" class="bg-transparent text-subtitle2 text-weight-bolder" title="Share">
              <q-icon size="sm" name="share" color="negative" class="q-mr-xs">
                <q-menu class="bg-white q-pa-none" auto-close>
                  <q-list class="q-pa-none">
                    <q-item clickable>
                      <q-btn dense href="#" target="_blank" size="sm" flat comfortable
                        class="rounded-borders text-primary" icon="email" title="Share Email" />
                    </q-item>
                    <q-separator />
                    <q-item clickable>
                      <q-btn href="#" dense target="_blank" size="sm" flat comfortable color="white"
                        class="rounded-borders text-blue-6" icon="facebook" title="Share Facebook" />
                    </q-item>
                    <q-separator />
                    <q-item clickable>
                      <q-btn dense href="https://wa.me/YOUR_NUMBER" target="_blank" size="sm" flat comfortable
                        class="rounded-borders" icon="language" title="Share Affiliate"></q-btn>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-white">
      <q-card-section class="q-pa-xs">
        <q-scroll-area :visible="false" style="height: 40px" :thumb-style="{ opacity: '0' }" @touchstart.stop @mousedown.stop>
          <div class="row justify-center items-center no-wrap text-capitalize text-bold">
            <NuxtLink v-for="tag in news.news_tag_arr" :key="tag" :to="`/news/tag/` + tag.news_tag_url" :aria-label="tag.news_tag_name" style="text-decoration: none">
              <q-chip outline clickable square color="primary" size="md">
                {{ tag.news_tag_name.replace(/_/g, " ") }}
              </q-chip>
            </NuxtLink>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
    <q-card  flat>
      <div class="q-pa-sm">
        <div class="text-justify q-pa-xs">
          <p class="text-body2 text-grey-7 q-my-xs" v-html="styledHtml" />
        </div>
      </div>
    </q-card>
      <NewsLatestNewsM />
      <LazySuggestedProductsM />
  </div>
</template>

