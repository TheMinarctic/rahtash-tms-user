export const getFileType = (fileName: string | null | undefined) => {
  if (!fileName) return "Unknown";
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext!)) return "PDF";
  if (["jpg", "jpeg", "png", "gif"].includes(ext!)) return "Image";
  if (["doc", "docx"].includes(ext!)) return "Word";
  if (["xls", "xlsx"].includes(ext!)) return "Excel";
  return ext?.toUpperCase() || "Unknown";
};
