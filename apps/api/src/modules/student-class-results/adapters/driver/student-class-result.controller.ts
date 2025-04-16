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
import { CreateStudentClassResultDTO } from '../../domain/dto/create-student-class-result.dto';
import { UpdateStudentClassResultDTO } from '../../domain/dto/update-student-class-result.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  StudentClassResultDto,
  StudentClassResultsResponseWrapperDTO,
  StudentClassResultResponseWrapperDTO,
} from '../../domain/dto/student-class-result.dto';
import { StudentClassResultService } from '../../domain/port/input/student-class-result.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Student Class Results')
@Controller({ path: 'student-class-results', version: '1' })
export class StudentClassResultController {
  constructor(
    private readonly studentClassResultService: StudentClassResultService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(StudentClassResultDto)
  @ApiBody({ type: CreateStudentClassResultDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a student class result',
    type: StudentClassResultResponseWrapperDTO,
  })
  create(@Body() createStudentClassResultDto: CreateStudentClassResultDTO) {
    return this.studentClassResultService.create(createStudentClassResultDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all student class results with pagination',
    type: StudentClassResultsResponseWrapperDTO,
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
  ): Promise<PaginatedResponse<StudentClassResultDto>> {
    return await this.studentClassResultService.findAll(
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
    description: 'Get results by student ID',
    type: StudentClassResultsResponseWrapperDTO,
  })
  findByStudent(
    @Param('studentId') studentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.studentClassResultService.findByStudent(
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
    description: 'Get results by class code',
    type: StudentClassResultsResponseWrapperDTO,
  })
  findByClass(
    @Param('classCode') classCode: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.studentClassResultService.findByClass(
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
    description: 'Get results by student ID and class code',
  })
  findByStudentAndClass(
    @Param('studentId') studentId: string,
    @Param('classCode') classCode: string,
  ) {
    return this.studentClassResultService.findByStudentAndClass(
      studentId,
      classCode,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(StudentClassResultDto)
  @ApiParam({ name: 'id', description: 'Result ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get student class result by id',
    type: StudentClassResultResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student class result not found',
  })
  findById(@Param('id') id: string) {
    return this.studentClassResultService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(StudentClassResultDto)
  @ApiParam({ name: 'id', description: 'Result ID', type: String })
  @ApiBody({ type: UpdateStudentClassResultDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update student class result',
    type: StudentClassResultResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student class result not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateStudentClassResultDto: UpdateStudentClassResultDTO,
  ) {
    return this.studentClassResultService.update(
      id,
      updateStudentClassResultDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(StudentClassResultDto)
  @ApiParam({ name: 'id', description: 'Result ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete student class result',
    type: StudentClassResultResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student class result not found',
  })
  delete(@Param('id') id: string) {
    return this.studentClassResultService.delete(id);
  }
}
