import { EnrollmentForm } from "@/src/components/organisms/EnrollmentForm";
import { useLanguage } from "@/src/context/LanguageContext";

export default function EnrollmentTab({ studentId }: { studentId: string }) {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {t("EnrollmentPage_Tab_Enroll_Header")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("EnrollmentPage_Tab_Enroll_Desc")}
        </p>
        <div className="bg-muted p-4 rounded-md mb-4">
          <h3 className="font-medium mb-2">
            {t("EnrollmentPage_Tab_Enroll_Notes")}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>{t("EnrollmentPage_Tab_Enroll_Notes_List_1")}</li>
            <li>{t("EnrollmentPage_Tab_Enroll_Notes_List_2")}</li>
            <li>{t("EnrollmentPage_Tab_Enroll_Notes_List_3")}</li>
          </ul>
        </div>
      </div>

      <div className="bg-card shadow-sm rounded-lg border p-6">
        <EnrollmentForm initialStudentId={studentId} />
      </div>
    </div>
  );
}
