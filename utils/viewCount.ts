export default function (value: number) {
  if (value >= 1000 && value <= 999999) {
    let format = (value / 1000).toFixed(1);
    format = format.replace(/\.?0+$/, "");
    return format + "K";
  }
  if (value >= 1000000) {
    let format = (value / 1000000).toFixed(1);
    format = format.replace(/\.?0+$/, "");
    return format + "M";
  } else {
    return value.toString();
  }
}
