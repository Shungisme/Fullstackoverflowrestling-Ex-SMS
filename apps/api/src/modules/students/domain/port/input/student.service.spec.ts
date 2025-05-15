import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { StudentService } from './student.service';
import { CreateStudentWithAddressDTO } from '../../dto/create-student-dto';
import { UpdateStudentRequestDTO } from '../../dto/student-dto';
import { SearchRequestDTO } from '../../dto/search-dto';
import { STUDENT_REPOSITORY } from '../output/IStudentRepository';
import { PROGRAM_REPOSITORY } from 'src/modules/programs/domain/port/output/IProgramsRepository';
import { STATUS_REPOSITORY } from 'src/modules/statuses/domain/port/output/IStatusesRepository';
import { FACULTIES_REPOSITORY } from 'src/modules/faculties/domain/port/output/IFacultiesRepository';
import { ADDRESSES_REPOSITORY } from 'src/modules/addresses/domain/port/output/IAddressesRepository';
import { IDENTITY_REPOSITORY } from 'src/modules/identity-papers/domain/port/output/IIdentityPapersRepository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { TranslationService } from 'src/modules/translations/domain/port/input/translation.service';

// Define our own Gender enum to match what's expected in the service
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

describe('StudentService', () => {
  let service: StudentService;

  // Create mock implementations for all repositories
  const mockStudentRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
    upload: jest.fn(),
    exportFile: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
    findAll: jest.fn(),
    getAll: jest.fn(),
    getStudentResults: jest.fn(),
    createMany: jest.fn(),
  };

  const mockProgramsRepository = {
    findById: jest.fn(),
    find: jest.fn(),
    findByName: jest.fn(),
  };

  const mockStatusesRepository = {
    findById: jest.fn(),
    find: jest.fn(),
    findByName: jest.fn(),
  };

  const mockFacultiesRepository = {
    findById: jest.fn(),
    find: jest.fn(),
    findByName: jest.fn(),
  };

  const mockAddressesRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
  };

  const mockIdentityPapersRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByTypeAndNumber: jest.fn(),
  };

  const mockTranslationService = {
    translateAndSave: jest.fn(),
    getAllTranslations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: STUDENT_REPOSITORY,
          useValue: mockStudentRepository,
        },
        {
          provide: PROGRAM_REPOSITORY,
          useValue: mockProgramsRepository,
        },
        {
          provide: STATUS_REPOSITORY,
          useValue: mockStatusesRepository,
        },
        {
          provide: FACULTIES_REPOSITORY,
          useValue: mockFacultiesRepository,
        },
        {
          provide: ADDRESSES_REPOSITORY,
          useValue: mockAddressesRepository,
        },
        {
          provide: IDENTITY_REPOSITORY,
          useValue: mockIdentityPapersRepository,
        },
        {
          provide: TranslationService,
          useValue: mockTranslationService,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a student', async () => {
      // Arrange
      const createStudentDto: CreateStudentWithAddressDTO = {
        studentId: 'ST12345',
        name: 'John Doe',
        dateOfBirth: new Date('2000-01-01'),
        gender: Gender.MALE,
        course: 1,
        email: 'john.doe@example.edu',
        phone: '+84123456789',
        nationality: 'Vietnamese',
        facultyId: '6001f693a073e80b5adde618',
        programId: '6001f693a073e80b5adde619',
        statusId: '6001f693a073e80b5adde620',
        mailingAddress: {
          number: '123',
          street: 'Main St',
          district: 'District 1',
          city: 'Ho Chi Minh',
          country: 'Vietnam',
        },
        permanentAddress: {
          number: '123',
          street: 'Main St',
          district: 'District 1',
          city: 'Ho Chi Minh',
          country: 'Vietnam',
        },
        temporaryAddress: null,
        identityPaper: {
          type: 'Passport',
          number: 'P12345678',
          issueDate: new Date('2018-01-01'),
          expirationDate: new Date('2028-01-01'),
          placeOfIssue: 'Ho Chi Minh',
          hasChip: true,
          issuingCountry: 'Vietnam',
          notes: null,
        },
      };

      const expectedResult = {
        id: '6001f693a073e80b5adde621',
        studentId: 'ST12345',
        name: 'John Doe',
        dateOfBirth: new Date('2000-01-01'),
        gender: 'MALE',
        course: 1,
        email: 'john.doe@example.edu',
        phone: '+84123456789',
        nationality: 'Vietnamese',
        faculty: {
          id: '6001f693a073e80b5adde618',
          title: 'Computer Science',
        },
        program: {
          id: '6001f693a073e80b5adde619',
          title: 'Bachelor of Science',
        },
        status: {
          id: '6001f693a073e80b5adde620',
          title: 'Active',
        },
        permanentAddress: {
          id: '6001f693a073e80b5adde622',
          number: '123',
          street: 'Main St',
          district: 'District 1',
          city: 'Ho Chi Minh',
          country: 'Vietnam',
        },
        temporaryAddress: null,
        mailingAddress: {
          id: '6001f693a073e80b5adde623',
          number: '123',
          street: 'Main St',
          district: 'District 1',
          city: 'Ho Chi Minh',
          country: 'Vietnam',
        },
        identityPaper: {
          id: '6001f693a073e80b5adde624',
          type: 'Passport',
          number: 'P12345678',
          issueDate: new Date('2018-01-01'),
          expirationDate: new Date('2028-01-01'),
          placeOfIssue: 'Ho Chi Minh',
          hasChip: true,
          issuingCountry: 'Vietnam',
          notes: null,
        },
      };

      mockStudentRepository.findById.mockResolvedValue(null); // No existing student
      mockStudentRepository.create.mockResolvedValue(expectedResult);
      mockFacultiesRepository.findById.mockResolvedValue({
        id: '6001f693a073e80b5adde618',
        title: 'Computer Science',
      });
      mockProgramsRepository.findById.mockResolvedValue({
        id: '6001f693a073e80b5adde619',
        title: 'Bachelor of Science',
      });
      mockStatusesRepository.findById.mockResolvedValue({
        id: '6001f693a073e80b5adde620',
        title: 'Active',
      });

      // Act
      const result = await service.create(createStudentDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockStudentRepository.findById).toHaveBeenCalledWith('ST12345');
      expect(mockStudentRepository.create).toHaveBeenCalledWith(
        createStudentDto,
      );
      expect(mockStudentRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when student already exists', async () => {
      // Arrange
      const createStudentDto: CreateStudentWithAddressDTO = {
        studentId: 'ST12345',
        // Other required fields
        name: 'John Doe',
        dateOfBirth: new Date('2000-01-01'),
        gender: Gender.MALE,
        course: 1,
        email: 'john.doe@example.edu',
        phone: '+84123456789',
        nationality: 'Vietnamese',
        facultyId: '6001f693a073e80b5adde618',
        programId: '6001f693a073e80b5adde619',
        statusId: '6001f693a073e80b5adde620',
        mailingAddress: {
          number: '123',
          street: 'Main St',
          district: 'District 1',
          city: 'Ho Chi Minh',
          country: 'Vietnam',
        },
        permanentAddress: null,
        temporaryAddress: null,
        identityPaper: {
          type: 'Passport',
          number: 'P12345678',
          issueDate: new Date('2018-01-01'),
          expirationDate: new Date('2028-01-01'),
          placeOfIssue: 'Ho Chi Minh',
          hasChip: true,
          issuingCountry: 'Vietnam',
          notes: null,
        },
      };

      mockStudentRepository.findById.mockResolvedValue({
        id: '123',
        studentId: 'ST12345',
      });

      // Act & Assert
      await expect(service.create(createStudentDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockStudentRepository.findById).toHaveBeenCalledWith('ST12345');
      expect(mockStudentRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a student by ID successfully', async () => {
      // Arrange
      const studentId = 'ST12345';
      const expectedResult = {
        id: '6001f693a073e80b5adde621',
        studentId: 'ST12345',
        name: 'John Doe',
        dateOfBirth: new Date('2000-01-01'),
        gender: 'MALE',
        course: 1,
        email: 'john.doe@example.edu',
        phone: '+84123456789',
        nationality: 'Vietnamese',
        faculty: {
          id: '6001f693a073e80b5adde618',
          title: 'Computer Science',
        },
        program: {
          id: '6001f693a073e80b5adde619',
          title: 'Bachelor of Science',
        },
        status: {
          id: '6001f693a073e80b5adde620',
          title: 'Active',
        },
        permanentAddress: {
          id: '6001f693a073e80b5adde622',
          number: '123',
          street: 'Main St',
          district: 'District 1',
          city: 'Ho Chi Minh',
          country: 'Vietnam',
        },
        temporaryAddress: null,
        mailingAddress: {
          id: '6001f693a073e80b5adde623',
          number: '123',
          street: 'Main St',
          district: 'District 1',
          city: 'Ho Chi Minh',
          country: 'Vietnam',
        },
        identityPaper: {
          id: '6001f693a073e80b5adde624',
          type: 'Passport',
          number: 'P12345678',
          issueDate: new Date('2018-01-01'),
          expirationDate: new Date('2028-01-01'),
          placeOfIssue: 'Ho Chi Minh',
          hasChip: true,
          issuingCountry: 'Vietnam',
          notes: null,
        },
      };

      mockStudentRepository.findById.mockResolvedValue(expectedResult);

      // Act
      const result = await service.findById(studentId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockStudentRepository.findById).toHaveBeenCalledWith(studentId);
      expect(mockStudentRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      const studentId = 'nonexistent-id';
      mockStudentRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById(studentId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockStudentRepository.findById).toHaveBeenCalledWith(studentId);
    });
  });

  describe('upload', () => {
    it('should upload student data from Excel file', async () => {
      // Arrange
      const mockFile = {
        originalname: 'students.xlsx',
        buffer: Buffer.from('mock-excel-data'),
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      } as Express.Multer.File;

      const mockStudents = [
        {
          studentId: 'ST12345',
          name: 'John Doe',
          // Other student data
        },
      ];

      mockStudentRepository.createMany.mockResolvedValue(1);
      // Mock other repository methods as needed for upload

      // Act
      const result = await service.upload(mockFile);

      // Assert
      expect(result).toHaveProperty('isCreated');
      expect(result).toHaveProperty('message');
      expect(mockStudentRepository.createMany).toHaveBeenCalled();
    });
  });

  describe('exportFile', () => {
    it('should export student data to JSON format', async () => {
      // Arrange
      const fileType = 'json';
      const mockStudents = [
        {
          id: '6001f693a073e80b5adde621',
          studentId: 'ST12345',
          name: 'John Doe',
          // Other student fields
        },
      ];

      mockStudentRepository.getAll.mockResolvedValue(mockStudents);

      const mockResponse = {
        setHeader: jest.fn(),
        download: jest.fn().mockImplementation((path, name, callback) => {
          callback(null);
        }),
      } as any;

      // Act
      const result = await service.exportFile(fileType, mockResponse);

      // Assert
      expect(result).toEqual({
        isDownload: true,
        message: 'Download successfully',
      });
      expect(mockStudentRepository.getAll).toHaveBeenCalled();
      expect(mockResponse.download).toHaveBeenCalled();
    });
  });
});
