import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateAddressDTO } from '../../dto/create-address.dto';
import { AddressesDto } from '../../dto/addresses.dto';
import { UpdateAddressDTO } from '../../dto/update-address.dto';

export interface IAddressesService {
  create(address: CreateAddressDTO): Promise<AddressesDto>;

  createForStudent(
    studentId: string,
    type: 'permanentAddress' | 'temporaryAddress' | 'mailingAddress',
    address: CreateAddressDTO,
  ): Promise<AddressesDto>;

  update(addressId: string, data: UpdateAddressDTO): Promise<AddressesDto>;

  delete(addressId: string): Promise<AddressesDto>;

  findById(addressId: string): Promise<AddressesDto>;

  findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<AddressesDto>>;

  count(): Promise<number>;
}
