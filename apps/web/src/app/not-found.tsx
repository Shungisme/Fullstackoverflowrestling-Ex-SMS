import { Compass, Construction, Home, Rocket } from "lucide-react";
import React from "react";
import { Button } from "../components/atoms/Button";

const NotFound = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 number */}
        <div className="relative mb-8">
          <span className="text-9xl font-bold text-blue-600 opacity-20 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Construction className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Không tìm thấy trang
              </h1>
              <p className="text-lg text-slate-600">
                Trang bạn đang tìm kiếm có thể đã bị di chuyển hoặc không tồn
                tại
              </p>
            </div>
          </div>
        </div>

        {/* Suggested actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center justify-center gap-2">
            <Compass className="h-5 w-5 text-blue-500" />
            Bạn có thể thử:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              asChild
              variant="outline"
              className="h-auto py-3 flex-col gap-2"
            >
              <a href="/">
                <Home className="h-5 w-5" />
                <span>Trang chủ</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto py-3 flex-col gap-2"
            >
              <a href="/courses">
                <Rocket className="h-5 w-5" />
                <span>Khóa học</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto py-3 flex-col gap-2"
            >
              <a href="/search">
                <Compass className="h-5 w-5" />
                <span>Tìm kiếm</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Contact support */}
        <div className="text-slate-500 text-sm">
          <p>Nếu bạn tin rằng đây là lỗi hệ thống, vui lòng liên hệ</p>
          <Button asChild variant="link" className="text-blue-600">
            <a href="/contact">bộ phận hỗ trợ</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
