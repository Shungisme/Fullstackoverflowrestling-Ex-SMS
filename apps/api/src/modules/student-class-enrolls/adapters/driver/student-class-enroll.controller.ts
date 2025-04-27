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
import { EnrollEnum } from '@prisma/client';
import { Response } from 'express';

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
  async create(
    @Res() response: Response,
    @Body() createStudentClassEnrollDto: CreateStudentClassEnrollDTO,
  ) {
    try {
      const studentClassEnrol = await this.studentClassEnrollService.create(
        createStudentClassEnrollDto,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Student class enrollment created successfully',
        data: studentClassEnrol,
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
    @Res() response: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.studentClassEnrollService.findAll(
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class enrollments fetched successfully',
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
  async findByStudent(
    @Res() response: Response,
    @Param('studentId') studentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.studentClassEnrollService.findByStudent(
        studentId,
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student enrollments fetched successfully',
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
  async findByClass(
    @Res() response: Response,
    @Param('classCode') classCode: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.studentClassEnrollService.findByClass(
        classCode,
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Class enrollments fetched successfully',
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

  @Get('student/:studentId/class/:classCode')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'studentId', description: 'Student ID', type: String })
  @ApiParam({ name: 'classCode', description: 'Class Code', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get enrollment by student ID and class code',
    type: StudentClassEnrollResponseWrapperDTO,
  })
  async findByStudentAndClass(
    @Res() response: Response,
    @Param('studentId') studentId: string,
    @Param('classCode') classCode: string,
  ) {
    try {
      const result = await this.studentClassEnrollService.findByStudentAndClass(
        studentId,
        classCode,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Enrollment fetched successfully',
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

  @Post('student/:studentId/class/:classCode')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'studentId', description: 'Student ID', type: String })
  @ApiParam({ name: 'classCode', description: 'Class Code', type: String })
  @ApiBody({
    description: 'Enrollment type',
    schema: {
      type: 'string',
      enum: Object.values(EnrollEnum),
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get enrollment by student ID and class code',
    type: StudentClassEnrollResponseWrapperDTO,
  })
  async updateTypeByStudentAndClass(
    @Res() response: Response,
    @Param('studentId') studentId: string,
    @Param('classCode') classCode: string,
    @Body('type') type: EnrollEnum,
  ) {
    try {
      const result =
        await this.studentClassEnrollService.updateTypeByStudentAndClass(
          studentId,
          classCode,
          type,
        );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Enrollment type updated successfully',
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
  async findById(@Res() response: Response, @Param('id') id: string) {
    try {
      const result = await this.studentClassEnrollService.findById(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class enrollment fetched successfully',
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
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateStudentClassEnrollDto: UpdateStudentClassEnrollDTO,
  ) {
    try {
      const result = await this.studentClassEnrollService.update(
        id,
        updateStudentClassEnrollDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class enrollment updated successfully',
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
  async delete(@Res() response: Response, @Param('id') id: string) {
    try {
      const result = await this.studentClassEnrollService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class enrollment deleted successfully',
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

  @Delete('student/:studentId/class/:classCode')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(StudentClassEnrollDto)
  @ApiParam({ name: 'studentId', description: 'Student ID', type: String })
  @ApiParam({ name: 'classCode', description: 'Class Code', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete student class enrollment by student ID and class code',
    type: StudentClassEnrollResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student class enrollment not found',
  })
  async dropAnEnrollment(
    @Res() response: Response,
    @Param('studentId') studentId: string,
    @Param('classCode') classCode: string,
  ) {
    try {
      const result = await this.studentClassEnrollService.dropEnroll(
        studentId,
        classCode,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Student class enrollment dropped successfully',
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
