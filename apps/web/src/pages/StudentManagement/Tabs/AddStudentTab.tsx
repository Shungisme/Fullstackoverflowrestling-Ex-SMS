import { Student } from "@/src/types";
import AddStudentForm from "@/src/components/organisms/AddStudentForm";
import {
    FacultyService,
    ProgramService,
    StudentStatusService,
} from "@/src/lib/api/school-service";

type AddStudentTabProps = {
    onSubmit: (student: Student) => Promise<boolean>;
};

export default async function AddStudentTab({ onSubmit }: AddStudentTabProps) {
    const [facultyRes, programRes, statusRes] = await Promise.all([
        FacultyService.getAll(),
        ProgramService.getAll(),
        StudentStatusService.getAll(),
    ]);
    return (
        <AddStudentForm
            onSubmit={onSubmit}
            facultyOptions={facultyRes.data.data}
            programOptions={programRes.data.data}
            statusOptions={statusRes.data.data}
        />
    );
}
