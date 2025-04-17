import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { CLASSES_REPOSITORY } from '../output/IClassesRepository';
import { CreateClassDTO } from '../../dto/create-class.dto';
import { UpdateClassDTO } from '../../dto/update-class.dto';
import { ClassResponseDto } from '../../dto/classes.dto';

describe('ClassesService', () => {
  let service: ClassesService;

  // Create mock implementation for classes repository
  const mockClassesRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByCode: jest.fn(),
    count: jest.fn(),
    getCurrentEnrollmentCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: CLASSES_REPOSITORY,
          useValue: mockClassesRepository,
        },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);

    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should count classes with provided where options', async () => {
      // Arrange
      const whereOptions = { subjectCode: 'CS101' };
      const expectedCount = 3;
      mockClassesRepository.count.mockResolvedValue(expectedCount);

      // Act
      const result = await service.count(whereOptions);

      // Assert
      expect(result).toEqual(expectedCount);
      expect(mockClassesRepository.count).toHaveBeenCalledWith(whereOptions);
      expect(mockClassesRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a class successfully', async () => {
      // Arrange
      const createClassDto: CreateClassDTO = {
        code: 'CS101-A',
        subjectCode: 'CS101',
        semesterId: '6001f693a073e80b5adde618',
        teacherName: 'Dr. Alan Turing',
        maximumQuantity: 35,
        classSchedule: 'Monday, Wednesday 9:00-10:30',
        classroom: 'Building A - Room 101',
      };

      mockClassesRepository.findByCode.mockRejectedValue(
        new NotFoundException(),
      );

      const expectedResult: ClassResponseDto = {
        id: '6001f693a073e80b5adde619',
        code: 'CS101-A',
        subjectCode: 'CS101',
        semesterId: '6001f693a073e80b5adde618',
        teacherName: 'Dr. Alan Turing',
        maximumQuantity: 35,
        classSchedule: 'Monday, Wednesday 9:00-10:30',
        classroom: 'Building A - Room 101',
        createdAt: new Date(),
        updatedAt: new Date(),
        subject: {
          id: '6001f693a073e80b5adde620',
          code: 'CS101',
          title: 'Introduction to Computer Science',
          credit: 3,
        },
        semester: {
          id: '6001f693a073e80b5adde618',
          academicYear: '2023-2024',
          semester: 1,
          startedAt: new Date(),
          endedAt: new Date(),
        },
      };

      mockClassesRepository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(createClassDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockClassesRepository.findByCode).toHaveBeenCalledWith(
        createClassDto.code,
      );
      expect(mockClassesRepository.create).toHaveBeenCalledWith(createClassDto);
      expect(mockClassesRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw a ConflictException when class with same code already exists', async () => {
      // Arrange
      const createClassDto: CreateClassDTO = {
        code: 'CS101-A',
        subjectCode: 'CS101',
        semesterId: '6001f693a073e80b5adde618',
        teacherName: 'Dr. Alan Turing',
        maximumQuantity: 35,
        classSchedule: 'Monday, Wednesday 9:00-10:30',
        classroom: 'Building A - Room 101',
      };

      const existingClass: ClassResponseDto = {
        id: '6001f693a073e80b5adde619',
        code: 'CS101-A',
        subjectCode: 'CS101',
        semesterId: '6001f693a073e80b5adde618',
        teacherName: 'Dr. Grace Hopper',
        maximumQuantity: 30,
        classSchedule: 'Tuesday, Thursday 9:00-10:30',
        classroom: 'Building A - Room 102',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockClassesRepository.findByCode.mockResolvedValue(existingClass);

      // Act & Assert
      await expect(service.create(createClassDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockClassesRepository.findByCode).toHaveBeenCalledWith(
        createClassDto.code,
      );
      expect(mockClassesRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all classes with pagination', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const filters = { subjectCode: 'CS101' };

      const mockClasses: ClassResponseDto[] = [
        {
          id: '6001f693a073e80b5adde619',
          code: 'CS101-A',
          subjectCode: 'CS101',
          semesterId: '6001f693a073e80b5adde618',
          teacherName: 'Dr. Alan Turing',
          maximumQuantity: 35,
          classSchedule: 'Monday, Wednesday 9:00-10:30',
          classroom: 'Building A - Room 101',
          createdAt: new Date(),
          updatedAt: new Date(),
          subject: {
            id: '6001f693a073e80b5adde620',
            code: 'CS101',
            title: 'Introduction to Computer Science',
            credit: 3,
          },
          semester: {
            id: '6001f693a073e80b5adde618',
            academicYear: '2023-2024',
            semester: 1,
            startedAt: new Date(),
            endedAt: new Date(),
          },
          currentEnrollments: 20,
        },
      ];

      const totalCount = 1;

      mockClassesRepository.findAll.mockResolvedValue(mockClasses);
      mockClassesRepository.count.mockResolvedValue(totalCount);

      const expectedResult = {
        data: mockClasses,
        page,
        totalPage: Math.ceil(totalCount / limit),
        limit,
        total: totalCount,
      };

      // Act
      const result = await service.findAll(page, limit, filters);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockClassesRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        filters,
      );
      expect(mockClassesRepository.count).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a class by id successfully', async () => {
      // Arrange
      const classId = '6001f693a073e80b5adde619';
      const expectedClass: ClassResponseDto = {
        id: classId,
        code: 'CS101-A',
        subjectCode: 'CS101',
        semesterId: '6001f693a073e80b5adde618',
        teacherName: 'Dr. Alan Turing',
        maximumQuantity: 35,
        classSchedule: 'Monday, Wednesday 9:00-10:30',
        classroom: 'Building A - Room 101',
        createdAt: new Date(),
        updatedAt: new Date(),
        subject: {
          id: '6001f693a073e80b5adde620',
          code: 'CS101',
          title: 'Introduction to Computer Science',
          credit: 3,
        },
        semester: {
          id: '6001f693a073e80b5adde618',
          academicYear: '2023-2024',
          semester: 1,
          startedAt: new Date(),
          endedAt: new Date(),
        },
      };

      const enrollmentCount = 20;

      mockClassesRepository.findById.mockResolvedValue(expectedClass);
      mockClassesRepository.getCurrentEnrollmentCount.mockResolvedValue(
        enrollmentCount,
      );

      const expectedResult = {
        ...expectedClass,
        currentEnrollments: enrollmentCount,
      };

      // Act
      const result = await service.findById(classId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockClassesRepository.findById).toHaveBeenCalledWith(classId);
      expect(
        mockClassesRepository.getCurrentEnrollmentCount,
      ).toHaveBeenCalledWith(expectedClass.code);
    });

    it('should throw NotFoundException when class is not found', async () => {
      // Arrange
      const classId = 'nonexistent-id';
      mockClassesRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById(classId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockClassesRepository.findById).toHaveBeenCalledWith(classId);
    });
  });

  describe('update', () => {
    it('should update a class successfully', async () => {
      // Arrange
      const classId = '6001f693a073e80b5adde619';
      const updateClassDto: UpdateClassDTO = {
        teacherName: 'Dr. Grace Hopper',
        classSchedule: 'Monday, Wednesday 14:00-15:30',
        classroom: 'Building B - Room 201',
      };

      const existingClass: ClassResponseDto = {
        id: classId,
        code: 'CS101-A',
        subjectCode: 'CS101',
        semesterId: '6001f693a073e80b5adde618',
        teacherName: 'Dr. Alan Turing',
        maximumQuantity: 35,
        classSchedule: 'Monday, Wednesday 9:00-10:30',
        classroom: 'Building A - Room 101',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedClass: ClassResponseDto = {
        ...existingClass,
        teacherName: updateClassDto.teacherName ?? existingClass.teacherName,
        classSchedule:
          updateClassDto.classSchedule ?? existingClass.classSchedule,
        classroom: updateClassDto.classroom ?? existingClass.classroom,
      };

      const enrollmentCount = 20;

      mockClassesRepository.findById.mockResolvedValue(existingClass);
      mockClassesRepository.getCurrentEnrollmentCount.mockResolvedValue(
        enrollmentCount,
      );
      mockClassesRepository.update.mockResolvedValue(updatedClass);

      // Act
      const result = await service.update(classId, updateClassDto);

      // Assert
      expect(result).toEqual(updatedClass);
      expect(mockClassesRepository.findById).toHaveBeenCalledWith(classId);
      expect(mockClassesRepository.update).toHaveBeenCalledWith(
        classId,
        updateClassDto,
      );
    });

    it('should throw NotFoundException when class to update is not found', async () => {
      // Arrange
      const classId = 'nonexistent-id';
      const updateClassDto: UpdateClassDTO = {
        teacherName: 'Dr. Grace Hopper',
      };

      mockClassesRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(classId, updateClassDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockClassesRepository.findById).toHaveBeenCalledWith(classId);
      expect(mockClassesRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when maximumQuantity is less than current enrollment count', async () => {
      // Arrange
      const classId = '6001f693a073e80b5adde619';
      const updateClassDto: UpdateClassDTO = {
        maximumQuantity: 15, // Less than current enrollment count
      };

      const existingClass: ClassResponseDto = {
        id: classId,
        code: 'CS101-A',
        subjectCode: 'CS101',
        semesterId: '6001f693a073e80b5adde618',
        teacherName: 'Dr. Alan Turing',
        maximumQuantity: 35,
        classSchedule: 'Monday, Wednesday 9:00-10:30',
        classroom: 'Building A - Room 101',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const enrollmentCount = 20; // Current enrollment is 20

      mockClassesRepository.findById.mockResolvedValue(existingClass);
      mockClassesRepository.getCurrentEnrollmentCount.mockResolvedValue(
        enrollmentCount,
      );

      // Act & Assert
      await expect(service.update(classId, updateClassDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockClassesRepository.findById).toHaveBeenCalledWith(classId);
      expect(
        mockClassesRepository.getCurrentEnrollmentCount,
      ).toHaveBeenCalledWith(existingClass.code);
      expect(mockClassesRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a class successfully', async () => {
      // Arrange
      const classId = '6001f693a073e80b5adde619';
      const deletedClass: ClassResponseDto = {
        id: classId,
        code: 'CS101-A',
        subjectCode: 'CS101',
        semesterId: '6001f693a073e80b5adde618',
        teacherName: 'Dr. Alan Turing',
        maximumQuantity: 35,
        classSchedule: 'Monday, Wednesday 9:00-10:30',
        classroom: 'Building A - Room 101',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockClassesRepository.delete.mockResolvedValue(deletedClass);

      // Act
      const result = await service.delete(classId);

      // Assert
      expect(result).toEqual(deletedClass);
      expect(mockClassesRepository.delete).toHaveBeenCalledWith(classId);
    });

    it('should propagate NotFoundException when class is not found', async () => {
      // Arrange
      const classId = 'nonexistent-id';
      mockClassesRepository.delete.mockRejectedValue(
        new NotFoundException(`Class with ID ${classId} not found`),
      );

      // Act & Assert
      await expect(service.delete(classId)).rejects.toThrow(NotFoundException);
      expect(mockClassesRepository.delete).toHaveBeenCalledWith(classId);
    });
  });

  describe('findByAcademicYear', () => {
    it('should throw BadRequestException when academicYear or semester is missing', async () => {
      // Act & Assert
      await expect(service.findByAcademicYear('', 1, 1, 10)).rejects.toThrow(
        BadRequestException,
      );
      await expect(
        service.findByAcademicYear('2023-2024', 1, 1, 10),
      ).rejects.toThrow(BadRequestException);
    });

    it('should find classes by academic year and semester successfully', async () => {
      // Arrange
      const academicYear = '2023-2024';
      const semester = 1;
      const page = 1;
      const limit = 10;

      const mockClasses: ClassResponseDto[] = [
        {
          id: '6001f693a073e80b5adde619',
          code: 'CS101-A',
          subjectCode: 'CS101',
          semesterId: '6001f693a073e80b5adde618',
          teacherName: 'Dr. Alan Turing',
          maximumQuantity: 35,
          classSchedule: 'Monday, Wednesday 9:00-10:30',
          classroom: 'Building A - Room 101',
          createdAt: new Date(),
          updatedAt: new Date(),
          subject: {
            id: '6001f693a073e80b5adde620',
            code: 'CS101',
            title: 'Introduction to Computer Science',
            credit: 3,
          },
          semester: {
            id: '6001f693a073e80b5adde618',
            academicYear: academicYear,
            semester: semester,
            startedAt: new Date(),
            endedAt: new Date(),
          },
          currentEnrollments: 20,
        },
      ];

      const totalCount = 1;

      // Mock the repository responses
      mockClassesRepository.findAll.mockResolvedValue(mockClasses);
      mockClassesRepository.count.mockResolvedValue(totalCount);

      const expectedResult = {
        data: mockClasses,
        page,
        totalPage: Math.ceil(totalCount / limit),
        limit,
        total: totalCount,
      };

      // Act
      const result = await service.findByAcademicYear(
        academicYear,
        semester,
        page,
        limit,
      );

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockClassesRepository.findAll).toHaveBeenCalledWith(page, limit, {
        semester: { academicYear, semester },
      });
      expect(mockClassesRepository.count).toHaveBeenCalledWith({
        semester: { academicYear, semester },
      });
    });
  });
});
