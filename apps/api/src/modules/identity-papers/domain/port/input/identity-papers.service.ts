import { Inject, Injectable } from '@nestjs/common';
import { CreateIdentityPaperDTO } from '../../dto/create-identity-paper.dto';
import { UpdateIdentityPaperDTO } from '../../dto/update-identity-paper.dto';
import {
  IDENTITY_REPOSITORY,
  IIdentityPapersRepository,
} from '../output/IIdentityPapersRepository';
import { IIdentityPapersService } from './IIdentityPapersService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { IdentityPapersDto } from '../../dto/identity-papers.dto';

@Injectable()
export class IdentityPapersService implements IIdentityPapersService {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private identityPapersRepository: IIdentityPapersRepository,
  ) {}

  async count(): Promise<number> {
    try {
      return await this.identityPapersRepository.count();
    } catch (error) {
      throw new Error(`Error counting identity papers: ${error.message}`);
    }
  }

  async create(identityPaper: CreateIdentityPaperDTO) {
    try {
      return await this.identityPapersRepository.create(identityPaper);
    } catch (error) {
      throw new Error(`Error creating identity paper: ${error.message}`);
    }
  }

  async delete(identityPaperId: string) {
    try {
      return await this.identityPapersRepository.delete(identityPaperId);
    } catch (error) {
      throw new Error(
        `Error deleting identity paper with ID ${identityPaperId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<IdentityPapersDto>> {
    try {
      const identityPapers = await this.identityPapersRepository.findAll(
        page,
        limit,
      );
      const totalIdentityPapers = await this.identityPapersRepository.count();

      return {
        data: identityPapers,
        page,
        totalPage: Math.ceil(totalIdentityPapers / limit),
        limit,
        total: totalIdentityPapers,
      };
    } catch (error) {
      throw new Error(`Error finding all identity papers: ${error.message}`);
    }
  }

  async findById(identityPaperId: string) {
    try {
      return await this.identityPapersRepository.findById(identityPaperId);
    } catch (error) {
      throw new Error(
        `Error finding identity paper with ID ${identityPaperId}: ${error.message}`,
      );
    }
  }

  async update(identityPaperId: string, data: UpdateIdentityPaperDTO) {
    try {
      return await this.identityPapersRepository.update(identityPaperId, data);
    } catch (error) {
      throw new Error(
        `Error updating identity paper with ID ${identityPaperId}: ${error.message}`,
      );
    }
  }
}
