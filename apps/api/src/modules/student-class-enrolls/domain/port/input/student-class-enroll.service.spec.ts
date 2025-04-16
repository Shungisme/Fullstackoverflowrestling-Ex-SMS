import { Test, TestingModule } from '@nestjs/testing';
import { StudentClassEnrollService } from './student-class-enroll.service';
import { STUDENT_CLASS_ENROLL_REPOSITORY } from '../output/IStudentClassEnrollRepository';
import { CreateStudentClassEnrollDTO } from '../../dto/create-student-class-enroll.dto';
import { UpdateStudentClassEnrollDTO } from '../../dto/update-student-class-enroll.dto';
import { StudentClassEnrollDto } from '../../dto/student-class-enroll.dto';

describe('StudentClassEnrollService', () => {
  let service: StudentClassEnrollService;

  // Create mock implementation for repository
  const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
    findByStudentAndClass: jest.fn(),
    findByStudent: jest.fn(),
    findByClass: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentClassEnrollService,
        {
          provide: STUDENT_CLASS_ENROLL_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StudentClassEnrollService>(StudentClassEnrollService);

    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should count enrollments with provided where options', async () => {
      // Arrange
      const whereOptions = { classCode: 'CS101' };
      const expectedCount = 5;
      mockRepository.count.mockResolvedValue(expectedCount);

      // Act
      const result = await service.count(whereOptions);

      // Assert
      expect(result).toEqual(expectedCount);
      expect(mockRepository.count).toHaveBeenCalledWith(whereOptions);
      expect(mockRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository count fails', async () => {
      // Arrange
      const whereOptions = { classCode: 'CS101' };
      const errorMessage = 'Database error';
      mockRepository.count.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.count(whereOptions)).rejects.toThrow(
        `Error counting student class enrollments: ${errorMessage}`,
      );
      expect(mockRepository.count).toHaveBeenCalledWith(whereOptions);
    });
  });

  describe('create', () => {
    it('should create a student class enrollment successfully', async () => {
      // Arrange
      const createDto: CreateStudentClassEnrollDTO = {
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'COMPLETE',
      };

      const expectedResult: StudentClassEnrollDto = {
        id: '6001f693a073e80b5adde618',
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'COMPLETE',
        createdAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository create fails', async () => {
      // Arrange
      const createDto: CreateStudentClassEnrollDTO = {
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'COMPLETE',
      };

      const errorMessage = 'Validation failed';
      mockRepository.create.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(
        `Error creating student class enrollment: ${errorMessage}`,
      );
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should find all enrollments with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;

      const mockEnrollments: StudentClassEnrollDto[] = [
        {
          id: '6001f693a073e80b5adde618',
          studentId: 'ST12345',
          classCode: 'CS101',
          type: 'COMPLETE',
          createdAt: new Date(),
        },
        {
          id: '6001f693a073e80b5adde619',
          studentId: 'ST12346',
          classCode: 'CS101',
          type: 'DROP',
          createdAt: new Date(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockEnrollments);
      mockRepository.count.mockResolvedValue(mockEnrollments.length);

      const expectedResult = {
        data: mockEnrollments,
        page,
        totalPage: Math.ceil(mockEnrollments.length / limit),
        limit,
        total: mockEnrollments.length,
      };

      // Act
      const result = await service.findAll(page, limit);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepository.count).toHaveBeenCalledWith({});
    });
  });

  describe('findByStudentAndClass', () => {
    it('should find enrollment by student and class', async () => {
      // Arrange
      const studentId = 'ST12345';
      const classCode = 'CS101';

      const mockEnrollment: StudentClassEnrollDto = {
        id: '6001f693a073e80b5adde618',
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'COMPLETE',
        createdAt: new Date(),
      };

      mockRepository.findByStudentAndClass.mockResolvedValue(mockEnrollment);

      // Act
      const result = await service.findByStudentAndClass(studentId, classCode);

      // Assert
      expect(result).toEqual(mockEnrollment);
      expect(mockRepository.findByStudentAndClass).toHaveBeenCalledWith(
        studentId,
        classCode,
      );
      expect(mockRepository.findByStudentAndClass).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a student class enrollment successfully', async () => {
      // Arrange
      const enrollId = '6001f693a073e80b5adde618';
      const updateDto: UpdateStudentClassEnrollDTO = {
        type: 'DROP',
      };

      const expectedResult: StudentClassEnrollDto = {
        id: enrollId,
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'DROP',
        createdAt: new Date(),
      };

      mockRepository.update.mockResolvedValue(expectedResult);

      // Act
      const result = await service.update(enrollId, updateDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.update).toHaveBeenCalledWith(enrollId, updateDto);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a student class enrollment successfully', async () => {
      // Arrange
      const enrollId = '6001f693a073e80b5adde618';
      const expectedResult = {
        id: enrollId,
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'COMPLETE',
        createdAt: new Date(),
      };

      mockRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(enrollId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.delete).toHaveBeenCalledWith(enrollId);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
