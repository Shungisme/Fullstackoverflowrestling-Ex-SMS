import { Gender } from '@prisma/client';

export class Student {
  studentId: string;
  name: string;
  dateOfBirth: Date;
  gender: Gender;
  course: number;
  email: string;
  phone: string;
  nationality: string;
  facultyId: string;
  permanentAddressId?: string | null;
  temporaryAddressId?: string | null;
  mailingAddressId: string;
  programId: string;
  statusId: string;
  identityPaperId: string;

  constructor(data: Partial<Student>) {
    this.studentId = data.studentId!;
    this.name = data.name!;
    this.dateOfBirth = data.dateOfBirth!;
    this.gender = data.gender!;
    this.course = data.course!;
    this.email = data.email!;
    this.phone = data.phone!;
    this.nationality = data.nationality!;
    this.facultyId = data.facultyId!;
    this.permanentAddressId = data.permanentAddressId ?? null;
    this.temporaryAddressId = data.temporaryAddressId ?? null;
    this.mailingAddressId = data.mailingAddressId!;
    this.programId = data.programId!;
    this.statusId = data.statusId!;
    this.identityPaperId = data.identityPaperId!;
  }
}

export class AddressResponse {
  id: string;
  number: string;
  street: string;
  district: string;
  city: string;
  country: string;
}

export class ProgramResponse {
  id: string;
  title: string;
}

export class StatusResponse {
  id: string;
  title: string;
}

export class IdentityPaperResponse {
  id: string;
  type: string;
  number: string;
  issueDate: Date;
  expirationDate: Date;
  placeOfIssue: string;
  hasChip?: boolean | null;
  issuingCountry?: string | null;
  notes?: string | null;
}

export class FacultyResponse {
  id: string;
  title: string;
}

export class StudentResponse {
  studentId: string;
  name: string;
  dateOfBirth: Date;
  gender: string;
  course: number;
  email: string;
  phone: string;
  nationality: string;
  faculty: FacultyResponse;
  permanentAddress?: AddressResponse | null;
  temporaryAddress?: AddressResponse | null;
  mailingAddress: AddressResponse;
  program: ProgramResponse;
  status: StatusResponse;
  identityPaper: IdentityPaperResponse;
}
