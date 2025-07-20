import type { FunctionComponent, ReactNode } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Toaster } from "sonner";
interface LayoutAuthPageProps {
  children: ReactNode;
  title: string;
}
const LayoutAuthPage: FunctionComponent<LayoutAuthPageProps> = ({
  children,
  title,
}) => {
  return (
    <Card className="min-h-screen flex flex-col justify-center items-center overflow-auto">
      <Toaster />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center h-full">
        {/* Hình ảnh chỉ hiển thị ở md trở lên */}
        <CardContent className="hidden md:flex justify-center items-center overflow-y-auto ">
          <img src="login-backgroud.png" alt="logo-authentication" />
        </CardContent>
        <CardContent className="flex flex-col justify-center items-start h-full gap-6">
          {/* Tiêu đề đăng nhập */}
          <div className="flex flex-col items-start">
            <CardTitle className="leading-tight text-4xl font-bold">
              Hello,
            </CardTitle>
            <CardTitle className="leading-tight text-4xl font-bold">
              {title}
            </CardTitle>
          </div>
          {/* Form authen */}
          {children}
        </CardContent>
      </div>
    </Card>
  );
};

export default LayoutAuthPage;
