export const useCachedData = () => {
  const nuxtApp = useNuxtApp();

  const getCachedData = (key: any) => {
    const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    if (!data) {
      return null;
    }
    const expDate = new Date(data.fetchedAt);
    expDate.setTime(expDate.getTime() + nuxtApp.$config.public.cacheMinAge);
    const isExpired = expDate.getTime() < Date.now();
    
    return isExpired ? null : data;
  };

  return { getCachedData };
};
