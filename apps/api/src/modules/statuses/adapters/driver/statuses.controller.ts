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
import { CreateStatusDTO } from '../../domain/dto/create-status.dto';
import { UpdateStatusDTO } from '../../domain/dto/update-status.dto';
import {
  StatusesDto,
  StatusesResponseWrapperDTO,
  StatusResponseWrapperDTO,
} from '../../domain/dto/statuses.dto';
import { StatusesService } from '../../domain/port/input/statuses.service';
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

@ApiTags('Statuses')
@Controller({ path: 'student-statuses', version: '1' })
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(StatusesDto)
  @ApiBody({ type: CreateStatusDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a status',
    type: StatusResponseWrapperDTO,
  })
  async create(
    @Res() response: Response,
    @Body() createStatusDto: CreateStatusDTO,
  ) {
    try {
      const status = await this.statusesService.create(createStatusDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Status created successfully',
        data: status,
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
    description: 'Get all statuses with pagination',
    type: StatusesResponseWrapperDTO,
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
  ) {
    try {
      // Ưu tiên query param, sau đó dùng header
      const lang =
        queryLang ||
        (acceptLanguage
          ? acceptLanguage.split(',')[0].split(';')[0]
          : undefined);

      const result = await this.statusesService.findAll(
        Number(page),
        Number(limit),
        status,
        lang,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Statuses fetched successfully',
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
  @ZodSerializerDto(StatusesDto)
  @ApiParam({ name: 'id', description: 'Status ID', type: String })
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
    description: 'Get status by id',
    type: StatusResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Status not found',
  })
  async findById(
    @Res() response: Response,
    @Param('id') id: string,
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

      const status = await this.statusesService.findById(id, lang);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Status fetched successfully',
        data: status,
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
  @ZodSerializerDto(StatusesDto)
  @ApiParam({ name: 'id', description: 'Status ID', type: String })
  @ApiBody({ type: UpdateStatusDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update status',
    type: StatusResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Status not found',
  })
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDTO,
  ) {
    try {
      const updatedStatus = await this.statusesService.update(
        id,
        updateStatusDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Status updated successfully',
        data: updatedStatus,
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
  @ZodSerializerDto(StatusesDto)
  @ApiParam({ name: 'id', description: 'Status ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete status',
    type: StatusResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Status not found',
  })
  async delete(@Res() response: Response, @Param('id') id: string) {
    try {
      const deletedStatus = await this.statusesService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Status deleted successfully',
        data: deletedStatus,
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
