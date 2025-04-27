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
import { CreateProgramDTO } from '../../domain/dto/create-program.dto';
import { UpdateProgramDTO } from '../../domain/dto/update-program.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  ProgramsDto,
  ProgramsResponseWrapperDTO,
  ProgramResponseWrapperDTO,
} from '../../domain/dto/programs.dto';
import { ProgramsService } from '../../domain/port/input/programs.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { Response } from 'express';

@ApiTags('Programs')
@Controller({ path: 'programs', version: '1' })
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(ProgramsDto)
  @ApiBody({ type: CreateProgramDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a program',
    type: ProgramResponseWrapperDTO,
  })
  async create(
    @Res() response: Response,
    @Body() createProgramDto: CreateProgramDTO,
  ): Promise<Response> {
    try {
      const program = await this.programsService.create(createProgramDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Program created successfully',
        data: program,
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
    description: 'Get all programs with pagination',
    type: ProgramsResponseWrapperDTO,
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
    description: 'Filter by status',
  })
  async findAll(
    @Res() response: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status: string = '',
  ): Promise<Response> {
    try {
      const programs = await this.programsService.findAll(
        Number(page),
        Number(limit),
        status,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Programs fetched successfully',
        data: programs,
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
  @ZodSerializerDto(ProgramsDto)
  @ApiParam({ name: 'id', description: 'Program ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get program by id',
    type: ProgramResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Program not found',
  })
  async findById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const program = await this.programsService.findById(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Program fetched successfully',
        data: program,
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
  @ZodSerializerDto(ProgramsDto)
  @ApiParam({ name: 'id', description: 'Program ID', type: String })
  @ApiBody({ type: UpdateProgramDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update program',
    type: ProgramResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Program not found',
  })
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDTO,
  ): Promise<Response> {
    try {
      const updatedProgram = await this.programsService.update(
        id,
        updateProgramDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Program updated successfully',
        data: updatedProgram,
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
  @ZodSerializerDto(ProgramsDto)
  @ApiParam({ name: 'id', description: 'Program ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete program',
    type: ProgramResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Program not found',
  })
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const deletedProgram = await this.programsService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Program deleted successfully',
        data: deletedProgram,
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
