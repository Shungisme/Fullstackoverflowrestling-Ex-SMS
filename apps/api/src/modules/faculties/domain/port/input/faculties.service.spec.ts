import { Test, TestingModule } from '@nestjs/testing';
import { FacultiesService } from './faculties.service';
import { FACULTIES_REPOSITORY } from '../output/IFacultiesRepository';
import { CreateFacultyDTO } from '../../dto/create-faculty.dto';
import { UpdateFacultyDTO } from '../../dto/update-faculty.dto';
import { TranslationService } from 'src/modules/translations/domain/port/input/translation.service';
import { Logger } from '@nestjs/common';

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
    findByName: jest.fn(),
  };

  const mockTranslationService = {
    translateAndSave: jest.fn(),
    getAllTranslations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacultiesService,
        {
          provide: FACULTIES_REPOSITORY,
          useValue: mockFacultiesRepository,
        },
        {
          provide: TranslationService,
          useValue: mockTranslationService,
        },
        Logger,
      ],
    }).compile();

    service = module.get<FacultiesService>(FacultiesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should update a faculty successfully', async () => {
      // Arrange
      const facultyId = '6001f693a073e80b5adde618';
      const updateFacultyDto: UpdateFacultyDTO = {
        title: 'Updated Computer Science',
        description: 'Updated description',
      };

      const expectedResult = {
        id: facultyId,
        title: 'Updated Computer Science',
        description: 'Updated description',
        status: 'ACTIVE',
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
      expect(mockTranslationService.translateAndSave).toHaveBeenCalledWith({
        entity: 'Faculty',
        entityId: facultyId,
        fields: {
          title: 'Updated Computer Science',
          description: 'Updated description',
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete a faculty successfully', async () => {
      // Arrange
      const facultyId = '6001f693a073e80b5adde618';
      const expectedResult = {
        id: facultyId,
        title: 'Computer Science',
        description: 'Faculty of Computer Science and Engineering',
        status: 'ACTIVE',
      };

      mockFacultiesRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(facultyId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockFacultiesRepository.delete).toHaveBeenCalledWith(facultyId);
    });
  });

  describe('findById', () => {
    it('should find a faculty by ID with translation', async () => {
      // Arrange
      const facultyId = '6001f693a073e80b5adde618';
      const lang = 'en';

      const expectedFaculty = {
        id: facultyId,
        title: 'Computer Science',
        description: 'Faculty of Computer Science and Engineering',
        status: 'ACTIVE',
      };

      mockFacultiesRepository.findById.mockResolvedValue(expectedFaculty);
      mockTranslationService.getAllTranslations.mockResolvedValue([
        {
          field: 'title',
          value: 'Computer Science (Translated)',
        },
      ]);

      // Act
      const result = await service.findById(facultyId, lang);

      // Assert
      expect(result.id).toEqual(facultyId);
      expect(mockFacultiesRepository.findById).toHaveBeenCalledWith(facultyId);
      expect(mockTranslationService.getAllTranslations).toHaveBeenCalledWith(
        'Faculty',
        facultyId,
        undefined,
        lang,
      );
    });

    it('should find a faculty by ID without translation when lang is not provided', async () => {
      // Arrange
      const facultyId = '6001f693a073e80b5adde618';

      const expectedFaculty = {
        id: facultyId,
        title: 'Computer Science',
        description: 'Faculty of Computer Science and Engineering',
        status: 'ACTIVE',
      };

      mockFacultiesRepository.findById.mockResolvedValue(expectedFaculty);

      // Act
      const result = await service.findById(facultyId);

      // Assert
      expect(result).toEqual(expectedFaculty);
      expect(mockFacultiesRepository.findById).toHaveBeenCalledWith(facultyId);
      expect(mockTranslationService.getAllTranslations).not.toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should count faculties', async () => {
      // Arrange
      const whereOptions = { status: 'ACTIVE' };
      const expectedCount = 5;

      mockFacultiesRepository.count.mockResolvedValue(expectedCount);

      // Act
      const result = await service.count(whereOptions);

      // Assert
      expect(result).toEqual(expectedCount);
      expect(mockFacultiesRepository.count).toHaveBeenCalledWith(whereOptions);
    });
  });
});
