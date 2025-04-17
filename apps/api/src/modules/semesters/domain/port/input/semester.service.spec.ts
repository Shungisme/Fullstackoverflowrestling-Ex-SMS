import { Test, TestingModule } from '@nestjs/testing';
import { SemesterService } from './semester.service';
import { SEMESTER_REPOSITORY } from '../output/ISemesterRepository';
import { CreateSemesterDTO } from '../../dto/create-semester.dto';
import { UpdateSemesterDTO } from '../../dto/update-semester.dto';
import { SemesterDto } from '../../dto/semester.dto';

describe('SemesterService', () => {
  let service: SemesterService;

  // Create mock implementation for semester repository
  const mockSemesterRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SemesterService,
        {
          provide: SEMESTER_REPOSITORY,
          useValue: mockSemesterRepository,
        },
      ],
    }).compile();

    service = module.get<SemesterService>(SemesterService);

    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should count semesters with provided where options', async () => {
      // Arrange
      const whereOptions = {};
      const expectedCount = 5;
      mockSemesterRepository.count.mockResolvedValue(expectedCount);

      // Act
      const result = await service.count(whereOptions);

      // Assert
      expect(result).toEqual(expectedCount);
      expect(mockSemesterRepository.count).toHaveBeenCalledWith(whereOptions);
      expect(mockSemesterRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository count fails', async () => {
      // Arrange
      const whereOptions = {};
      const errorMessage = 'Database error';
      mockSemesterRepository.count.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.count(whereOptions)).rejects.toThrow(
        `Error counting semesters: ${errorMessage}`,
      );
      expect(mockSemesterRepository.count).toHaveBeenCalledWith(whereOptions);
    });
  });

  describe('create', () => {
    it('should create a semester successfully', async () => {
      // Arrange
      const createSemesterDto: CreateSemesterDTO = {
        academicYear: '2023-2024',
        semester: 1,
        startedAt: new Date('2023-09-01'),
        endedAt: new Date('2024-01-15'),
      };

      const expectedResult: SemesterDto = {
        id: '6001f693a073e80b5adde618',
        academicYear: '2023-2024',
        semester: 1,
        startedAt: new Date('2023-09-01'),
        endedAt: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSemesterRepository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(createSemesterDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSemesterRepository.create).toHaveBeenCalledWith(
        createSemesterDto,
      );
      expect(mockSemesterRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository create fails', async () => {
      // Arrange
      const createSemesterDto: CreateSemesterDTO = {
        academicYear: '2023-2024',
        semester: 1,
        startedAt: new Date('2023-09-01'),
        endedAt: new Date('2024-01-15'),
      };

      const errorMessage = 'Validation failed';
      mockSemesterRepository.create.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.create(createSemesterDto)).rejects.toThrow(
        `Error creating semester: ${errorMessage}`,
      );
      expect(mockSemesterRepository.create).toHaveBeenCalledWith(
        createSemesterDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a semester successfully', async () => {
      // Arrange
      const semesterId = '6001f693a073e80b5adde618';
      const expectedResult = {
        id: semesterId,
        academicYear: '2023-2024',
        semester: 1,
        startedAt: new Date('2023-09-01'),
        endedAt: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSemesterRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(semesterId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSemesterRepository.delete).toHaveBeenCalledWith(semesterId);
      expect(mockSemesterRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository delete fails', async () => {
      // Arrange
      const semesterId = '6001f693a073e80b5adde618';
      const errorMessage = 'Semester not found';
      mockSemesterRepository.delete.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.delete(semesterId)).rejects.toThrow(
        `Error deleting semester with ID ${semesterId}: ${errorMessage}`,
      );
      expect(mockSemesterRepository.delete).toHaveBeenCalledWith(semesterId);
    });
  });

  describe('findAll', () => {
    it('should find all semesters with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;

      const mockSemesters: SemesterDto[] = [
        {
          id: '6001f693a073e80b5adde618',
          academicYear: '2023-2024',
          semester: 1,
          startedAt: new Date('2023-09-01'),
          endedAt: new Date('2024-01-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '6001f693a073e80b5adde619',
          academicYear: '2023-2024',
          semester: 2,
          startedAt: new Date('2024-01-20'),
          endedAt: new Date('2024-05-30'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockSemesterRepository.findAll.mockResolvedValue(mockSemesters);
      mockSemesterRepository.count.mockResolvedValue(mockSemesters.length);

      const expectedResult = {
        data: mockSemesters,
        page,
        totalPage: Math.ceil(mockSemesters.length / limit),
        limit,
        total: mockSemesters.length,
      };

      // Act
      const result = await service.findAll(page, limit);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSemesterRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(mockSemesterRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.count).toHaveBeenCalledWith({});
    });

    it('should handle empty result when finding semesters', async () => {
      // Arrange
      const page = 1;
      const limit = 10;

      const mockSemesters: SemesterDto[] = [];

      mockSemesterRepository.findAll.mockResolvedValue(mockSemesters);
      mockSemesterRepository.count.mockResolvedValue(0);

      const expectedResult = {
        data: mockSemesters,
        page,
        totalPage: Math.ceil(mockSemesters.length / limit),
        limit,
        total: mockSemesters.length,
      };

      // Act
      const result = await service.findAll(page, limit);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSemesterRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(mockSemesterRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.count).toHaveBeenCalledWith({});
    });

    it('should throw an error when repository findAll fails', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const errorMessage = 'Database connection error';
      mockSemesterRepository.findAll.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.findAll(page, limit)).rejects.toThrow(
        `Error finding all semesters: ${errorMessage}`,
      );
      expect(mockSemesterRepository.findAll).toHaveBeenCalledWith(page, limit);
    });
  });

  describe('findById', () => {
    it('should find a semester by id successfully', async () => {
      // Arrange
      const semesterId = '6001f693a073e80b5adde618';
      const expectedResult: SemesterDto = {
        id: semesterId,
        academicYear: '2023-2024',
        semester: 1,
        startedAt: new Date('2023-09-01'),
        endedAt: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSemesterRepository.findById.mockResolvedValue(expectedResult);

      // Act
      const result = await service.findById(semesterId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSemesterRepository.findById).toHaveBeenCalledWith(semesterId);
      expect(mockSemesterRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository findById fails', async () => {
      // Arrange
      const semesterId = '6001f693a073e80b5adde618';
      const errorMessage = 'Semester not found';
      mockSemesterRepository.findById.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(service.findById(semesterId)).rejects.toThrow(
        `Error finding semester with ID ${semesterId}: ${errorMessage}`,
      );
      expect(mockSemesterRepository.findById).toHaveBeenCalledWith(semesterId);
    });
  });

  describe('update', () => {
    it('should update a semester successfully', async () => {
      // Arrange
      const semesterId = '6001f693a073e80b5adde618';
      const updateSemesterDto: UpdateSemesterDTO = {
        startedAt: new Date('2023-09-05'),
        endedAt: new Date('2024-01-20'),
      };

      const expectedResult: SemesterDto = {
        id: semesterId,
        academicYear: '2023-2024',
        semester: 1,
        startedAt: new Date('2023-09-05'),
        endedAt: new Date('2024-01-20'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSemesterRepository.update.mockResolvedValue(expectedResult);

      // Act
      const result = await service.update(semesterId, updateSemesterDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSemesterRepository.update).toHaveBeenCalledWith(
        semesterId,
        updateSemesterDto,
      );
      expect(mockSemesterRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository update fails', async () => {
      // Arrange
      const semesterId = '6001f693a073e80b5adde618';
      const updateSemesterDto: UpdateSemesterDTO = {
        startedAt: new Date('2023-09-05'),
        endedAt: new Date('2024-01-20'),
      };

      const errorMessage = 'Semester not found';
      mockSemesterRepository.update.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(
        service.update(semesterId, updateSemesterDto),
      ).rejects.toThrow(
        `Error updating semester with ID ${semesterId}: ${errorMessage}`,
      );
      expect(mockSemesterRepository.update).toHaveBeenCalledWith(
        semesterId,
        updateSemesterDto,
      );
    });
  });
});
