import { Student } from "@/src/types";
import EditStudentForm from "@/src/components/organisms/EditStudentForm";
import { FacultyService, ProgramService, StudentStatusService } from "@/src/lib/api/school-service";

type EditStudentTabProps = {
  student: Student;
  onSubmit: (student: Student) => Promise<void>;
  onCancel: () => void;
};

export default async function EditStudentTab({ 
  student, 
  onSubmit, 
  onCancel 
}: EditStudentTabProps) {
    const [facultyRes, programRes, statusRes] = await Promise.all([
        FacultyService.getAll(),
        ProgramService.getAll(),
        StudentStatusService.getAll(),
    ]);
  return (
    <EditStudentForm
      student={student}
      onSubmit={onSubmit}
      onCancel={onCancel}
      facultyOptions={facultyRes.data.data}
      programOptions={programRes.data.data}
      statusOptions={statusRes.data.data}
    />
  );
}
