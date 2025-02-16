<template>
  <div>

    <Head>
      <Title>Immerse Yourself in Womanish: A VR Experience</Title>
      <Meta name="description" content="Experience Womanish like never before with our immersive VR tour. Explore our stunning collections and visualize them in your space. Dive in today!" />
      <Meta name="robots" content="noindex, follow" />
      <Link rel="canonical" :href="baseURL + '/vr'" />
    </Head>
    <q-page v-if="mobileAndTab()" class="bg-grey-1">
      <div class="q-gutter-sm">
        <q-card flat class="q-pa-xs">
          <q-card-section class="q-pa-xs">
            <div class="items-center justify-around row q-pt-sm q-pa-xs">
              <h1 class="text-h6 text-uppercase text-primary text-weight-medium text-center">
                Immerse Yourself in Womanish: A VR Experience
              </h1>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section flat class="column text-center q-pa-sm q-gutter-md">
            <div class="col">
              <h6 class="text-primary text-h6 text-weight-medium text-capitalize">
                Home Furniture 1st Floor
              </h6>
              <div class="iframe-container-m">
                <q-img src="/vr/Home-1M.webp" :class="!iframe1
                    ? 'thumbnail cursor-pointer rounded-borders'
                    : 'thumbnail hidden'
                  " alt="Home Furniture 1st Floor" title="Home Furniture 1st Floor" @click="showIframe1" />
                <q-btn round size="lg" icon="play_arrow" color="primary" style="z-index: 20" :class="!iframe1 ? 'absolute-center bg-primary' : 'hidden'" @click="showIframe1" />
                <iframe loading="lazy" :class="!iframe1 ? 'hidden' : 'flex rounded-borders'" width="100%" height="300" src="https://my.matterport.com/show/?m=qsX1fYUrgsh&cloudEdit=1&ss=4&sr=-.38,-.31" frameborder="0" allowfullscreen allow="xr-spatial-tracking" />
              </div>
            </div>
            <div class="col">
              <h6 class="text-primary text-h6 text-weight-medium text-capitalize">
                Home Furniture 2nd Floor
              </h6>
              <div class="iframe-container-m">
                <q-img src="/vr/Home-2-M.webp" :class="!iframe2
                    ? 'thumbnail cursor-pointer rounded-borders'
                    : 'thumbnail hidden'
                  " alt="Home Furniture 2nd Floor" title="Home Furniture 2nd Floor" @click="showIframe2" />
                <q-btn round size="lg" icon="play_arrow" color="primary" style="z-index: 20" :class="!iframe2 ? 'absolute-center bg-primary' : 'hidden'" @click="showIframe2" />
                <iframe loading="lazy" :class="!iframe2 ? 'hidden' : 'flex rounded-borders'" width="100%" height="300" src="https://my.matterport.com/show/?m=qsX1fYUrgsh&cloudEdit=1&ss=98&sr=-.08,.54" frameborder="0" allowfullscreen allow="xr-spatial-tracking" />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="column text-center q-pa-sm q-gutter-md">
            <div class="col">
              <h6 class="text-primary text-h6 text-weight-medium text-capitalize">
                Office Furniture
              </h6>
              <div class="iframe-container-m">
                <q-img src="/vr/Office-1M.webp" :class="!iframe3
                    ? 'thumbnail cursor-pointer rounded-borders'
                    : 'thumbnail hidden'
                  " alt="Office Furniture" title="Office Furniture" @click="showIframe3" />
                <q-btn round size="lg" icon="play_arrow" color="primary" style="z-index: 20" :class="!iframe3 ? 'absolute-center bg-primary' : 'hidden'" @click="showIframe3" />
                <iframe loading="lazy" :class="!iframe3 ? 'hidden' : 'flex rounded-borders'" width="100%" height="300" src="https://my.matterport.com/show/?m=qsX1fYUrgsh&cloudEdit=1&ss=98&sr=-.08,.54" frameborder="0" allowfullscreen allow="xr-spatial-tracking" />
              </div>
            </div>
            <div class="col">
              <h6 class="text-primary text-h6 text-weight-medium text-capitalize">
                Smart Living Furniture
              </h6>
              <div class="iframe-container-m">
                <q-img src="/vr/VR-LB-M.webp" :class="!iframe4
                    ? 'thumbnail cursor-pointer rounded-borders'
                    : 'thumbnail hidden'
                  " alt="Smart Living Furniture" title="Smart Living Furniture" @click="showIframe4" />
                <q-btn round size="lg" icon="play_arrow" color="primary" style="z-index: 20" :class="!iframe4 ? 'absolute-center bg-primary' : 'hidden'" @click="showIframe4" />
                <iframe loading="lazy" :class="!iframe4 ? 'hidden' : 'flex rounded-borders'" width="100%" height="300" src="https://my.matterport.com/show/?m=z5pwDmzWjqA" frameborder="0" allowfullscreen allow="xr-spatial-tracking" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
    
    <!-- Video Modal -->
    <q-dialog v-model="videoModal" backdrop-filter="blur(1px) brightness(90%)" transition-show="fade" transition-hide="fade">
      <q-card class="shadow-up-10" style="width: 700px; max-width: 80vw">
        <iframe loading="lazy" width="100%" height="480" :src="video_code" frameborder="0" allowfullscreen allow="xr-spatial-tracking" />
        <q-card-actions class="justify-center row q-pa-sm gradient-bottom">
          <q-btn v-close-popup outline label="Close" color="primary" style="width: 120px" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
const $q = useQuasar();
const videoModal = ref(false);
const video_code = ref("");
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

function openModal(video: any) {
  videoModal.value = true;
  video_code.value = video;
}

const iframe1 = ref(false);
const iframe2 = ref(false);
const iframe3 = ref(false);
const iframe4 = ref(false);
function showIframe1() {
  iframe1.value = true;
}
function showIframe2() {
  iframe2.value = true;
}
function showIframe3() {
  iframe3.value = true;
}
function showIframe4() {
  iframe4.value = true;
}
</script>
<style scoped>
.iframe-container {
  position: relative;
  width: 100%;
  height: 480px;
}

.iframe-container-m {
  position: relative;
  width: 100%;
  height: 300px;
}

.thumbnail {
  position: absolute-center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 1;
}

.iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
