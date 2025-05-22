export function formatDate(isoDate: string, format: string = "YYYY-MM-DD"): string {
    if (!isoDate) return "";
  
    const date = new Date(isoDate);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return format
      .replace("YYYY", year)
      .replace("MM", month)
      .replace("DD", day);
  }
  