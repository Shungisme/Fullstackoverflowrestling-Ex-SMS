import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IIdentityPapersRepository } from '../../domain/port/output/IIdentityPapersRepository';
import { IdentityPapersDto } from '../../domain/dto/identity-papers.dto';
import { CreateIdentityPaperDTO } from '../../domain/dto/create-identity-paper.dto';

@Injectable()
export class IdentityPapersRepository implements IIdentityPapersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async count(): Promise<number> {
    return await this.prismaService.identity_papers.count();
  }

  async create(
    identityPaper: CreateIdentityPaperDTO,
  ): Promise<IdentityPapersDto> {
    const createdIdentityPaper =
      await this.prismaService.identity_papers.create({
        data: identityPaper,
      });
    return createdIdentityPaper;
  }

  async delete(identityPaperId: string): Promise<IdentityPapersDto> {
    const deletedIdentityPaper =
      await this.prismaService.identity_papers.delete({
        where: { id: identityPaperId },
      });
    return deletedIdentityPaper;
  }

  async findAll(page: number, limit: number): Promise<IdentityPapersDto[]> {
    const identityPapers = await this.prismaService.identity_papers.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return identityPapers;
  }

  async findById(identityPaperId: string): Promise<IdentityPapersDto> {
    const identityPaper = await this.prismaService.identity_papers.findUnique({
      where: { id: identityPaperId },
    });

    if (!identityPaper) {
      throw new Error(`Identity paper with ID ${identityPaperId} not found`);
    }

    return identityPaper;
  }

  async update(
    identityPaperId: string,
    data: CreateIdentityPaperDTO,
  ): Promise<IdentityPapersDto> {
    const updatedIdentityPaper =
      await this.prismaService.identity_papers.update({
        where: { id: identityPaperId },
        data,
      });

    return updatedIdentityPaper;
  }
}
