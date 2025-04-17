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
import { CreateStudentClassEnrollDTO } from '../../domain/dto/create-student-class-enroll.dto';
import { UpdateStudentClassEnrollDTO } from '../../domain/dto/update-student-class-enroll.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  StudentClassEnrollDto,
  StudentClassEnrollsResponseWrapperDTO,
  StudentClassEnrollResponseWrapperDTO,
} from '../../domain/dto/student-class-enroll.dto';
import { StudentClassEnrollService } from '../../domain/port/input/student-class-enroll.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Student Class Enrollments')
@Controller({ path: 'student-class-enrolls', version: '1' })
export class StudentClassEnrollController {
  constructor(
    private readonly studentClassEnrollService: StudentClassEnrollService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(StudentClassEnrollDto)
  @ApiBody({ type: CreateStudentClassEnrollDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a student class enrollment',
    type: StudentClassEnrollResponseWrapperDTO,
  })
  create(@Body() createStudentClassEnrollDto: CreateStudentClassEnrollDTO) {
    return this.studentClassEnrollService.create(createStudentClassEnrollDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all student class enrollments with pagination',
    type: StudentClassEnrollsResponseWrapperDTO,
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
  ): Promise<PaginatedResponse<StudentClassEnrollDto>> {
    return await this.studentClassEnrollService.findAll(
      Number(page),
      Number(limit),
    );
  }

  @Get('student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'studentId', description: 'Student ID', type: String })
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
    description: 'Get enrollments by student ID',
    type: StudentClassEnrollsResponseWrapperDTO,
  })
  findByStudent(
    @Param('studentId') studentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.studentClassEnrollService.findByStudent(
      studentId,
      Number(page),
      Number(limit),
    );
  }

  @Get('class/:classCode')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'classCode', description: 'Class Code', type: String })
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
    description: 'Get enrollments by class code',
    type: StudentClassEnrollsResponseWrapperDTO,
  })
  findByClass(
    @Param('classCode') classCode: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.studentClassEnrollService.findByClass(
      classCode,
      Number(page),
      Number(limit),
    );
  }

  @Get('student/:studentId/class/:classCode')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'studentId', description: 'Student ID', type: String })
  @ApiParam({ name: 'classCode', description: 'Class Code', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get enrollment by student ID and class code',
    type: StudentClassEnrollResponseWrapperDTO,
  })
  findByStudentAndClass(
    @Param('studentId') studentId: string,
    @Param('classCode') classCode: string,
  ) {
    return this.studentClassEnrollService.findByStudentAndClass(
      studentId,
      classCode,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(StudentClassEnrollDto)
  @ApiParam({ name: 'id', description: 'Enrollment ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get student class enrollment by id',
    type: StudentClassEnrollResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student class enrollment not found',
  })
  findById(@Param('id') id: string) {
    return this.studentClassEnrollService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(StudentClassEnrollDto)
  @ApiParam({ name: 'id', description: 'Enrollment ID', type: String })
  @ApiBody({ type: UpdateStudentClassEnrollDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update student class enrollment',
    type: StudentClassEnrollResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student class enrollment not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateStudentClassEnrollDto: UpdateStudentClassEnrollDTO,
  ) {
    return this.studentClassEnrollService.update(
      id,
      updateStudentClassEnrollDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(StudentClassEnrollDto)
  @ApiParam({ name: 'id', description: 'Enrollment ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete student class enrollment',
    type: StudentClassEnrollResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student class enrollment not found',
  })
  delete(@Param('id') id: string) {
    return this.studentClassEnrollService.delete(id);
  }
}
