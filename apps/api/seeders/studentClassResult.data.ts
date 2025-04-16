import { ObjectId } from 'mongodb';
import { ResultEnum } from '@prisma/client';

export const resultId1 = new ObjectId().toString();
export const resultId2 = new ObjectId().toString();
export const resultId3 = new ObjectId().toString();
export const resultId4 = new ObjectId().toString();
export const resultId5 = new ObjectId().toString();
export const resultId6 = new ObjectId().toString();
export const resultId7 = new ObjectId().toString();
export const resultId8 = new ObjectId().toString();
export const resultId9 = new ObjectId().toString();
export const resultId10 = new ObjectId().toString();
export const resultId11 = new ObjectId().toString();
export const resultId12 = new ObjectId().toString();
export const resultId13 = new ObjectId().toString();
export const resultId14 = new ObjectId().toString();
export const resultId15 = new ObjectId().toString();
export const resultId16 = new ObjectId().toString();
export const resultId17 = new ObjectId().toString();

export const studentClassResultData = [
  // Results for ST001 in CS101-A
  {
    id: resultId1,
    studentId: 'ST001',
    classCode: 'CS101-A',
    type: ResultEnum.MIDTERM,
    factor: 0.3,
    score: 85.5,
  },
  {
    id: resultId2,
    studentId: 'ST001',
    classCode: 'CS101-A',
    type: ResultEnum.FINALTERM,
    factor: 0.7,
    score: 92.0,
  },

  // Results for ST001 in CS201-A
  {
    id: resultId3,
    studentId: 'ST001',
    classCode: 'CS201-A',
    type: ResultEnum.MIDTERM,
    factor: 0.3,
    score: 78.0,
  },
  {
    id: resultId4,
    studentId: 'ST001',
    classCode: 'CS201-A',
    type: ResultEnum.FINALTERM,
    factor: 0.7,
    score: 85.5,
  },

  // Results for ST002 in CS101-B
  {
    id: resultId5,
    studentId: 'ST002',
    classCode: 'CS101-B',
    type: ResultEnum.MIDTERM,
    factor: 0.3,
    score: 76.5,
  },
  {
    id: resultId6,
    studentId: 'ST002',
    classCode: 'CS101-B',
    type: ResultEnum.FINALTERM,
    factor: 0.7,
    score: 81.0,
  },

  // Results for ST002 in LA101-A
  {
    id: resultId7,
    studentId: 'ST002',
    classCode: 'LA101-A',
    type: ResultEnum.MIDTERM,
    factor: 0.3,
    score: 90.0,
  },
  {
    id: resultId8,
    studentId: 'ST002',
    classCode: 'LA101-A',
    type: ResultEnum.FINALTERM,
    factor: 0.7,
    score: 94.5,
  },

  // Results for ST003 in CS101-A
  {
    id: resultId9,
    studentId: 'ST003',
    classCode: 'CS101-A',
    type: ResultEnum.MIDTERM,
    factor: 0.3,
    score: 82.0,
  },
  {
    id: resultId10,
    studentId: 'ST003',
    classCode: 'CS101-A',
    type: ResultEnum.FINALTERM,
    factor: 0.7,
    score: 88.5,
  },

  // Results for ST003 in CS201-A
  {
    id: resultId11,
    studentId: 'ST003',
    classCode: 'CS201-A',
    type: ResultEnum.MIDTERM,
    factor: 0.3,
    score: 79.5,
  },
  {
    id: resultId12,
    studentId: 'ST003',
    classCode: 'CS201-A',
    type: ResultEnum.FINALTERM,
    factor: 0.7,
    score: 83.0,
  },

  // Results for ST004 in BA101-A
  {
    id: resultId13,
    studentId: 'ST004',
    classCode: 'BA101-A',
    type: ResultEnum.MIDTERM,
    factor: 0.3,
    score: 88.5,
  },
  {
    id: resultId14,
    studentId: 'ST004',
    classCode: 'BA101-A',
    type: ResultEnum.FINALTERM,
    factor: 0.7,
    score: 91.0,
  },

  // Results for ST004 in BA201-A with an additional OTHER result
  {
    id: resultId15,
    studentId: 'ST004',
    classCode: 'BA201-A',
    type: ResultEnum.MIDTERM,
    factor: 0.3,
    score: 86.0,
  },
  {
    id: resultId16,
    studentId: 'ST004',
    classCode: 'BA201-A',
    type: ResultEnum.FINALTERM,
    factor: 0.5,
    score: 89.5,
  },
  {
    id: resultId17,
    studentId: 'ST004',
    classCode: 'BA201-A',
    type: ResultEnum.OTHER,
    factor: 0.2,
    score: 95.0,
  },
];
