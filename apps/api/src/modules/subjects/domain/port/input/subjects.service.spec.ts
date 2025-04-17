import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsService } from './subjects.service';
import { SUBJECTS_REPOSITORY } from '../output/ISubjectsRepository';
import { CreateSubjectDTO } from '../../dto/create-subject.dto';
import { UpdateSubjectDTO } from '../../dto/update-subject.dto';
import { SubjectsDto } from '../../dto/subjects.dto';
import { StatusEnum } from '@prisma/client';

describe('SubjectsService', () => {
  let service: SubjectsService;

  // Create mock implementation for subjects repository
  const mockSubjectsRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByCode: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectsService,
        {
          provide: SUBJECTS_REPOSITORY,
          useValue: mockSubjectsRepository,
        },
      ],
    }).compile();

    service = module.get<SubjectsService>(SubjectsService);

    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should count subjects with provided where options', async () => {
      // Arrange
      const whereOptions = { status: StatusEnum.ACTIVATED };
      const expectedCount = 5;
      mockSubjectsRepository.count.mockResolvedValue(expectedCount);

      // Act
      const result = await service.count(whereOptions);

      // Assert
      expect(result).toEqual(expectedCount);
      expect(mockSubjectsRepository.count).toHaveBeenCalledWith(whereOptions);
      expect(mockSubjectsRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository count fails', async () => {
      // Arrange
      const whereOptions = { status: StatusEnum.ACTIVATED };
      const errorMessage = 'Database error';
      mockSubjectsRepository.count.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.count(whereOptions)).rejects.toThrow(
        `Error counting subjects: ${errorMessage}`,
      );
      expect(mockSubjectsRepository.count).toHaveBeenCalledWith(whereOptions);
    });
  });

  describe('create', () => {
    it('should create a subject successfully', async () => {
      // Arrange
      const createSubjectDto: CreateSubjectDTO = {
        code: 'CS101',
        title: 'Introduction to Computer Science',
        credit: 3,
        facultyId: '6001f693a073e80b5adde618',
        description: 'Fundamental concepts of computer science',
        status: StatusEnum.ACTIVATED,
      };

      const expectedResult: SubjectsDto = {
        id: '6001f693a073e80b5adde619',
        code: 'CS101',
        title: 'Introduction to Computer Science',
        credit: 3,
        facultyId: '6001f693a073e80b5adde618',
        description: 'Fundamental concepts of computer science',
        status: StatusEnum.ACTIVATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSubjectsRepository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(createSubjectDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSubjectsRepository.create).toHaveBeenCalledWith(
        createSubjectDto,
      );
      expect(mockSubjectsRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository create fails', async () => {
      // Arrange
      const createSubjectDto: CreateSubjectDTO = {
        code: 'CS101',
        title: 'Introduction to Computer Science',
        credit: 3,
        facultyId: '6001f693a073e80b5adde618',
        description: 'Fundamental concepts of computer science',
        status: StatusEnum.ACTIVATED,
      };

      const errorMessage = 'Subject code already exists';
      mockSubjectsRepository.create.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.create(createSubjectDto)).rejects.toThrow(
        `Error creating subject: ${errorMessage}`,
      );
      expect(mockSubjectsRepository.create).toHaveBeenCalledWith(
        createSubjectDto,
      );
    });
  });

  describe('findAll', () => {
    it('should find all subjects with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const status = StatusEnum.ACTIVATED;
      const facultyId = '6001f693a073e80b5adde618';

      const mockSubjects: SubjectsDto[] = [
        {
          id: '6001f693a073e80b5adde619',
          code: 'CS101',
          title: 'Introduction to Computer Science',
          credit: 3,
          facultyId: '6001f693a073e80b5adde618',
          description: 'Fundamental concepts of computer science',
          status: StatusEnum.ACTIVATED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '6001f693a073e80b5adde620',
          code: 'CS201',
          title: 'Data Structures and Algorithms',
          credit: 4,
          facultyId: '6001f693a073e80b5adde618',
          description: 'Study of data structures and algorithms',
          status: StatusEnum.ACTIVATED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const totalCount = 2;

      mockSubjectsRepository.findAll.mockResolvedValue(mockSubjects);
      mockSubjectsRepository.count.mockResolvedValue(totalCount);

      const expectedResult = {
        data: mockSubjects,
        page,
        totalPage: Math.ceil(totalCount / limit),
        limit,
        total: totalCount,
      };

      // Act
      const result = await service.findAll(page, limit, status, facultyId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSubjectsRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        status,
        facultyId,
      );
      expect(mockSubjectsRepository.count).toHaveBeenCalledWith({
        status: status || undefined,
        facultyId: facultyId || undefined,
      });
    });
  });

  describe('findById', () => {
    it('should find a subject by id successfully', async () => {
      // Arrange
      const subjectId = '6001f693a073e80b5adde619';
      const expectedResult: SubjectsDto = {
        id: subjectId,
        code: 'CS101',
        title: 'Introduction to Computer Science',
        credit: 3,
        facultyId: '6001f693a073e80b5adde618',
        description: 'Fundamental concepts of computer science',
        status: StatusEnum.ACTIVATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSubjectsRepository.findById.mockResolvedValue(expectedResult);

      // Act
      const result = await service.findById(subjectId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSubjectsRepository.findById).toHaveBeenCalledWith(subjectId);
      expect(mockSubjectsRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByCode', () => {
    it('should find a subject by code successfully', async () => {
      // Arrange
      const subjectCode = 'CS101';
      const expectedResult: SubjectsDto = {
        id: '6001f693a073e80b5adde619',
        code: subjectCode,
        title: 'Introduction to Computer Science',
        credit: 3,
        facultyId: '6001f693a073e80b5adde618',
        description: 'Fundamental concepts of computer science',
        status: StatusEnum.ACTIVATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSubjectsRepository.findByCode.mockResolvedValue(expectedResult);

      // Act
      const result = await service.findByCode(subjectCode);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSubjectsRepository.findByCode).toHaveBeenCalledWith(
        subjectCode,
      );
      expect(mockSubjectsRepository.findByCode).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a subject successfully', async () => {
      // Arrange
      const subjectId = '6001f693a073e80b5adde619';
      const updateSubjectDto: UpdateSubjectDTO = {
        title: 'Updated Introduction to Computer Science',
        description: 'Updated fundamental concepts of computer science',
      };

      const expectedResult: SubjectsDto = {
        id: subjectId,
        code: 'CS101',
        title: 'Updated Introduction to Computer Science',
        credit: 3,
        facultyId: '6001f693a073e80b5adde618',
        description: 'Updated fundamental concepts of computer science',
        status: StatusEnum.ACTIVATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSubjectsRepository.update.mockResolvedValue(expectedResult);

      // Act
      const result = await service.update(subjectId, updateSubjectDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSubjectsRepository.update).toHaveBeenCalledWith(
        subjectId,
        updateSubjectDto,
      );
      expect(mockSubjectsRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a subject successfully', async () => {
      // Arrange
      const subjectId = '6001f693a073e80b5adde619';
      const expectedResult: SubjectsDto = {
        id: subjectId,
        code: 'CS101',
        title: 'Introduction to Computer Science',
        credit: 3,
        facultyId: '6001f693a073e80b5adde618',
        description: 'Fundamental concepts of computer science',
        status: StatusEnum.ACTIVATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSubjectsRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(subjectId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockSubjectsRepository.delete).toHaveBeenCalledWith(subjectId);
      expect(mockSubjectsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
