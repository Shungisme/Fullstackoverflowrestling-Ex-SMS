import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { ADDRESSES_REPOSITORY } from '../output/IAddressesRepository';
import { CreateAddressDTO } from '../../dto/create-address.dto';
import { UpdateAddressDTO } from '../../dto/update-address.dto';
import { AddressesDto } from '../../dto/addresses.dto';
import { TranslationService } from '../../../../translations/domain/port/input/translation.service';
import * as errorHelpers from 'src/shared/helpers/error';

describe('AddressesService', () => {
  let service: AddressesService;

  // Mock repositories and services
  const mockAddressesRepository = {
    create: jest.fn(),
    createAndLinkAddressForStudent: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
  };

  const mockTranslationService = {
    translateAndSave: jest.fn(),
    getAllTranslations: jest.fn(),
  };

  // Mock data
  const addressId = '123e4567-e89b-12d3-a456-426614174000';
  const studentId = '123e4567-e89b-12d3-a456-426614174001';

  const sampleAddress: AddressesDto = {
    id: addressId,
    number: '123',
    street: 'Main Street',
    district: 'Downtown',
    city: 'Metropolis',
    country: 'USA',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  };

  const createAddressDto: CreateAddressDTO = {
    number: '123',
    street: 'Main Street',
    district: 'Downtown',
    city: 'Metropolis',
    country: 'USA',
  };

  const updateAddressDto: UpdateAddressDTO = {
    street: 'Updated Street',
    city: 'New City',
  };

  // Mock isNotFoundPrismaError function
  jest
    .spyOn(errorHelpers, 'isNotFoundPrismaError')
    .mockImplementation((error) => {
      return error.name === 'NotFoundError';
    });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: ADDRESSES_REPOSITORY,
          useValue: mockAddressesRepository,
        },
        {
          provide: TranslationService,
          useValue: mockTranslationService,
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an address successfully', async () => {
      // Arrange
      mockAddressesRepository.create.mockResolvedValue(sampleAddress);
      mockTranslationService.translateAndSave.mockResolvedValue(undefined);

      // Act
      const result = await service.create(createAddressDto);

      // Assert
      expect(result).toEqual(sampleAddress);
      expect(mockAddressesRepository.create).toHaveBeenCalledWith(
        createAddressDto,
      );
      expect(mockTranslationService.translateAndSave).toHaveBeenCalledWith({
        entity: 'Address',
        entityId: sampleAddress.id,
        fields: {
          street: 'Main Street',
          district: 'Downtown',
          city: 'Metropolis',
          country: 'USA',
        },
      });
    });

    it('should create an address even when translation fails', async () => {
      // Arrange
      mockAddressesRepository.create.mockResolvedValue(sampleAddress);
      mockTranslationService.translateAndSave.mockRejectedValue(
        new Error('Translation failed'),
      );

      // Act
      const result = await service.create(createAddressDto);

      // Assert
      expect(result).toEqual(sampleAddress);
      expect(mockAddressesRepository.create).toHaveBeenCalledWith(
        createAddressDto,
      );
      // We should still try to create translations
      expect(mockTranslationService.translateAndSave).toHaveBeenCalled();
    });

    it('should throw an error when repository create fails', async () => {
      // Arrange
      const errorMessage = 'Validation failed';
      mockAddressesRepository.create.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.create(createAddressDto)).rejects.toThrow(
        `Error creating address: ${errorMessage}`,
      );
      expect(mockAddressesRepository.create).toHaveBeenCalledWith(
        createAddressDto,
      );
      expect(mockTranslationService.translateAndSave).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find an address by id successfully', async () => {
      // Arrange
      mockAddressesRepository.findById.mockResolvedValue(sampleAddress);

      // Act
      const result = await service.findById(addressId);

      // Assert
      expect(result).toEqual(sampleAddress);
      expect(mockAddressesRepository.findById).toHaveBeenCalledWith(addressId);
      expect(mockTranslationService.getAllTranslations).not.toHaveBeenCalled();
    });

    it('should apply translations when language is provided', async () => {
      // Arrange
      mockAddressesRepository.findById.mockResolvedValue({ ...sampleAddress });
      const translations = [
        { field: 'street', value: 'Đường Chính' },
        { field: 'city', value: 'Thành phố Mới' },
      ];
      mockTranslationService.getAllTranslations.mockResolvedValue(translations);

      const expectedAddress = {
        ...sampleAddress,
        street: 'Đường Chính',
        city: 'Thành phố Mới',
      };

      // Act
      const result = await service.findById(addressId, 'vi');

      // Assert
      expect(result).toEqual(expectedAddress);
      expect(mockAddressesRepository.findById).toHaveBeenCalledWith(addressId);
      expect(mockTranslationService.getAllTranslations).toHaveBeenCalledWith(
        'Address',
        addressId,
        undefined,
        'vi',
      );
    });

    it('should throw an error when repository findById fails', async () => {
      // Arrange
      const errorMessage = 'Address not found';
      mockAddressesRepository.findById.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(service.findById(addressId)).rejects.toThrow(
        `Error finding address with ID ${addressId}: ${errorMessage}`,
      );
    });

    it('should handle when translations fail', async () => {
      // Arrange
      mockAddressesRepository.findById.mockResolvedValue({ ...sampleAddress });
      mockTranslationService.getAllTranslations.mockRejectedValue(
        new Error('Translation service down'),
      );

      // Act
      const result = await service.findById(addressId, 'vi');

      // Assert
      expect(result).toEqual(sampleAddress);
      expect(mockAddressesRepository.findById).toHaveBeenCalledWith(addressId);
      expect(mockTranslationService.getAllTranslations).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const page = 1;
    const limit = 10;
    const addresses = [sampleAddress, { ...sampleAddress, id: 'address-2' }];

    it('should find all addresses with pagination', async () => {
      // Arrange
      mockAddressesRepository.findAll.mockResolvedValue(addresses);
      mockAddressesRepository.count.mockResolvedValue(addresses.length);

      const expectedResponse = {
        data: addresses,
        total: addresses.length,
        page,
        limit,
        totalPage: 1,
      };

      // Act
      const result = await service.findAll(page, limit);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockAddressesRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(mockAddressesRepository.count).toHaveBeenCalled();
    });

    it('should apply translations when language is specified', async () => {
      // Arrange
      mockAddressesRepository.findAll.mockResolvedValue([...addresses]);
      mockAddressesRepository.count.mockResolvedValue(addresses.length);

      const translations = [{ field: 'street', value: 'Đường Chính' }];
      mockTranslationService.getAllTranslations.mockResolvedValue(translations);

      // Act
      const result = await service.findAll(page, limit, 'vi');

      // Assert
      expect(result.data[0].street).toBe('Đường Chính');
      expect(mockTranslationService.getAllTranslations).toHaveBeenCalledTimes(
        addresses.length,
      );
    });

    it('should throw an error when repository findAll fails', async () => {
      // Arrange
      const errorMessage = 'Database error';
      mockAddressesRepository.findAll.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(service.findAll(page, limit)).rejects.toThrow(
        `Error finding addresses: ${errorMessage}`,
      );
    });
  });

  describe('update', () => {
    it('should update an address successfully', async () => {
      // Arrange
      const updatedAddress = {
        ...sampleAddress,
        street: 'Updated Street',
        city: 'New City',
      };
      mockAddressesRepository.update.mockResolvedValue(updatedAddress);
      mockTranslationService.translateAndSave.mockResolvedValue(undefined);

      // Act
      const result = await service.update(addressId, updateAddressDto);

      // Assert
      expect(result).toEqual(updatedAddress);
      expect(mockAddressesRepository.update).toHaveBeenCalledWith(
        addressId,
        updateAddressDto,
      );
      expect(mockTranslationService.translateAndSave).toHaveBeenCalledWith({
        entity: 'Address',
        entityId: addressId,
        fields: {
          street: 'Updated Street',
          city: 'New City',
        },
      });
    });

    it('should update even when translation fails', async () => {
      // Arrange
      const updatedAddress = {
        ...sampleAddress,
        street: 'Updated Street',
      };
      mockAddressesRepository.update.mockResolvedValue(updatedAddress);
      mockTranslationService.translateAndSave.mockRejectedValue(
        new Error('Translation failed'),
      );

      // Act
      const result = await service.update(addressId, {
        street: 'Updated Street',
      });

      // Assert
      expect(result).toEqual(updatedAddress);
      expect(mockTranslationService.translateAndSave).toHaveBeenCalled();
    });

    it('should throw an error when repository update fails', async () => {
      // Arrange
      const errorMessage = 'Address not found';
      mockAddressesRepository.update.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.update(addressId, updateAddressDto)).rejects.toThrow(
        `Error updating address with ID ${addressId}: ${errorMessage}`,
      );
    });
  });

  describe('delete', () => {
    it('should delete an address successfully', async () => {
      // Arrange
      mockAddressesRepository.delete.mockResolvedValue(sampleAddress);

      // Act
      const result = await service.delete(addressId);

      // Assert
      expect(result).toEqual(sampleAddress);
      expect(mockAddressesRepository.delete).toHaveBeenCalledWith(addressId);
    });

    it('should throw an error when repository delete fails', async () => {
      // Arrange
      const errorMessage = 'Address not found';
      mockAddressesRepository.delete.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.delete(addressId)).rejects.toThrow(
        `Error deleting address with ID ${addressId}: ${errorMessage}`,
      );
    });
  });
});
