<template>
  <div>
    <div v-if="product.length > 0" class="flex justify-center items-center q-gutter-sm q-pa-md bg-grey-2">
      <q-btn outline color="primary" class="text-weight-medium text-uppercase" style="width: 150px"
        @click="confirm_clear_all">
        Clear History
      </q-btn>
      <q-btn outline color="grey-1" class="text-weight-medium text-uppercase" style="width: 100px"
        @click="refresh_history">
        Refresh
      </q-btn>
    </div>
    <q-card v-else square flat outline>
      <q-card-section class="column justify-center items-center q-gutter-md text-subtitle1  text-uppercase bg-grey-2">
        <div class="col">No Recent Views</div>
        <q-btn outline color="grey-1" class="col text-grey-9 text-weight-medium text-uppercase" style="width: 100px"
          @click="refresh_history">
          Refresh
        </q-btn>
      </q-card-section>
    </q-card>
    <div class="q-px-sm q-gutter-sm bg-grey-2">
      <div v-for="(item, index) in product" :key="item">
        <q-card>
          <q-card-section horizontal>
            <NuxtImg loading="lazy" placeholder="/placeholder.gif" class="col-4" format="webp" quality="50"
              :src="item.fg_image" :alt="item.fg_title" :title="item.fg_title" />

            <q-btn flat dense round size="md" icon="delete" color="primary" class="absolute bg-transparent"
              style="bottom: 3px; left: 70px" @click="remove_recent(item.fg_id)">
            </q-btn>
            <q-icon v-if="item.fg_featured > 0" name="bookmark" color="primary" size="xs" class="absolute"
              style="top: 5px; left: 5px" />
            <q-card-section class="q-pa-sm col">
              <NuxtLink :to="`/product/${item.fg_url}`" class="text-secondary" aria-label="product" title="product"
                style="text-decoration: none">
                <div class="text-subtitle1 ellipsis-2-lines" style="height: 48px">
                  <p class="q-ma-none"> {{ item.acc_ledger_name }}</p>
                </div>
                <div class="flex justify-between items-center q-my-sm">
                  <div class="text-caption  ellipsis">
                    <p class="q-ma-none">{{ item.fg_category_name }}</p>
                  </div>
                  <q-space />
                  <div v-if="item.fg_view > 0" class="flex justify-start items-center text-caption">
                    <q-icon name="trending_up" left class="q-mr-xs" />
                    <p class="q-ma-none">
                      {{ viewCount(item.fg_view) }}
                    </p>
                  </div>
                </div>
                <div class="flex justify-between items-baseline">
                      <div v-if="
                        item.fg_discount > 0 &&
                        inDateRange(
                          item.fg_discount_start_date,
                          item.fg_discount_end_date
                        )
                      " class="text-caption text-bold text-primary text-uppercase">
                        -{{ item.fg_discount }}%
                      </div>
                      <q-space />
                      <div class="text-subtitle2 text-weight-medium">
                        {{ config.public.currencyBefore }}
                        {{ formatMoney(item.fg_up_final * 1.0) }}
                        {{ config.public.currencyAfter }}
                      </div>
                    </div>
              </NuxtLink>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-if="product.length > 5" class="flex justify-center items-center q-gutter-sm q-pa-md bg-grey-2">
      <q-btn outline color="primary" class=" text-weight-medium text-uppercase" style="width: 150px"
        @click="confirm_clear_all">
        Clear History
      </q-btn>
      <q-btn outline color="white" class="text-grey-9 text-weight-medium text-uppercase" style="width: 100px"
        @click="refresh_history">
        Refresh
      </q-btn>
    </div>
    <!-- Clear All History -->
    <q-dialog v-model="clear_all_modal">
      <q-card class="shadow-up-10">
        <q-card-section class="bg-grey-2 text-subtitle1 q-pa-md">
          <div>Are you sure you want to clear all history?</div>
        </q-card-section>
        <q-separator space />
        <q-card-section>
          <div class="flex justify-between q-gutter-md">
            <q-btn v-close-popup class="col" label="Yes" type="submit" color="primary" @click="clear_all_history()" />
            <q-btn v-close-popup class="col" outline label="No" color="primary" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { onMounted } from "vue";
interface DataType {
  [x: string]: any;
}

const start = 0;
let end = 8;
let localFgLength = 0;
const product: DataType = useRecentlyViewed();

const clear_all_modal = ref(false);
const confirm_clear_all = async () => {
  clear_all_modal.value = true;
};

onMounted(async () => {
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem("history")) {
      let localStorageFg = localStorage.getItem("history");
      if (localStorageFg == "") {
        localStorage.removeItem("history");
      } else {
        const localFgString = localStorage.getItem("history");
        let arr = (localFgString as string).split(",");
        localFgLength = arr.length;
        if (end > localFgLength) {
          end = localFgLength;
        }
        arr = arr.slice(start, end);
        localStorageFg = arr.join(",");
        historyApiCall(localStorageFg);
      }
    }
  }
});

function formatMoney(amount: number): string {
  return amount.toFixed(2);
}

function viewCount(view: number): string {
  return view.toString();
}

function inDateRange(startDate: string, endDate: string): boolean {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
}

async function historyApiCall(fgArr: string) {
  const data: any = await $fetch("/api/product-history", {
    method: "POST",
    body: {
      historyProduct: fgArr,
    },
  });
  product.value = data ? data.data : [];
}

async function remove_recent(fgId: string) {
  if (typeof localStorage !== 'undefined') {
    let localStorageFg = localStorage.getItem("history");
    const historyFg = (localStorageFg as string).split(",");
    const index = historyFg.indexOf(fgId);
    if (index !== -1) {
      historyFg.splice(index, 1);
    }
    localStorageFg = historyFg.join(",");
    localStorage.setItem("history", localStorageFg);
    // product.value = [];
    const data: any = await $fetch("/api/product-history", {
      method: "POST",
      body: {
        historyProduct: localStorageFg,
      },
    });
    product.value = data ? data.data : [];
  }
}

async function clear_all_history() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem("history");
    refresh_history();
  }
}

async function refresh_history() {
  if (typeof localStorage !== 'undefined') {
    const localStorageFg = localStorage.getItem("history");
    product.value = [];
    const data: any = await $fetch("/api/product-history", {
      key: "product-history",
      method: "POST",
      body: {
        historyProduct: localStorageFg,
      },
    });
    product.value = data ? data.data : [];
  }
}
refresh_history();
</script>
