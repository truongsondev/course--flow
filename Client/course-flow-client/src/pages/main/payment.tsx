import { useEffect, useMemo, useState } from "react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaShieldAlt,
  FaRegClock,
  FaCheckCircle,
  FaCreditCard,
  FaUniversity,
  FaTags,
} from "react-icons/fa";

// ======= MOCK COURSE DATA =======
const course = {
  id: "react-pro-001",
  title: "ReactJS Từ Cơ Bản Đến Nâng Cao",
  description:
    "Nắm vững React, Hooks, Routing, tối ưu hiệu năng và triển khai dự án thực tế.",
  thumbnail:
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop",
  price: 999000,
  salePrice: 499000,
  features: [
    "Truy cập trọn đời",
    "Cập nhật bài học miễn phí",
    "Chứng chỉ hoàn thành",
  ],
};

const COUPONS = {
  UDEMY20: 0.2,
  HELLO10: 0.1,
};

function currency(n) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function Step({ index, active, done, title }) {
  return (
    <div className="flex items-center">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
          done
            ? "bg-green-500 text-white border-green-500"
            : active
            ? "bg-blue-600 text-white border-blue-600 shadow"
            : "bg-white text-gray-600 border-gray-300"
        }`}
      >
        {done ? <FaCheckCircle /> : index}
      </div>
      <div className="ml-2 text-sm font-medium">{title}</div>
    </div>
  );
}

export default function CheckoutPagePro() {
  // ======= STATE =======
  const [step, setStep] = useState(1); // 1: Account, 2: Payment, 3: Review, 4: Success
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [method, setMethod] = useState("card"); // card | bank | paypal
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [bank, setBank] = useState("Vietcombank");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(null); // number (0-1) or null

  const [agreed, setAgreed] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Countdown (khuyến mãi còn X phút)
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  useEffect(() => {
    const id = setInterval(
      () => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(id);
  }, []);
  const timeLeft = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, [secondsLeft]);

  // ======= PRICING =======
  const basePrice = course.salePrice ?? course.price;
  const discount = couponApplied ? Math.round(basePrice * couponApplied) : 0;
  const total = Math.max(basePrice - discount, 0);

  // ======= VALIDATION =======
  const isEmailValid = /.+@.+\..+/.test(email);
  const isCardNumberValid = /^(\d{4} \d{4} \d{4} \d{4})$/.test(cardNumber);
  const isExpiryValid = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry);
  const isCvvValid = /^(\d{3})$/.test(cvv);

  const canContinueAccount = name.length > 1 && isEmailValid;
  const canPay =
    agreed &&
    ((method === "card" &&
      isCardNumberValid &&
      isExpiryValid &&
      isCvvValid &&
      cardName.length > 2) ||
      method === "bank" ||
      method === "paypal");

  // ======= HELPERS =======
  function maskCard(value) {
    return value
      .replace(/[^\d]/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();
  }
  function maskExpiry(value) {
    const v = value.replace(/[^\d]/g, "").slice(0, 4);
    if (v.length < 3) return v;
    return v.slice(0, 2) + "/" + v.slice(2);
  }

  function applyCoupon() {
    const key = coupon.trim().toUpperCase();
    if (COUPONS[key]) {
      setCouponApplied(COUPONS[key]);
    } else {
      setCouponApplied(null);
      alert("Mã giảm giá không hợp lệ");
    }
  }

  function handlePay() {
    if (!canPay) return;
    setIsPaying(true);
    // giả lập API
    setTimeout(() => {
      setIsPaying(false);
      setOrderId("CF" + Math.random().toString(36).slice(2, 10).toUpperCase());
      setStep(4);
    }, 1200);
  }

  // ======= STEP CONTENTS =======
  const AccountStep = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Họ và tên</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white/60 backdrop-blur p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email nhận hoá đơn</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@vidu.com"
            className={`mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 ${
              email && !isEmailValid
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {email && !isEmailValid && (
            <p className="text-xs text-red-500 mt-1">Email không hợp lệ.</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <FaRegClock />
          <span>Ưu đãi kết thúc sau</span>
          <span className="font-semibold">{timeLeft}</span>
        </div>
        <div className="text-sm">
          Tiết kiệm ngay{" "}
          <span className="font-semibold">
            {currency(course.price - basePrice)}
          </span>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          disabled={!canContinueAccount}
          onClick={() => setStep(2)}
          className={`px-5 py-3 rounded-xl text-white transition shadow ${
            canContinueAccount
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );

  const PaymentStep = (
    <div className="space-y-6">
      {/* Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => setMethod("card")}
          className={`p-4 rounded-2xl border flex items-center justify-center gap-2 transition ${
            method === "card"
              ? "border-blue-600 ring-2 ring-blue-100 bg-white"
              : "border-gray-200 bg-white/60"
          }`}
        >
          <FaCreditCard /> Thẻ tín dụng
        </button>
        <button
          onClick={() => setMethod("bank")}
          className={`p-4 rounded-2xl border flex items-center justify-center gap-2 transition ${
            method === "bank"
              ? "border-blue-600 ring-2 ring-blue-100 bg-white"
              : "border-gray-200 bg-white/60"
          }`}
        >
          <FaUniversity /> Ngân hàng nội địa
        </button>
        <button
          onClick={() => setMethod("paypal")}
          className={`p-4 rounded-2xl border flex items-center justify-center gap-2 transition ${
            method === "paypal"
              ? "border-blue-600 ring-2 ring-blue-100 bg-white"
              : "border-gray-200 bg-white/60"
          }`}
        >
          <FaCcPaypal /> PayPal
        </button>
      </div>

      {/* Forms */}
      {method === "card" && (
        <div className="rounded-2xl border p-4 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tên in trên thẻ</label>
              <input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="NGUYEN VAN A"
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Số thẻ</label>
              <div className="relative">
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(maskCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className={`mt-1 w-full rounded-xl border p-3 pr-12 focus:outline-none focus:ring-2 ${
                    cardNumber && !isCardNumberValid
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 flex gap-1">
                  <FaCcVisa size={26} /> <FaCcMastercard size={26} />
                </div>
              </div>
              {cardNumber && !isCardNumberValid && (
                <p className="text-xs text-red-500 mt-1">
                  Số thẻ không hợp lệ.
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Ngày hết hạn</label>
              <input
                value={expiry}
                onChange={(e) => setExpiry(maskExpiry(e.target.value))}
                placeholder="MM/YY"
                className={`mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 ${
                  expiry && !isExpiryValid
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {expiry && !isExpiryValid && (
                <p className="text-xs text-red-500 mt-1">Định dạng MM/YY.</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">CVV</label>
              <input
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/[^\d]/g, "").slice(0, 3))
                }
                placeholder="123"
                className={`mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 ${
                  cvv && !isCvvValid
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {cvv && !isCvvValid && (
                <p className="text-xs text-red-500 mt-1">
                  CVV 3 số mặt sau thẻ.
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2 mt-4">
            <input
              id="agree"
              type="checkbox"
              className="mt-1"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.
            </label>
          </div>
        </div>
      )}

      {method === "bank" && (
        <div className="rounded-2xl border p-4 bg-white shadow-sm">
          <label className="text-sm font-medium">Chọn ngân hàng</label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Vietcombank</option>
            <option>Techcombank</option>
            <option>MB Bank</option>
            <option>BIDV</option>
            <option>ACB</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Sau khi bấm thanh toán, bạn sẽ được chuyển đến cổng thanh toán của
            ngân hàng để xác thực giao dịch.
          </p>
          <div className="flex items-start gap-2 mt-4">
            <input
              id="agree2"
              type="checkbox"
              className="mt-1"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree2" className="text-sm text-gray-600">
              Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.
            </label>
          </div>
        </div>
      )}

      {method === "paypal" && (
        <div className="rounded-2xl border p-4 bg-white shadow-sm">
          <p className="text-sm text-gray-600">
            Bạn sẽ được chuyển đến PayPal để hoàn tất thanh toán an toàn.
          </p>
          <div className="flex items-start gap-2 mt-4">
            <input
              id="agree3"
              type="checkbox"
              className="mt-1"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree3" className="text-sm text-gray-600">
              Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
        >
          Quay lại
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!agreed || (method === "card" && !isCardNumberValid)}
          className={`px-5 py-3 rounded-xl text-white transition shadow ${
            agreed
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Xem lại & xác nhận
        </button>
      </div>
    </div>
  );

  const ReviewStep = (
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

  const SuccessStep = (
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

  // ======= PAGE LAYOUT (fits right content area) =======
  return (
    <div className="p-6 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Main content with steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stepper */}
          <div className="rounded-2xl border bg-white/80 backdrop-blur p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-4">
              <Step
                index={1}
                title="Tài khoản"
                active={step === 1}
                done={step > 1}
              />
              <Step
                index={2}
                title="Thanh toán"
                active={step === 2}
                done={step > 2}
              />
              <Step
                index={3}
                title="Xem lại"
                active={step === 3}
                done={step > 3}
              />
            </div>
            <div className="h-1 mt-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${(Math.min(step, 3) - 1) * 50 + 1}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border bg-white p-6 shadow-md">
            {step === 1 && AccountStep}
            {step === 2 && PaymentStep}
            {step === 3 && ReviewStep}
            {step === 4 && SuccessStep}
          </div>
        </div>

        {/* RIGHT: Order summary sticky */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-4">
            <div className="rounded-2xl border bg-white overflow-hidden shadow-md">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-end gap-2 mt-3">
                  <div className="text-2xl font-bold text-blue-600">
                    {currency(basePrice)}
                  </div>
                  {course.salePrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {currency(course.price)}
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{currency(basePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span className="text-emerald-600">
                      - {currency(discount)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-gray-800">
                    <span>Thành tiền</span>
                    <span>{currency(total)}</span>
                  </div>
                </div>

                {step < 4 && (
                  <button
                    onClick={() => (step < 3 ? setStep(step + 1) : handlePay())}
                    className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700"
                  >
                    {step < 3 ? "Tiếp tục" : `Thanh toán ${currency(total)}`}
                  </button>
                )}

                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FaShieldAlt /> Bảo mật bởi 256-bit SSL
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h4 className="font-semibold mb-2">Cam kết</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc ml-5">
                <li>Hoàn tiền trong 7 ngày nếu không hài lòng</li>
                <li>Hỗ trợ kỹ thuật trong quá trình học</li>
                <li>Cộng đồng học viên riêng tư</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
