import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StudentService } from '../../domain/port/input/student.service';
import {
  StudentRequestDTO,
  StudentResponseDTO,
} from '../../domain/dto/student-dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { DeleteStudentResponseDTO } from '../../domain/dto/delete-dto';
import { SearchRequestDTO } from '../../domain/dto/search-dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ZodSerializerDto(StudentResponseDTO)
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

  @Get()
  async search(
    @Query() query: SearchRequestDTO,
  ): Promise<StudentResponseDTO[]> {
    return this.studentService.search(query);
  }
}
