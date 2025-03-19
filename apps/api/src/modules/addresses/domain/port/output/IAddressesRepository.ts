import { CreateAddressDTO } from '../../dto/create-address.dto';
import { AddressesDto } from '../../dto/addresses.dto';

export interface IAddressesRepository {
  create(address: CreateAddressDTO): Promise<AddressesDto>;

  update(addressId: string, data: CreateAddressDTO): Promise<AddressesDto>;

  delete(addressId: string): Promise<AddressesDto>;

  findById(addressId: string): Promise<AddressesDto>;

  findAll(page: number, limit: number): Promise<AddressesDto[]>;

  count(): Promise<number>;
}
