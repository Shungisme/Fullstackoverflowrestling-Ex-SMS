"use client";
import { Card } from "@/src/components/atoms/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import React from "react";
import FacultySettings from "./FacultySettings";
import StudentStatusSettings from "./StudentStatusSettings";
import ProgramSettings from "./ProgramSettings";
import { useLanguage } from "@/src/context/LanguageContext";

const SettingsTabs = () => {
  const { t } = useLanguage();
  return (
    <Tabs defaultValue="faculties" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="faculties">{t("SettingsPage_FacultyTab")}</TabsTrigger>
        <TabsTrigger value="statuses">{t("SettingsPage_StatusTab")}</TabsTrigger>
        <TabsTrigger value="programs">{t("SettingsPage_ProgramTab")}</TabsTrigger>
      </TabsList>
      <TabsContent value="faculties">
        <Card className="p-6">
          <FacultySettings />
        </Card>
      </TabsContent>
      <TabsContent value="statuses">
        <Card className="p-6">
          <StudentStatusSettings />
        </Card>
      </TabsContent>
      <TabsContent value="programs">
        <Card className="p-6">
          <ProgramSettings />
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
