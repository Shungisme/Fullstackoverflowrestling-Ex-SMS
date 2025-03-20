import { Injectable } from '@nestjs/common';
import { IStudentRepository } from '../../domain/port/output/IStudentRepository';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { SearchStudent } from './types/search-type';
import { Student } from './types/student-type';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async count(): Promise<number> {
    return this.prismaService.student.count();
  }

  async create(student: Student): Promise<Student> {
    const response = await this.prismaService.student.create({
      data: student,
      include: {
        faculty: true,
        identityPaper: true,
        mailingAddress: true,
        permanentAddress: true,
        program: true,
        status: true,
        temporaryAddress: true,
      },
    });

    return response;
  }
  async delete(studentId: string): Promise<Student> {
    return await this.prismaService.student.delete({
      where: {
        studentId: studentId,
      },
      include: {
        faculty: true,
        identityPaper: true,
        mailingAddress: true,
        permanentAddress: true,
        program: true,
        status: true,
        temporaryAddress: true,
      },
    });
  }

  async update(student: Student): Promise<Student> {
    const { studentId, ...data } = student;
    return await this.prismaService.student.update({
      where: {
        studentId: studentId,
      },
      data: data,
      include: {
        faculty: true,
        identityPaper: true,
        mailingAddress: true,
        permanentAddress: true,
        program: true,
        status: true,
        temporaryAddress: true,
      },
    });
  }
  async findById(studentId: string): Promise<Student | null> {
    const response = await this.prismaService.student.findUnique({
      where: {
        studentId: studentId,
      },
      include: {
        faculty: true,
        identityPaper: true,
        mailingAddress: true,
        permanentAddress: true,
        program: true,
        status: true,
        temporaryAddress: true,
      },
    });

    return response;
  }

  async search(query: SearchStudent): Promise<Student[]> {
    const { key, limit, page, faculty } = query;
    return this.prismaService.student.findMany({
      include: {
        program: true,
        status: true,
        permanentAddress: true,
        temporaryAddress: true,
        mailingAddress: true,
        identityPaper: true,
        faculty: true,
      },
      where: {
        OR: [
          { name: { contains: key, mode: 'insensitive' } },
          { studentId: key },
          {
            faculty: {
              title: faculty,
            },
          },
        ],
      },
      skip: Number((page - 1) * limit),
      take: Number(limit),
    });
  }
}
