import { FaCheckCircle } from "react-icons/fa";

interface SuccessStepProps {
  orderId: string;
  email?: string;
}

export default function SuccessStep({ orderId, email }: SuccessStepProps) {
  return (
    <div className="text-center space-y-4 py-10">
      <div className="inline-flex w-20 h-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-4xl">
        <FaCheckCircle />
      </div>
      <h3 className="text-2xl font-bold">Thanh toán thành công!</h3>
      <p className="text-gray-600">
        Mã đơn hàng: <span className="font-mono">{orderId}</span>
      </p>
      <div className="max-w-md mx-auto text-sm text-gray-600">
        Hóa đơn đã được gửi tới{" "}
        <span className="font-medium">{email || "email của bạn"}</span>. Bạn có
        thể bắt đầu học ngay.
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <a
          href="#"
          className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Vào học ngay
        </a>
        <a
          href="#"
          className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
        >
          Xem hoá đơn
        </a>
      </div>
    </div>
  );
}
