<template>
  <div class="bg-grey-2">
    <div>
      <q-carousel ref="carousel" v-model="slide" swipeable :autoplay="60000" animated height="240px">
        <q-carousel-slide v-for="(item, index) in addImgUrl" :key="item" class="no-padding" :name="index + 1">
          <!-- <q-img :ratio="16 / 9" class="cursor-pointer fit" :src="blog.add_img_url[index]" :alt="blog.blog_title"
            :title="blog.blog_title">
          </q-img> -->
          <div style="width:100%; height:230px">
            <NuxtImg loading="lazy" width="356" height="230" format="webp"  class="cursor-pointer fit" quality="50" :draggable="false"
                      placeholder="/placeholder.gif" :src="blog.add_img_url[index]" :alt="blog.blog_title"
                      :title="blog.blog_title" />
          </div>
        </q-carousel-slide>
        <q-carousel-slide v-if="blog.blog_video" class="no-padding" :name="addImgUrl.length + 1" label="Next"
          style="height:230px; width: 100%;">
          <!-- <q-video loading="lazy" style="height: 100%; width: 100%" :alt="blog.blog_title" :title="blog.blog_title" :src="`https://www.youtube.com/embed/${blog.blog_video}?controls=0&autoplay=1&rel=0&mute=0&loop=1&showinfo=0`" /> -->
          <ScriptYouTubePlayer ref="video" :ratio="16 / 9" class="no-padding" :video-id="blog.blog_video"
            style="height: 100%; width: 100%">
            <template #awaitingLoad>
              <div class="absolute-center" style="height: 32px; width: 68px">
                <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
                  <path
                    d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                    fill="#f00" />
                  <path d="M 45,24 27,14 27,34" fill="#fff" />
                </svg>
              </div>
            </template>
          </ScriptYouTubePlayer>
        </q-carousel-slide>
      </q-carousel>
      <q-chip dense v-if="blog.blog_view > 0" class="absolute text-primary" style="top: 205px; right: 10px" square flat>
        <q-icon name="trending_up" class="q-mr-sm" left />
        <span>
          {{ blog.blog_view }}
        </span>
      </q-chip>
      <q-chip dense color="primary" class="absolute bg-grey-3 text-primary" style="top: 10px; right: 10px" square flat>
        <q-icon name="schedule" class="q-mr-xs" left />
        <span class="text-capitalize text-caption">
          {{ useTimeAgo(blog.blog_date) }}
        </span>
      </q-chip>
    </div>
    <q-card flat>
      <q-card-section class="q-pa-sm bg-grey-3">
        <div class="row" :class="blog.blog_video ? 'justify-between' : 'justify-end'">
          <div class="row" v-if="blog.blog_video">
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
                        class="rounded-borders text-red" icon="email" title="Share Email" />
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
      <q-separator />
      <q-card-section class="q-pa-sm">
        <h2 class="text-h6 q-my-none text-primary text-weight-medium text-capitalize">
          {{ blog.blog_title }}
        </h2>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-white">
      <q-card-section class="q-pa-xs">
        <q-scroll-area :visible="false" style="height: 40px" :thumb-style="{ opacity: '0' }" @touchstart.stop
          @mousedown.stop>
          <div class="items-center justify-center row no-wrap text-capitalize text-bold">
            <NuxtLink v-for="tag in blog.blog_tag_arr" :key="tag" :to="`/blog/tag/` + tag.blog_tag_url"
              :aria-label="tag.blog_tag_name" style="text-decoration: none">
              <q-chip outline clickable square color="primary" size="md" text-color="white">
                {{ tag.blog_tag_name.replace(/_/g, " ") }}
              </q-chip>
            </NuxtLink>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
      <q-card v-if="blog.blog_article" flat class="shadow-6 q-pa-xs">
        <div class="q-pa-sm">
          <div class="text-justify">
            <p class="text-body2" v-html="blog.blog_article" />
          </div>
        </div>
      </q-card>
      <BlogLatestBlogM />
      <LazySuggestedProductsM />
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const route = useRoute();
const $q = useQuasar();
const url = route.params.url;
const videoModal = useVideoModal();
const slide = ref(1);

interface blogType {
  [x: string]: any;
}

const nuxtApp = useNuxtApp();
const addImgUrl: any = ref([]);
const blog: any = ref();

const { data: response }: any = await useAsyncData(
  `blog-details: ${url}`,
  async () =>
    $fetch("/api/blog-details/" + url, {
      query: {
        blog_url: url,
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
blog.value = response.value;
</script>
