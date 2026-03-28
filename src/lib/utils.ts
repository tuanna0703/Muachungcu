export const nowTs = (): string =>
  new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

export const nowIso = (): string => new Date().toISOString();

export const uid = (): string => Math.random().toString(36).slice(2, 10);

export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
