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
import { CreateSemesterDTO } from '../../domain/dto/create-semester.dto';
import { UpdateSemesterDTO } from '../../domain/dto/update-semester.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  SemesterDto,
  SemestersResponseWrapperDTO,
  SemesterResponseWrapperDTO,
} from '../../domain/dto/semester.dto';
import { SemesterService } from '../../domain/port/input/semester.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { Response } from 'express';

@ApiTags('Semesters')
@Controller({ path: 'semesters', version: '1' })
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(SemesterDto)
  @ApiBody({ type: CreateSemesterDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a semester',
    type: SemesterResponseWrapperDTO,
  })
  async create(
    @Res() response: Response,
    @Body() createSemesterDto: CreateSemesterDTO,
  ) {
    try {
      const semester = await this.semesterService.create(createSemesterDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Semester created successfully',
        data: semester,
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
    description: 'Get all semesters with pagination',
    type: SemestersResponseWrapperDTO,
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
      const semesters = await this.semesterService.findAll(
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Semesters fetched successfully',
        data: semesters,
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
  @ZodSerializerDto(SemesterDto)
  @ApiParam({ name: 'id', description: 'Semester ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get semester by id',
    type: SemesterResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Semester not found',
  })
  async findById(@Res() response: Response, @Param('id') id: string) {
    try {
      const semester = await this.semesterService.findById(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Semester fetched successfully',
        data: semester,
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
  @ZodSerializerDto(SemesterDto)
  @ApiParam({ name: 'id', description: 'Semester ID', type: String })
  @ApiBody({ type: UpdateSemesterDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update semester',
    type: SemesterResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Semester not found',
  })
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDTO,
  ) {
    try {
      const updatedSemester = await this.semesterService.update(
        id,
        updateSemesterDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Semester updated successfully',
        data: updatedSemester,
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
  @ZodSerializerDto(SemesterDto)
  @ApiParam({ name: 'id', description: 'Semester ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete semester',
    type: SemesterResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Semester not found',
  })
  async delete(@Res() response: Response, @Param('id') id: string) {
    try {
      const deletedSemester = await this.semesterService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Semester deleted successfully',
        data: deletedSemester,
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
