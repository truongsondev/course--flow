import type { FunctionComponent } from "react";
import LayoutAuthPage from "./layout-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import authenService from "@/services/authen.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

interface OtpPageProps {}

const OtpPage: FunctionComponent<OtpPageProps> = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ttl, setTtl] = useState(60);
  const email = sessionStorage.getItem("email") || "";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });
  useEffect(() => {
    const token = searchParams.get("token") || "";
    if (!token) {
      navigate("/");
      return;
    }
    const fetchTtl = async () => {
      try {
        const res = await authenService.getTTL(token);
        const data = res.data.data.ttl;
        setTtl(data);
      } catch (err) {
        toast("Server error. Please register again.");
        navigate("/register");
      }
    };
    fetchTtl();
  });

  useEffect(() => {
    if (ttl <= 0) return;
    const timer = setInterval(() => {
      setTtl((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [ttl]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (email === "" || !email) {
        toast.error("Email not found. Please register first.");
        navigate("/register");
        return;
      }

      const otp = data.pin.replace(/\s/g, "");
      const res = await authenService.verifyOtp({ email, otp });
      if (res.status === 200) {
        toast.success("OTP verified successfully!");
        navigate("/login");
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    } catch (error) {}
  }

  function handleResendOtp() {
    toast.success("OTP has been resent to your email!");
  }

  return (
    <LayoutAuthPage title="Verify Your Account">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            {ttl > 0 ? (
              <span className="text-sm text-gray-500">
                Resend available in <span className="text-red-500">{ttl}s</span>
              </span>
            ) : (
              <Button type="button" variant="outline" onClick={handleResendOtp}>
                Resend OTP
              </Button>
            )}
          </div>

          <Button type="submit" className="w-full bg-[#0099FF]">
            Submit
          </Button>
        </form>
      </Form>
    </LayoutAuthPage>
  );
};
export default OtpPage;
