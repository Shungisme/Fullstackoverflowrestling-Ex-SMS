"use client";
import React from "react";
import DataSection from "./DataSection";
import { Info } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { Course } from "@/src/types/course";

interface DescriptionSectionProps {
  courseData: Course;
}

const DescriptionSection = ({ courseData }: DescriptionSectionProps) => {
  const { t } = useLanguage();
  return (
    <DataSection
      icon={<Info className="w-6 h-6 text-slate-500 mt-0.5" />}
      title={t("CoursePage_CourseInfo_Desc")}
      description={courseData ? courseData.description : ""}
    />
  );
};

export default DescriptionSection;
