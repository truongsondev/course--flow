import type { FunctionComponent } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AiFillFacebook, AiFillGoogleCircle } from "react-icons/ai";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LayoutAuthPage from "./layout-auth";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/validator";
import authenService from "@/services/authen.service";
import { toast } from "sonner";
interface LoginPageProps {}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await authenService.login(values);
      const at = res.data.data.accessToken;
      const rt = res.data.data.refreshToken;
      const user = res.data.data.user;
      localStorage.setItem("at", at);
      localStorage.setItem("rt", rt);
      localStorage.setItem("user", user);
      toast.message("Login success");
      navigate("/");
    } catch (e) {}
    console.log(values);
  }
  return (
    <LayoutAuthPage title="Welcome Back">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      {...field}
                      placeholder="Email"
                      className=" border-0 border-b-[0.8px] border-b-gray-400 rounded-none focus-visible:outline-none focus-visible:ring-0  shadow-none"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      {...field}
                      autoComplete="false"
                      type="password"
                      placeholder="password"
                      className=" border-0 border-b-[0.8px] border-b-gray-400 rounded-none focus-visible:outline-none focus-visible:ring-0  shadow-none"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Các tùy chọn đăng nhập */}
          {/* Nhớ mật khẩu, quên mật khẩu, nút đăng nhập */}
          <div className="flex justify-between items-center w-full text-sm text-[#0099FF]">
            <div className="flex items-center justify-center gap-2">
              {" "}
              <Checkbox />
              <span>Remember me</span>
            </div>
            {/* <span>Forgot password</span> */}
          </div>
          {/* Nút đăng nhập, đăng ký, đăng nhập bằng Google và Facebook */}
          <Button
            type="submit"
            className="w-full bg-[#0099FF] cursor-pointer hover:bg-white hover:text-[#0099FF] hover:border-[#0099FF] border-2 border-[#0099FF]"
          >
            Login
          </Button>
          <span>
            Don't you have an account?
            <Button
              className="hover:cursor-pointer"
              variant="link"
              onClick={() => navigate("/register")}
            >
              Click here
            </Button>
          </span>
          <div className="w-full flex justify-between items-center gap-2">
            <Button variant="outline" className="hover:cursor-pointer w-[50%]">
              <AiFillGoogleCircle color="#0099FF" />
              <span>Google</span>
            </Button>
            <Button variant="outline" className="hover:cursor-pointer w-[50%]">
              <AiFillFacebook color="#0099FF" />
              <span>Facebook</span>
            </Button>
          </div>
        </form>
      </Form>
    </LayoutAuthPage>
  );
};

export default LoginPage;
