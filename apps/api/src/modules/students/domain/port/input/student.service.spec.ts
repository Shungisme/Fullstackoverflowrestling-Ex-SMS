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
    count: jest.fn(), // Added missing count method to fix search test
  };

  const mockProgramsRepository = {
    findById: jest.fn(),
    find: jest.fn(),
  };

  const mockStatusesRepository = {
    findById: jest.fn(),
    find: jest.fn(),
  };

  const mockFacultiesRepository = {
    findById: jest.fn(),
    find: jest.fn(),
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

      mockStudentRepository.create.mockResolvedValue(expectedResult);
      // Set up other repository mocks if needed for create method
      mockStudentRepository.findById.mockResolvedValue(null); // No existing student
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
      expect(mockStudentRepository.create).toHaveBeenCalledWith(
        createStudentDto,
      );
      expect(mockStudentRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      // Arrange
      const updateStudentDto: UpdateStudentRequestDTO = {
        id: '6001f693a073e80b5adde621',
        name: 'John Updated',
        email: 'john.updated@example.edu',
        phone: '+84987654321',
      };

      const expectedResult = {
        id: '6001f693a073e80b5adde621',
        studentId: 'ST12345',
        name: 'John Updated',
        dateOfBirth: new Date('2000-01-01'),
        gender: 'MALE',
        course: 1,
        email: 'john.updated@example.edu',
        phone: '+84987654321',
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

      mockStudentRepository.update.mockResolvedValue(expectedResult);
      mockStudentRepository.findById.mockResolvedValue({
        id: '6001f693a073e80b5adde621',
        // Add other required properties for the existing student
      });

      // Act
      const result = await service.update(updateStudentDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockStudentRepository.update).toHaveBeenCalledWith(
        updateStudentDto,
      );
      expect(mockStudentRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a student', async () => {
      // Arrange
      const studentId = '6001f693a073e80b5adde621';
      const expectedResult = {
        isDeleted: true,
        message: 'Delete successfully', // Updated to match actual response from service
      };

      mockStudentRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(studentId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockStudentRepository.delete).toHaveBeenCalledWith(studentId);
      expect(mockStudentRepository.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('search', () => {
    it('should search for students', async () => {
      // Arrange
      const query: SearchRequestDTO = {
        key: 'John',
        limit: 10,
        page: 1,
        faculty: 'Computer Science',
      };

      const mockStudents = [
        {
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
        },
      ];

      const totalCount = 1;

      // Mock both the search and count methods
      mockStudentRepository.search.mockResolvedValue(mockStudents);
      mockStudentRepository.count.mockResolvedValue(totalCount);

      const expectedResult = {
        students: mockStudents,
        total: totalCount,
      };

      // Act
      const result = await service.search(query);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockStudentRepository.search).toHaveBeenCalledWith(query);
      expect(mockStudentRepository.count).toHaveBeenCalled();
      expect(mockStudentRepository.search).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should find a student by id', async () => {
      // Arrange
      const studentId = '6001f693a073e80b5adde621';
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
  });
});
