import { Student } from "@/src/types";
import EditStudentForm from "@/src/components/organisms/EditStudentForm";

type EditStudentTabProps = {
  student: Student;
  onSubmit: (student: Student) => Promise<void>;
  onCancel: () => void;
};

export default function EditStudentTab({ 
  student, 
  onSubmit, 
  onCancel 
}: EditStudentTabProps) {
  return (
    <EditStudentForm
      student={student}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}
