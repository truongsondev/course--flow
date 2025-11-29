import type { FunctionComponent } from "react";
import LayoutAuthPage from "./layout-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import authenService from "@/services/authen.service";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required.",
  }),
});

const ForgetPasswordPage: FunctionComponent = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleSubmit() {
    try {
      await authenService.forget(form.getValues("email"));
      toast.success("The new password has been sent to your email.");
      navigate("/auth/login");
    } catch (e) {
      toast.error("An error occurred. Please try again.");
    }
  }

  return (
    <LayoutAuthPage>
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Forget Password
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 text-white"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      className="bg-transparent text-white placeholder:text-gray-300 border-b border-gray-500 rounded-none focus:ring-0 focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </LayoutAuthPage>
  );
};

export default ForgetPasswordPage;
