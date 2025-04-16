import { ObjectId } from 'mongodb';
import {
  subjectId1,
  subjectId2,
  subjectId3,
  subjectId4,
  subjectId5,
} from './subject.data';

export const prerequisiteId1 = new ObjectId().toString();
export const prerequisiteId2 = new ObjectId().toString();
export const prerequisiteId3 = new ObjectId().toString();

export const subjectPrerequisiteData = [
  {
    id: prerequisiteId1,
    subjectId: subjectId2, // CS201 requires CS101
    prerequisiteSubjectId: subjectId1,
  },
  {
    id: prerequisiteId2,
    subjectId: subjectId3, // CS301 requires CS201
    prerequisiteSubjectId: subjectId2,
  },
  {
    id: prerequisiteId3,
    subjectId: subjectId5, // BA201 requires BA101
    prerequisiteSubjectId: subjectId4,
  },
];
