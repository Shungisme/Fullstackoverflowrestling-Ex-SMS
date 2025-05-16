"use client";
import { Course } from "@/src/types/course";
import React from "react";
import DataSection from "./DataSection";
import { CalendarCheck, CalendarDays } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { formatDate } from "date-fns";

interface TimelineSectionProps {
  courseData: Course;
}

const TimelineSection = ({ courseData }: TimelineSectionProps) => {
  if (!courseData) return null;
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DataSection
        icon={<CalendarDays className="w-6 h-6 text-slate-500 mt-0.5" />}
        title={t("CoursePage_CourseInfo_DayCreated")}
        description={
          courseData.createdAt
            ? formatDate(courseData.createdAt, "dd/MM/yyyy HH:mm")
            : undefined
        }
      />
      <DataSection
        icon={<CalendarCheck className="w-6 h-6 text-slate-500 mt-0.5" />}
        title={t("CoursePage_CourseInfo_LastUpdated")}
        description={
          courseData.updatedAt
            ? formatDate(courseData.updatedAt, "dd/MM/yyyy HH:mm")
            : undefined
        }
      />
    </div>
  );
};

export default TimelineSection;
