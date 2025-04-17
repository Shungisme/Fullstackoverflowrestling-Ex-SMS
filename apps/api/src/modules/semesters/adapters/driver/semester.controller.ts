import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateSemesterDTO } from '../../domain/dto/create-semester.dto';
import { UpdateSemesterDTO } from '../../domain/dto/update-semester.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  SemesterDto,
  SemestersResponseWrapperDTO,
  SemesterResponseWrapperDTO,
} from '../../domain/dto/semester.dto';
import { SemesterService } from '../../domain/port/input/semester.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Semesters')
@Controller({ path: 'semesters', version: '1' })
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(SemesterDto)
  @ApiBody({ type: CreateSemesterDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a semester',
    type: SemesterResponseWrapperDTO,
  })
  create(@Body() createSemesterDto: CreateSemesterDTO) {
    return this.semesterService.create(createSemesterDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all semesters with pagination',
    type: SemestersResponseWrapperDTO,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number, defaults to 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Results per page, defaults to 10',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedResponse<SemesterDto>> {
    return await this.semesterService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SemesterDto)
  @ApiParam({ name: 'id', description: 'Semester ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get semester by id',
    type: SemesterResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Semester not found',
  })
  findById(@Param('id') id: string) {
    return this.semesterService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SemesterDto)
  @ApiParam({ name: 'id', description: 'Semester ID', type: String })
  @ApiBody({ type: UpdateSemesterDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update semester',
    type: SemesterResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Semester not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDTO,
  ) {
    return this.semesterService.update(id, updateSemesterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SemesterDto)
  @ApiParam({ name: 'id', description: 'Semester ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete semester',
    type: SemesterResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Semester not found',
  })
  delete(@Param('id') id: string) {
    return this.semesterService.delete(id);
  }
}
