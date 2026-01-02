export async function apiGet(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("Lỗi tải dữ liệu");
  return r.json();
}
export async function apiPost(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data?.ok === false) throw new Error(data?.message || "Lỗi lưu dữ liệu");
  return data;
}
export async function apiDelete(url) {
  const r = await fetch(url, { method: "DELETE" });
  if (!r.ok) throw new Error("Lỗi xoá dữ liệu");
  return r.json();
}
