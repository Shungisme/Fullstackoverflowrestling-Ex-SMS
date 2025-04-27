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
import {
  StudentRequestDTO,
  UpdateStudentRequestDTO,
} from '../../domain/dto/student-dto';
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
    @Res() response: Response,
    @Body() studentDto: CreateStudentWithAddressDTO,
  ): Promise<Response> {
    try {
      const result = await this.studentService.create(studentDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Student created successfully',
        data: result,
      });
    } catch (error) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
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
    @Res() response: Response,
    @Param('studentId') studentId: string,
    @Body() studentDto: UpdateStudentRequestDTO,
  ): Promise<Response> {
    try {
      const result = await this.studentService.update({
        ...studentDto,
        studentId,
      });
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student updated successfully',
        data: result,
      });
    } catch (error) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
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
    @Res() response: Response,
    @Param('studentId') studentId: string,
  ): Promise<Response> {
    try {
      const result = await this.studentService.delete(studentId);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student deleted successfully',
        data: result,
      });
    } catch (error) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
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
  async search(
    @Res() response: Response,
    @Query() query: SearchRequestDTO,
  ): Promise<Response> {
    try {
      const result = await this.studentService.search(query);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Students searched successfully',
        data: result,
      });
    } catch (error) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    try {
      const result = await this.studentService.upload(file);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.OK,
        message: 'Students uploaded successfully',
        data: result,
      });
    } catch (error) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || 'Internal Server Error',
        });
    }
  }

  @Get('export')
  @HttpCode(HttpStatus.OK)
  async exportFile(
    @Query('type') type: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      return await this.studentService.exportFile(type, res);
    } catch (error) {
      return res
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || 'Internal Server Error',
        });
    }
  }

  @Get(':studentId/transcript')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Export a student transcript',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async exportTranscript(
    @Param('studentId') studentId: string,
    @Res() res: Response,
  ) {
    try {
      await this.studentService.exportTranscript(studentId, res);
      return res;
    } catch (error) {
      return res
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || 'Internal Server Error',
        });
    }
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
    @Res() response: Response,
    @Param('studentId') studentId: string,
  ): Promise<Response> {
    try {
      const result = await this.studentService.findById(studentId);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student finded successfully',
        data: result,
      });
    } catch (error) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || 'Internal Server Error',
        });
    }
  }
}
