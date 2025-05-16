import React from "react";
import SettingsPageHeader from "./SettingsPageHeader";
import SettingsTabs from "./SettingsTabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsPageHeader />
      <SettingsTabs />
    </div>
  );
}
