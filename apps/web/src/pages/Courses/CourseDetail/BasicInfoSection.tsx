"use client";
import { useLanguage } from "@/src/context/LanguageContext";
import React from "react";
import DataSection from "./DataSection";
import { BookOpenText, Hash } from "lucide-react";
import { Course } from "@/src/types/course";

interface BasicInfoSectionProps {
  courseData: Course;
}

const BasicInfoSection = ({ courseData }: BasicInfoSectionProps) => {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DataSection
        Icon={Hash}
        title={t("CoursePage_CourseInfo_Code")}
        description={courseData.code}
      />
      <DataSection
        Icon={BookOpenText}
        title={t("CoursePage_CourseInfo_Credits")}
        description={courseData.credit}
      />
    </div>
  );
};

export default BasicInfoSection;
