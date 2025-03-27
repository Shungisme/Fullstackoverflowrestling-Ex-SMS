import { Student } from "@/src/types";
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import StudentForm from "@/src/components/organisms/StudentForm";

type EditStudentTabProps = {
    student: Student;
    onSubmit: (student: Student) => Promise<boolean>;
    onCancel: () => void;
};

export default async function EditStudentTab({
    student,
    onSubmit,
    onCancel,
}: EditStudentTabProps) {
    const { faculties, statuses, programs } = useSchoolConfigContext();

    return (
        <StudentForm
            student={student}
            onSubmit={onSubmit}
            onCancel={onCancel}
            facultyOptions={faculties}
            programOptions={programs}
            statusOptions={statuses}
        />
    );
}
