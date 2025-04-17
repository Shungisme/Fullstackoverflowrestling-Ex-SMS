import { Faculty, Student } from ".";

export type Course = {
    id?: string;
    code: string;
    title: string;
    credit: number;
    faculty: Faculty;
    facultyId: string;
    description: string;
    status: CourseStatus;
    prerequisite?: Course[];
    createdAt?: Date;
    updatedAt?: Date;
}

export enum CourseStatus {
    ACTIVE = "ACTIVATED",
    INACTIVE = "DEACTIVATED",
}

export type Class = {
    id?: string;
    code: string;
    subjectCode: string;
    subject: Course;
    semester: Semester;
    maximumQuantity: number;
    classroom: string;
    classSchedule: string;
    teacher: string;
}

export type ClassResult = {
    id?: string;
    student: Student;
    class: Class;
    type: "MIDTERM" | "FINALTERM" | "OTHER";
    factor: number;
    score: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type Semester = {
    id?: string;
    academicYear: string;
    semester: number;
    startDate: Date;
    endDate: Date;
}
