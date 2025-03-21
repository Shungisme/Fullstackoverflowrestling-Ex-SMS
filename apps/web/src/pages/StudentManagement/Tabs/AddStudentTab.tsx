import { Student } from "@/src/types";
import AddStudentForm from "@/src/components/organisms/AddStudentForm";

type AddStudentTabProps = {
  onSubmit: (student: Student) => Promise<boolean>;
};

export default function AddStudentTab({ onSubmit }: AddStudentTabProps) {
  return <AddStudentForm onSubmit={onSubmit} />;
}
