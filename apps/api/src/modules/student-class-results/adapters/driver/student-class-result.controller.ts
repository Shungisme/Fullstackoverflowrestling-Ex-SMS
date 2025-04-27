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
  Res,
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
import { Response } from 'express';

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
  async create(
    @Res() response: Response,
    @Body() createStudentClassResultDto: CreateStudentClassResultDTO,
  ) {
    try {
      const result = await this.studentClassResultService.create(
        createStudentClassResultDto,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Student class result created successfully',
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
    @Res() response: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const results = await this.studentClassResultService.findAll(
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class results fetched successfully',
        data: results,
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
  async findByStudent(
    @Res() response: Response,
    @Param('studentId') studentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const results = await this.studentClassResultService.findByStudent(
        studentId,
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class results fetched successfully',
        data: results,
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
  async findByClass(
    @Res() response: Response,
    @Param('classCode') classCode: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const results = await this.studentClassResultService.findByClass(
        classCode,
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Class results fetched successfully',
        data: results,
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

  @Get('student/:studentId/class/:classCode')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'studentId', description: 'Student ID', type: String })
  @ApiParam({ name: 'classCode', description: 'Class Code', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get results by student ID and class code',
  })
  async findByStudentAndClass(
    @Res() response: Response,
    @Param('studentId') studentId: string,
    @Param('classCode') classCode: string,
  ) {
    try {
      const result = await this.studentClassResultService.findByStudentAndClass(
        studentId,
        classCode,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class result fetched successfully',
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
  async findById(@Res() response: Response, @Param('id') id: string) {
    try {
      const result = await this.studentClassResultService.findById(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class result fetched successfully',
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
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateStudentClassResultDto: UpdateStudentClassResultDTO,
  ) {
    try {
      const result = await this.studentClassResultService.update(
        id,
        updateStudentClassResultDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class result updated successfully',
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
  async delete(@Res() response: Response, @Param('id') id: string) {
    try {
      const result = await this.studentClassResultService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class result deleted successfully',
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
}
