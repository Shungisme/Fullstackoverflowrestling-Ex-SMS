import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css"
import "@repo/ui/styles.css"
import { ToastProvider } from "../context/toast-context";
import { Toaster } from "../components/atoms/Sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Sinh viên",
  description: "Ứng dụng quản lý thông tin sinh viên",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ToastProvider>
          <header className="bg-slate-800 text-white py-4">
            <div className="container mx-auto px-4 max-w-6xl">
              <h1 className="text-2xl font-bold">Quản Lý Sinh Viên</h1>
            </div>
          </header>

          <main className="flex-1 bg-background scroll-auto">
            <div className="container mx-auto py-6 px-4 max-w-6xl">
              {children}
            </div>
          </main>

          <footer className="bg-slate-800 text-white py-4 text-center">
            <div className="container mx-auto px-4 max-w-6xl">
              <p>© {new Date().getFullYear()} - Hệ thống Quản lý Sinh viên</p>
            </div>
          </footer>
          <Toaster richColors />
        </ToastProvider>
      </body>
    </html>
  );
}
