import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsService } from './programs.service';
import { PROGRAM_REPOSITORY } from '../output/IProgramsRepository';
import { CreateProgramDTO } from '../../dto/create-program.dto';
import { UpdateProgramDTO } from '../../dto/update-program.dto';
import { TranslationService } from 'src/modules/translations/domain/port/input/translation.service';
import { Logger } from '@nestjs/common';

describe('ProgramsService', () => {
  let service: ProgramsService;

  // Create mock implementation for programs repository
  const mockProgramsRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
    findByName: jest.fn(),
  };

  const mockTranslationService = {
    translateAndSave: jest.fn(),
    getAllTranslations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramsService,
        {
          provide: PROGRAM_REPOSITORY,
          useValue: mockProgramsRepository,
        },
        {
          provide: TranslationService,
          useValue: mockTranslationService,
        },
        Logger,
      ],
    }).compile();

    service = module.get<ProgramsService>(ProgramsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should update a program successfully', async () => {
      // Arrange
      const programId = '6001f693a073e80b5adde619';
      const updateProgramDto: UpdateProgramDTO = {
        title: 'Updated Bachelor of Science',
        description: 'Updated description',
      };

      const expectedResult = {
        id: programId,
        title: 'Updated Bachelor of Science',
        description: 'Updated description',
        status: 'ACTIVE',
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
      expect(mockTranslationService.translateAndSave).toHaveBeenCalledWith({
        entity: 'Program',
        entityId: programId,
        fields: {
          title: 'Updated Bachelor of Science',
          description: 'Updated description',
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete a program successfully', async () => {
      // Arrange
      const programId = '6001f693a073e80b5adde619';
      const expectedResult = {
        id: programId,
        title: 'Bachelor of Science in Computer Science',
        description: 'A four-year undergraduate program',
        status: 'ACTIVE',
      };

      mockProgramsRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(programId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProgramsRepository.delete).toHaveBeenCalledWith(programId);
    });
  });

  describe('findAll', () => {
    it('should find all programs with pagination and translation', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const status = 'ACTIVE';
      const lang = 'en';

      const mockPrograms = [
        {
          id: '6001f693a073e80b5adde619',
          title: 'Bachelor of Science in Computer Science',
          description: 'A four-year undergraduate program',
          status: 'ACTIVE',
        },
      ];

      const totalCount = 1;

      mockProgramsRepository.findAll.mockResolvedValue(mockPrograms);
      mockProgramsRepository.count.mockResolvedValue(totalCount);
      mockTranslationService.getAllTranslations.mockResolvedValue([
        {
          field: 'title',
          value: 'Bachelor of Science in Computer Science (Translated)',
        },
      ]);

      // Act
      const result = await service.findAll(page, limit, status, lang);

      // Assert
      expect(result).toEqual({
        data: mockPrograms,
        page,
        totalPage: Math.ceil(totalCount / limit),
        limit,
        total: totalCount,
      });
      expect(mockProgramsRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        status,
      );
      expect(mockProgramsRepository.count).toHaveBeenCalledWith({ status });
      expect(mockTranslationService.getAllTranslations).toHaveBeenCalled();
    });

    it('should find all programs without translation when lang is not provided', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const status = 'ACTIVE';

      const mockPrograms = [
        {
          id: '6001f693a073e80b5adde619',
          title: 'Bachelor of Science in Computer Science',
          description: 'A four-year undergraduate program',
          status: 'ACTIVE',
        },
      ];

      const totalCount = 1;

      mockProgramsRepository.findAll.mockResolvedValue(mockPrograms);
      mockProgramsRepository.count.mockResolvedValue(totalCount);

      // Act
      const result = await service.findAll(page, limit, status);

      // Assert
      expect(result).toEqual({
        data: mockPrograms,
        page,
        totalPage: Math.ceil(totalCount / limit),
        limit,
        total: totalCount,
      });
      expect(mockProgramsRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        status,
      );
      expect(mockProgramsRepository.count).toHaveBeenCalledWith({ status });
      expect(mockTranslationService.getAllTranslations).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a program by ID with translation', async () => {
      // Arrange
      const programId = '6001f693a073e80b5adde619';
      const lang = 'en';

      const expectedProgram = {
        id: programId,
        title: 'Bachelor of Science in Computer Science',
        description: 'A four-year undergraduate program',
        status: 'ACTIVE',
      };

      mockProgramsRepository.findById.mockResolvedValue(expectedProgram);
      mockTranslationService.getAllTranslations.mockResolvedValue([
        {
          field: 'title',
          value: 'Bachelor of Science in Computer Science (Translated)',
        },
      ]);

      // Act
      const result = await service.findById(programId, lang);

      // Assert
      expect(result.id).toEqual(programId);
      expect(mockProgramsRepository.findById).toHaveBeenCalledWith(programId);
      expect(mockTranslationService.getAllTranslations).toHaveBeenCalledWith(
        'Program',
        programId,
        undefined,
        lang,
      );
    });

    it('should find a program by ID without translation when lang is not provided', async () => {
      // Arrange
      const programId = '6001f693a073e80b5adde619';

      const expectedProgram = {
        id: programId,
        title: 'Bachelor of Science in Computer Science',
        description: 'A four-year undergraduate program',
        status: 'ACTIVE',
      };

      mockProgramsRepository.findById.mockResolvedValue(expectedProgram);

      // Act
      const result = await service.findById(programId);

      // Assert
      expect(result).toEqual(expectedProgram);
      expect(mockProgramsRepository.findById).toHaveBeenCalledWith(programId);
      expect(mockTranslationService.getAllTranslations).not.toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should count programs', async () => {
      // Arrange
      const whereOptions = { status: 'ACTIVE' };
      const expectedCount = 5;

      mockProgramsRepository.count.mockResolvedValue(expectedCount);

      // Act
      const result = await service.count(whereOptions);

      // Assert
      expect(result).toEqual(expectedCount);
      expect(mockProgramsRepository.count).toHaveBeenCalledWith(whereOptions);
    });
  });
});
