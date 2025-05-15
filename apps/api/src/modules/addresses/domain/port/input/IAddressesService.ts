import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { AddressesDto } from '../../dto/addresses.dto';
import { CreateAddressDTO } from '../../dto/create-address.dto';
import { UpdateAddressDTO } from '../../dto/update-address.dto';

export interface IAddressesService {
  create(address: CreateAddressDTO): Promise<AddressesDto>;

  findById(addressId: string, lang?: string): Promise<AddressesDto>;

  findAll(
    page: number,
    limit: number,
    lang?: string,
  ): Promise<PaginatedResponse<AddressesDto>>;

  update(addressId: string, data: UpdateAddressDTO): Promise<AddressesDto>;

  delete(addressId: string): Promise<AddressesDto>;

  createAndLinkAddressForStudent(
    studentId: string,
    type: string,
    address: CreateAddressDTO,
  ): Promise<AddressesDto>;
}
