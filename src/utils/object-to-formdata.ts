export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return; // نادیده گرفتن مقادیر خالی
    }

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (typeof value === "number" || typeof value === "string") {
      formData.append(key, String(value));
    } else if (value instanceof Blob) {
      formData.append(key, value); // شامل File هم میشه
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof Date) {
          formData.append(`${key}[${index}]`, item.toISOString());
        } else if (typeof item === "number" || typeof item === "string") {
          formData.append(`${key}[${index}]`, String(item));
        } else if (item instanceof Blob) {
          formData.append(`${key}[${index}]`, item);
        } else {
          // می‌تونی اینجا رو توسعه بدی برای nested objects
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        }
      });
    } else {
      // برای nested object یا ساختارهای دیگه
      formData.append(key, JSON.stringify(value));
    }
  });

  return formData;
}
