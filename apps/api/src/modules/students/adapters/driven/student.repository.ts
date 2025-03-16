import { Injectable } from '@nestjs/common';
import {
  StudentRequestDTO,
  StudentResponseDTO,
} from '../../domain/dto/student-dto';
import { IStudentRepository } from '../../domain/port/output/IStudentRepository';
import { PrismaService } from 'src/shared/services/database/prisma.service';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async count(): Promise<number> {
    return this.prismaService.student.count();
  }

  async create(student: StudentRequestDTO): Promise<StudentResponseDTO> {
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

  async update(student: StudentRequestDTO): Promise<StudentResponseDTO> {
    const response = await this.prismaService.student.update({
      where: {
        studentId: student?.studentId,
      },
      data: student,
    });

    return response;
  }
  async findById(studentId: string): Promise<StudentResponseDTO | null> {
    const response = await this.prismaService.student?.findUnique({
      where: {
        studentId: studentId,
      },
    });

    return response;
  }

  async search(query: any): Promise<StudentResponseDTO[]> {
    const { key = '', limit = 1000, page = 1 } = query;
    return this.prismaService.student.findMany({
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
