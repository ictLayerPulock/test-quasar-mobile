<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();
const $q = useQuasar();
const nuxtApp = useNuxtApp();

const { data: response }: any = await useAsyncData(
  `showroom: ${route.params.url}`,
  async () => $fetch("/api/showroom"),
  {
    transform(input: any) {
      input = input.showroomList.find(
        (item: { slug: string }) => item.slug == route.params.url
      );
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
    },
  }
);
</script>

<template>

  <Head>
    <Title>{{ response.name }}</Title>
  </Head>
  <div>
    <div class="column q-gutter-y-sm q-pb-sm">
      <q-card class="col" square>
        <div style="height: 300px;">
          <NuxtImg loading="lazy" rounded height="170" class="fit" :src="response.image" :title="response.name"
            :alt="response.name" />
        </div>
        <q-card-section>
          <h1 class="q-ma-none text-h6 text-primary">
            {{ response.name }}
          </h1>
          <p class="q-ma-none text-caption">
            Address: {{ response.address }}
          </p>
          <p class="q-ma-none text-caption">
            Phone: {{ response.phone }}
          </p>
        </q-card-section>
      </q-card>
      <q-card class="col" square>
        <q-card-section class="q-pa-none">
          <iframe loading="lazy" :src="response.map_url" width="100%" :height="$q.screen.sm ? '650px' : '450px'"
            style="border: 0" referrerpolicy="no-referrer-when-downgrade" />
        </q-card-section>
        <q-card-section class="row justify-center">
          <q-btn class="col q-mx-sm bg-grey-3" outline color="primary" flat to="/showroom">
            <q-icon name="arrow_back" class="q-pr-sm" />
            Back to Showroom List
          </q-btn>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
