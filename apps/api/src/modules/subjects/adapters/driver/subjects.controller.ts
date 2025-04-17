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
import { CreateSubjectDTO } from '../../domain/dto/create-subject.dto';
import { UpdateSubjectDTO } from '../../domain/dto/update-subject.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  SubjectsDto,
  SubjectsResponseWrapperDTO,
  SubjectResponseWrapperDTO,
} from '../../domain/dto/subjects.dto';
import { SubjectsService } from '../../domain/port/input/subjects.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Subjects')
@Controller({ path: 'subjects', version: '1' })
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(SubjectsDto)
  @ApiBody({ type: CreateSubjectDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a subject',
    type: SubjectResponseWrapperDTO,
  })
  create(@Body() createSubjectDto: CreateSubjectDTO) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all subjects with pagination',
    type: SubjectsResponseWrapperDTO,
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
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Status to filter by',
  })
  @ApiQuery({
    name: 'facultyId',
    required: false,
    type: String,
    description: 'Faculty ID to filter by',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status: string = '',
    @Query('facultyId') facultyId?: string,
  ): Promise<PaginatedResponse<SubjectsDto>> {
    return await this.subjectsService.findAll(
      Number(page),
      Number(limit),
      status,
      facultyId,
    );
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SubjectsDto)
  @ApiParam({ name: 'code', description: 'Subject code', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get subject by code',
    type: SubjectResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  findByCode(@Param('code') code: string) {
    return this.subjectsService.findByCode(code);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SubjectsDto)
  @ApiParam({ name: 'id', description: 'Subject ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get subject by id',
    type: SubjectResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  findById(@Param('id') id: string) {
    return this.subjectsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SubjectsDto)
  @ApiParam({ name: 'id', description: 'Subject ID', type: String })
  @ApiBody({ type: UpdateSubjectDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update subject',
    type: SubjectResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDTO) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SubjectsDto)
  @ApiParam({ name: 'id', description: 'Subject ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete subject',
    type: SubjectResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  delete(@Param('id') id: string) {
    return this.subjectsService.delete(id);
  }
}
