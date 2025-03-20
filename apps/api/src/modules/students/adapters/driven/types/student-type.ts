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
  permanentAddressId: string;
  temporaryAddressId?: string | null;
  mailingAddressId?: string | null;
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
    this.permanentAddressId = data.permanentAddressId!;
    this.temporaryAddressId = data.temporaryAddressId ?? null;
    this.mailingAddressId = data.mailingAddressId ?? null;
    this.programId = data.programId!;
    this.statusId = data.statusId!;
    this.identityPaperId = data.identityPaperId!;
  }
}
