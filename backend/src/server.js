const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "backend", time: new Date().toISOString() });
});

// Seed mẫu nếu DB chưa có data
const count = db.prepare("SELECT COUNT(1) AS c FROM transactions").get().c;
if (count === 0) {
  const today = new Date().toISOString().slice(0, 10);
  const ins = db.prepare("INSERT INTO transactions(date,type,note,amount) VALUES (?,?,?,?)");
  ins.run(today, "THU", "Ví dụ: Thu học phí", 1500000);
  ins.run(today, "CHI", "Ví dụ: Mua đồ dùng", -350000);
}

app.get("/api/transactions", (req, res) => {
  const { ym } = req.query; // "YYYY-MM"
  let rows;
  if (ym && /^\d{4}-\d{2}$/.test(ym)) {
    rows = db
      .prepare("SELECT * FROM transactions WHERE substr(date,1,7)=? ORDER BY date DESC, id DESC")
      .all(ym);
  } else {
    rows = db.prepare("SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT 500").all();
  }
  res.json({ items: rows });
});

app.post("/api/transactions", (req, res) => {
  const { date, type, note, amount } = req.body || {};
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ ok: false, message: "Ngày không hợp lệ." });
  }
  if (!type || (type !== "THU" && type !== "CHI")) {
    return res.status(400).json({ ok: false, message: "Loại phải là THU hoặc CHI." });
  }
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount === 0) {
    return res.status(400).json({ ok: false, message: "Số tiền không hợp lệ." });
  }
  // Quy ước: THU dương, CHI âm
  const normalized = type === "CHI" ? -Math.abs(Math.trunc(amount)) : Math.abs(Math.trunc(amount));
  const ins = db.prepare("INSERT INTO transactions(date,type,note,amount) VALUES (?,?,?,?)");
  const info = ins.run(date, type, (note && String(note).trim()) || "-", normalized);
  const item = db.prepare("SELECT * FROM transactions WHERE id=?").get(info.lastInsertRowid);
  res.json({ ok: true, item });
});

app.delete("/api/transactions/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, message: "ID không hợp lệ." });
  const del = db.prepare("DELETE FROM transactions WHERE id=?").run(id);
  res.json({ ok: true, deleted: del.changes });
});

app.listen(PORT, () => console.log(`Backend chạy: http://0.0.0.0:${PORT}`));
