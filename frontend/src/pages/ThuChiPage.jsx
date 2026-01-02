import { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, Select, Pill } from "../components/UI.jsx";
import { apiGet, apiPost, apiDelete } from "../lib/api.js";

const fmt = (n) => (Number(n) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });
const ymFromDate = (d) => d?.slice(0, 7);

export default function ThuChiPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [type, setType] = useState("CHI");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterYM, setFilterYM] = useState(ymFromDate(today));

  const load = async (ym) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet(`/api/transactions?ym=${encodeURIComponent(ym)}`);
      setRows(data.items || []);
    } catch (e) {
      setError(e.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(filterYM); }, [filterYM]);

  const monthOptions = useMemo(() => {
    const set = new Set(rows.map((r) => ymFromDate(r.date)));
    set.add(ymFromDate(today));
    return Array.from(set).filter(Boolean).sort().reverse();
  }, [rows, today]);

  const filteredRows = useMemo(() => rows.filter((r) => ymFromDate(r.date) === filterYM), [rows, filterYM]);

  const sumThu = useMemo(() => filteredRows.filter((r) => r.amount > 0).reduce((s, r) => s + r.amount, 0), [filteredRows]);
  const sumChi = useMemo(() => filteredRows.filter((r) => r.amount < 0).reduce((s, r) => s + r.amount, 0), [filteredRows]);
  const balance = useMemo(() => sumThu + sumChi, [sumThu, sumChi]);

  const addRow = async () => {
    const v = Number(amount);
    if (!v || v <= 0) return;
    setError("");
    try {
      const payload = { date, type, note: note?.trim() || "-", amount: v };
      const res = await apiPost("/api/transactions", payload);
      setRows((prev) => [res.item, ...prev]);
      setNote("");
      setAmount("");
      if (ymFromDate(date) !== filterYM) setFilterYM(ymFromDate(date));
    } catch (e) {
      setError(e.message || "Lỗi lưu dữ liệu");
    }
  };

  const removeRow = async (id) => {
    if (!id) return;
    setError("");
    try {
      await apiDelete(`/api/transactions/${id}`);
      setRows((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setError(e.message || "Lỗi xoá dữ liệu");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Thu / Chi</h1>
          <p className="text-gray-600 mt-1">Dữ liệu lấy từ backend (SQLite). Lọc theo tháng để xem đúng kỳ.</p>
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </div>

        <div className="w-full sm:w-56">
          <div className="text-sm text-gray-600 mb-1">Lọc theo tháng</div>
          <Select value={filterYM} onChange={(e) => setFilterYM(e.target.value)}>
            {monthOptions.map((ym) => (
              <option key={ym} value={ym}>{ym.slice(5,7)}/{ym.slice(0,4)}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Tổng Thu" subtitle={`${fmt(sumThu)} đ`} right={<Pill tone="pos">Thu</Pill>} />
        <Card title="Tổng Chi" subtitle={`${fmt(Math.abs(sumChi))} đ`} right={<Pill tone="neg">Chi</Pill>} />
        <Card title="Số dư" subtitle={`${fmt(Math.abs(balance))} đ`} right={<Pill tone={balance>=0?"pos":"neg"}>{balance>=0?"Dương":"Âm"}</Pill>} />
      </div>

      <div className="rounded-2xl border p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button variant={type==="THU"?"solid":"ghost"} onClick={() => setType("THU")}>Thu</Button>
            <Button
              variant={type==="CHI"?"solid":"ghost"}
              className={type==="CHI" ? "bg-red-600 hover:opacity-90" : ""}
              onClick={() => setType("CHI")}
            >
              Chi
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Quy ước: <span className="text-green-600 font-semibold">Thu dương</span>, <span className="text-red-600 font-semibold">Chi âm</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Ngày</div>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <div className="text-sm text-gray-600 mb-1">Nội dung</div>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ví dụ: Thu học phí, Mua sữa..." />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Số tiền (đ)</div>
            <Input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))} placeholder="Nhập số" inputMode="numeric" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={addRow}>Thêm giao dịch</Button>
        </div>
      </div>

      <div className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold">Danh sách giao dịch</div>
          <div className="text-sm text-gray-600">Tháng: <b>{filterYM?.slice(5,7)}/{filterYM?.slice(0,4)}</b></div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Ngày</th>
                <th className="text-left px-4 py-3">Loại</th>
                <th className="text-left px-4 py-3">Nội dung</th>
                <th className="text-right px-4 py-3">Số tiền (đ)</th>
                <th className="text-right px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="border-t">
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>Đang tải...</td>
                </tr>
              )}

              {!loading && filteredRows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className={r.type==="CHI" ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">{r.note}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={r.amount < 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                      {r.amount < 0 ? "-" : "+"}{fmt(Math.abs(r.amount))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-red-600 hover:underline" onClick={() => removeRow(r.id)}>Xoá</button>
                  </td>
                </tr>
              ))}

              {!loading && (
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-3 font-semibold" colSpan={3}>TỔNG (tháng)</td>
                  <td className="px-4 py-3 text-right">
                    <span className={balance < 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                      {balance < 0 ? "-" : "+"}{fmt(Math.abs(balance))}
                    </span>
                  </td>
                  <td className="px-4 py-3"></td>
                </tr>
              )}

              {!loading && filteredRows.length === 0 && (
                <tr className="border-t">
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>Chưa có giao dịch trong tháng này.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
