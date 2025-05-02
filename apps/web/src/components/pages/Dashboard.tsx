import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Student } from "../../types";
import { useLanguage } from "@/src/context/LanguageContext";
interface DashboardProps {
  students: Student[];
}

export default function Dashboard({ students }: DashboardProps) {
  // Count students by status
  if (!students) return <div></div>;
  const statusCounts = students.reduce(
    (acc: Record<string, number>, student) => {
      acc[student.status.title] = (acc[student.status.title] || 0) + 1;
      return acc;
    },
    {},
  );

  // Convert to array for charting
  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Count students by faculty
  const facultyCounts = students.reduce(
    (acc: Record<string, number>, student) => {
      acc[student.faculty.title] = (acc[student.faculty.title] || 0) + 1;
      return acc;
    },
    {},
  );

  const facultyData = Object.entries(facultyCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Dashboard_StatusChartTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[300px] text-muted-foreground">
              {t("notiNodata")}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("Dashboard_FacultyChartTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={facultyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[300px] text-muted-foreground">
              {t("notiNodata")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
