export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  var body: any = {};
  const bodyData = await readBody(event);
  if (bodyData) {
    let postBody = {
      company_code: config.apiSecret,
    };
    body = {
      ...bodyData,
      ...postBody,
    };
  } else {
    body.company_code = config.apiSecret;
  }

  try {
    const response = await $fetch(config.apiUrl + "shopping-cart", {
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
