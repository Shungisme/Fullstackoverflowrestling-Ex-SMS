import { Injectable } from '@nestjs/common';
import {
  CreateStudentDTO,
  StudentRequestDTO,
  StudentResponseDTO,
  UpdateStudentDTO,
  UpdateStudentRequestDTO,
} from '../../domain/dto/student-dto';
import { IStudentRepository } from '../../domain/port/output/IStudentRepository';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { SearchRequestDTO } from '../../domain/dto/search-dto';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async count(): Promise<number> {
    return this.prismaService.student.count();
  }

  async create(student: CreateStudentDTO): Promise<StudentResponseDTO> {
    const response = await this.prismaService.student.create({
      data: student,
    });

    return response;
  }
  async delete(studentId: string): Promise<StudentResponseDTO> {
    return await this.prismaService.student.delete({
      where: {
        studentId: studentId,
      },
    });
  }

  async update(student: UpdateStudentDTO): Promise<StudentResponseDTO> {
    const { studentId, ...data } = student;
    return await this.prismaService.student.update({
      where: {
        studentId: studentId,
      },
      data: data,
    });
  }
  async findById(studentId: string): Promise<StudentResponseDTO | null> {
    const response = await this.prismaService.student.findUnique({
      where: {
        studentId: studentId,
      },
    });

    return response;
  }

  async search(query: SearchRequestDTO): Promise<StudentResponseDTO[]> {
    const { key, limit, page } = query;
    return this.prismaService.student.findMany({
      where: {
        OR: [
          { name: { contains: key, mode: 'insensitive' } },
          { studentId: key },
        ],
      },
      include: {
        program: true,
        status: true,
        permanentAddress: true,
        temporaryAddress: true,
        mailingAddress: true,
        identityPaper: true,
      },
      skip: Number((page - 1) * limit),
      take: Number(limit),
    });
  }
}
