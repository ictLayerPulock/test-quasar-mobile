export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const body = {
    company_code: config.apiSecret,
    ...query,
  };

  try {
    const products = await $fetch(config.apiUrl + "category-by-category-url", {
      method: "POST",
      body: body,
    });
    return products;
  } catch (error) {
    const products = {
      status: 200,
      error: true,
      message: "Invalid Category URL",
      data: [],
    };
    return products;
  }
});
