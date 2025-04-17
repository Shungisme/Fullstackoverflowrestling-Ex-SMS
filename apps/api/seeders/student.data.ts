import { ObjectId } from 'mongodb';
import { Gender } from '@prisma/client';
import { facultyId1, facultyId2, facultyId3 } from './faculty.data';
import { programId1, programId2, programId3 } from './program.data';
import { statusId1 } from './status.data';
import {
  addressId1,
  addressId2,
  addressId3,
  addressId4,
  addressId5,
} from './address.data';
import {
  identityPaperId1,
  identityPaperId2,
  identityPaperId3,
  identityPaperId4,
} from './identityPaper.data';

export const studentId1 = new ObjectId().toString();
export const studentId2 = new ObjectId().toString();
export const studentId3 = new ObjectId().toString();
export const studentId4 = new ObjectId().toString();

export const studentData = [
  {
    id: studentId1,
    studentId: 'ST001',
    name: 'Nguyen Van A',
    dateOfBirth: new Date('2000-01-01'),
    gender: Gender.MALE, // Use the enum value instead of string
    course: 2021,
    email: 'a.nguyen@example.com',
    phone: '123456789',
    nationality: 'Vietnamese',
    facultyId: facultyId1,
    programId: programId1,
    statusId: statusId1,
    permanentAddressId: addressId1,
    temporaryAddressId: addressId2,
    mailingAddressId: addressId3,
    identityPaperId: identityPaperId1,
  },
  {
    id: studentId2,
    studentId: 'ST002',
    name: 'Tran Thi B',
    dateOfBirth: new Date('2001-02-02'),
    gender: Gender.FEMALE, // Use the enum value instead of string
    course: 2021,
    email: 'b.tran@example.com',
    phone: '987654321',
    nationality: 'Vietnamese',
    facultyId: facultyId2,
    programId: programId2,
    statusId: statusId1,
    permanentAddressId: addressId4,
    temporaryAddressId: null,
    mailingAddressId: addressId4,
    identityPaperId: identityPaperId2,
  },
  {
    id: studentId3,
    studentId: 'ST003',
    name: 'Le Van C',
    dateOfBirth: new Date('2000-03-15'),
    gender: Gender.MALE, // Use the enum value instead of string
    course: 2022,
    email: 'c.le@example.com',
    phone: '456789123',
    nationality: 'Vietnamese',
    facultyId: facultyId1,
    programId: programId1,
    statusId: statusId1,
    permanentAddressId: addressId5,
    temporaryAddressId: addressId1,
    mailingAddressId: addressId5,
    identityPaperId: identityPaperId3,
  },
  {
    id: studentId4,
    studentId: 'ST004',
    name: 'Pham Thi D',
    dateOfBirth: new Date('2001-07-20'),
    gender: Gender.FEMALE, // Use the enum value instead of string
    course: 2022,
    email: 'd.pham@example.com',
    phone: '321654987',
    nationality: 'Vietnamese',
    facultyId: facultyId3,
    programId: programId3,
    statusId: statusId1,
    permanentAddressId: addressId2,
    temporaryAddressId: addressId3,
    mailingAddressId: addressId2,
    identityPaperId: identityPaperId4,
  },
];
