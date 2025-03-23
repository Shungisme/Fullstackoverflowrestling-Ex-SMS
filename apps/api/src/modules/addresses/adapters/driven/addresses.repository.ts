import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IAddressesRepository } from '../../domain/port/output/IAddressesRepository';
import { AddressesDto } from '../../domain/dto/addresses.dto';
import { CreateAddressDTO } from '../../domain/dto/create-address.dto';
import { validFields } from 'src/shared/utils/parse-adress';

@Injectable()
export class AddressesRepository implements IAddressesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAndLinkAddressForStudent(
    studentId: string,
    type: string,
    address: CreateAddressDTO,
  ): Promise<AddressesDto> {
    return await this.prismaService.$transaction(async (tx) => {
      const student = await tx.student.findUnique({
        where: {
          studentId: studentId,
        },
      });

      if (!student) {
        throw new NotFoundException(`Student with ${studentId} is not found`);
      }

      const field = validFields[type];

      if (!field) {
        throw new BadRequestException('type createForStudent not valid');
      }

      const addressData = await tx.address.create({
        data: address,
      });

      await tx.student.update({
        where: {
          studentId: studentId,
        },
        data: {
          [field]: addressData,
        },
      });

      if (student[type]?.id) {
        await this.delete(student[type]?.id);
      }

      return addressData;
    });
  }

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
