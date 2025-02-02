import { useTimeAgo } from "@vueuse/core";
export default function (date: string) {
  const timeAgo = useTimeAgo(date);
  return timeAgo.value;
}
