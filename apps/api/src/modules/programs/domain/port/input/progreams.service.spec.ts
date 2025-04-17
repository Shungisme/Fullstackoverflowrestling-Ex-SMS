import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsService } from './programs.service';
import { PROGRAM_REPOSITORY } from '../output/IProgramsRepository';
import { CreateProgramDTO } from '../../dto/create-program.dto';
import { UpdateProgramDTO } from '../../dto/update-program.dto';
import { ProgramsDto } from '../../dto/programs.dto';

describe('ProgramsService', () => {
  let service: ProgramsService;

  // Mock the repository
  const mockProgramsRepository = {
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
        ProgramsService,
        {
          provide: PROGRAM_REPOSITORY,
          useValue: mockProgramsRepository,
        },
      ],
    }).compile();

    service = module.get<ProgramsService>(ProgramsService);

    // Clear all mock implementations and calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should return the count of programs', async () => {
      // Arrange
      const whereOptions = { status: 'active' };
      const expectedCount = 10;
      mockProgramsRepository.count.mockResolvedValue(expectedCount);

      // Act
      const result = await service.count(whereOptions);

      // Assert
      expect(result).toEqual(expectedCount);
      expect(mockProgramsRepository.count).toHaveBeenCalledWith(whereOptions);
      expect(mockProgramsRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository count fails', async () => {
      // Arrange
      const whereOptions = { status: 'active' };
      const errorMessage = 'Database error';
      mockProgramsRepository.count.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.count(whereOptions)).rejects.toThrow(
        `Error counting programs: ${errorMessage}`,
      );
      expect(mockProgramsRepository.count).toHaveBeenCalledWith(whereOptions);
    });
  });

  describe('create', () => {
    it('should create a program successfully', async () => {
      // Arrange
      const createProgramDto: CreateProgramDTO = {
        title: 'Computer Science',
        description: 'Bachelor of Science in Computer Science',
        status: 'active',
      };

      const expectedResult: ProgramsDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createProgramDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProgramsRepository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(createProgramDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProgramsRepository.create).toHaveBeenCalledWith(
        createProgramDto,
      );
      expect(mockProgramsRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository create fails', async () => {
      // Arrange
      const createProgramDto: CreateProgramDTO = {
        title: 'Computer Science',
        description: 'Bachelor of Science in Computer Science',
        status: 'active',
      };

      const errorMessage = 'Validation failed';
      mockProgramsRepository.create.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.create(createProgramDto)).rejects.toThrow(
        `Error creating program: ${errorMessage}`,
      );
      expect(mockProgramsRepository.create).toHaveBeenCalledWith(
        createProgramDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a program successfully', async () => {
      // Arrange
      const programId = '123e4567-e89b-12d3-a456-426614174002';
      const expectedResult: ProgramsDto = {
        id: programId,
        title: 'Computer Science',
        description: 'Bachelor of Science in Computer Science',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProgramsRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(programId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProgramsRepository.delete).toHaveBeenCalledWith(programId);
      expect(mockProgramsRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository delete fails', async () => {
      // Arrange
      const programId = '123e4567-e89b-12d3-a456-426614174002';
      const errorMessage = 'Program not found';
      mockProgramsRepository.delete.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.delete(programId)).rejects.toThrow(
        `Error deleting program with ID ${programId}: ${errorMessage}`,
      );
      expect(mockProgramsRepository.delete).toHaveBeenCalledWith(programId);
    });
  });

  describe('findAll', () => {
    it('should find all programs with pagination and status filter', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const status = 'active';
      const mockPrograms: ProgramsDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          title: 'Computer Science',
          description: 'Bachelor of Science in Computer Science',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          title: 'Mathematics',
          description: 'Bachelor of Science in Mathematics',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockProgramsRepository.findAll.mockResolvedValue(mockPrograms);

      const expectedResult = {
        data: mockPrograms,
        page,
        totalPage: Math.ceil(mockPrograms.length / limit),
        limit,
        total: mockPrograms.length,
      };

      // Act
      const result = await service.findAll(page, limit, status);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProgramsRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        status,
      );
      expect(mockProgramsRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle empty result when finding programs', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const status = 'inactive';
      const mockPrograms: ProgramsDto[] = [];

      mockProgramsRepository.findAll.mockResolvedValue(mockPrograms);

      const expectedResult = {
        data: mockPrograms,
        page,
        totalPage: Math.ceil(mockPrograms.length / limit),
        limit,
        total: mockPrograms.length,
      };

      // Act
      const result = await service.findAll(page, limit, status);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProgramsRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        status,
      );
      expect(mockProgramsRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository findAll fails', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const status = 'active';
      const errorMessage = 'Database error';
      mockProgramsRepository.findAll.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.findAll(page, limit, status)).rejects.toThrow(
        `Error finding all programs: ${errorMessage}`,
      );
      expect(mockProgramsRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        status,
      );
    });
  });

  describe('findById', () => {
    it('should find a program by id successfully', async () => {
      // Arrange
      const programId = '123e4567-e89b-12d3-a456-426614174002';
      const expectedResult: ProgramsDto = {
        id: programId,
        title: 'Computer Science',
        description: 'Bachelor of Science in Computer Science',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProgramsRepository.findById.mockResolvedValue(expectedResult);

      // Act
      const result = await service.findById(programId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProgramsRepository.findById).toHaveBeenCalledWith(programId);
      expect(mockProgramsRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository findById fails', async () => {
      // Arrange
      const programId = '123e4567-e89b-12d3-a456-426614174002';
      const errorMessage = 'Program not found';
      mockProgramsRepository.findById.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(service.findById(programId)).rejects.toThrow(
        `Error finding program with ID ${programId}: ${errorMessage}`,
      );
      expect(mockProgramsRepository.findById).toHaveBeenCalledWith(programId);
    });
  });

  describe('update', () => {
    it('should update a program successfully', async () => {
      // Arrange
      const programId = '123e4567-e89b-12d3-a456-426614174002';
      const updateProgramDto: UpdateProgramDTO = {
        title: 'Updated Computer Science',
        status: 'inactive',
      };

      const expectedResult: ProgramsDto = {
        id: programId,
        title: 'Updated Computer Science',
        description: 'Bachelor of Science in Computer Science',
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProgramsRepository.update.mockResolvedValue(expectedResult);

      // Act
      const result = await service.update(programId, updateProgramDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProgramsRepository.update).toHaveBeenCalledWith(
        programId,
        updateProgramDto,
      );
      expect(mockProgramsRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository update fails', async () => {
      // Arrange
      const programId = '123e4567-e89b-12d3-a456-426614174002';
      const updateProgramDto: UpdateProgramDTO = {
        title: 'Updated Computer Science',
        status: 'inactive',
      };

      const errorMessage = 'Program not found';
      mockProgramsRepository.update.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.update(programId, updateProgramDto)).rejects.toThrow(
        `Error updating program with ID ${programId}: ${errorMessage}`,
      );
      expect(mockProgramsRepository.update).toHaveBeenCalledWith(
        programId,
        updateProgramDto,
      );
    });
  });
});
