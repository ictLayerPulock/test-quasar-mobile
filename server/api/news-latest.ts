export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const body = {
    company_code: config.apiSecret,
    ...query,
  };

  try {
    const response = await $fetch(config.apiUrl + "news-latest", {
      method: "POST",
      body: body,
    });
    return response;
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
