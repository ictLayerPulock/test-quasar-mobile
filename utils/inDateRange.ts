export default function (start: string, end: string) {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = getCurrentDate();
  if (start == null) {
    start = today;
  }
  if (start <= today && today <= end) {
    return true;
  }
}
