import { Link } from "react-router-dom";
import { Button, Card, Pill } from "../components/UI.jsx";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tổng quan</h1>
          <p className="text-gray-600 mt-1">
            Sản phẩm sẵn dùng: nhập Thu/Chi, lọc theo tháng, dữ liệu lưu vĩnh viễn.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>Tiếng Việt</Pill>
            <Pill>SQLite</Pill>
            <Pill>API thật</Pill>
            <Pill tone="neg">Không Báo cáo</Pill>
            <Pill tone="neg">Không Cài đặt</Pill>
          </div>
        </div>
        <Link to="/thu-chi"><Button>Vào Thu/Chi</Button></Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Bước 1" subtitle="Nhập giao dịch">
          <div className="text-sm text-gray-600">Chọn Thu/Chi, nhập số tiền, nội dung, ngày (mặc định hôm nay).</div>
        </Card>
        <Card title="Bước 2" subtitle="Theo dõi tổng">
          <div className="text-sm text-gray-600">Hệ thống tự tính Tổng Thu, Tổng Chi và Số dư theo tháng.</div>
        </Card>
        <Card title="Bước 3" subtitle="Dữ liệu không mất">
          <div className="text-sm text-gray-600">Backend lưu vào SQLite: backend/data.sqlite.</div>
        </Card>
      </div>
    </div>
  );
}
