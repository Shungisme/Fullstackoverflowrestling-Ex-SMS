"use client";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Navbar() {
 const { t } = useLanguage();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold">
            {t("navAppName")}
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            {t("navDashboard")}
          </Link>

          <Link
            href="/courses"
            className="text-foreground hover:text-primary transition-colors"
          >
            {t("navCourses")}
          </Link>

          <Link
            href="/student-results"
            className="text-foreground hover:text-primary transition-colors"
          >
            {t("navStudentResults")}
          </Link>

          <Link
            href="/settings"
            className="text-foreground hover:text-primary transition-colors"
          >
            {t("navSettings")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
