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
  Headers,
} from '@nestjs/common';
import { CreateFacultyDTO } from '../../domain/dto/create-faculty.dto';
import { UpdateFacultyDTO } from '../../domain/dto/update-faculty.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  FacultiesDto,
  FacultiesResponseWrapperDTO,
  FacultyResponseWrapperDTO,
} from '../../domain/dto/faculties.dto';
import { FacultiesService } from '../../domain/port/input/faculties.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { Response } from 'express';

@ApiTags('Faculties')
@Controller({ path: 'faculties', version: '1' })
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(FacultiesDto)
  @ApiBody({ type: CreateFacultyDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a faculty',
    type: FacultyResponseWrapperDTO,
  })
  async create(
    @Res() response: Response,
    @Body() createFacultyDto: CreateFacultyDTO,
  ): Promise<Response> {
    try {
      const faculty = await this.facultiesService.create(createFacultyDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Faculty created successfully',
        data: faculty,
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
    description: 'Get all faculties with pagination',
    type: FacultiesResponseWrapperDTO,
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
    name: 'lang',
    required: false,
    type: String,
    description: 'Language code for translations',
  })
  @ApiHeader({
    name: 'Accept-Language',
    required: false,
    description: 'Language preference',
  })
  async findAll(
    @Res() response: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status: string = '',
    @Query('lang') queryLang?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ): Promise<Response> {
    try {
      // Ưu tiên query param, sau đó dùng header
      const lang =
        queryLang ||
        (acceptLanguage
          ? acceptLanguage.split(',')[0].split(';')[0]
          : undefined);

      const faculties = await this.facultiesService.findAll(
        Number(page),
        Number(limit),
        status,
        lang,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Faculties fetched successfully',
        data: faculties,
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
  @ZodSerializerDto(FacultiesDto)
  @ApiParam({ name: 'id', description: 'Faculty ID', type: String })
  @ApiQuery({
    name: 'lang',
    required: false,
    type: String,
    description: 'Language code for translations',
  })
  @ApiHeader({
    name: 'Accept-Language',
    required: false,
    description: 'Language preference',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get faculty by id',
    type: FacultyResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  async findById(
    @Param('id') id: string,
    @Res() response: Response,
    @Query('lang') queryLang?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    try {
      // Ưu tiên query param, sau đó dùng header
      const lang =
        queryLang ||
        (acceptLanguage
          ? acceptLanguage.split(',')[0].split(';')[0]
          : undefined);

      const faculty = await this.facultiesService.findById(id, lang);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Faculty fetched successfully',
        data: faculty,
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
  @ZodSerializerDto(FacultiesDto)
  @ApiParam({ name: 'id', description: 'Faculty ID', type: String })
  @ApiBody({ type: UpdateFacultyDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update faculty',
    type: FacultyResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateFacultyDto: UpdateFacultyDTO,
    @Res() response: Response,
  ) {
    try {
      const updatedFaculty = await this.facultiesService.update(
        id,
        updateFacultyDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Faculty updated successfully',
        data: updatedFaculty,
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
  @ZodSerializerDto(FacultiesDto)
  @ApiParam({ name: 'id', description: 'Faculty ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete faculty',
    type: FacultyResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  async delete(@Param('id') id: string, @Res() response: Response) {
    try {
      const deletedFaculty = await this.facultiesService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Faculty deleted successfully',
        data: deletedFaculty,
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
