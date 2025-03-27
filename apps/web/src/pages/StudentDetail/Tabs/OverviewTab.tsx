import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/atoms/Card";
import { AddressType, Student } from "@/src/types";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { TabsContent } from "@repo/ui";
import { formatDate } from "date-fns";
import { Cake, Flag } from "lucide-react";

import React from "react";
import AddressInfo from "../AddressInfo";
import AddAddressPlaceholder from "../AddAddressPlaceholder";

interface OverviewTabProps {
  student: Student;
  openAddressDialog: (type: AddressType, action: "add" | "edit") => void;
}

const OverviewTab = ({ student, openAddressDialog }: OverviewTabProps) => {
  return (
    <TabsContent value="overview" className="mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard student={student} />

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Thông tin địa chỉ</CardTitle>
            <CardDescription>
              Các địa chỉ được đăng ký của sinh viên
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mailing Address */}
            <AddressInfo
              type="mailingAddress"
              openAddressDialog={openAddressDialog}
              address={student.mailingAddress}
            />
            {/* Permanent Address */}
            {student?.permanentAddress ? (
              <AddressInfo
                type="permanentAddress"
                openAddressDialog={openAddressDialog}
                address={student.permanentAddress}
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
                address={student.temporaryAddress}
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
    </TabsContent>
  );
};

export default OverviewTab;

function InfoCard({ student }: { student: Student }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
        <CardDescription>Các thông tin cơ bản về sinh viên</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-start">
            <div className="w-32 flex-shrink-0 text-muted-foreground">
              Họ tên
            </div>
            <div className="font-medium">{student.name}</div>
          </div>

          <div className="flex items-start">
            <div className="w-32 flex-shrink-0 text-muted-foreground">
              Ngày sinh
            </div>
            <div className="flex items-center gap-2">
              <Cake size={16} className="text-muted-foreground" />
              <span>{formatDate(student.dateOfBirth, "dd/MM/yyyy")}</span>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-32 flex-shrink-0 text-muted-foreground">
              Giới tính
            </div>
            <div>{student.gender === "MALE" ? "Nam" : "Nữ"}</div>
          </div>

          <div className="flex items-start">
            <div className="w-32 flex-shrink-0 text-muted-foreground">
              Quốc tịch
            </div>
            <div className="flex items-center gap-2">
              <Flag size={16} className="text-muted-foreground" />
              <span>{student.nationality}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-semibold mb-3">MSSV</h4>
          <div className="bg-muted p-3 rounded-md font-mono text-sm">
            {student.studentId}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
