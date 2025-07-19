import type { FunctionComponent } from "react";
import LayoutAuthPage from "./layout-auth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpPageProps {}

const OtpPage: FunctionComponent<OtpPageProps> = () => {
  return (
    <>
      <LayoutAuthPage title="Enter OTP">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </LayoutAuthPage>
    </>
  );
};

export default OtpPage;
