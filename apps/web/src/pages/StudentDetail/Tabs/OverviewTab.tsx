import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/atoms/Card";
import { AddressType, Student } from "@/src/types";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { formatDate } from "date-fns";
import { Cake, Flag } from "lucide-react";

import React from "react";
import AddressInfo from "../AddressInfo";
import AddAddressPlaceholder from "../AddAddressPlaceholder";
import { useLanguage } from "@/src/context/LanguageContext";

interface OverviewTabProps {
  student: Student;
  openAddressDialog: (type: AddressType, action: "add" | "edit") => void;
}

const OverviewTab = ({ student, openAddressDialog }: OverviewTabProps) => {
  if (!student) return <div></div>;
  const { t } = useLanguage();
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {student && <InfoCard student={student} />}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {t("OverviewTab_AddressInfo_Title")}
          </CardTitle>
          <CardDescription>
            {t("OverviewTab_AddressInfo_HeaderDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mailing Address */}
          <AddressInfo
            type="mailingAddress"
            openAddressDialog={openAddressDialog}
            address={student?.mailingAddress}
          />
          {/* Permanent Address */}
          {student?.permanentAddress ? (
            <AddressInfo
              type="permanentAddress"
              openAddressDialog={openAddressDialog}
              address={student?.permanentAddress}
            />
          ) : (
            <AddAddressPlaceholder
              openAddressDialog={openAddressDialog}
              type="permanentAddress"
            />
          )}
          {/* Temporary Address */}
          {student?.temporaryAddress ? (
            <AddressInfo
              type="temporaryAddress"
              openAddressDialog={openAddressDialog}
              address={student?.temporaryAddress}
            />
          ) : (
            <AddAddressPlaceholder
              openAddressDialog={openAddressDialog}
              type="temporaryAddress"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;

function InfoCard({ student }: { student: Student }) {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {t("OverviewTab_InfoCard_Title")}
        </CardTitle>
        <CardDescription>
          {t("OverviewTab_InfoCard_HeaderDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-start">
            <div className="w-32 flex-shrink-0 text-muted-foreground">
              {t("studentName")}
            </div>
            <div className="font-medium">{student?.name}</div>
          </div>

          <div className="flex items-start">
            <div className="w-32 flex-shrink-0 text-muted-foreground">
              {t("studentDOB")}
            </div>
            <div className="flex items-center gap-2">
              <Cake size={16} className="text-muted-foreground" />
              <span>{formatDate(student?.dateOfBirth, "dd/MM/yyyy")}</span>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-32 flex-shrink-0 text-muted-foreground">
              {t("studentGender")}
            </div>
            <div>{student?.gender === "MALE" ? "Nam" : "Nữ"}</div>
          </div>

          <div className="flex items-start">
            <div className="w-32 flex-shrink-0 text-muted-foreground">
              {t("studentNationality")}
            </div>
            <div className="flex items-center gap-2">
              <Flag size={16} className="text-muted-foreground" />
              <span>{student?.nationality}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-semibold mb-3">{t("studentId")}</h4>
          <div className="bg-muted p-3 rounded-md font-mono text-sm">
            {student?.studentId}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
