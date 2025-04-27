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
import { CreateSubjectDTO } from '../../domain/dto/create-subject.dto';
import { UpdateSubjectDTO } from '../../domain/dto/update-subject.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  SubjectsDto,
  SubjectsResponseWrapperDTO,
  SubjectResponseWrapperDTO,
} from '../../domain/dto/subjects.dto';
import { SubjectsService } from '../../domain/port/input/subjects.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { response, Response } from 'express';

@ApiTags('Subjects')
@Controller({ path: 'subjects', version: '1' })
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(SubjectsDto)
  @ApiBody({ type: CreateSubjectDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a subject',
    type: SubjectResponseWrapperDTO,
  })
  async create(
    @Res() response: Response,
    @Body() createSubjectDto: CreateSubjectDTO,
  ): Promise<Response> {
    try {
      const result = await this.subjectsService.create(createSubjectDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Subject created successfully',
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
    description: 'Get all subjects with pagination',
    type: SubjectsResponseWrapperDTO,
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
    name: 'status',
    required: false,
    type: String,
    description: 'Status to filter by',
  })
  @ApiQuery({
    name: 'facultyId',
    required: false,
    type: String,
    description: 'Faculty ID to filter by',
  })
  async findAll(
    @Res() response: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status: string = '',
    @Query('facultyId') facultyId?: string,
  ): Promise<Response> {
    try {
      const result = await this.subjectsService.findAll(
        Number(page),
        Number(limit),
        status,
        facultyId,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subjects fetched successfully',
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

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SubjectsDto)
  @ApiParam({ name: 'code', description: 'Subject code', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get subject by code',
    type: SubjectResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  async findByCode(
    @Res() response: Response,
    @Param('code') code: string,
  ): Promise<Response> {
    try {
      const result = await this.subjectsService.findByCode(code);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subject fetched successfully',
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
  @ZodSerializerDto(SubjectsDto)
  @ApiParam({ name: 'id', description: 'Subject ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get subject by id',
    type: SubjectResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  async findById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const result = await this.subjectsService.findById(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subject fetched successfully',
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
  @ZodSerializerDto(SubjectsDto)
  @ApiParam({ name: 'id', description: 'Subject ID', type: String })
  @ApiBody({ type: UpdateSubjectDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update subject',
    type: SubjectResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDTO,
  ): Promise<Response> {
    try {
      const result = await this.subjectsService.update(id, updateSubjectDto);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subject updated successfully',
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
  @ZodSerializerDto(SubjectsDto)
  @ApiParam({ name: 'id', description: 'Subject ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete subject',
    type: SubjectResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const result = await this.subjectsService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subject deleted successfully',
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
