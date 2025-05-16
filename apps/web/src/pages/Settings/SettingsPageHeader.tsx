"use client";
import { useLanguage } from "@/src/context/LanguageContext";
import React from "react";

const SettingsPageHeader = () => {
  const { t } = useLanguage();
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">
        {t("SettingsPage_Title")}
      </h2>
      <p className="text-muted-foreground mt-2">{t("SettingsPage_Desc")}</p>
    </div>
  );
};

export default SettingsPageHeader;
