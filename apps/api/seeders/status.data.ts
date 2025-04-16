import { ObjectId } from 'mongodb';

export const statusId1 = new ObjectId().toString();
export const statusId2 = new ObjectId().toString();
export const statusId3 = new ObjectId().toString();

export const statusData = [
  {
    id: statusId1,
    title: 'Active',
    description: 'Active student',
    status: 'active',
  },
  {
    id: statusId2,
    title: 'Inactive',
    description: 'Inactive student',
    status: 'active',
  },
  {
    id: statusId3,
    title: 'Graduated',
    description: 'Graduated student',
    status: 'active',
  },
];
