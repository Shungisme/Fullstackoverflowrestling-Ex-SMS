import { Student } from "@/src/types";
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import StudentForm from "@/src/components/organisms/StudentForm";

type AddStudentTabProps = {
    onSubmit: (student: Student) => Promise<boolean>;
    onCancel: () => void;
};

export default function AddStudentTab({ onSubmit, onCancel }: AddStudentTabProps) {
    const { faculties, statuses, programs } = useSchoolConfigContext();
    return (
        <StudentForm
            onSubmit={onSubmit}
            facultyOptions={faculties}
            programOptions={programs}
            statusOptions={statuses}
            onCancel={onCancel}
        />
    );
}
