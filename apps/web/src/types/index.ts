export interface Student {
    studentId: string;
    name: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE";
    faculty: Faculty;
    course: number;
    program: Program;
    address?: string;
    email?: string;
    phone: string;
    status: StudentStatus;
    nationality: string;
    temporaryAddress?: Address;
    permanentAddress?: Address;
    mailingAddress: Address;
    programId?: string;
    statusId?: string;
    facultyId?: string;
    identityPaperId?: string;
    identityPaper: IdentityPapers;
}

export interface FormErrors {
    [key: string]: string | undefined;
}

export interface IAPIResponse<T> {
    statusCode: number; // shoud be typed StatusCode with defined status codes, but we go with string right now
    message: string;
    data: T;
}

export type StudentList = {
    students: Student[];
    total: number;
};

export interface StudentDataRespose extends IAPIResponse<StudentList> { }

export interface Faculty {
    id?: string;
    title: string;
    description: string;
    status: string;
}

export interface Address {
    id?: string;
    number: string;
    street: string;
    district: string;
    city: string;
    country: string;
}

export interface Program {
    id?: string;
    title: string;
    description: string;
    status: string;
}

export interface StudentStatus {
    id?: string;
    title: string;
    description: string;
    status: string;
}

export interface IdentityPapers {
    id?: string;
    type: string;
    number: string;
    issueDate: string;
    expirationDate: string;
    placeOfIssue: string;
    hasChip?: boolean;
    issuingCountry?: string;
    note?: string;
}
