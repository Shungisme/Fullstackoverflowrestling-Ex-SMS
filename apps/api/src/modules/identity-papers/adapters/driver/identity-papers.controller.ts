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
import { CreateIdentityPaperDTO } from '../../domain/dto/create-identity-paper.dto';
import { UpdateIdentityPaperDTO } from '../../domain/dto/update-identity-paper.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  IdentityPapersDto,
  IdentityPapersResponseWrapperDTO,
  IdentityPaperResponseWrapperDTO,
} from '../../domain/dto/identity-papers.dto';
import { IdentityPapersService } from '../../domain/port/input/identity-papers.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { Response } from 'express';

@ApiTags('Identity Papers')
@Controller({ path: 'identity-papers', version: '1' })
export class IdentityPapersController {
  constructor(private readonly identityPapersService: IdentityPapersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(IdentityPapersDto)
  @ApiBody({ type: CreateIdentityPaperDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an identity paper',
    type: IdentityPaperResponseWrapperDTO,
  })
  async create(
    @Res() response: Response,
    @Body() createIdentityPaperDto: CreateIdentityPaperDTO,
  ): Promise<Response> {
    try {
      const identityPapers = await this.identityPapersService.create(
        createIdentityPaperDto,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Identity paper created successfully',
        data: identityPapers,
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
    description: 'Get all identity papers with pagination',
    type: IdentityPapersResponseWrapperDTO,
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
      const result = await this.identityPapersService.findAll(
        Number(page),
        Number(limit),
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Identity papers retrieved successfully',
        data: result,
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
  @ZodSerializerDto(IdentityPapersDto)
  @ApiParam({ name: 'id', description: 'Identity Paper ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get identity paper by id',
    type: IdentityPaperResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Identity paper not found',
  })
  async findById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const result = await this.identityPapersService.findById(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Identity paper retrieved successfully',
        data: result,
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
  @ZodSerializerDto(IdentityPapersDto)
  @ApiParam({ name: 'id', description: 'Identity Paper ID', type: String })
  @ApiBody({ type: UpdateIdentityPaperDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update identity paper',
    type: IdentityPaperResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Identity paper not found',
  })
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateIdentityPaperDto: UpdateIdentityPaperDTO,
  ): Promise<Response> {
    try {
      const result = await this.identityPapersService.update(
        id,
        updateIdentityPaperDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Identity paper updated successfully',
        data: result,
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
  @ZodSerializerDto(IdentityPapersDto)
  @ApiParam({ name: 'id', description: 'Identity Paper ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete identity paper',
    type: IdentityPaperResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Identity paper not found',
  })
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const result = await this.identityPapersService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Identity paper deleted successfully',
        data: result,
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
