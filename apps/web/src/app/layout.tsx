import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import "@repo/ui/styles.css";
import { ToastProvider } from "../context/toast-context";
import { Toaster } from "../components/atoms/Sonner";
import Navbar from "../components/atoms/Navbar";
import { ThemeProvider } from "../theme/ThemeProvider";
import { StudentProvider } from "../context/StudentContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Sinh viên",
  description: "Ứng dụng quản lý thông tin sinh viên",
  icons: {
      icon: '/favicon.png',
  }
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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <StudentProvider>
              <Navbar />
              <main className="flex-1 bg-background scroll-auto">
                <div className="container mx-auto py-6 px-4 max-w-6xl">
                  {children}
                </div>
              </main>

              <footer className="bg-slate-800 text-white py-4 text-center">
                <div className="container mx-auto px-4 max-w-6xl">
                  <p>
                    © {new Date().getFullYear()} - Hệ thống Quản lý Sinh viên
                  </p>
                </div>
              </footer>
            </StudentProvider>
          </ThemeProvider>
          <Toaster richColors />
        </ToastProvider>
      </body>
    </html>
  );
}
