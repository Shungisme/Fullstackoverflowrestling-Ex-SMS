import { ObjectId } from 'mongodb';

export const facultyId1 = new ObjectId().toString();
export const facultyId2 = new ObjectId().toString();
export const facultyId3 = new ObjectId().toString();

export const facultyData = [
  {
    id: facultyId1,
    title: 'Computer Science',
    description: 'Faculty of Computer Science and Engineering',
    status: 'active',
  },
  {
    id: facultyId2,
    title: 'Business Administration',
    description: 'Faculty of Business Administration',
    status: 'active',
  },
  {
    id: facultyId3,
    title: 'Liberal Arts',
    description: 'Faculty of Liberal Arts',
    status: 'active',
  },
];
