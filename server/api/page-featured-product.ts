export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const body = {
    company_code: config.apiSecret,
    ...query,
  };

  try {
    const products: any = { data: [] };
    const { data }: any = await $fetch(config.apiUrl + "featured-product", {
      method: "POST",
      body: body,
    });
    // Tag Array Check Start :
    // ? IF TagArrayCheck NOT REQUIRED -> Comment Code Block
    // const tagArrayCheck = ["main"];
    // for (const fg_key in data) {
    //   for (const tag_key in data[fg_key].fg_tag_arr) {
    //     if (
    //       tagArrayCheck.includes(data[fg_key].fg_tag_arr[tag_key].fg_tag_name)
    //     ) {
    //       products.data.push(data[fg_key]);
    //     }
    //   }
    // }
    // return products; // ? IF tagArrayCheck Required, return this
    // Tag Array Check End
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
