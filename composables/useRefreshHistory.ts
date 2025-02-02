export const useRefreshHistory = async () => {
    const config = useRuntimeConfig();
  const product = useRecentlyViewed();
  if (typeof localStorage !== 'undefined') {
    const localStorageFg = localStorage.getItem("history");
    product.value = [];
    const data: any = await $fetch("/api/product-history", {
      method: "POST",
      body: {
        historyProduct: localStorageFg,
      },
    });
    product.value = data.data;
  }
}
