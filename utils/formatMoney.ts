export default function (value: number) {
  if (typeof value !== "number") {
    return value;
  }
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
