export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = {
    company_code: config.apiSecret,
  };

  try {
    const response = await $fetch(config.apiUrl + "remove-api-cache", {
      method: "POST",
      body: body,
    });
    return response;
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
