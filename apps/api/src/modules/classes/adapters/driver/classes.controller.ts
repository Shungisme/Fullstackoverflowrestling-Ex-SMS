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
import { CreateClassDTO } from '../../domain/dto/create-class.dto';
import { UpdateClassDTO } from '../../domain/dto/update-class.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  ClassResponseDto,
  ClassesResponseWrapperDTO,
  ClassResponseWrapperDTO,
  ClassesDto,
} from '../../domain/dto/classes.dto';
import { ClassesService } from '../../domain/port/input/classes.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Classes')
@Controller({ path: 'classes', version: '1' })
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(ClassesDto)
  @ApiBody({ type: CreateClassDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a class',
    type: ClassResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Class with the same code already exists',
  })
  create(@Body() createClassDto: CreateClassDTO) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all classes with pagination',
    type: ClassesResponseWrapperDTO,
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
    name: 'subjectCode',
    required: false,
    type: String,
    description: 'Filter by subject code',
  })
  @ApiQuery({
    name: 'semesterId',
    required: false,
    type: String,
    description: 'Filter by semester ID',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('subjectCode') subjectCode?: string,
    @Query('semesterId') semesterId?: string,
  ): Promise<PaginatedResponse<ClassResponseDto>> {
    const filters = { subjectCode, semesterId };
    return await this.classesService.findAll(
      Number(page),
      Number(limit),
      filters,
    );
  }

  @Get('subject/:subjectCode')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'subjectCode', description: 'Subject code', type: String })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get classes for a specific subject',
    type: ClassesResponseWrapperDTO,
  })
  findBySubject(
    @Param('subjectCode') subjectCode: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.classesService.findBySubject(
      subjectCode,
      Number(page),
      Number(limit),
    );
  }

  @Get('semester/:semesterId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'semesterId', description: 'Semester ID', type: String })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get classes for a specific semester',
    type: ClassesResponseWrapperDTO,
  })
  findBySemester(
    @Param('semesterId') semesterId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.classesService.findBySemester(
      semesterId,
      Number(page),
      Number(limit),
    );
  }

  @Get('academic-year/:academicYear/semester/:semester')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'academicYear',
    description: 'Academic year (e.g., 2023-2024)',
    type: String,
  })
  @ApiParam({ name: 'semester', description: 'Semester number', type: Number })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get classes for a specific academic year and semester',
    type: ClassesResponseWrapperDTO,
  })
  findByAcademicYear(
    @Param('academicYear') academicYear: string,
    @Param('semester') semester: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.classesService.findByAcademicYear(
      academicYear,
      Number(semester),
      Number(page),
      Number(limit),
    );
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(ClassesDto)
  @ApiParam({ name: 'code', description: 'Class code', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get class by code',
    type: ClassResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found',
  })
  findByCode(@Param('code') code: string) {
    return this.classesService.findByCode(code);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(ClassesDto)
  @ApiParam({ name: 'id', description: 'Class ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get class by id',
    type: ClassResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found',
  })
  findById(@Param('id') id: string) {
    return this.classesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(ClassesDto)
  @ApiParam({ name: 'id', description: 'Class ID', type: String })
  @ApiBody({ type: UpdateClassDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update class',
    type: ClassResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found',
  })
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDTO) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(ClassesDto)
  @ApiParam({ name: 'id', description: 'Class ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete class',
    type: ClassResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete class with existing enrollments or results',
  })
  delete(@Param('id') id: string) {
    return this.classesService.delete(id);
  }
}
