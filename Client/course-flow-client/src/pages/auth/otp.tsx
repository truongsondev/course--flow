import type { FunctionComponent } from "react";
import LayoutAuthPage from "./layout-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import authenService from "@/services/authen.serivce";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const otp = data.pin.replace(/\s/g, "");
    const res = await authenService.verifyOtp({ email, otp });
    console.log(res);
    if (res.status === 200) {
      toast.success("OTP verified successfully!");
      navigate("/login");
    } else {
      toast.error("Failed to verify OTP. Please try again.");
    }
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
          <Button type="submit" className="w-full ">
            Submit
          </Button>
        </form>
      </Form>
    </LayoutAuthPage>
  );
};

export default OtpPage;
