import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from '../../domain/port/input/student.service';
import { StudentRequestDTO } from '../../domain/dto/student-dto';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  DeleteStudentResponseDTO,
  DeleteStudentWrapperResponseDTO,
} from '../../domain/dto/delete-dto';
import { SearchRequestDTO } from '../../domain/dto/search-dto';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  StudentResponseDTO,
  StudentResponseWrapperDTO,
  StudentsResponseDTO,
  StudentsResponseWrapperDTO,
} from '../../domain/dto/student-response-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CreateStudentWithAddressDTO } from '../../domain/dto/create-student-dto';

@ApiTags('Students')
@Controller({ path: 'students', version: '1' })
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(StudentResponseDTO)
  @ApiBody({
    type: CreateStudentWithAddressDTO,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a student',
    type: StudentResponseWrapperDTO,
  })
  async create(
    @Body() studentDto: CreateStudentWithAddressDTO,
  ): Promise<StudentResponseDTO> {
    return await this.studentService.create(studentDto);
  }

  @Patch(':studentId')
  @HttpCode(HttpStatus?.OK)
  @ZodSerializerDto(StudentResponseDTO)
  @ApiBody({ type: StudentRequestDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'update a student',
    type: StudentResponseWrapperDTO,
  })
  async update(
    @Param('studentId') studentId: string,
    @Body() studentDto: StudentRequestDTO,
  ): Promise<StudentResponseDTO> {
    return await this.studentService.update({ ...studentDto, studentId });
  }

  @Delete(':studentId')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(DeleteStudentResponseDTO)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'delete a student',
    type: DeleteStudentWrapperResponseDTO,
  })
  async delete(
    @Param('studentId') studentId: string,
  ): Promise<DeleteStudentResponseDTO> {
    return await this.studentService.delete(studentId);
  }

  @Get()
  @ZodSerializerDto(StudentsResponseDTO)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create a student',
    type: StudentsResponseWrapperDTO,
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({
    name: 'key',
    required: false,
    type: Number,
    description: 'contain name and studentId',
  })
  @ApiQuery({
    name: 'faculty',
    required: false,
    type: String,
  })
  async search(@Query() query: SearchRequestDTO): Promise<StudentsResponseDTO> {
    return await this.studentService.search(query);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ isCreated: boolean; message: string }> {
    return await this.studentService.upload(file);
  }

  @Get('export')
  @HttpCode(HttpStatus.OK)
  async exportFile(
    @Query('type') type: string,
    @Res() res: Response,
  ): Promise<any> {
    return await this.studentService.exportFile(type, res);
  }

  @Get(':studentId')
  @HttpCode(HttpStatus?.OK)
  @ZodSerializerDto(StudentResponseDTO)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'find a student by id',
    type: StudentResponseWrapperDTO,
  })
  async findById(
    @Param('studentId') studentId: string,
  ): Promise<StudentResponseDTO> {
    return await this.studentService.findById(studentId);
  }
}
