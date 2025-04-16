import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { ISemesterRepository } from '../../domain/port/output/ISemesterRepository';
import { SemesterDto } from '../../domain/dto/semester.dto';
import { CreateSemesterDTO } from '../../domain/dto/create-semester.dto';
import { UpdateSemesterDTO } from '../../domain/dto/update-semester.dto';

@Injectable()
export class SemesterRepository implements ISemesterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async count(whereOptions: any): Promise<number> {
    return await this.prismaService.semester.count({
      where: whereOptions,
    });
  }

  async create(semester: CreateSemesterDTO): Promise<SemesterDto> {
    const createdSemester = await this.prismaService.semester.create({
      data: semester,
    });
    return createdSemester;
  }

  async delete(semesterId: string): Promise<SemesterDto> {
    const deletedSemester = await this.prismaService.semester.delete({
      where: { id: semesterId },
    });
    return deletedSemester;
  }

  async findAll(page: number, limit: number): Promise<SemesterDto[]> {
    const semesters = await this.prismaService.semester.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ academicYear: 'desc' }, { semester: 'desc' }],
    });
    return semesters;
  }

  async findById(semesterId: string): Promise<SemesterDto> {
    const semester = await this.prismaService.semester.findUnique({
      where: { id: semesterId },
    });

    if (!semester) {
      throw new Error(`Semester with ID ${semesterId} not found`);
    }

    return semester;
  }

  async findByAcademicYearAndSemester(
    academicYear: string,
    semester: number,
  ): Promise<SemesterDto> {
    const foundSemester = await this.prismaService.semester.findFirst({
      where: {
        academicYear,
        semester,
      },
    });

    if (!foundSemester) {
      throw new Error(
        `Semester for ${academicYear}, semester ${semester} not found`,
      );
    }

    return foundSemester;
  }

  async update(
    semesterId: string,
    data: UpdateSemesterDTO,
  ): Promise<SemesterDto> {
    const updatedSemester = await this.prismaService.semester.update({
      where: { id: semesterId },
      data,
    });

    return updatedSemester;
  }
}
