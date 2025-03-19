import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateFacultyDTO } from '../../domain/dto/create-faculty.dto';
import { UpdateFacultyDTO } from '../../domain/dto/update-faculty.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { FacultiesDto } from '../../domain/dto/faculties.dto';
import { FacultiesService } from '../../domain/port/input/faculties.service';

@Controller({ path: 'faculties', version: '1' })
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Post()
  create(@Body() createFacultyDto: CreateFacultyDTO) {
    return this.facultiesService.create(createFacultyDto);
  }

  @Get()
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<FacultiesDto>> {
    return await this.facultiesService.findAll(page, limit);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.facultiesService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacultyDto: UpdateFacultyDTO) {
    return this.facultiesService.update(id, updateFacultyDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.facultiesService.delete(id);
  }
}
