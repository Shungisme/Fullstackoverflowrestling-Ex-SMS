import { Inject, Injectable } from '@nestjs/common';
import { CreateAddressDTO } from '../../dto/create-address.dto';
import { UpdateAddressDTO } from '../../dto/update-address.dto';
import { IAddressesRepository } from '../output/IAddressesRepository';
import { IAddressesService } from './IAddressesService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { AddressesDto } from '../../dto/addresses.dto';

@Injectable()
export class AddressesService implements IAddressesService {
  constructor(
    @Inject('IAddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  async count(): Promise<number> {
    try {
      return await this.addressesRepository.count();
    } catch (error) {
      throw new Error(`Error counting addresses: ${error.message}`);
    }
  }

  async create(address: CreateAddressDTO) {
    try {
      return await this.addressesRepository.create(address);
    } catch (error) {
      throw new Error(`Error creating address: ${error.message}`);
    }
  }

  async delete(addressId: string) {
    try {
      return await this.addressesRepository.delete(addressId);
    } catch (error) {
      throw new Error(
        `Error deleting address with ID ${addressId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<AddressesDto>> {
    try {
      const addresses = await this.addressesRepository.findAll(page, limit);
      const totalAddresses = await this.addressesRepository.count();

      return {
        data: addresses,
        page,
        totalPage: Math.ceil(totalAddresses / limit),
        limit,
        total: totalAddresses,
      };
    } catch (error) {
      throw new Error(`Error finding all addresses: ${error.message}`);
    }
  }

  async findById(addressId: string) {
    try {
      return await this.addressesRepository.findById(addressId);
    } catch (error) {
      throw new Error(
        `Error finding address with ID ${addressId}: ${error.message}`,
      );
    }
  }

  async update(addressId: string, data: UpdateAddressDTO) {
    try {
      return await this.addressesRepository.update(addressId, data);
    } catch (error) {
      throw new Error(
        `Error updating address with ID ${addressId}: ${error.message}`,
      );
    }
  }
}
