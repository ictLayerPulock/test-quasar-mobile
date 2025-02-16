<template>
  <div>

    <Head>
      <Title>Showrooms</Title>
    </Head>
    <q-card flat class="bg-grey-1 shadow-4">
      <q-card-section class="q-pa-sm gradient-h">
        <h1 class="text-h5 text-uppercase text-primary q-ma-none text-weight-medium text-center">
          Showroom Location
        </h1>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-none">
        <q-card v-for="location in response.showroomList" :key="location" class="q-ma-sm" style="height: 120px">
          <q-card-section horizontal>
              <NuxtImg loading="lazy" @click="navigateTo(`/showroom/${location.slug}`)" rounded height="120" src="https://placehold.co/200x200" :title="location.name"
                :alt="location.name" />
            <div class="q-pa-xs">
              <div class="row items-center q-col-gutter-x-sm" @click="navigateTo(`/showroom/${location.slug}`)">
                <q-icon size="xs" color="red" name="place" />
                <p class="q-ma-none text-subtitle2"> {{ location.name }}</p>
              </div>
              <div class="row items-center q-col-gutter-x-sm">
                <q-icon size="xs" color="red" name="home" />
                <p class="q-ma-none text-caption  ellipsis-2-lines" @click="navigateTo(`/showroom/${location.slug}`)"> {{ location.address }}</p>
              
              </div>
              <div class="row items-center q-col-gutter-x-sm">
                <q-icon size="xs" color="red" name="phone" />
                <p class="q-ma-none text-caption"> 
                  <a :href="`tel:` + location.phone" style="text-decoration: none" class="text-secondary">
                      {{ location.phone }}
                    </a>
                </p>
              </div>
            </div>
          </q-card-section>
          <!-- <q-card-section horizontal class="row overflow-hidden cursor-pointer"
            @click="navigateTo(`/showroom/${location.slug}`)">
            <div class="col-4"> 
              <NuxtImg loading="lazy" rounded ratio="3:4" height="150" width="112" :src="location.image" :title="location.name"
                :alt="location.name" />
            </div>
            <q-card-section class="q-pa-none column justify-center">
              <q-list class="q-gutter-y-sm">
                <q-item dense>
                  <q-item-section side>
                    <q-icon size="xs" color="red" name="place" />
                  </q-item-section>
                  <q-item-section class="text-body2 text-weight-medium">
                    {{ location.name }}
                  </q-item-section>
                </q-item>
                <q-item dense>
                  <q-item-section side>
                    <q-icon size="xs" color="primary" name="home" />
                  </q-item-section>
                  <q-item-section class="text-caption ellipsis-2-lines">
                    {{ location.address }}
                  </q-item-section>
                </q-item>
                <q-item dense>
                  <q-item-section side>
                    <q-icon size="xs" color="primary" name="phone" />
                  </q-item-section>
                  <q-item-section class="text-caption">
                    <a :href="`tel:` + location.phone" style="text-decoration: none" class="text-secondary">
                      {{ location.phone }}
                    </a>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card-section> -->
        </q-card>
      </q-card-section>
    </q-card>
  </div>
</template>


<script setup lang="ts">
const config: any = useRuntimeConfig();
const nuxtApp = useNuxtApp();

const { data: response }: any = await useAsyncData(
  'showroomList',
  async () =>
    $fetch("/api/showroom"),
  {
    transform(input: any) {
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
      return data;
    }
  }
);
</script>
