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
import { Response } from 'express';

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
  async create(
    @Res() response: Response,
    @Body() createClassDto: CreateClassDTO,
  ): Promise<Response> {
    try {
      const createdClass = await this.classesService.create(createClassDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Class created successfully',
        data: createdClass,
      });
    } catch (error: any) {
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
    @Res() response: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('subjectCode') subjectCode?: string,
    @Query('semesterId') semesterId?: string,
  ): Promise<Response> {
    try {
      const filters = { subjectCode, semesterId };
      const classes = await this.classesService.findAll(
        Number(page),
        Number(limit),
        filters,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Classes fetched successfully',
        data: classes,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
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
  async findBySubject(
    @Res() response: Response,
    @Param('subjectCode') subjectCode: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Response> {
    try {
      const classes = await this.classesService.findBySubject(
        subjectCode,
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Classes fetched successfully',
        data: classes,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
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
  async findBySemester(
    @Res() response: Response,
    @Param('semesterId') semesterId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Response> {
    try {
      const classes = await this.classesService.findBySemester(
        semesterId,
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Classes fetched successfully',
        data: classes,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
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
  async findByAcademicYear(
    @Res() response: Response,
    @Param('academicYear') academicYear: string,
    @Param('semester') semester: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Response> {
    try {
      const classes = await this.classesService.findByAcademicYear(
        academicYear,
        Number(semester),
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Classes fetched successfully',
        data: classes,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
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
  async findByCode(
    @Res() response: Response,
    @Param('code') code: string,
  ): Promise<Response> {
    try {
      const classData = await this.classesService.findByCode(code);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Class fetched successfully',
        data: classData,
      });
    } catch (error: any) {
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
  async findById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const classData = await this.classesService.findById(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Class fetched successfully',
        data: classData,
      });
    } catch (error: any) {
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
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDTO,
  ): Promise<Response> {
    try {
      const updatedClass = await this.classesService.update(id, updateClassDto);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Class updated successfully',
        data: updatedClass,
      });
    } catch (error: any) {
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
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const deletedClass = await this.classesService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Class deleted successfully',
        data: deletedClass,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
  }
}
