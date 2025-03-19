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
    return this.prismaService.students.count();
  }

  async create(student: CreateStudentDTO): Promise<StudentResponseDTO> {
    const response = await this.prismaService.students.create({
      data: student,
    });

    return response;
  }
  async delete(studentId: string): Promise<StudentResponseDTO> {
    return await this.prismaService.students.delete({
      where: {
        studentId: studentId,
      },
    });
  }

  async update(student: UpdateStudentDTO): Promise<StudentResponseDTO> {
    const { studentId, ...data } = student;
    return await this.prismaService.students.update({
      where: {
        studentId: studentId,
      },
      data: data,
    });
  }
  async findById(studentId: string): Promise<StudentResponseDTO | null> {
    const response = await this.prismaService.students.findUnique({
      where: {
        studentId: studentId,
      },
    });

    return response;
  }

  async search(query: SearchRequestDTO): Promise<StudentResponseDTO[]> {
    const { key, limit, page } = query;
    return this.prismaService.students.findMany({
      where: {
        OR: [
          { name: { contains: key, mode: 'insensitive' } },
          { studentId: key },
        ],
      },
      skip: Number((page - 1) * limit),
      take: Number(limit),
    });
  }
}
