import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IClassesRepository } from '../../domain/port/output/IClassesRepository';
import { ClassResponseDto } from '../../domain/dto/classes.dto';
import { CreateClassDTO } from '../../domain/dto/create-class.dto';
import { UpdateClassDTO } from '../../domain/dto/update-class.dto';
import { EnrollEnum } from '@prisma/client';

@Injectable()
export class ClassesRepository implements IClassesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async count(whereOptions: any): Promise<number> {
    return await this.prismaService.class.count({
      where: whereOptions,
    });
  }

  async create(classData: CreateClassDTO): Promise<ClassResponseDto> {
    try {
      const createdClass = await this.prismaService.class.create({
        data: classData,
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              title: true,
              credit: true,
            },
          },
          semester: true,
        },
      });

      return createdClass;
    } catch (error) {
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        throw new Error(`Class with code ${classData.code} already exists`);
      }
      if (error.code === 'P2003') {
        throw new Error(`Referenced subject or semester does not exist`);
      }
      throw error;
    }
  }

  async delete(classId: string): Promise<ClassResponseDto> {
    try {
      // Check if there are any enrollments for this class
      const enrollments = await this.prismaService.studentClassEnroll.findMany({
        where: {
          class: {
            id: classId,
          },
        },
        take: 1,
      });

      if (enrollments.length > 0) {
        throw new Error(
          'Cannot delete class with existing student enrollments',
        );
      }

      // Check if there are any results for this class
      const results = await this.prismaService.studentClassResult.findMany({
        where: {
          class: {
            id: classId,
          },
        },
        take: 1,
      });

      if (results.length > 0) {
        throw new Error('Cannot delete class with existing student results');
      }

      const deletedClass = await this.prismaService.class.delete({
        where: { id: classId },
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              title: true,
              credit: true,
            },
          },
          semester: true,
        },
      });

      return deletedClass;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Class with ID ${classId} not found`);
      }
      throw error;
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: {
      subjectCode?: string;
      semesterId?: string;
      academicYear?: string;
      semester?: number;
    },
  ): Promise<ClassResponseDto[]> {
    const whereOptions: any = {};

    if (filters?.subjectCode) {
      whereOptions.subjectCode = filters.subjectCode;
    }

    if (filters?.semesterId) {
      whereOptions.semesterId = filters.semesterId;
    }

    if (filters?.academicYear || filters?.semester) {
      whereOptions.semester = {};

      if (filters.academicYear) {
        whereOptions.semester.academicYear = filters.academicYear;
      }

      if (filters.semester) {
        whereOptions.semester.semester = filters.semester;
      }
    }

    const classes = await this.prismaService.class.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereOptions,
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
            credit: true,
          },
        },
        semester: true,
      },
      orderBy: {
        code: 'asc',
      },
    });

    // Get enrollment counts for each class
    const classesWithEnrollments = await Promise.all(
      classes.map(async (classItem) => {
        const enrollmentCount = await this.getCurrentEnrollmentCount(
          classItem.code,
        );
        return {
          ...classItem,
          currentEnrollments: enrollmentCount,
        };
      }),
    );

    return classesWithEnrollments;
  }

  async findById(classId: string): Promise<ClassResponseDto> {
    const classData = await this.prismaService.class.findUnique({
      where: { id: classId },
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
            credit: true,
          },
        },
        semester: true,
      },
    });

    if (!classData) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    return classData;
  }

  async findByCode(classCode: string): Promise<ClassResponseDto> {
    const classData = await this.prismaService.class.findUnique({
      where: { code: classCode },
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
            credit: true,
          },
        },
        semester: true,
      },
    });

    if (!classData) {
      throw new NotFoundException(`Class with code ${classCode} not found`);
    }

    return classData;
  }

  async findBySubjectCode(subjectCode: string): Promise<ClassResponseDto[]> {
    const classes = await this.prismaService.class.findMany({
      where: { subjectCode },
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
            credit: true,
          },
        },
        semester: true,
      },
    });

    return classes;
  }

  async getCurrentEnrollmentCount(classCode: string): Promise<number> {
    // Count students who are enrolled and have not dropped the class
    const enrollmentCount = await this.prismaService.studentClassEnroll.count({
      where: {
        classCode,
        type: {
          not: EnrollEnum.DROP,
        },
      },
    });

    return enrollmentCount;
  }

  async update(
    classId: string,
    data: UpdateClassDTO,
  ): Promise<ClassResponseDto> {
    try {
      const updatedClass = await this.prismaService.class.update({
        where: { id: classId },
        data,
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              title: true,
              credit: true,
            },
          },
          semester: true,
        },
      });

      return updatedClass;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Class with ID ${classId} not found`);
      }
      if (error.code === 'P2003') {
        throw new Error(`Referenced subject or semester does not exist`);
      }
      throw error;
    }
  }
}
