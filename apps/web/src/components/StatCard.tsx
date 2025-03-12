import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <Card className="p-4 rounded-lg shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
