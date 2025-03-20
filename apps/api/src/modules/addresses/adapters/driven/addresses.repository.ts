import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IAddressesRepository } from '../../domain/port/output/IAddressesRepository';
import { AddressesDto } from '../../domain/dto/addresses.dto';
import { CreateAddressDTO } from '../../domain/dto/create-address.dto';

@Injectable()
export class AddressesRepository implements IAddressesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async count(): Promise<number> {
    return await this.prismaService.address.count();
  }

  async create(address: CreateAddressDTO): Promise<AddressesDto> {
    const createdAddress = await this.prismaService.address.create({
      data: address,
    });
    return createdAddress;
  }

  async delete(addressId: string): Promise<AddressesDto> {
    const deletedAddress = await this.prismaService.address.delete({
      where: { id: addressId },
    });
    return deletedAddress;
  }

  async findAll(page: number, limit: number): Promise<AddressesDto[]> {
    const addresses = await this.prismaService.address.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return addresses;
  }

  async findById(addressId: string): Promise<AddressesDto> {
    const address = await this.prismaService.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new Error(`Address with ID ${addressId} not found`);
    }

    return address;
  }

  async update(
    addressId: string,
    data: CreateAddressDTO,
  ): Promise<AddressesDto> {
    const updatedAddress = await this.prismaService.address.update({
      where: { id: addressId },
      data,
    });

    return updatedAddress;
  }
}
