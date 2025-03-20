import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IFacultiesRepository } from '../../domain/port/output/IFacultiesRepository';
import { FacultiesDto } from '../../domain/dto/faculties.dto';
import { CreateFacultyDTO } from '../../domain/dto/create-faculty.dto';
import { Faculty } from '@prisma/client';

@Injectable()
export class FacultiesRepository implements IFacultiesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async count(): Promise<number> {
    return await this.prismaService.faculty.count();
  }

  async create(faculty: CreateFacultyDTO): Promise<FacultiesDto> {
    const createdFaculty = await this.prismaService.faculty.create({
      data: faculty,
    });
    return {
      ...createdFaculty,
      status: createdFaculty.status as 'active' | 'inactive',
    };
  }

  async delete(facultyId: string): Promise<FacultiesDto> {
    const deletedFaculty = await this.prismaService.faculty.delete({
      where: { id: facultyId },
    });
    return {
      ...deletedFaculty,
      status: deletedFaculty.status as 'active' | 'inactive',
    };
  }

  async findAll(page: number, limit: number): Promise<FacultiesDto[]> {
    const faculties = await this.prismaService.faculty.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return faculties.map((faculty) => ({
      ...faculty,
      status: faculty.status as 'active' | 'inactive',
    }));
  }

  async findById(facultyId: string): Promise<FacultiesDto> {
    const faculty = await this.prismaService.faculty.findUnique({
      where: { id: facultyId },
    });

    if (!faculty) {
      throw new Error(`Faculty with ID ${facultyId} not found`);
    }

    return {
      ...faculty,
      status: faculty.status as 'active' | 'inactive',
    };
  }

  async update(
    facultyId: string,
    data: CreateFacultyDTO,
  ): Promise<FacultiesDto> {
    const updatedFaculty = await this.prismaService.faculty.update({
      where: { id: facultyId },
      data,
    });

    return {
      ...updatedFaculty,
      status: updatedFaculty.status as 'active' | 'inactive',
    };
  }
}
