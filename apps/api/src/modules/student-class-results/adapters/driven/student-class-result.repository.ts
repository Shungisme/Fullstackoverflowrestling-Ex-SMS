import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IStudentClassResultRepository } from '../../domain/port/output/IStudentClassResultRepository';
import { StudentClassResultDto } from '../../domain/dto/student-class-result.dto';
import { CreateStudentClassResultDTO } from '../../domain/dto/create-student-class-result.dto';
import { UpdateStudentClassResultDTO } from '../../domain/dto/update-student-class-result.dto';

@Injectable()
export class StudentClassResultRepository
  implements IStudentClassResultRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async count(whereOptions: any): Promise<number> {
    return await this.prismaService.studentClassResult.count({
      where: whereOptions,
    });
  }

  async create(
    result: CreateStudentClassResultDTO,
  ): Promise<StudentClassResultDto> {
    const createdResult = await this.prismaService.studentClassResult.create({
      data: result,
    });
    return createdResult;
  }

  async delete(resultId: string): Promise<StudentClassResultDto> {
    const deletedResult = await this.prismaService.studentClassResult.delete({
      where: { id: resultId },
    });
    return deletedResult;
  }

  async findAll(page: number, limit: number): Promise<StudentClassResultDto[]> {
    const results = await this.prismaService.studentClassResult.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        student: true,
        class: true,
      },
    });
    return results;
  }

  async findById(resultId: string): Promise<StudentClassResultDto> {
    const result = await this.prismaService.studentClassResult.findUnique({
      where: { id: resultId },
      include: {
        student: true,
        class: true,
      },
    });

    if (!result) {
      throw new Error(`Student class result with ID ${resultId} not found`);
    }

    return result;
  }

  async findByStudentAndClass(
    studentId: string,
    classCode: string,
  ): Promise<StudentClassResultDto[]> {
    const results = await this.prismaService.studentClassResult.findMany({
      where: {
        studentId,
        classCode,
      },
      include: {
        student: true,
        class: true,
      },
    });

    return results;
  }

  async findByStudent(
    studentId: string,
    page: number,
    limit: number,
  ): Promise<StudentClassResultDto[]> {
    const results = await this.prismaService.studentClassResult.findMany({
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

    return results;
  }

  async findByClass(
    classCode: string,
    page: number,
    limit: number,
  ): Promise<StudentClassResultDto[]> {
    const results = await this.prismaService.studentClassResult.findMany({
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

    return results;
  }

  async update(
    resultId: string,
    data: UpdateStudentClassResultDTO,
  ): Promise<StudentClassResultDto> {
    const updatedResult = await this.prismaService.studentClassResult.update({
      where: { id: resultId },
      data,
      include: {
        student: true,
        class: true,
      },
    });

    return updatedResult;
  }
}
