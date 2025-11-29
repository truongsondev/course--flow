import { type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LayoutAuthPage from "./layout-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import authenService from "@/services/authen.service";
import { formSchemaReset } from "@/lib/validator";
import { useAuth } from "@/contexts/auth-context";

const ChangePasswordPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchemaReset>>({
    resolver: zodResolver(formSchemaReset),
    defaultValues: {
      userId: user?.id || "",
      oldpassword: "",
      newpassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaReset>) {
    try {
      await authenService.resetPassword(
        values.userId,
        values.newpassword,
        values.oldpassword
      );

      navigate("/auth/login");
      toast.success("Change password successfully. Please login again.");
    } catch (e) {
      toast.error("An error occurred during login. Please try again.");
    }
  }

  return (
    <LayoutAuthPage>
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="userId"
                      className="bg-transparent text-white placeholder:text-gray-300 border-b border-gray-500 rounded-none focus:ring-0 focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oldpassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Old password"
                      className="bg-transparent text-white placeholder:text-gray-300 border-b border-gray-500 rounded-none focus:ring-0 focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newpassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="New password"
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
              Reset
            </Button>

            <div className="text-center text-gray-300">
              <Button
                variant="link"
                className="text-blue-400 hover:underline ml-1"
                onClick={() => navigate("/")}
              >
                Back to home
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </LayoutAuthPage>
  );
};

export default ChangePasswordPage;
