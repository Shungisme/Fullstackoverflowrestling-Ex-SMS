"use client";
import { useLanguage } from "@/src/context/LanguageContext";
import { Student } from "../../../types";
import StatCard from "./StatCard";
import { Users2, Rows, BarChart4 } from "lucide-react";
interface StatsListProps {
  students: Student[];
}

export default function StatsList({ students }: StatsListProps) {
  if (!Array.isArray(students)) return <div></div>;
  const { t } = useLanguage();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("statTotalStudents")}
        value={students.length}
        description={t("statTotalStudentsDesc")}
        Icon={Users2}
      />
      <StatCard
        title={t("statStudying")}
        value={students.filter((s) => s.status.title === "Đang học").length}
        description={t("statStudyingDesc")}
        Icon={Rows}
      />
      <StatCard
        title={t("statGraduated")}
        value={students.filter((s) => s.status.title === "Tốt nghiệp").length}
        description={t("statGraduatedDesc")}
        Icon={BarChart4}
      />
      <StatCard
        title={t("statGraduationRate")}
        value={
          students.length
            ? Math.round(
                (students.filter((s) => s.status.title === "Tốt nghiệp")
                  .length /
                  students.length) *
                  100,
              ) + "%"
            : "0%"
        }
        description={t("statGraduationRateDesc")}
        Icon={BarChart4}
      />
    </div>
  );
}
