import { CreateAddressDTO } from '../../dto/create-address.dto';
import { AddressesDto } from '../../dto/addresses.dto';
import { UpdateAddressDTO } from '../../dto/update-address.dto';

export interface IAddressesRepository {
  create(address: CreateAddressDTO): Promise<AddressesDto>;

  update(addressId: string, data: UpdateAddressDTO): Promise<AddressesDto>;

  delete(addressId: string): Promise<AddressesDto>;

  findById(addressId: string): Promise<AddressesDto>;

  findAll(page: number, limit: number): Promise<AddressesDto[]>;

  count(): Promise<number>;

  createAndLinkAddressForStudent(
    studentId: string,
    type: string,
    address: CreateAddressDTO,
  ): Promise<AddressesDto>;
}

export const ADDRESSES_REPOSITORY = Symbol('IAddressesRepository');
