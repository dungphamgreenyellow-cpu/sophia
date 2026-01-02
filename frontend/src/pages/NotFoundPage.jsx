import { Link } from "react-router-dom";
import { Button } from "../components/UI.jsx";
export default function NotFoundPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Không tìm thấy trang</h1>
      <p className="text-gray-600">Đường dẫn không hợp lệ.</p>
      <Link to="/"><Button>Về Trang chủ</Button></Link>
    </div>
  );
}
