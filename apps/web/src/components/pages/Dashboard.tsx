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
import { EngVietFalcutyMap, EngVietStatusMap } from "../utils/mapper";

interface DashboardProps {
  students: Student[];
}

export default function Dashboard({ students }: DashboardProps) {
  // Count students by status
  const statusCounts = students.reduce(
    (acc: Record<string, number>, student) => {
      acc[EngVietStatusMap[student.status]] =
        (acc[EngVietStatusMap[student.status]] || 0) + 1;
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
      acc[EngVietFalcutyMap[student.faculty]] =
        (acc[EngVietFalcutyMap[student.faculty]] || 0) + 1;
      return acc;
    },
    {},
  );

  const facultyData = Object.entries(facultyCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Phân bố sinh viên theo tình trạng</CardTitle>
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
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phân bố sinh viên theo khoa</CardTitle>
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
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
