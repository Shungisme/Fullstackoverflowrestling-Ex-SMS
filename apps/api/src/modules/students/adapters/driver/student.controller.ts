import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { StudentService } from '../../domain/port/input/student.service';
import {
  DeleteStudentResponseDTO,
  StudentRequestDTO,
  StudentResponseDTO,
} from '../../domain/dto/student-dto';
import { ZodSerializerDto, ZodValidationPipe } from 'nestjs-zod';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ZodSerializerDto(StudentResponseDTO)
  @UsePipes(ZodValidationPipe)
  async create(
    @Body() studentDto: StudentRequestDTO,
  ): Promise<StudentResponseDTO> {
    return await this.studentService.create(studentDto);
  }

  @Get(':studentId')
  @ZodSerializerDto(StudentResponseDTO)
  async findById(
    @Param('studentId') studentId: string,
  ): Promise<StudentResponseDTO> {
    return await this.studentService.findById(studentId);
  }

  @Patch(':studentId')
  @ZodSerializerDto(StudentResponseDTO)
  async update(
    @Param('studentId') studentId: string,
    @Body() studentDto: StudentRequestDTO,
  ): Promise<StudentResponseDTO> {
    return await this.studentService.update({ ...studentDto, studentId });
  }

  @Delete(':studentId')
  @ZodSerializerDto(DeleteStudentResponseDTO)
  async delete(
    @Param('studentId') studentId: string,
  ): Promise<DeleteStudentResponseDTO> {
    return await this.studentService.delete(studentId);
  }

  @Get('/')
  async search(@Query() query): Promise<StudentResponseDTO[]> {
    return await this.studentService.search(query);
  }
}
