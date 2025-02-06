export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  return {
    c_code: config.apiSecret,
    api_url: config.apiUrl,
  };
});
