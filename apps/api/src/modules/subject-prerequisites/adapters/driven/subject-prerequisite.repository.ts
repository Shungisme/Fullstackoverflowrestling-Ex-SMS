import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { ISubjectPrerequisiteRepository } from '../../domain/port/output/ISubjectPrerequisiteRepository';
import { SubjectPrerequisiteResponseDto } from '../../domain/dto/subject-prerequisite.dto';
import { CreateSubjectPrerequisiteDTO } from '../../domain/dto/create-subject-prerequisite.dto';
import { UpdateSubjectPrerequisiteDTO } from '../../domain/dto/update-subject-prerequisite.dto';

@Injectable()
export class SubjectPrerequisiteRepository
  implements ISubjectPrerequisiteRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async count(whereOptions: any): Promise<number> {
    return await this.prismaService.subjectPrerequisite.count({
      where: whereOptions,
    });
  }

  async create(
    prerequisite: CreateSubjectPrerequisiteDTO,
  ): Promise<SubjectPrerequisiteResponseDto> {
    const created = await this.prismaService.subjectPrerequisite.create({
      data: {
        subjectId: prerequisite.subjectId,
        prerequisiteSubjectId: prerequisite.prerequisiteSubjectId,
      },
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
        prerequisiteSubject: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
    });

    return created;
  }

  async delete(
    prerequisiteId: string,
  ): Promise<SubjectPrerequisiteResponseDto> {
    try {
      const deleted = await this.prismaService.subjectPrerequisite.delete({
        where: { id: prerequisiteId },
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              title: true,
            },
          },
          prerequisiteSubject: {
            select: {
              id: true,
              code: true,
              title: true,
            },
          },
        },
      });

      return deleted;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Subject prerequisite with ID ${prerequisiteId} not found`,
        );
      }
      throw error;
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<SubjectPrerequisiteResponseDto[]> {
    return await this.prismaService.subjectPrerequisite.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
        prerequisiteSubject: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
      orderBy: {
        subject: {
          code: 'asc',
        },
      },
    });
  }

  async findById(
    prerequisiteId: string,
  ): Promise<SubjectPrerequisiteResponseDto> {
    const prerequisite =
      await this.prismaService.subjectPrerequisite.findUnique({
        where: { id: prerequisiteId },
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              title: true,
            },
          },
          prerequisiteSubject: {
            select: {
              id: true,
              code: true,
              title: true,
            },
          },
        },
      });

    if (!prerequisite) {
      throw new NotFoundException(
        `Subject prerequisite with ID ${prerequisiteId} not found`,
      );
    }

    return prerequisite;
  }

  async findBySubjectId(
    subjectId: string,
  ): Promise<SubjectPrerequisiteResponseDto[]> {
    return await this.prismaService.subjectPrerequisite.findMany({
      where: { subjectId },
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
        prerequisiteSubject: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
    });
  }

  async findByPrerequisiteSubjectId(
    prerequisiteSubjectId: string,
  ): Promise<SubjectPrerequisiteResponseDto[]> {
    return await this.prismaService.subjectPrerequisite.findMany({
      where: { prerequisiteSubjectId },
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
        prerequisiteSubject: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
    });
  }

  async findByClassCode(
    classCode: string,
  ): Promise<SubjectPrerequisiteResponseDto[]> {
    const subject = await this.prismaService.subject.findUnique({
      where: { code: classCode },
      select: { id: true },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with code ${classCode} not found`);
    }
    return await this.prismaService.subjectPrerequisite.findMany({
      where: { subjectId: subject.id },
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
        prerequisiteSubject: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
    });
  }

  async update(
    prerequisiteId: string,
    data: UpdateSubjectPrerequisiteDTO,
  ): Promise<SubjectPrerequisiteResponseDto> {
    try {
      const updated = await this.prismaService.subjectPrerequisite.update({
        where: { id: prerequisiteId },
        data,
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              title: true,
            },
          },
          prerequisiteSubject: {
            select: {
              id: true,
              code: true,
              title: true,
            },
          },
        },
      });

      return updated;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Subject prerequisite with ID ${prerequisiteId} not found`,
        );
      }
      throw error;
    }
  }

  async exists(
    subjectId: string,
    prerequisiteSubjectId: string,
  ): Promise<boolean> {
    const count = await this.prismaService.subjectPrerequisite.count({
      where: {
        subjectId,
        prerequisiteSubjectId,
      },
    });
    return count > 0;
  }
}
