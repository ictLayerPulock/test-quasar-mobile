import { useDateFormat } from "@vueuse/core";
export default function (days: number) {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const today = useDateFormat(formattedDateTime, "YYYY-MM-DD", {
    locales: "en-US",
  });
  const result = new Date(today.value);
  result.setDate(result.getDate() + days);

  return useDateFormat(result, "D MMM YYYY", { locales: "en-US" }).value;
}
