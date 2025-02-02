export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const body = {
    company_code: config.apiSecret,
    ...query,
  };

  try {
    const products: any = { data: [] };
    const { data }: any = await $fetch(config.apiUrl + "home-new-arrival", {
      method: "POST",
      body: body,
    });
    products.data = data
    return products; // ? ELSE return this
  } catch (error) {
    const response = {
      status: 200,
      error: true,
      message: "No Data",
      data: [],
    };
    return response;
  }
});
