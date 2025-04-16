import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { ISubjectsRepository } from '../../domain/port/output/ISubjectsRepository';
import { SubjectsDto } from '../../domain/dto/subjects.dto';
import { CreateSubjectDTO } from '../../domain/dto/create-subject.dto';
import { UpdateSubjectDTO } from '../../domain/dto/update-subject.dto';

@Injectable()
export class SubjectsRepository implements ISubjectsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async count(whereOptions: any): Promise<number> {
    return await this.prismaService.subject.count({
      where: whereOptions,
    });
  }

  async create(subject: CreateSubjectDTO): Promise<SubjectsDto> {
    const createdSubject = await this.prismaService.subject.create({
      data: subject,
      include: {
        faculty: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      ...createdSubject,
      status: createdSubject.status,
    };
  }

  async delete(subjectId: string): Promise<SubjectsDto> {
    const deletedSubject = await this.prismaService.subject.delete({
      where: { id: subjectId },
      include: {
        faculty: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      ...deletedSubject,
      status: deletedSubject.status,
    };
  }

  async findAll(
    page: number,
    limit: number,
    status: string,
    facultyId?: string,
  ): Promise<SubjectsDto[]> {
    const whereOptions: any = {};

    if (status) {
      whereOptions.status = status;
    }

    if (facultyId) {
      whereOptions.facultyId = facultyId;
    }

    const subjects = await this.prismaService.subject.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereOptions,
      include: {
        faculty: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        code: 'asc',
      },
    });

    return subjects.map((subject) => ({
      ...subject,
      status: subject.status,
    }));
  }

  async findById(subjectId: string): Promise<SubjectsDto> {
    const subject = await this.prismaService.subject.findUnique({
      where: { id: subjectId },
      include: {
        faculty: {
          select: {
            id: true,
            title: true,
          },
        },
        prerequisites: {
          include: {
            prerequisiteSubject: true,
          },
        },
        prerequisiteFor: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!subject) {
      throw new Error(`Subject with ID ${subjectId} not found`);
    }

    return {
      ...subject,
      status: subject.status,
    };
  }

  async findByCode(subjectCode: string): Promise<SubjectsDto> {
    const subject = await this.prismaService.subject.findUnique({
      where: { code: subjectCode },
      include: {
        faculty: {
          select: {
            id: true,
            title: true,
          },
        },
        prerequisites: {
          include: {
            prerequisiteSubject: true,
          },
        },
        prerequisiteFor: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!subject) {
      throw new Error(`Subject with code ${subjectCode} not found`);
    }

    return {
      ...subject,
      status: subject.status,
    };
  }

  async update(
    subjectId: string,
    data: UpdateSubjectDTO,
  ): Promise<SubjectsDto> {
    const updatedSubject = await this.prismaService.subject.update({
      where: { id: subjectId },
      data,
      include: {
        faculty: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      ...updatedSubject,
      status: updatedSubject.status,
    };
  }
}
