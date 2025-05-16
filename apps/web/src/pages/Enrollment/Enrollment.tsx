import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/atoms/Tabs";
import { EnrollmentManagement } from "@/src/components/organisms/EnrollmentManagement";
import { useLanguage } from "@/src/context/LanguageContext";
import EnrollmentTab from "./EnrollmentTab";
import TranscriptTab from "./TranscriptTab";

export default function Enrollment({ studentId }: { studentId?: string }) {
  const { t } = useLanguage();
  const defaultTab = studentId ? "manage" : "enroll";
  if (!studentId) {
    return <div>{t("notiNodata")}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t("EnrollmentPage_Header")}</h1>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="enroll">
            {t("EnrollmentPage_Tabs_Enroll")}
          </TabsTrigger>
          <TabsTrigger value="manage">
            {t("EnrollmentPage_Tabs_Manage")}
          </TabsTrigger>
          <TabsTrigger value="transcript">
            {t("EnrollmentPage_Tabs_Transcript")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enroll" className="space-y-4">
          <EnrollmentTab studentId={studentId} />
        </TabsContent>

        <TabsContent value="manage">
          <EnrollmentManagement studentId={studentId || ""} />
        </TabsContent>

        <TabsContent value="transcript">
          <TranscriptTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
