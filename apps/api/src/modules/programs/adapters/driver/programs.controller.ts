import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
  HttpCode,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { ProgramsService } from '../../domain/port/input/programs.service';
import { CreateProgramDTO } from '../../domain/dto/create-program.dto';
import { UpdateProgramDTO } from '../../domain/dto/update-program.dto';
import {
  ProgramResponseWrapperDTO,
  ProgramsDto,
} from '../../domain/dto/programs.dto';

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
    description: 'Create program',
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
  @ZodSerializerDto(ProgramsDto)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by status',
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all programs',
    type: ProgramResponseWrapperDTO,
  })
  async findAll(
    @Res() response: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status = '',
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

      const paginatedPrograms = await this.programsService.findAll(
        +page,
        +limit,
        status,
        lang,
      );

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Programs fetched successfully',
        data: paginatedPrograms.data,
        page: paginatedPrograms.page,
        totalPage: paginatedPrograms.totalPage,
        limit: paginatedPrograms.limit,
        total: paginatedPrograms.total,
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
    description: 'Get program by id',
    type: ProgramResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Program not found',
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

      const program = await this.programsService.findById(id, lang);
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
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDTO,
    @Res() response: Response,
  ) {
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
  async delete(@Param('id') id: string, @Res() response: Response) {
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
