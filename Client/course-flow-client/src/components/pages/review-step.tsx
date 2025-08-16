import { FaShieldAlt, FaTags } from "react-icons/fa";
import { currency } from "../utils/format";

interface ReviewStepProps {
  coupon: string;
  setCoupon: React.Dispatch<React.SetStateAction<string>>;
  applyCoupon: () => void;
  couponApplied: any;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    salePrice: number;
    features: string[];
  };

  handlePay: () => void;
  canPay: boolean;
  isPaying: boolean;
  total: number;
}

export default function ReviewStep({
  coupon,
  setCoupon,
  applyCoupon,
  setStep,
  couponApplied,
  course,
  handlePay,
  canPay,
  isPaying,
  total,
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-4 bg-white shadow-sm">
        <h4 className="font-semibold mb-3">Tóm tắt đơn hàng</h4>
        <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
          {course.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border p-4 bg-white shadow-sm">
        <h4 className="font-semibold mb-3">Mã giảm giá</h4>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <FaTags className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Nhập mã (UDEMY20, HELLO10)"
              className="w-full pl-10 rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={applyCoupon}
            className="px-4 py-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Áp dụng
          </button>
        </div>
        {couponApplied && (
          <p className="text-sm text-green-600 mt-2">
            Áp dụng mã thành công: {Math.round(couponApplied * 100)}%
          </p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border">
        <div className="flex items-center gap-2 text-gray-700">
          <FaShieldAlt />
          <span className="text-sm">Thanh toán bảo mật chuẩn PCI DSS</span>
        </div>
        <div className="text-sm">Hỗ trợ 24/7</div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
        >
          Quay lại
        </button>
        <button
          onClick={handlePay}
          disabled={!canPay || isPaying}
          className={`px-6 py-3 rounded-xl text-white shadow transition ${
            canPay
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isPaying ? "Đang xử lý..." : `Thanh toán ${currency(total)}`}
        </button>
      </div>
    </div>
  );
}
