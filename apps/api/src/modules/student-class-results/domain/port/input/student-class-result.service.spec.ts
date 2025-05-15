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

  // Setup common test data
  const mockStudentId = 'ST12345';
  const mockClassCode = 'CS101';
  const mockResultId = '6001f693a073e80b5adde618';

  const mockResult: StudentClassResultDto = {
    id: mockResultId,
    studentId: mockStudentId,
    classCode: mockClassCode,
    type: 'MIDTERM',
    factor: 0.4,
    score: 8.5,
    createdAt: new Date('2023-01-15T10:00:00Z'),
    updatedAt: new Date('2023-01-15T10:00:00Z'),
  };

  const mockResults: StudentClassResultDto[] = [
    mockResult,
    {
      id: '6001f693a073e80b5adde619',
      studentId: mockStudentId,
      classCode: mockClassCode,
      type: 'FINALTERM',
      factor: 0.6,
      score: 9.0,
      createdAt: new Date('2023-01-20T10:00:00Z'),
      updatedAt: new Date('2023-01-20T10:00:00Z'),
    },
  ];

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
      const whereOptions = { classCode: mockClassCode };
      const expectedCount = 5;
      mockRepository.count.mockResolvedValue(expectedCount);

      // Act
      const result = await service.count(whereOptions);

      // Assert
      expect(result).toBe(expectedCount);
      expect(mockRepository.count).toHaveBeenCalledWith(whereOptions);
      expect(mockRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository count fails', async () => {
      // Arrange
      const whereOptions = { classCode: mockClassCode };
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
        studentId: mockStudentId,
        classCode: mockClassCode,
        type: 'MIDTERM',
        factor: 0.4,
        score: 8.5,
      };
      mockRepository.create.mockResolvedValue(mockResult);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(mockResult);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository create fails', async () => {
      // Arrange
      const createDto: CreateStudentClassResultDTO = {
        studentId: mockStudentId,
        classCode: mockClassCode,
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

  describe('delete', () => {
    it('should delete a student class result successfully', async () => {
      // Arrange
      mockRepository.delete.mockResolvedValue(mockResult);

      // Act
      const result = await service.delete(mockResultId);

      // Assert
      expect(result).toEqual(mockResult);
      expect(mockRepository.delete).toHaveBeenCalledWith(mockResultId);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository delete fails', async () => {
      // Arrange
      const errorMessage = 'Record not found';
      mockRepository.delete.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.delete(mockResultId)).rejects.toThrow(
        `Error deleting student class result with ID ${mockResultId}: ${errorMessage}`,
      );
      expect(mockRepository.delete).toHaveBeenCalledWith(mockResultId);
    });
  });

  describe('findAll', () => {
    it('should find all results with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
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
      expect(mockRepository.count).toHaveBeenCalledWith({});
    });

    it('should handle empty results', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      mockRepository.findAll.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(0);

      const expectedResult = {
        data: [],
        page,
        totalPage: 0,
        limit,
        total: 0,
      };

      // Act
      const result = await service.findAll(page, limit);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error when repository findAll fails', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const errorMessage = 'Database query failed';
      mockRepository.findAll.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.findAll(page, limit)).rejects.toThrow(
        `Error finding all student class results: ${errorMessage}`,
      );
    });
  });

  describe('findById', () => {
    it('should find a result by id successfully', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockResult);

      // Act
      const result = await service.findById(mockResultId);

      // Assert
      expect(result).toEqual(mockResult);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockResultId);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository findById fails', async () => {
      // Arrange
      const errorMessage = 'Result not found';
      mockRepository.findById.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.findById(mockResultId)).rejects.toThrow(
        `Error finding student class result with ID ${mockResultId}: ${errorMessage}`,
      );
      expect(mockRepository.findById).toHaveBeenCalledWith(mockResultId);
    });
  });

  describe('findByStudentAndClass', () => {
    it('should find results by student and class successfully', async () => {
      // Arrange
      mockRepository.findByStudentAndClass.mockResolvedValue(mockResults);

      // Act
      const result = await service.findByStudentAndClass(
        mockStudentId,
        mockClassCode,
      );

      // Assert
      expect(result).toEqual(mockResults);
      expect(mockRepository.findByStudentAndClass).toHaveBeenCalledWith(
        mockStudentId,
        mockClassCode,
      );
      expect(mockRepository.findByStudentAndClass).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no results found', async () => {
      // Arrange
      mockRepository.findByStudentAndClass.mockResolvedValue([]);

      // Act
      const result = await service.findByStudentAndClass(
        mockStudentId,
        mockClassCode,
      );

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw an error when repository findByStudentAndClass fails', async () => {
      // Arrange
      const errorMessage = 'Query failed';
      mockRepository.findByStudentAndClass.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(
        service.findByStudentAndClass(mockStudentId, mockClassCode),
      ).rejects.toThrow(
        `Error finding results for student ${mockStudentId} and class ${mockClassCode}: ${errorMessage}`,
      );
    });
  });

  describe('findByStudent', () => {
    it('should find results by student with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      mockRepository.findByStudent.mockResolvedValue(mockResults);
      mockRepository.count.mockResolvedValue(mockResults.length);

      const expectedResult = {
        data: mockResults,
        page,
        totalPage: Math.ceil(mockResults.length / limit),
        limit,
        total: mockResults.length,
      };

      // Act
      const result = await service.findByStudent(mockStudentId, page, limit);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.findByStudent).toHaveBeenCalledWith(
        mockStudentId,
        page,
        limit,
      );
      expect(mockRepository.count).toHaveBeenCalledWith({
        studentId: mockStudentId,
      });
    });

    it('should throw an error when repository findByStudent fails', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const errorMessage = 'Student not found';
      mockRepository.findByStudent.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(
        service.findByStudent(mockStudentId, page, limit),
      ).rejects.toThrow(
        `Error finding results for student ${mockStudentId}: ${errorMessage}`,
      );
    });
  });

  describe('findByClass', () => {
    it('should find results by class with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      mockRepository.findByClass.mockResolvedValue(mockResults);
      mockRepository.count.mockResolvedValue(mockResults.length);

      const expectedResult = {
        data: mockResults,
        page,
        totalPage: Math.ceil(mockResults.length / limit),
        limit,
        total: mockResults.length,
      };

      // Act
      const result = await service.findByClass(mockClassCode, page, limit);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.findByClass).toHaveBeenCalledWith(
        mockClassCode,
        page,
        limit,
      );
      expect(mockRepository.count).toHaveBeenCalledWith({
        classCode: mockClassCode,
      });
    });

    it('should throw an error when repository findByClass fails', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const errorMessage = 'Class not found';
      mockRepository.findByClass.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(
        service.findByClass(mockClassCode, page, limit),
      ).rejects.toThrow(
        `Error finding results for class ${mockClassCode}: ${errorMessage}`,
      );
    });
  });

  describe('update', () => {
    it('should update a student class result successfully', async () => {
      // Arrange
      const updateDto: UpdateStudentClassResultDTO = {
        score: 9.2,
      };

      const updatedResult = {
        ...mockResult,
        score: 9.2,
        updatedAt: new Date('2023-01-16T10:00:00Z'),
      };

      mockRepository.update.mockResolvedValue(updatedResult);

      // Act
      const result = await service.update(mockResultId, updateDto);

      // Assert
      expect(result).toEqual(updatedResult);
      expect(mockRepository.update).toHaveBeenCalledWith(
        mockResultId,
        updateDto,
      );
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository update fails', async () => {
      // Arrange
      const updateDto: UpdateStudentClassResultDTO = {
        score: 9.2,
      };
      const errorMessage = 'Record not found';
      mockRepository.update.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.update(mockResultId, updateDto)).rejects.toThrow(
        `Error updating student class result with ID ${mockResultId}: ${errorMessage}`,
      );
      expect(mockRepository.update).toHaveBeenCalledWith(
        mockResultId,
        updateDto,
      );
    });
  });
});
