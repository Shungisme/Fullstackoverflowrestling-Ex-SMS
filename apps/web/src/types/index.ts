export interface Student {
    id?: string;
    studentId: string;
    name: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE";
    faculty: Faculty;
    course: number;
    program: Program;
    email: string;
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
    mailingAddressId?: string;
}

export interface FormErrors {
    [key: string]: string | undefined;
}

export interface IAPIResponse<T> {
    statusCode: number; // shoud be typed StatusCode with defined status codes, but we go with string right now
    message: string;
    data: T;
}

export interface APIError {
    statusCode: number;
    message: string;
    errors: ResponseError[];
}

type ResponseError = {
    code: string;
    message: string;
    path: string[];
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
    updatedAt?: Date;
    createdAt?: Date;
}
export type AddressType = "mailingAddress" | "permanentAddress" | "temporaryAddress";

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
    updatedAt?: Date;
    createdAt?: Date;
}

export interface StudentStatus {
    id?: string;
    title: string;
    description: string;
    status: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export type IdentityPaperType = "CMND" | "CCCD" | "PASSPORT";

export interface IdentityPapers {
    id?: string;
    type: IdentityPaperType;
    number: string;
    issueDate: string;
    expirationDate: string;
    placeOfIssue: string;
    hasChip?: boolean;
    issuingCountry?: string;
    note?: string;
    updatedAt?: Date;
    createdAt?: Date;
}
