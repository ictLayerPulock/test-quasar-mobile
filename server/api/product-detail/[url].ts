export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const body = {
    company_code: config.apiSecret,
    ...query,
  };
  try {
    const response: any = await $fetch(config.apiUrl + "product-detail", {
      method: "POST",
      body: body,
    });
    return response.data;
  } catch (error) {
    const response = {
      status: 200,
      error: true,
      message: "No Data",
      data: 0,
    };
    return response;
  }
});
