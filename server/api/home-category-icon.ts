
export default cachedEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const body = {
    company_code: config.apiSecret,
    ...query,
  };

  try {
    const response = await $fetch(config.apiUrl + "home-category-icon", {
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
}, {
	maxAge: 300,
	name: `home-category-icon`,
	getKey: (event) => {
		const config = useRuntimeConfig();
    const query = getQuery(event);
		const companyCode = config.apiSecret;

		const dynamicName = `home-category-icon_${companyCode}`;

		return `${dynamicName}_${JSON.stringify(query)}`;
	}
});
