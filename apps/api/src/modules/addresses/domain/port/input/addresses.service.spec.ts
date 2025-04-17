import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { ADDRESSES_REPOSITORY } from '../output/IAddressesRepository';
import { CreateAddressDTO } from '../../dto/create-address.dto';
import { UpdateAddressDTO } from '../../dto/update-address.dto';
import { AddressesDto } from '../../dto/addresses.dto';
import * as errorHelpers from 'src/shared/helpers/error';

describe('AddressesService', () => {
  let service: AddressesService;

  // Mock the repository
  const mockAddressesRepository = {
    create: jest.fn(),
    createAndLinkAddressForStudent: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
  };

  // Mock isNotFoundPrismaError function
  jest
    .spyOn(errorHelpers, 'isNotFoundPrismaError')
    .mockImplementation((error) => {
      return error.name === 'NotFoundError';
    });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: ADDRESSES_REPOSITORY,
          useValue: mockAddressesRepository,
        },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);

    // Clear all mock implementations and calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should return the count of addresses', async () => {
      // Arrange
      const expectedCount = 10;
      mockAddressesRepository.count.mockResolvedValue(expectedCount);

      // Act
      const result = await service.count();

      // Assert
      expect(result).toEqual(expectedCount);
      expect(mockAddressesRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository count fails', async () => {
      // Arrange
      const errorMessage = 'Database error';
      mockAddressesRepository.count.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.count()).rejects.toThrow(
        `Error counting addresses: ${errorMessage}`,
      );
      expect(mockAddressesRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create an address successfully', async () => {
      // Arrange
      const createAddressDto: CreateAddressDTO = {
        number: '123',
        street: 'Main Street',
        district: 'Downtown',
        city: 'Metropolis',
        country: 'USA',
      };

      const expectedResult: AddressesDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createAddressDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAddressesRepository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(createAddressDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockAddressesRepository.create).toHaveBeenCalledWith(
        createAddressDto,
      );
      expect(mockAddressesRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository create fails', async () => {
      // Arrange
      const createAddressDto: CreateAddressDTO = {
        number: '123',
        street: 'Main Street',
        district: 'Downtown',
        city: 'Metropolis',
        country: 'USA',
      };

      const errorMessage = 'Validation failed';
      mockAddressesRepository.create.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.create(createAddressDto)).rejects.toThrow(
        `Error creating address: ${errorMessage}`,
      );
      expect(mockAddressesRepository.create).toHaveBeenCalledWith(
        createAddressDto,
      );
    });
  });

  describe('createForStudent', () => {
    it('should create an address for student successfully', async () => {
      // Arrange
      const studentId = '123e4567-e89b-12d3-a456-426614174001';
      const type = 'permanentAddress' as const;
      const createAddressDto: CreateAddressDTO = {
        number: '456',
        street: 'College Avenue',
        district: 'University',
        city: 'Collegetown',
        country: 'USA',
      };

      const expectedResult: AddressesDto = {
        id: '123e4567-e89b-12d3-a456-426614174002',
        ...createAddressDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAddressesRepository.createAndLinkAddressForStudent.mockResolvedValue(
        expectedResult,
      );

      // Act
      const result = await service.createForStudent(
        studentId,
        type,
        createAddressDto,
      );

      // Assert
      expect(result).toEqual(expectedResult);
      expect(
        mockAddressesRepository.createAndLinkAddressForStudent,
      ).toHaveBeenCalledWith(studentId, type, createAddressDto);
      expect(
        mockAddressesRepository.createAndLinkAddressForStudent,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when studentId is not provided', async () => {
      // Arrange
      const studentId = '';
      const type = 'permanentAddress' as const;
      const createAddressDto: CreateAddressDTO = {
        number: '456',
        street: 'College Avenue',
        district: 'University',
        city: 'Collegetown',
        country: 'USA',
      };

      // Act & Assert
      // Use toThrowError to match the error message instead of the constructor
      await expect(
        service.createForStudent(studentId, type, createAddressDto),
      ).rejects.toThrowError('studentId must have');
      expect(
        mockAddressesRepository.createAndLinkAddressForStudent,
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      const studentId = '123e4567-e89b-12d3-a456-426614174001';
      const type = 'temporaryAddress' as const;
      const createAddressDto: CreateAddressDTO = {
        number: '456',
        street: 'College Avenue',
        district: 'University',
        city: 'Collegetown',
        country: 'USA',
      };

      const notFoundError = new Error('Student not found');
      notFoundError.name = 'NotFoundError';
      mockAddressesRepository.createAndLinkAddressForStudent.mockRejectedValue(
        notFoundError,
      );

      // Act & Assert
      await expect(
        service.createForStudent(studentId, type, createAddressDto),
      ).rejects.toThrow(NotFoundException);
      expect(
        mockAddressesRepository.createAndLinkAddressForStudent,
      ).toHaveBeenCalledWith(studentId, type, createAddressDto);
    });

    it('should throw general error for other repository failures', async () => {
      // Arrange
      const studentId = '123e4567-e89b-12d3-a456-426614174001';
      const type = 'mailingAddress' as const;
      const createAddressDto: CreateAddressDTO = {
        number: '456',
        street: 'College Avenue',
        district: 'University',
        city: 'Collegetown',
        country: 'USA',
      };

      const errorMessage = 'Database connection error';
      mockAddressesRepository.createAndLinkAddressForStudent.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(
        service.createForStudent(studentId, type, createAddressDto),
      ).rejects.toThrow(`Error creating address: ${errorMessage}`);
      expect(
        mockAddressesRepository.createAndLinkAddressForStudent,
      ).toHaveBeenCalledWith(studentId, type, createAddressDto);
    });
  });

  describe('delete', () => {
    it('should delete an address successfully', async () => {
      // Arrange
      const addressId = '123e4567-e89b-12d3-a456-426614174002';
      const expectedResult: AddressesDto = {
        id: addressId,
        number: '123',
        street: 'Main Street',
        district: 'Downtown',
        city: 'Metropolis',
        country: 'USA',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAddressesRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(addressId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockAddressesRepository.delete).toHaveBeenCalledWith(addressId);
      expect(mockAddressesRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository delete fails', async () => {
      // Arrange
      const addressId = '123e4567-e89b-12d3-a456-426614174002';
      const errorMessage = 'Address not found';
      mockAddressesRepository.delete.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.delete(addressId)).rejects.toThrow(
        `Error deleting address with ID ${addressId}: ${errorMessage}`,
      );
      expect(mockAddressesRepository.delete).toHaveBeenCalledWith(addressId);
    });
  });

  describe('findAll', () => {
    it('should find all addresses with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const mockAddresses: AddressesDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          number: '123',
          street: 'Main Street',
          district: 'Downtown',
          city: 'Metropolis',
          country: 'USA',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          number: '456',
          street: 'College Avenue',
          district: 'University',
          city: 'Collegetown',
          country: 'USA',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const totalAddresses = 2;
      mockAddressesRepository.findAll.mockResolvedValue(mockAddresses);
      mockAddressesRepository.count.mockResolvedValue(totalAddresses);

      const expectedResult = {
        data: mockAddresses,
        page,
        totalPage: Math.ceil(totalAddresses / limit),
        limit,
        total: totalAddresses,
      };

      // Act
      const result = await service.findAll(page, limit);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockAddressesRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(mockAddressesRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should handle empty result when finding addresses', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const mockAddresses: AddressesDto[] = [];
      const totalAddresses = 0;

      mockAddressesRepository.findAll.mockResolvedValue(mockAddresses);
      mockAddressesRepository.count.mockResolvedValue(totalAddresses);

      const expectedResult = {
        data: mockAddresses,
        page,
        totalPage: Math.ceil(totalAddresses / limit),
        limit,
        total: totalAddresses,
      };

      // Act
      const result = await service.findAll(page, limit);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockAddressesRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(mockAddressesRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository findAll fails', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const errorMessage = 'Database error';
      mockAddressesRepository.findAll.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(service.findAll(page, limit)).rejects.toThrow(
        `Error finding all addresses: ${errorMessage}`,
      );
      expect(mockAddressesRepository.findAll).toHaveBeenCalledWith(page, limit);
    });
  });

  describe('findById', () => {
    it('should find an address by id successfully', async () => {
      // Arrange
      const addressId = '123e4567-e89b-12d3-a456-426614174002';
      const expectedResult: AddressesDto = {
        id: addressId,
        number: '123',
        street: 'Main Street',
        district: 'Downtown',
        city: 'Metropolis',
        country: 'USA',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAddressesRepository.findById.mockResolvedValue(expectedResult);

      // Act
      const result = await service.findById(addressId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockAddressesRepository.findById).toHaveBeenCalledWith(addressId);
      expect(mockAddressesRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository findById fails', async () => {
      // Arrange
      const addressId = '123e4567-e89b-12d3-a456-426614174002';
      const errorMessage = 'Address not found';
      mockAddressesRepository.findById.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(service.findById(addressId)).rejects.toThrow(
        `Error finding address with ID ${addressId}: ${errorMessage}`,
      );
      expect(mockAddressesRepository.findById).toHaveBeenCalledWith(addressId);
    });
  });

  describe('update', () => {
    it('should update an address successfully', async () => {
      // Arrange
      const addressId = '123e4567-e89b-12d3-a456-426614174002';
      const updateAddressDto: UpdateAddressDTO = {
        street: 'Updated Street',
        city: 'New City',
      };

      const expectedResult: AddressesDto = {
        id: addressId,
        number: '123',
        street: 'Updated Street',
        district: 'Downtown',
        city: 'New City',
        country: 'USA',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAddressesRepository.update.mockResolvedValue(expectedResult);

      // Act
      const result = await service.update(addressId, updateAddressDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockAddressesRepository.update).toHaveBeenCalledWith(
        addressId,
        updateAddressDto,
      );
      expect(mockAddressesRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository update fails', async () => {
      // Arrange
      const addressId = '123e4567-e89b-12d3-a456-426614174002';
      const updateAddressDto: UpdateAddressDTO = {
        street: 'Updated Street',
        city: 'New City',
      };

      const errorMessage = 'Address not found';
      mockAddressesRepository.update.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.update(addressId, updateAddressDto)).rejects.toThrow(
        `Error updating address with ID ${addressId}: ${errorMessage}`,
      );
      expect(mockAddressesRepository.update).toHaveBeenCalledWith(
        addressId,
        updateAddressDto,
      );
    });
  });
});
