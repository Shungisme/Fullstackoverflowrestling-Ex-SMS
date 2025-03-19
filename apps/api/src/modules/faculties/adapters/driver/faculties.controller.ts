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
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

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

  create(@Body() createFacultyDto: CreateFacultyDTO) {
    return this.facultiesService.create(createFacultyDto);
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
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedResponse<FacultiesDto>> {
    return await this.facultiesService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(FacultiesDto)
  @ApiParam({ name: 'id', description: 'Faculty ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get faculty by id',
    type: FacultyResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })

  findById(@Param('id') id: string) {
    return this.facultiesService.findById(id);
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

  update(@Param('id') id: string, @Body() updateFacultyDto: UpdateFacultyDTO) {
    return this.facultiesService.update(id, updateFacultyDto);
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

  delete(@Param('id') id: string) {
    return this.facultiesService.delete(id);
  }
}
