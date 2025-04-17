import { Test, TestingModule } from '@nestjs/testing';
import { FacultiesService } from './faculties.service';
import { FACULTIES_REPOSITORY } from '../output/IFacultiesRepository';
import { CreateFacultyDTO } from '../../dto/create-faculty.dto';
import { UpdateFacultyDTO } from '../../dto/update-faculty.dto';
import { FacultiesDto } from '../../dto/faculties.dto';

describe('FacultiesService', () => {
  let service: FacultiesService;

  // Create mock implementation for faculties repository
  const mockFacultiesRepository = {
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
        FacultiesService,
        {
          provide: FACULTIES_REPOSITORY,
          useValue: mockFacultiesRepository,
        },
      ],
    }).compile();

    service = module.get<FacultiesService>(FacultiesService);

    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should count faculties with provided where options', async () => {
      // Arrange
      const whereOptions = { status: 'active' };
      const expectedCount = 5;
      mockFacultiesRepository.count.mockResolvedValue(expectedCount);

      // Act
      const result = await service.count(whereOptions);

      // Assert
      expect(result).toEqual(expectedCount);
      expect(mockFacultiesRepository.count).toHaveBeenCalledWith(whereOptions);
      expect(mockFacultiesRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository count fails', async () => {
      // Arrange
      const whereOptions = { status: 'active' };
      const errorMessage = 'Database error';
      mockFacultiesRepository.count.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.count(whereOptions)).rejects.toThrow(
        `Error counting faculties: ${errorMessage}`,
      );
      expect(mockFacultiesRepository.count).toHaveBeenCalledWith(whereOptions);
    });
  });

  describe('create', () => {
    it('should create a faculty successfully', async () => {
      // Arrange
      const createFacultyDto: CreateFacultyDTO = {
        title: 'Computer Science',
        description: 'Faculty of Computer Science and Engineering',
        status: 'active',
      };

      const expectedResult: FacultiesDto = {
        id: '6001f693a073e80b5adde618',
        title: 'Computer Science',
        description: 'Faculty of Computer Science and Engineering',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFacultiesRepository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(createFacultyDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockFacultiesRepository.create).toHaveBeenCalledWith(
        createFacultyDto,
      );
      expect(mockFacultiesRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository create fails', async () => {
      // Arrange
      const createFacultyDto: CreateFacultyDTO = {
        title: 'Computer Science',
        description: 'Faculty of Computer Science and Engineering',
        status: 'active',
      };

      const errorMessage = 'Validation failed';
      mockFacultiesRepository.create.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.create(createFacultyDto)).rejects.toThrow(
        `Error creating faculty: ${errorMessage}`,
      );
      expect(mockFacultiesRepository.create).toHaveBeenCalledWith(
        createFacultyDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a faculty successfully', async () => {
      // Arrange
      const facultyId = '6001f693a073e80b5adde618';
      const expectedResult = {
        id: facultyId,
        deleted: true,
        message: 'Faculty deleted successfully',
      };

      mockFacultiesRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(facultyId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockFacultiesRepository.delete).toHaveBeenCalledWith(facultyId);
      expect(mockFacultiesRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository delete fails', async () => {
      // Arrange
      const facultyId = '6001f693a073e80b5adde618';
      const errorMessage = 'Faculty not found';
      mockFacultiesRepository.delete.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.delete(facultyId)).rejects.toThrow(
        `Error deleting faculty with ID ${facultyId}: ${errorMessage}`,
      );
      expect(mockFacultiesRepository.delete).toHaveBeenCalledWith(facultyId);
    });
  });

  describe('findAll', () => {
    it('should find all faculties with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const status = 'active';

      const mockFaculties: FacultiesDto[] = [
        {
          id: '6001f693a073e80b5adde618',
          title: 'Computer Science',
          description: 'Faculty of Computer Science and Engineering',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '6001f693a073e80b5adde619',
          title: 'Business Administration',
          description: 'Faculty of Business and Economics',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockFacultiesRepository.findAll.mockResolvedValue(mockFaculties);

      const expectedResult = {
        data: mockFaculties,
        page,
        totalPage: Math.ceil(mockFaculties.length / limit),
        limit,
        total: mockFaculties.length,
      };

      // Act
      const result = await service.findAll(page, limit, status);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockFacultiesRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        status,
      );
      expect(mockFacultiesRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle empty result when finding faculties', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const status = 'active';

      const mockFaculties: FacultiesDto[] = [];

      mockFacultiesRepository.findAll.mockResolvedValue(mockFaculties);

      const expectedResult = {
        data: mockFaculties,
        page,
        totalPage: Math.ceil(mockFaculties.length / limit),
        limit,
        total: mockFaculties.length,
      };

      // Act
      const result = await service.findAll(page, limit, status);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockFacultiesRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        status,
      );
      expect(mockFacultiesRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository findAll fails', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const status = 'active';
      const errorMessage = 'Database connection error';
      mockFacultiesRepository.findAll.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(service.findAll(page, limit, status)).rejects.toThrow(
        `Error finding all faculties: ${errorMessage}`,
      );
      expect(mockFacultiesRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        status,
      );
    });
  });

  describe('findById', () => {
    it('should find a faculty by id successfully', async () => {
      // Arrange
      const facultyId = '6001f693a073e80b5adde618';
      const expectedResult: FacultiesDto = {
        id: facultyId,
        title: 'Computer Science',
        description: 'Faculty of Computer Science and Engineering',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFacultiesRepository.findById.mockResolvedValue(expectedResult);

      // Act
      const result = await service.findById(facultyId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockFacultiesRepository.findById).toHaveBeenCalledWith(facultyId);
      expect(mockFacultiesRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository findById fails', async () => {
      // Arrange
      const facultyId = '6001f693a073e80b5adde618';
      const errorMessage = 'Faculty not found';
      mockFacultiesRepository.findById.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(service.findById(facultyId)).rejects.toThrow(
        `Error finding faculty with ID ${facultyId}: ${errorMessage}`,
      );
      expect(mockFacultiesRepository.findById).toHaveBeenCalledWith(facultyId);
    });
  });

  describe('update', () => {
    it('should update a faculty successfully', async () => {
      // Arrange
      const facultyId = '6001f693a073e80b5adde618';
      const updateFacultyDto: UpdateFacultyDTO = {
        title: 'Updated Computer Science',
        description: 'Updated Faculty of Computer Science and Engineering',
      };

      const expectedResult: FacultiesDto = {
        id: facultyId,
        title: 'Updated Computer Science',
        description: 'Updated Faculty of Computer Science and Engineering',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFacultiesRepository.update.mockResolvedValue(expectedResult);

      // Act
      const result = await service.update(facultyId, updateFacultyDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockFacultiesRepository.update).toHaveBeenCalledWith(
        facultyId,
        updateFacultyDto,
      );
      expect(mockFacultiesRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository update fails', async () => {
      // Arrange
      const facultyId = '6001f693a073e80b5adde618';
      const updateFacultyDto: UpdateFacultyDTO = {
        title: 'Updated Computer Science',
        description: 'Updated Faculty of Computer Science and Engineering',
      };

      const errorMessage = 'Faculty not found';
      mockFacultiesRepository.update.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.update(facultyId, updateFacultyDto)).rejects.toThrow(
        `Error updating faculty with ID ${facultyId}: ${errorMessage}`,
      );
      expect(mockFacultiesRepository.update).toHaveBeenCalledWith(
        facultyId,
        updateFacultyDto,
      );
    });
  });
});
