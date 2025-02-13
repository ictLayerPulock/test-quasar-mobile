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
      <!-- {{ response.showroomList }} -->
      <q-card-section class="q-pa-none">
        <q-card v-for="location in response.showroomList" :key="location" class="q-ma-sm" style="height: 150px">
          <q-card-section horizontal class="row overflow-hidden cursor-pointer"
            @click="navigateTo(`/showroom/${location.slug}`)">
            <div class="col-4"> 
              <NuxtImg loading="lazy" rounded height="170" class="fit" :src="location.image" :title="location.name"
                :alt="location.name" />
            </div>
            <q-card-section class="q-pa-none column justify-center">
              <q-list class="q-gutter-y-sm" padding>
                <q-item dense>
                  <q-item-section side>
                    <q-icon size="sm" color="red" name="place" />
                  </q-item-section>
                  <q-item-section class="text-body1 text-weight-medium">
                    {{ location.name }}
                  </q-item-section>
                </q-item>
                <q-item dense>
                  <q-item-section side>
                    <q-icon size="sm" color="primary" name="home" />
                  </q-item-section>
                  <q-item-section class="text-body2 ellipsis-2-lines">
                    {{ location.address }}
                  </q-item-section>
                </q-item>
                <q-item dense>
                  <q-item-section side>
                    <q-icon size="sm" color="primary" name="phone" />
                  </q-item-section>
                  <q-item-section class="text-body1">
                    <a :href="`tel:` + location.phone" style="text-decoration: none" class="text-secondary">
                      {{ location.phone }}
                    </a>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card-section>
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
