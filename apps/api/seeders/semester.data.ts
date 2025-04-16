import { ObjectId } from 'mongodb';

export const semesterId1 = new ObjectId().toString();
export const semesterId2 = new ObjectId().toString();
export const semesterId3 = new ObjectId().toString();
export const semesterId4 = new ObjectId().toString();

export const semesterData = [
  {
    id: semesterId1,
    academicYear: '2023-2024',
    semester: 1,
    startedAt: new Date('2023-09-01'),
    endedAt: new Date('2023-12-31'),
  },
  {
    id: semesterId2,
    academicYear: '2023-2024',
    semester: 2,
    startedAt: new Date('2024-01-15'),
    endedAt: new Date('2024-05-15'),
  },
  {
    id: semesterId3,
    academicYear: '2024-2025',
    semester: 1,
    startedAt: new Date('2024-09-01'),
    endedAt: new Date('2024-12-31'),
  },
  {
    id: semesterId4,
    academicYear: '2024-2025',
    semester: 2,
    startedAt: new Date('2025-01-15'),
    endedAt: new Date('2025-05-15'),
  },
];
