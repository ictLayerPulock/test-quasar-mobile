// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["nuxt-quasar-ui", "@nuxt/image"],
  quasar: {
    extras: {
      fontIcons: ["material-icons"], // Add any icons you need
    },
    config: {},
  },
  css: [
    "quasar/dist/quasar.sass",
  ],
  build: {
    transpile: ["quasar"]
  },
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET,
    apiUrl: process.env.NUXT_API_URL,
    public: {
      /**
       * TODO get setting backend data from database against company code and SET Database Connection
       * ! important ! do not change this unless you know what you are doing
       */
      environment: process.env.NUXT_ENV,
      domain: process.env.DOMAIN!,
      CompanyName: process.env.NUXT_SITE_NAME!,
      baseURL: process.env.NUXT_SITE_URL!,
      baseURLAlternate: process.env.NUXT_SITE_URL_ALTERNATE!,
      cacheMinAge: 10 * 60 * 1000, // 10 mins
      cacheMaxAge: 30 * 60 * 1000, // 1 hr
      viewLimit: 0,
      currency: "BDT", // Primary Currency (For Post Method)
      currencyBefore: "",
      currencyAfter: "Tk.",
      imgRatio: "1",
      //__ For Height
      scrollAreaHeightMobile: "310px",
      scrollAreaHeightMobileDouble: "540px",

      //__ For Width
      scrollAreaWidthMobile: "165px",
      scrollAreaWidthMobileDouble: "540px",

      //__For Medium image card
      imageGridMediumWidthMobile: "150px",
      imageGridMediumHeightMobile: "200px",

      // imageGridMediumWidthMobile: "159px",
      // imageGridMediumHeightMobile: "212px",
      tagFiltering: "null" // fg_tag_id for filtering , if not needed then null
    },
  },
})