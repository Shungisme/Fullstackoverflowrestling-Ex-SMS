import { ObjectId } from 'mongodb';
import { semesterId1, semesterId2 } from './semester.data';

export const classId1 = new ObjectId().toString();
export const classId2 = new ObjectId().toString();
export const classId3 = new ObjectId().toString();
export const classId4 = new ObjectId().toString();
export const classId5 = new ObjectId().toString();
export const classId6 = new ObjectId().toString();
export const classId7 = new ObjectId().toString();

export const classData = [
  {
    id: classId1,
    code: 'CS101-A',
    subjectCode: 'CS101',
    semesterId: semesterId1,
    teacherName: 'Dr. Alan Turing',
    maximumQuantity: 35,
    classSchedule: 'Monday, Wednesday 9:00-10:30',
    classroom: 'Building A - Room 101',
  },
  {
    id: classId2,
    code: 'CS101-B',
    subjectCode: 'CS101',
    semesterId: semesterId1,
    teacherName: 'Dr. Grace Hopper',
    maximumQuantity: 35,
    classSchedule: 'Tuesday, Thursday 9:00-10:30',
    classroom: 'Building A - Room 102',
  },
  {
    id: classId3,
    code: 'CS201-A',
    subjectCode: 'CS201',
    semesterId: semesterId2,
    teacherName: 'Dr. Donald Knuth',
    maximumQuantity: 30,
    classSchedule: 'Monday, Wednesday 13:00-14:30',
    classroom: 'Building B - Room 201',
  },
  {
    id: classId4,
    code: 'CS301-A',
    subjectCode: 'CS301',
    semesterId: semesterId2,
    teacherName: 'Dr. Ada Lovelace',
    maximumQuantity: 25,
    classSchedule: 'Tuesday, Thursday 15:00-16:30',
    classroom: 'Building C - Room 305',
  },
  {
    id: classId5,
    code: 'BA101-A',
    subjectCode: 'BA101',
    semesterId: semesterId1,
    teacherName: 'Prof. Peter Drucker',
    maximumQuantity: 40,
    classSchedule: 'Monday, Friday 10:00-11:30',
    classroom: 'Building D - Room 102',
  },
  {
    id: classId6,
    code: 'BA201-A',
    subjectCode: 'BA201',
    semesterId: semesterId2,
    teacherName: 'Prof. Philip Kotler',
    maximumQuantity: 35,
    classSchedule: 'Wednesday, Friday 14:00-15:30',
    classroom: 'Building D - Room 103',
  },
  {
    id: classId7,
    code: 'LA101-A',
    subjectCode: 'LA101',
    semesterId: semesterId1,
    teacherName: 'Dr. Martha Nussbaum',
    maximumQuantity: 30,
    classSchedule: 'Tuesday, Thursday 11:00-12:00',
    classroom: 'Building E - Room 105',
  },
];
