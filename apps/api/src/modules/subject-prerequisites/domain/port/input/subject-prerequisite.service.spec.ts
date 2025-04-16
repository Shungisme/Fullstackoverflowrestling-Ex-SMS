import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SubjectPrerequisiteService } from './subject-prerequisite.service';
import { SUBJECT_PREREQUISITE_REPOSITORY } from '../output/ISubjectPrerequisiteRepository';
import { CreateSubjectPrerequisiteDTO } from '../../dto/create-subject-prerequisite.dto';
import { UpdateSubjectPrerequisiteDTO } from '../../dto/update-subject-prerequisite.dto';
import { SubjectPrerequisiteResponseDto } from '../../dto/subject-prerequisite.dto';

describe('SubjectPrerequisiteService', () => {
  let service: SubjectPrerequisiteService;

  // Create mock implementation for subject prerequisites repository
  const mockPrerequisiteRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findBySubjectId: jest.fn(),
    findByPrerequisiteSubjectId: jest.fn(),
    count: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectPrerequisiteService,
        {
          provide: SUBJECT_PREREQUISITE_REPOSITORY,
          useValue: mockPrerequisiteRepository,
        },
      ],
    }).compile();

    service = module.get<SubjectPrerequisiteService>(
      SubjectPrerequisiteService,
    );

    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a subject prerequisite successfully', async () => {
      // Arrange
      const createDto: CreateSubjectPrerequisiteDTO = {
        subjectId: 'subject1',
        prerequisiteSubjectId: 'subject2',
      };

      const expectedResult: SubjectPrerequisiteResponseDto = {
        id: 'prereq1',
        subjectId: 'subject1',
        prerequisiteSubjectId: 'subject2',
        subject: {
          id: 'subject1',
          code: 'CS201',
          title: 'Data Structures',
        },
        prerequisiteSubject: {
          id: 'subject2',
          code: 'CS101',
          title: 'Intro to Programming',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrerequisiteRepository.exists.mockResolvedValue(false);
      mockPrerequisiteRepository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrerequisiteRepository.exists).toHaveBeenCalledWith(
        createDto.subjectId,
        createDto.prerequisiteSubjectId,
      );
      expect(mockPrerequisiteRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw an error when subject is its own prerequisite', async () => {
      // Arrange
      const createDto: CreateSubjectPrerequisiteDTO = {
        subjectId: 'subject1',
        prerequisiteSubjectId: 'subject1',
      };

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrerequisiteRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when prerequisite relationship already exists', async () => {
      // Arrange
      const createDto: CreateSubjectPrerequisiteDTO = {
        subjectId: 'subject1',
        prerequisiteSubjectId: 'subject2',
      };

      mockPrerequisiteRepository.exists.mockResolvedValue(true);

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrerequisiteRepository.exists).toHaveBeenCalledWith(
        createDto.subjectId,
        createDto.prerequisiteSubjectId,
      );
      expect(mockPrerequisiteRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all prerequisites with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;

      const mockPrerequisites: SubjectPrerequisiteResponseDto[] = [
        {
          id: 'prereq1',
          subjectId: 'subject1',
          prerequisiteSubjectId: 'subject2',
          subject: {
            id: 'subject1',
            code: 'CS201',
            title: 'Data Structures',
          },
          prerequisiteSubject: {
            id: 'subject2',
            code: 'CS101',
            title: 'Intro to Programming',
          },
        },
        {
          id: 'prereq2',
          subjectId: 'subject3',
          prerequisiteSubjectId: 'subject1',
          subject: {
            id: 'subject3',
            code: 'CS301',
            title: 'Algorithms',
          },
          prerequisiteSubject: {
            id: 'subject1',
            code: 'CS201',
            title: 'Data Structures',
          },
        },
      ];

      const totalCount = 2;

      mockPrerequisiteRepository.findAll.mockResolvedValue(mockPrerequisites);
      mockPrerequisiteRepository.count.mockResolvedValue(totalCount);

      const expectedResult = {
        data: mockPrerequisites,
        page,
        totalPage: Math.ceil(totalCount / limit),
        limit,
        total: totalCount,
      };

      // Act
      const result = await service.findAll(page, limit);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrerequisiteRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
      );
      expect(mockPrerequisiteRepository.count).toHaveBeenCalledWith({});
    });
  });

  describe('findById', () => {
    it('should find a prerequisite by id successfully', async () => {
      // Arrange
      const prerequisiteId = 'prereq1';
      const expectedResult: SubjectPrerequisiteResponseDto = {
        id: prerequisiteId,
        subjectId: 'subject1',
        prerequisiteSubjectId: 'subject2',
        subject: {
          id: 'subject1',
          code: 'CS201',
          title: 'Data Structures',
        },
        prerequisiteSubject: {
          id: 'subject2',
          code: 'CS101',
          title: 'Intro to Programming',
        },
      };

      mockPrerequisiteRepository.findById.mockResolvedValue(expectedResult);

      // Act
      const result = await service.findById(prerequisiteId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrerequisiteRepository.findById).toHaveBeenCalledWith(
        prerequisiteId,
      );
    });

    it('should throw NotFoundException when prerequisite not found', async () => {
      // Arrange
      const prerequisiteId = 'nonexistent';
      mockPrerequisiteRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById(prerequisiteId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrerequisiteRepository.findById).toHaveBeenCalledWith(
        prerequisiteId,
      );
    });
  });

  describe('findPrerequisitesForSubject', () => {
    it('should find prerequisites for a subject', async () => {
      // Arrange
      const subjectId = 'subject1';
      const expectedResults: SubjectPrerequisiteResponseDto[] = [
        {
          id: 'prereq1',
          subjectId,
          prerequisiteSubjectId: 'subject2',
          subject: {
            id: subjectId,
            code: 'CS201',
            title: 'Data Structures',
          },
          prerequisiteSubject: {
            id: 'subject2',
            code: 'CS101',
            title: 'Intro to Programming',
          },
        },
      ];

      mockPrerequisiteRepository.findBySubjectId.mockResolvedValue(
        expectedResults,
      );

      // Act
      const result = await service.findPrerequisitesForSubject(subjectId);

      // Assert
      expect(result).toEqual(expectedResults);
      expect(mockPrerequisiteRepository.findBySubjectId).toHaveBeenCalledWith(
        subjectId,
      );
    });
  });

  describe('findSubjectsRequiringPrerequisite', () => {
    it('should find subjects that require a specific prerequisite', async () => {
      // Arrange
      const prerequisiteSubjectId = 'subject2';
      const expectedResults: SubjectPrerequisiteResponseDto[] = [
        {
          id: 'prereq1',
          subjectId: 'subject1',
          prerequisiteSubjectId,
          subject: {
            id: 'subject1',
            code: 'CS201',
            title: 'Data Structures',
          },
          prerequisiteSubject: {
            id: prerequisiteSubjectId,
            code: 'CS101',
            title: 'Intro to Programming',
          },
        },
      ];

      mockPrerequisiteRepository.findByPrerequisiteSubjectId.mockResolvedValue(
        expectedResults,
      );

      // Act
      const result = await service.findSubjectsRequiringPrerequisite(
        prerequisiteSubjectId,
      );

      // Assert
      expect(result).toEqual(expectedResults);
      expect(
        mockPrerequisiteRepository.findByPrerequisiteSubjectId,
      ).toHaveBeenCalledWith(prerequisiteSubjectId);
    });
  });

  describe('update', () => {
    it('should update a prerequisite successfully', async () => {
      // Arrange
      const prerequisiteId = 'prereq1';
      const updateDto: UpdateSubjectPrerequisiteDTO = {
        prerequisiteSubjectId: 'subject3',
      };

      const existingPrerequisite: SubjectPrerequisiteResponseDto = {
        id: prerequisiteId,
        subjectId: 'subject1',
        prerequisiteSubjectId: 'subject2',
      };

      const expectedResult: SubjectPrerequisiteResponseDto = {
        id: prerequisiteId,
        subjectId: 'subject1',
        prerequisiteSubjectId: 'subject3',
        subject: {
          id: 'subject1',
          code: 'CS201',
          title: 'Data Structures',
        },
        prerequisiteSubject: {
          id: 'subject3',
          code: 'CS102',
          title: 'Computer Systems',
        },
      };

      mockPrerequisiteRepository.findById.mockResolvedValue(
        existingPrerequisite,
      );
      mockPrerequisiteRepository.exists.mockResolvedValue(false);
      mockPrerequisiteRepository.update.mockResolvedValue(expectedResult);

      // Act
      const result = await service.update(prerequisiteId, updateDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrerequisiteRepository.findById).toHaveBeenCalledWith(
        prerequisiteId,
      );
      expect(mockPrerequisiteRepository.update).toHaveBeenCalledWith(
        prerequisiteId,
        updateDto,
      );
    });

    it('should throw NotFoundException when prerequisite to update not found', async () => {
      // Arrange
      const prerequisiteId = 'nonexistent';
      const updateDto: UpdateSubjectPrerequisiteDTO = {
        prerequisiteSubjectId: 'subject3',
      };

      mockPrerequisiteRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(prerequisiteId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrerequisiteRepository.findById).toHaveBeenCalledWith(
        prerequisiteId,
      );
      expect(mockPrerequisiteRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a prerequisite successfully', async () => {
      // Arrange
      const prerequisiteId = 'prereq1';
      const expectedResult: SubjectPrerequisiteResponseDto = {
        id: prerequisiteId,
        subjectId: 'subject1',
        prerequisiteSubjectId: 'subject2',
        subject: {
          id: 'subject1',
          code: 'CS201',
          title: 'Data Structures',
        },
        prerequisiteSubject: {
          id: 'subject2',
          code: 'CS101',
          title: 'Intro to Programming',
        },
      };

      mockPrerequisiteRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(prerequisiteId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrerequisiteRepository.delete).toHaveBeenCalledWith(
        prerequisiteId,
      );
    });
  });
});
