import { Test, TestingModule } from '@nestjs/testing';
import { StudentClassResultService } from './student-class-result.service';
import { STUDENT_CLASS_RESULT_REPOSITORY } from '../output/IStudentClassResultRepository';
import { CreateStudentClassResultDTO } from '../../dto/create-student-class-result.dto';
import { UpdateStudentClassResultDTO } from '../../dto/update-student-class-result.dto';
import { StudentClassResultDto } from '../../dto/student-class-result.dto';

describe('StudentClassResultService', () => {
  let service: StudentClassResultService;

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
        StudentClassResultService,
        {
          provide: STUDENT_CLASS_RESULT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StudentClassResultService>(StudentClassResultService);

    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should count results with provided where options', async () => {
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
        `Error counting student class results: ${errorMessage}`,
      );
      expect(mockRepository.count).toHaveBeenCalledWith(whereOptions);
    });
  });

  describe('create', () => {
    it('should create a student class result successfully', async () => {
      // Arrange
      const createDto: CreateStudentClassResultDTO = {
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'MIDTERM',
        factor: 0.4,
        score: 8.5,
      };

      const expectedResult: StudentClassResultDto = {
        id: '6001f693a073e80b5adde618',
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'MIDTERM',
        factor: 0.4,
        score: 8.5,
        createdAt: new Date(),
        updatedAt: new Date(),
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
      const createDto: CreateStudentClassResultDTO = {
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'MIDTERM',
        factor: 0.4,
        score: 8.5,
      };

      const errorMessage = 'Validation failed';
      mockRepository.create.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(
        `Error creating student class result: ${errorMessage}`,
      );
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should find all results with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;

      const mockResults: StudentClassResultDto[] = [
        {
          id: '6001f693a073e80b5adde618',
          studentId: 'ST12345',
          classCode: 'CS101',
          type: 'MIDTERM',
          factor: 0.4,
          score: 8.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '6001f693a073e80b5adde619',
          studentId: 'ST12345',
          classCode: 'CS101',
          type: 'FINALTERM',
          factor: 0.6,
          score: 9.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockResults);
      mockRepository.count.mockResolvedValue(mockResults.length);

      const expectedResult = {
        data: mockResults,
        page,
        totalPage: Math.ceil(mockResults.length / limit),
        limit,
        total: mockResults.length,
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
    it('should find results by student and class', async () => {
      // Arrange
      const studentId = 'ST12345';
      const classCode = 'CS101';

      const mockResults: StudentClassResultDto[] = [
        {
          id: '6001f693a073e80b5adde618',
          studentId: 'ST12345',
          classCode: 'CS101',
          type: 'MIDTERM',
          factor: 0.4,
          score: 8.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '6001f693a073e80b5adde619',
          studentId: 'ST12345',
          classCode: 'CS101',
          type: 'FINALTERM',
          factor: 0.6,
          score: 9.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findByStudentAndClass.mockResolvedValue(mockResults);

      // Act
      const result = await service.findByStudentAndClass(studentId, classCode);

      // Assert
      expect(result).toEqual(mockResults);
      expect(mockRepository.findByStudentAndClass).toHaveBeenCalledWith(
        studentId,
        classCode,
      );
      expect(mockRepository.findByStudentAndClass).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a student class result successfully', async () => {
      // Arrange
      const resultId = '6001f693a073e80b5adde618';
      const updateDto: UpdateStudentClassResultDTO = {
        score: 9.2,
      };

      const expectedResult: StudentClassResultDto = {
        id: resultId,
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'MIDTERM',
        factor: 0.4,
        score: 9.2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockResolvedValue(expectedResult);

      // Act
      const result = await service.update(resultId, updateDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.update).toHaveBeenCalledWith(resultId, updateDto);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a student class result successfully', async () => {
      // Arrange
      const resultId = '6001f693a073e80b5adde618';
      const expectedResult = {
        id: resultId,
        studentId: 'ST12345',
        classCode: 'CS101',
        type: 'MIDTERM',
        factor: 0.4,
        score: 8.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(resultId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.delete).toHaveBeenCalledWith(resultId);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
