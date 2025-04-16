import { Faculty } from ".";

export type Course = {
    id?: string;
    code: string;
    title: string;
    credit: number;
    faculty: Faculty;
    description: string;
    status: CourseStatus;
    prerequisite?: Course[];
    createdAt?: Date;
    updatedAt?: Date;
}

export enum CourseStatus {
    ACTIVE = "activated",
    INACTIVE = "deactivated",
}

export type Class = {
    id?: string;
    code: string;
    subjectCourse: string;
    semester: string;
    maximumQuantity: number;
    classroom: string;
    classSchedule: string;
    teacher: string;
}

export type Semester = {
    id?: string;
    academicYear: string;
    semester: number;
    startDate: Date;
    endDate: Date;
}
