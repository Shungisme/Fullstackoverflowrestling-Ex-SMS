import { ReactNode } from "react";
import { ThemeProvider } from "../theme/ThemeProvider";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">
            <div className="container mx-auto py-6 px-4">{children}</div>
          </div>
          <footer className="border-t py-4">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Student Management System -
              Fullstackoverflowrestling
            </div>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}
