import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IIdentityPapersRepository } from '../../domain/port/output/IIdentityPapersRepository';
import { IdentityPapersDto } from '../../domain/dto/identity-papers.dto';
import { CreateIdentityPaperDTO } from '../../domain/dto/create-identity-paper.dto';
import { UpdateIdentityPaperDTO } from '../../domain/dto/update-identity-paper.dto';

@Injectable()
export class IdentityPapersRepository implements IIdentityPapersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async count(): Promise<number> {
    return await this.prismaService.identityPaper.count();
  }

  async create(
    identityPaper: CreateIdentityPaperDTO,
  ): Promise<IdentityPapersDto> {
    const createdIdentityPaper = await this.prismaService.identityPaper.create({
      data: identityPaper,
    });
    return createdIdentityPaper;
  }

  async delete(identityPaperId: string): Promise<IdentityPapersDto> {
    const deletedIdentityPaper = await this.prismaService.identityPaper.delete({
      where: { id: identityPaperId },
    });
    return deletedIdentityPaper;
  }

  async findAll(page: number, limit: number): Promise<IdentityPapersDto[]> {
    const identityPapers = await this.prismaService.identityPaper.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return identityPapers;
  }

  async findById(identityPaperId: string): Promise<IdentityPapersDto> {
    const identityPaper = await this.prismaService.identityPaper.findUnique({
      where: { id: identityPaperId },
    });

    if (!identityPaper) {
      throw new Error(`Identity paper with ID ${identityPaperId} not found`);
    }

    return identityPaper;
  }

  async findByTypeAndNumber(
    type: string,
    number: string,
  ): Promise<IdentityPapersDto | null> {
    const identityPaper = await this.prismaService.identityPaper.findFirst({
      where: {
        AND: [
          {
            type: {
              contains: type,
              mode: 'insensitive',
            },
          },
          {
            number: number,
          },
        ],
      },
    });

    if (identityPaper) {
      throw new ConflictException(
        `Identity paper with number ${number} is existed`,
      );
    }

    return null;
  }

  async update(
    identityPaperId: string,
    data: UpdateIdentityPaperDTO,
  ): Promise<IdentityPapersDto> {
    const updatedIdentityPaper = await this.prismaService.identityPaper.update({
      where: { id: identityPaperId },
      data,
    });

    return updatedIdentityPaper;
  }
}
