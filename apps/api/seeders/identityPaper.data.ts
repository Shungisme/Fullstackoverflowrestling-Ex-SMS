import { ObjectId } from 'mongodb';

export const identityPaperId1 = new ObjectId().toString();
export const identityPaperId2 = new ObjectId().toString();
export const identityPaperId3 = new ObjectId().toString();
export const identityPaperId4 = new ObjectId().toString();

export const identityPaperData = [
  {
    id: identityPaperId1,
    type: 'CCCD',
    number: '123456789',
    issueDate: new Date('2020-01-01'),
    expirationDate: new Date('2030-01-01'),
    placeOfIssue: 'Ho Chi Minh City',
    hasChip: true,
    issuingCountry: 'Vietnam',
  },
  {
    id: identityPaperId2,
    type: 'PASSPORT',
    number: '987654321',
    issueDate: new Date('2019-05-15'),
    expirationDate: new Date('2029-05-15'),
    placeOfIssue: 'Ho Chi Minh City',
    hasChip: true,
    issuingCountry: 'Vietnam',
  },
  {
    id: identityPaperId3,
    type: 'CMND',
    number: '456789123',
    issueDate: new Date('2018-10-10'),
    expirationDate: new Date('2028-10-10'),
    placeOfIssue: 'Ho Chi Minh City',
    hasChip: false,
    issuingCountry: 'Vietnam',
  },
  {
    id: identityPaperId4,
    type: 'CCCD',
    number: '789123456',
    issueDate: new Date('2021-05-05'),
    expirationDate: new Date('2031-05-05'),
    placeOfIssue: 'Hanoi',
    hasChip: true,
    issuingCountry: 'Vietnam',
  },
];
