import { ObjectId } from 'mongodb';

export const addressId1 = new ObjectId().toString();
export const addressId2 = new ObjectId().toString();
export const addressId3 = new ObjectId().toString();
export const addressId4 = new ObjectId().toString();
export const addressId5 = new ObjectId().toString();

export const addressData = [
  {
    id: addressId1,
    number: '123',
    street: 'Main St',
    district: 'District 1',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
  },
  {
    id: addressId2,
    number: '456',
    street: 'Secondary St',
    district: 'District 2',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
  },
  {
    id: addressId3,
    number: '789',
    street: 'Third St',
    district: 'District 3',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
  },
  {
    id: addressId4,
    number: '101',
    street: 'Fourth St',
    district: 'District 4',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
  },
  {
    id: addressId5,
    number: '202',
    street: 'Fifth St',
    district: 'District 5',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
  },
];
