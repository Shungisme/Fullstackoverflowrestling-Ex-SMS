import { Inject, Injectable, Logger } from '@nestjs/common';
import { AddressesDto } from '../../dto/addresses.dto';
import { CreateAddressDTO } from '../../dto/create-address.dto';
import { UpdateAddressDTO } from '../../dto/update-address.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { IAddressesService } from './IAddressesService';
import {
  ADDRESSES_REPOSITORY,
  IAddressesRepository,
} from '../output/IAddressesRepository';
import { TranslationService } from '../../../../translations/domain/port/input/translation.service';

// Các trường có thể dịch
const TRANSLATABLE_FIELDS = ['street', 'district', 'city', 'country'];

@Injectable()
export class AddressesService implements IAddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(
    @Inject(ADDRESSES_REPOSITORY)
    private readonly addressesRepository: IAddressesRepository,
    private readonly translationService: TranslationService,
  ) {}

  async create(address: CreateAddressDTO): Promise<AddressesDto> {
    try {
      // Tạo địa chỉ trong cơ sở dữ liệu
      const createdAddress = await this.addressesRepository.create(address);
      this.logger.log(`Created address with ID: ${createdAddress.id}`);

      // Lưu bản dịch
      const fieldsToTranslate: Record<string, string> = {};
      for (const field of TRANSLATABLE_FIELDS) {
        if (address[field]) {
          fieldsToTranslate[field] = address[field];
        }
      }

      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          await this.translationService.translateAndSave({
            entity: 'Address',
            entityId: createdAddress.id!,
            fields: fieldsToTranslate,
          });
          this.logger.log(
            `Translations created for address ${createdAddress.id}`,
          );
        } catch (translationError) {
          this.logger.error(
            `Failed to create translations: ${translationError.message}`,
          );
        }
      }

      return createdAddress;
    } catch (error) {
      throw new Error(`Error creating address: ${error.message}`);
    }
  }

  async findById(addressId: string, lang?: string): Promise<AddressesDto> {
    try {
      const address = await this.addressesRepository.findById(addressId);

      // Áp dụng bản dịch nếu có chỉ định ngôn ngữ
      if (lang) {
        await this.applyTranslation(address, lang);
      }

      return address;
    } catch (error) {
      throw new Error(
        `Error finding address with ID ${addressId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    lang?: string,
  ): Promise<PaginatedResponse<AddressesDto>> {
    try {
      const addresses = await this.addressesRepository.findAll(page, limit);
      const total = await this.addressesRepository.count();

      // Áp dụng bản dịch nếu có chỉ định ngôn ngữ
      if (lang) {
        await this.applyTranslationsToList(addresses, lang);
      }

      return {
        data: addresses,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Error finding addresses: ${error.message}`);
    }
  }

  async update(
    addressId: string,
    data: UpdateAddressDTO,
  ): Promise<AddressesDto> {
    try {
      // Cập nhật địa chỉ
      const updatedAddress = await this.addressesRepository.update(
        addressId,
        data,
      );

      // Xác định các trường dịch được thay đổi
      const fieldsToTranslate: Record<string, string> = {};
      for (const field of TRANSLATABLE_FIELDS) {
        if (data[field] !== undefined) {
          fieldsToTranslate[field] = data[field];
        }
      }

      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          // Xóa các bản dịch cũ cho các trường sẽ được cập nhật
          for (const field of Object.keys(fieldsToTranslate)) {
            try {
              const translations =
                await this.translationService.getAllTranslations(
                  'Address',
                  addressId,
                  field,
                );

              if (translations.length > 0) {
                this.logger.log(
                  `Deleting existing translations for address ${addressId}, field ${field}`,
                );

                // Xóa từng bản dịch của trường này
                await this.translationService[
                  'translationRepository'
                ].deleteMany('Address', addressId);
              }
            } catch (deleteError) {
              this.logger.error(
                `Failed to delete old translations for field ${field}: ${deleteError.message}`,
              );
            }
          }

          // Tạo các bản dịch mới sau khi đã xóa bản dịch cũ
          await this.translationService.translateAndSave({
            entity: 'Address',
            entityId: addressId,
            fields: fieldsToTranslate,
          });
          this.logger.log(`Updated translations for address ${addressId}`);
        } catch (translationError) {
          this.logger.error(
            `Failed to update translations: ${translationError.message}`,
          );
        }
      }

      return updatedAddress;
    } catch (error) {
      throw new Error(
        `Error updating address with ID ${addressId}: ${error.message}`,
      );
    }
  }

  async delete(addressId: string): Promise<AddressesDto> {
    try {
      // Xóa các bản dịch liên quan đến địa chỉ trước khi xóa địa chỉ
      try {
        // Lấy tất cả bản dịch của địa chỉ
        const translations = await this.translationService.getAllTranslations(
          'Address',
          addressId,
        );

        // Nếu có bản dịch nào, xóa tất cả
        if (translations.length > 0) {
          this.logger.log(
            `Deleting ${translations.length} translations for address ${addressId}`,
          );

          const deletedCount = await this.translationService[
            'translationRepository'
          ].deleteMany('Address', addressId);

          this.logger.log(
            `Successfully deleted ${deletedCount} translations for address ${addressId}`,
          );
        }
      } catch (translationError) {
        this.logger.error(
          `Error deleting translations for address ${addressId}: ${translationError.message}`,
        );
      }

      return await this.addressesRepository.delete(addressId);
    } catch (error) {
      throw new Error(
        `Error deleting address with ID ${addressId}: ${error.message}`,
      );
    }
  }

  async createAndLinkAddressForStudent(
    studentId: string,
    type: string,
    address: CreateAddressDTO,
  ): Promise<AddressesDto> {
    try {
      // Tạo địa chỉ và liên kết với sinh viên
      const createdAddress =
        await this.addressesRepository.createAndLinkAddressForStudent(
          studentId,
          type,
          address,
        );
      this.logger.log(
        `Created and linked address with ID: ${createdAddress.id} to student ${studentId}`,
      );

      // Lưu bản dịch
      const fieldsToTranslate: Record<string, string> = {};
      for (const field of TRANSLATABLE_FIELDS) {
        if (address[field]) {
          fieldsToTranslate[field] = address[field];
        }
      }

      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          await this.translationService.translateAndSave({
            entity: 'Address',
            entityId: createdAddress.id!,
            fields: fieldsToTranslate,
          });
          this.logger.log(
            `Translations created for address ${createdAddress.id}`,
          );
        } catch (translationError) {
          this.logger.error(
            `Failed to create translations: ${translationError.message}`,
          );
        }
      }

      return createdAddress;
    } catch (error) {
      throw new Error(
        `Error creating and linking address for student ${studentId}: ${error.message}`,
      );
    }
  }

  // Helper method để áp dụng bản dịch cho một địa chỉ
  private async applyTranslation(
    address: AddressesDto,
    lang: string,
  ): Promise<void> {
    try {
      const translations = await this.translationService.getAllTranslations(
        'Address',
        address.id!,
        undefined,
        lang,
      );

      if (translations.length === 0) {
        return;
      }

      // Áp dụng các bản dịch vào đối tượng địa chỉ
      for (const translation of translations) {
        address[translation.field] = translation.value;
      }
    } catch (error) {
      this.logger.error(`Error applying translations: ${error.message}`);
    }
  }

  // Helper method để áp dụng bản dịch cho một danh sách địa chỉ
  private async applyTranslationsToList(
    addresses: AddressesDto[],
    lang: string,
  ): Promise<void> {
    for (const address of addresses) {
      await this.applyTranslation(address, lang);
    }
  }
}
