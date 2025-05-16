import { Alert, AlertTitle } from "@/src/components/atoms/Alert";
import { useLanguage } from "@/src/context/LanguageContext";
import React from "react";

const NoCourseAlert = () => {
  const { t } = useLanguage();
  return (
    <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
      <AlertTitle>{t("CoursePage_AlertTitle")}</AlertTitle>
    </Alert>
  );
};

export default NoCourseAlert;
