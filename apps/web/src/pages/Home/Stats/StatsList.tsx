import { Student } from "../../../types";
import StatCard from "./StatCard";
import { Users2, Rows, BarChart4 } from "lucide-react";
interface StatsListProps {
  students: Student[];
}

export default function StatsList({ students }: StatsListProps) {
  if (!Array.isArray(students)) return null;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tổng sinh viên"
        value={students.length}
        description="Tổng số sinh viên trong hệ thống"
        Icon={Users2}
      />
      <StatCard
        title="Đang học"
        value={students.filter((s) => s.status.title === "Đang học").length}
        description="Sinh viên đang học tập"
        Icon={Rows}
      />
      <StatCard
        title="Tốt nghiệp"
        value={students.filter((s) => s.status.title === "Tốt nghiệp").length}
        description="Sinh viên đã tốt nghiệp"
        Icon={BarChart4}
      />
      <StatCard
        title="Tỷ lệ tốt nghiệp"
        value={
          students.length
            ? Math.round(
                (students.filter((s) => s.status.title === "Tốt nghiệp").length /
                  students.length) *
                  100
              ) + "%"
            : "0%"
        }
        description="Phần trăm sinh viên tốt nghiệp"
        Icon={BarChart4}
      />
    </div>
  );
}
