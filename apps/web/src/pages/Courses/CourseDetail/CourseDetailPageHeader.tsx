"use client";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { CardTitle } from "@/src/components/atoms/Card";
import { useLanguage } from "@/src/context/LanguageContext";
import { Course, CourseStatus } from "@/src/types/course";
import { Pencil } from "lucide-react";
import React from "react";

interface CourseDetailPageHeaderProps {
  courseData: Course;
  courseId: string;
}

const CourseDetailPageHeader = ({
  courseData,
  courseId,
}: CourseDetailPageHeaderProps) => {
  const { t } = useLanguage();
  const statusVariant =
    courseData.status === CourseStatus.ACTIVE ? "default" : "destructive";
  const statusText =
    courseData.status === CourseStatus.ACTIVE
      ? t("CoursesList_CourseTable_Status_Active")
      : t("CoursesList_CourseTable_Status_Inactive");

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <CardTitle className="text-2xl font-bold text-slate-800">
          {courseData.title}
        </CardTitle>
        <div className="text-lg text-slate-600 mt-1">
          {courseData.faculty.title}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={statusVariant} className="text-sm">
          {statusText}
        </Badge>
        <Button asChild variant="outline" className="gap-2">
          <a href={`/courses/${courseId}/edit`}>
            <Pencil className="h-4 w-4" />
            <span>{t("CoursePage_EditButton")}</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default CourseDetailPageHeader;
