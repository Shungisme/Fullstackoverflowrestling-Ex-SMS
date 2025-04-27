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
import { CreateSubjectPrerequisiteDTO } from '../../domain/dto/create-subject-prerequisite.dto';
import { UpdateSubjectPrerequisiteDTO } from '../../domain/dto/update-subject-prerequisite.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  SubjectPrerequisiteDto,
  SubjectPrerequisiteResponseDto,
  SubjectPrerequisiteResponseWrapperDTO,
  SubjectPrerequisitesResponseWrapperDTO,
} from '../../domain/dto/subject-prerequisite.dto';
import { SubjectPrerequisiteService } from '../../domain/port/input/subject-prerequisite.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { Response } from 'express';

@ApiTags('Subject Prerequisites')
@Controller({ path: 'subject-prerequisites', version: '1' })
export class SubjectPrerequisiteController {
  constructor(
    private readonly prerequisiteService: SubjectPrerequisiteService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(SubjectPrerequisiteDto)
  @ApiBody({ type: CreateSubjectPrerequisiteDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a subject prerequisite relationship',
    type: SubjectPrerequisiteResponseWrapperDTO,
  })
  async create(
    @Res() response: Response,
    @Body() createDto: CreateSubjectPrerequisiteDTO,
  ): Promise<Response> {
    try {
      const result = await this.prerequisiteService.create(createDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Subject prerequisite created successfully',
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
    description: 'Get all subject prerequisites with pagination',
    type: SubjectPrerequisitesResponseWrapperDTO,
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
  ): Promise<Response> {
    try {
      const result = await this.prerequisiteService.findAll(
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subject prerequisites fetched successfully',
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

  @Get('subject/:subjectId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'subjectId', description: 'Subject ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all prerequisites for a specific subject',
    type: [SubjectPrerequisiteResponseDto],
  })
  async findBySubjectId(
    @Res() response: Response,
    @Param('subjectId') subjectId: string,
  ): Promise<Response> {
    try {
      const result =
        await this.prerequisiteService.findPrerequisitesForSubject(subjectId);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subject prerequisites fetched successfully',
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

  @Get('required-by/:prerequisiteSubjectId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'prerequisiteSubjectId',
    description: 'Prerequisite Subject ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all subjects that require a specific prerequisite',
    type: [SubjectPrerequisiteResponseDto],
  })
  async findByPrerequisiteSubjectId(
    @Res() response: Response,
    @Param('prerequisiteSubjectId') prerequisiteSubjectId: string,
  ): Promise<Response> {
    try {
      const result =
        await this.prerequisiteService.findSubjectsRequiringPrerequisite(
          prerequisiteSubjectId,
        );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subjects requiring prerequisite fetched successfully',
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
  @ZodSerializerDto(SubjectPrerequisiteDto)
  @ApiParam({ name: 'id', description: 'Prerequisite ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get subject prerequisite by id',
    type: SubjectPrerequisiteResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject prerequisite not found',
  })
  async findById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const result = await this.prerequisiteService.findById(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subject prerequisite fetched successfully',
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
  @ZodSerializerDto(SubjectPrerequisiteDto)
  @ApiParam({ name: 'id', description: 'Prerequisite ID', type: String })
  @ApiBody({ type: UpdateSubjectPrerequisiteDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update subject prerequisite',
    type: SubjectPrerequisiteResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject prerequisite not found',
  })
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateDto: UpdateSubjectPrerequisiteDTO,
  ): Promise<Response> {
    try {
      const result = await this.prerequisiteService.update(id, updateDto);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subject prerequisite updated successfully',
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
  @ZodSerializerDto(SubjectPrerequisiteDto)
  @ApiParam({ name: 'id', description: 'Prerequisite ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete subject prerequisite',
    type: SubjectPrerequisiteResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject prerequisite not found',
  })
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const result = await this.prerequisiteService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Subject prerequisite deleted successfully',
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
