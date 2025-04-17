import { ObjectId } from 'mongodb';
import { StatusEnum } from '@prisma/client';
import { facultyId1, facultyId2, facultyId3 } from './faculty.data';

export const subjectId1 = new ObjectId().toString();
export const subjectId2 = new ObjectId().toString();
export const subjectId3 = new ObjectId().toString();
export const subjectId4 = new ObjectId().toString();
export const subjectId5 = new ObjectId().toString();
export const subjectId6 = new ObjectId().toString();

export const subjectData = [
  {
    id: subjectId1,
    code: 'CS101',
    title: 'Introduction to Computer Science',
    credit: 3,
    description: 'Fundamental concepts of computer science',
    status: StatusEnum.ACTIVATED,
    facultyId: facultyId1,
  },
  {
    id: subjectId2,
    code: 'CS201',
    title: 'Data Structures and Algorithms',
    credit: 4,
    description: 'Study of data structures and algorithms',
    status: StatusEnum.ACTIVATED,
    facultyId: facultyId1,
  },
  {
    id: subjectId3,
    code: 'CS301',
    title: 'Database Management Systems',
    credit: 3,
    description: 'Introduction to database design and implementation',
    status: StatusEnum.ACTIVATED,
    facultyId: facultyId1,
  },
  {
    id: subjectId4,
    code: 'BA101',
    title: 'Principles of Management',
    credit: 3,
    description: 'Basic concepts and principles of management',
    status: StatusEnum.ACTIVATED,
    facultyId: facultyId2,
  },
  {
    id: subjectId5,
    code: 'BA201',
    title: 'Marketing Fundamentals',
    credit: 3,
    description: 'Introduction to marketing concepts and strategies',
    status: StatusEnum.ACTIVATED,
    facultyId: facultyId2,
  },
  {
    id: subjectId6,
    code: 'LA101',
    title: 'Critical Thinking',
    credit: 2,
    description: 'Development of critical thinking skills',
    status: StatusEnum.ACTIVATED,
    facultyId: facultyId3,
  },
];
