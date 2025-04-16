import { ObjectId } from 'mongodb';

export const programId1 = new ObjectId().toString();
export const programId2 = new ObjectId().toString();
export const programId3 = new ObjectId().toString();

export const programData = [
  {
    id: programId1,
    title: 'Computer Science',
    description: 'Bachelor of Computer Science',
    status: 'active',
  },
  {
    id: programId2,
    title: 'Information Technology',
    description: 'Bachelor of Information Technology',
    status: 'active',
  },
  {
    id: programId3,
    title: 'Business Administration',
    description: 'Bachelor of Business Administration',
    status: 'active',
  },
];
