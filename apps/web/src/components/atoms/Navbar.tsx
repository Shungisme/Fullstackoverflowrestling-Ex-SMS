import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <Link href="/" className="text-xl font-bold">
                        Quản lý sinh viên
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-foreground hover:text-primary transition-colors"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/courses"
                        className="text-foreground hover:text-primary transition-colors"
                    >
                        Khóa học
                    </Link>

                    <Link
                        href="/settings"
                        className="text-foreground hover:text-primary transition-colors"
                    >
                        Cài đặt
                    </Link>
                </nav>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
