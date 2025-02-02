import { useTimeAgo } from "@vueuse/core";
export default function (date: string) {
  const timeAgo = useTimeAgo(date + " 23:59:59");
  return timeAgo.value;
}
