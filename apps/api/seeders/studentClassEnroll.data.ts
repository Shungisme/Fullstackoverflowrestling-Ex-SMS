import { ObjectId } from 'mongodb';
import { EnrollEnum } from '@prisma/client';

export const enrollId1 = new ObjectId().toString();
export const enrollId2 = new ObjectId().toString();
export const enrollId3 = new ObjectId().toString();
export const enrollId4 = new ObjectId().toString();
export const enrollId5 = new ObjectId().toString();
export const enrollId6 = new ObjectId().toString();
export const enrollId7 = new ObjectId().toString();
export const enrollId8 = new ObjectId().toString();
export const enrollId9 = new ObjectId().toString();
export const enrollId10 = new ObjectId().toString();
export const enrollId11 = new ObjectId().toString();

export const studentClassEnrollData = [
  {
    id: enrollId1,
    studentId: 'ST001',
    classCode: 'CS101-A',
    type: EnrollEnum.COMPLETE,
  },
  {
    id: enrollId2,
    studentId: 'ST001',
    classCode: 'CS201-A',
    type: EnrollEnum.COMPLETE,
  },
  {
    id: enrollId3,
    studentId: 'ST001',
    classCode: 'BA101-A',
    type: EnrollEnum.DROP,
  },
  {
    id: enrollId4,
    studentId: 'ST002',
    classCode: 'CS101-B',
    type: EnrollEnum.COMPLETE,
  },
  {
    id: enrollId5,
    studentId: 'ST002',
    classCode: 'LA101-A',
    type: EnrollEnum.COMPLETE,
  },
  {
    id: enrollId6,
    studentId: 'ST002',
    classCode: 'BA101-A',
    type: EnrollEnum.FAIL,
  },
  {
    id: enrollId7,
    studentId: 'ST003',
    classCode: 'CS101-A',
    type: EnrollEnum.COMPLETE,
  },
  {
    id: enrollId8,
    studentId: 'ST003',
    classCode: 'CS201-A',
    type: EnrollEnum.COMPLETE,
  },
  {
    id: enrollId9,
    studentId: 'ST003',
    classCode: 'CS301-A',
    type: EnrollEnum.COMPLETE,
  },
  {
    id: enrollId10,
    studentId: 'ST004',
    classCode: 'BA101-A',
    type: EnrollEnum.COMPLETE,
  },
  {
    id: enrollId11,
    studentId: 'ST004',
    classCode: 'BA201-A',
    type: EnrollEnum.COMPLETE,
  },
];
