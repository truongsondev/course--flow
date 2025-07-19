import type { FunctionComponent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiFillFacebook, AiFillGoogleCircle } from "react-icons/ai";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LayoutAuthPage from "./layout-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { formRegisterSchema } from "@/lib/validator";
import type z from "zod";

interface LoginPageProps {}

const RegisterPage: FunctionComponent<LoginPageProps> = () => {
  const form = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: { email: "", name: "" },
  });

  return (
    <LayoutAuthPage title="Welcome To Course Flow">
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit((values) => console.log(values))}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      {...field}
                      placeholder="Your full Name"
                      className=" border-0 border-b-[0.8px] border-b-gray-400 rounded-none focus-visible:outline-none focus-visible:ring-0  shadow-none"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      {...field}
                      placeholder="email"
                      className=" border-0 border-b-[0.8px] border-b-gray-400 rounded-none focus-visible:outline-none focus-visible:ring-0  shadow-none"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          {/* Nút đăng nhập, đăng ký, đăng nhập bằng Google và Facebook */}
          <Button
            type="submit"
            className="w-full bg-[#0099FF] cursor-pointer hover:bg-white hover:text-[#0099FF] hover:border-[#0099FF] border-2 border-[#0099FF]"
          >
            Register
          </Button>

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

export default RegisterPage;
