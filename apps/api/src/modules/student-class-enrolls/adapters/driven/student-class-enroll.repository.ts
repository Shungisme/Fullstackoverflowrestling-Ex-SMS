import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IStudentClassEnrollRepository } from '../../domain/port/output/IStudentClassEnrollRepository';
import { StudentClassEnrollDto } from '../../domain/dto/student-class-enroll.dto';
import { CreateStudentClassEnrollDTO } from '../../domain/dto/create-student-class-enroll.dto';
import { UpdateStudentClassEnrollDTO } from '../../domain/dto/update-student-class-enroll.dto';

@Injectable()
export class StudentClassEnrollRepository
  implements IStudentClassEnrollRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async count(whereOptions: any): Promise<number> {
    return await this.prismaService.studentClassEnroll.count({
      where: whereOptions,
    });
  }

  async create(
    enroll: CreateStudentClassEnrollDTO,
  ): Promise<StudentClassEnrollDto> {
    const createdEnrollment =
      await this.prismaService.studentClassEnroll.create({
        data: enroll,
        include: {
          student: true,
          class: true,
        },
      });
    return createdEnrollment;
  }

  async delete(enrollId: string): Promise<StudentClassEnrollDto> {
    const deletedEnrollment =
      await this.prismaService.studentClassEnroll.delete({
        where: { id: enrollId },
        include: {
          student: true,
          class: true,
        },
      });
    return deletedEnrollment;
  }

  async findAll(page: number, limit: number): Promise<StudentClassEnrollDto[]> {
    const enrollments = await this.prismaService.studentClassEnroll.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        student: true,
        class: true,
      },
    });
    return enrollments;
  }

  async findById(enrollId: string): Promise<StudentClassEnrollDto> {
    const enrollment = await this.prismaService.studentClassEnroll.findUnique({
      where: { id: enrollId },
      include: {
        student: true,
        class: true,
      },
    });

    if (!enrollment) {
      throw new Error(`Student class enrollment with ID ${enrollId} not found`);
    }

    return enrollment;
  }

  async findByStudentAndClass(
    studentId: string,
    classCode: string,
  ): Promise<StudentClassEnrollDto> {
    const enrollment = await this.prismaService.studentClassEnroll.findFirst({
      where: {
        studentId,
        classCode,
      },
      include: {
        student: true,
        class: true,
      },
    });

    if (!enrollment) {
      throw new Error(
        `Enrollment for student ${studentId} and class ${classCode} not found`,
      );
    }

    return enrollment;
  }

  async findByStudent(
    studentId: string,
    page: number,
    limit: number,
  ): Promise<StudentClassEnrollDto[]> {
    const enrollments = await this.prismaService.studentClassEnroll.findMany({
      where: {
        studentId,
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        student: true,
        class: true,
      },
    });

    return enrollments;
  }

  async findByClass(
    classCode: string,
    page: number,
    limit: number,
  ): Promise<StudentClassEnrollDto[]> {
    const enrollments = await this.prismaService.studentClassEnroll.findMany({
      where: {
        classCode,
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        student: true,
        class: true,
      },
    });

    return enrollments;
  }

  async findBySubjectCode(
    subjectCode: string,
  ): Promise<StudentClassEnrollDto[]> {
    const enrollments = await this.prismaService.studentClassEnroll.findMany({
      where: {
        class: {
          subjectCode,
        },
      },
      include: {
        student: true,
        class: true,
      },
    });

    return enrollments;
  }

  async update(
    enrollId: string,
    data: UpdateStudentClassEnrollDTO,
  ): Promise<StudentClassEnrollDto> {
    const updatedEnrollment =
      await this.prismaService.studentClassEnroll.update({
        where: { id: enrollId },
        data,
        include: {
          student: true,
          class: true,
        },
      });

    return updatedEnrollment;
  }
}
