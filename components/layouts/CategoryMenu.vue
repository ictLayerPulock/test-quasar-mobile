<template>
    <div>
      <q-expansion-item v-for="parent in response.data" :key="parent" :to="(parent.fg_category_url != '' && parent.fg_category_url != null) ? `/category/` + parent.fg_category_url : ''" active-class="bg-grey-4" :label-lines="1" :content-inset-level="0.5" :hide-expand-icon="!parent.children ? true : false">
        <q-expansion-item v-for="child in parent.children" :key="child" :to="(child.fg_category_url != '' && child.fg_category_url != null) ? `/category/` + child.fg_category_url : ''" active-class="bg-grey-4" :content-inset-level="0.5" :hide-expand-icon="!child.children ? true : false">
          <q-expansion-item v-for="grandchild in child.children" :key="grandchild" :to="(grandchild.fg_category_url != '' && grandchild.fg_category_url != null) ? `/category/` + grandchild.fg_category_url : ''" active-class="bg-grey-4" :content-inset-level="0.5" :hide-expand-icon="true">
            <template #header>
              <q-item-section avatar>
                <q-avatar size="25px" square>
                  <NuxtImg v-if="grandchild.fg_category_icon != null && grandchild.fg_category_icon != ''" loading="lazy" format="webp" class="category-icon" :src="grandchild.fg_category_icon" :alt="grandchild.fg_category_name" :title="grandchild.fg_category_name" />
                  <q-icon v-else name="category" size="xs" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                {{ grandchild.fg_category_name }}
              </q-item-section>
            </template>
          </q-expansion-item>
          <template #header>
            <q-item-section avatar>
              <q-avatar size="25px" square>
                <NuxtImg v-if="child.fg_category_icon != null && child.fg_category_icon != ''" loading="lazy" format="webp" class="category-icon" :src="child.fg_category_icon" :alt="child.fg_category_name" :title="child.fg_category_name" />
                <q-icon v-else name="category" size="xs" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              {{ child.fg_category_name }}
            </q-item-section>
          </template>
        </q-expansion-item>
        <template #header>
          <q-item-section avatar>
            <q-avatar size="25px" square>
              <NuxtImg v-if="parent.fg_category_icon != null && parent.fg_category_icon != ''" loading="lazy" format="webp" class="category-icon" :src="parent.fg_category_icon" :alt="parent.fg_category_name" :title="parent.fg_category_name" />
              <q-icon v-else name="category" size="xs" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ parent.fg_category_name }}
          </q-item-section>
        </template>
      </q-expansion-item>
    </div>
  </template>
  
  <script setup lang="ts">
  
  const checkFgCount = ref(true)
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  const { data: response, status }: any = await useAsyncData(
    "category-menu",
    async () => $fetch("/api/category-menu"),
    {
      default: () => [],
      // lazy: true,
      deep: false,
      transform(responseData: any) {
        if (checkFgCount.value) {
          responseData.data = responseData.data
            .filter((item: any) => item.fg_count > 0)
            .map((item: any) => ({
              fg_category_id: item.fg_category_id,
              fg_category_name: item.fg_category_name,
              fg_category_parent_id: item.fg_category_parent_id,
              fg_category_icon: item.fg_category_icon,
              fg_count: item.fg_count,
              children: item.children,
            }));
        }
        else {
          responseData.data = responseData.data.map((item: any) => ({
            fg_category_id: item.fg_category_id,
            fg_category_name: item.fg_category_name,
            fg_category_parent_id: item.fg_category_parent_id,
            fg_category_icon: item.fg_category_icon,
            fg_count: item.fg_count,
            children: item.children
          }))
        }
  
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
        expDate.setTime(expDate.getTime() + config.public.cacheMaxAge);
        const isExpired = expDate.getTime() < Date.now();
        if (isExpired) {
          return;
        }
        return data;
      },
    }
  );
  
  </script>